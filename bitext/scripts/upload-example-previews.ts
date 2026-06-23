/**
 * Upload `.cache/example-previews/*.png` to S3-compatible object storage.
 *
 * Required env (see `.env.example`):
 *   OBJECT_STORAGE_ACCESS_KEY, OBJECT_STORAGE_SECRET_KEY,
 *   OBJECT_STORAGE_BUCKET_NAME, OBJECT_STORAGE_ORIGIN_ENDPOINT
 * Optional:
 *   OBJECT_STORAGE_CDN_ENDPOINT — public CDN host for site `<img>` URLs (required unless PUBLIC_BASE set)
 *   OBJECT_STORAGE_PREFIX       — default "examples"
 *   OBJECT_STORAGE_PUBLIC_BASE  — override computed public CDN base URL
 *
 * Optional CDN purge (DigitalOcean Spaces CDN — separate from S3 keys):
 *   DIGITALOCEAN_API_TOKEN or DO_API_TOKEN — DO control-plane PAT with CDN access
 *   DO_CDN_ENDPOINT_ID                   — skip auto-lookup by bucket origin
 *   OBJECT_STORAGE_CDN_PURGE=0           — disable purge after upload
 *   OBJECT_STORAGE_CDN_PURGE_PATHS       — comma-separated, default `{prefix}/*`
 */
import { config as loadEnv } from 'dotenv';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GALLERY_SLUGS } from './gallery-slugs.js';
import {
	digitalOceanApiTokenFromEnv,
	purgeDigitalOceanCdnCache,
	resolveDigitalOceanCdnEndpointId
} from './purge-do-cdn.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BITEXT_ROOT = join(__dirname, '..');
loadEnv({ path: join(BITEXT_ROOT, '.env') });
const IN_DIR = join(BITEXT_ROOT, '.cache', 'example-previews');

function requireEnv(name: string): string {
	const v = process.env[name]?.trim();
	if (!v) throw new Error(`Missing env ${name}`);
	return v;
}

function toHttpsOriginUrl(hostOrUrl: string): string {
	const trimmed = hostOrUrl.trim().replace(/\/$/, '');
	if (/^https?:\/\//i.test(trimmed)) return trimmed;
	return `https://${trimmed}`;
}

function stripHost(hostOrUrl: string): string {
	return hostOrUrl
		.trim()
		.replace(/^https?:\/\//i, '')
		.replace(/\/$/, '');
}

function publicCdnBaseUrl(bucket: string, prefix: string): string {
	const override = process.env.OBJECT_STORAGE_PUBLIC_BASE?.trim().replace(/\/$/, '');
	if (override) return override;

	const cdnHost = requireEnv('OBJECT_STORAGE_CDN_ENDPOINT');
	return `https://${bucket}.${stripHost(cdnHost)}/${prefix}`;
}

async function main(): Promise<void> {
	const key = requireEnv('OBJECT_STORAGE_ACCESS_KEY');
	const secret = requireEnv('OBJECT_STORAGE_SECRET_KEY');
	const bucket = requireEnv('OBJECT_STORAGE_BUCKET_NAME');
	const prefix = (process.env.OBJECT_STORAGE_PREFIX ?? 'examples').replace(/^\/|\/$/g, '');
	const endpoint = toHttpsOriginUrl(requireEnv('OBJECT_STORAGE_ORIGIN_ENDPOINT'));

	const client = new S3Client({
		region: 'us-east-1',
		endpoint,
		credentials: { accessKeyId: key, secretAccessKey: secret },
		forcePathStyle: false
	});

	const files = await readdir(IN_DIR);
	const pngs = files.filter((f) => f.endsWith('.png'));
	if (pngs.length === 0) {
		throw new Error(`No PNGs in ${IN_DIR}. Run npm run examples:render first.`);
	}

	const expected = new Set(GALLERY_SLUGS.map((s) => `${s}.png`));
	for (const name of pngs) {
		if (!expected.has(name)) {
			console.warn(`Skipping unexpected file: ${name}`);
		}
	}

	for (const slug of GALLERY_SLUGS) {
		const filename = `${slug}.png`;
		const localPath = join(IN_DIR, filename);
		let body: Buffer;
		try {
			body = await readFile(localPath);
		} catch {
			throw new Error(`Missing ${localPath}. Run npm run examples:render first.`);
		}
		const objectKey = `${prefix}/${filename}`;
		console.log(`Uploading ${objectKey} …`);
		await client.send(
			new PutObjectCommand({
				Bucket: bucket,
				Key: objectKey,
				Body: body,
				ContentType: 'image/png',
				ACL: 'public-read',
				CacheControl: 'public, max-age=31536000, immutable'
			})
		);
	}

	const publicBase = publicCdnBaseUrl(bucket, prefix);

	console.log('');
	console.log('Upload complete (each object ACL: public-read).');
	console.log(`CDN base for the site: ${publicBase}`);

	const purgeDisabled = process.env.OBJECT_STORAGE_CDN_PURGE === '0';
	const doToken = digitalOceanApiTokenFromEnv();
	if (purgeDisabled) {
		console.log('CDN purge skipped (OBJECT_STORAGE_CDN_PURGE=0).');
	} else if (!doToken) {
		console.log('');
		console.log(
			'CDN purge skipped — set DIGITALOCEAN_API_TOKEN (or DO_API_TOKEN) in .env to purge after upload.'
		);
	} else {
		const cdnId =
			process.env.DO_CDN_ENDPOINT_ID?.trim() ||
			(await resolveDigitalOceanCdnEndpointId(doToken, bucket, endpoint));
		const purgePaths = process.env.OBJECT_STORAGE_CDN_PURGE_PATHS?.trim()
			.split(/\s*,\s*/)
			.filter(Boolean) ?? [`${prefix}/*`];
		console.log('');
		console.log(`Purging CDN cache (endpoint ${cdnId}) …`);
		console.log(`  paths: ${purgePaths.join(', ')}`);
		await purgeDigitalOceanCdnCache(doToken, cdnId, purgePaths);
		console.log('CDN purge complete.');
	}

	console.log('');
	console.log('Update EXAMPLE_PREVIEWS_CDN_BASE in src/lib/examples/cdn.ts:');
	console.log(`  export const EXAMPLE_PREVIEWS_CDN_BASE = '${publicBase}';`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
