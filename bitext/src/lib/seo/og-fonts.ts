import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { read } from '$app/server';
import InterRegular from './fonts/Inter-Regular.ttf';
import InterSemiBold from './fonts/Inter-SemiBold.ttf';
import InterBold from './fonts/Inter-Bold.ttf';

interface FontAsset {
	url: string;
	filename: string;
}

const FONT_ASSETS: FontAsset[] = [
	{ url: InterRegular, filename: 'Inter-Regular.ttf' },
	{ url: InterSemiBold, filename: 'Inter-SemiBold.ttf' },
	{ url: InterBold, filename: 'Inter-Bold.ttf' }
];

let cached: string[] | null = null;

/**
 * Materialize the bundled Inter TTF assets to filesystem paths for `@resvg/resvg-js`.
 *
 * Resvg 2.6.x has no built-in fonts and its `fontFiles` option only accepts filesystem paths
 * (not buffers, not WOFF2). Without these paths every `<text>` in the SVG silently renders as
 * empty on slim server images (Railway, Docker alpine) → a blank OG PNG.
 *
 * We import the TTFs through SvelteKit's `$app/server:read` so the files are copied into the
 * build by Vite, then spill their bytes into a temp directory and hand those paths to resvg.
 * Cached in-memory for the lifetime of the process.
 */
export async function loadOgFontFiles(): Promise<string[]> {
	if (cached) return cached;
	const dir = mkdtempSync(join(tmpdir(), 'bitext-og-fonts-'));
	const paths: string[] = [];
	for (const asset of FONT_ASSETS) {
		try {
			const res = read(asset.url);
			const buf = Buffer.from(await res.arrayBuffer());
			const target = join(dir, asset.filename);
			writeFileSync(target, buf);
			paths.push(target);
		} catch {
			// best-effort: missing weight only affects weight matching, not rendering
		}
	}
	cached = paths;
	return cached;
}
