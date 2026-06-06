/**
 * Purge DigitalOcean Spaces CDN cache after gallery PNG upload.
 *
 * Uses the DigitalOcean control-plane API (not S3/Spaces keys):
 *   DELETE /v2/cdn/endpoints/{cdn_id}/cache
 *
 * @see https://docs.digitalocean.com/products/spaces/how-to/manage-cdn-cache/
 */

type CdnEndpoint = { id: string; origin: string };

function stripHost(hostOrUrl: string): string {
	return hostOrUrl
		.trim()
		.replace(/^https?:\/\//i, '')
		.replace(/\/$/, '');
}

async function doFetch(token: string, url: string, init?: RequestInit): Promise<Response> {
	const res = await fetch(url, {
		...init,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			...init?.headers
		}
	});
	return res;
}

/** List CDN endpoints until we find one whose origin matches `{bucket}.{originHost}`. */
export async function resolveDigitalOceanCdnEndpointId(
	token: string,
	bucket: string,
	originHost: string
): Promise<string> {
	const origin = `${bucket}.${stripHost(originHost)}`;
	let page = 1;

	for (;;) {
		const res = await doFetch(
			token,
			`https://api.digitalocean.com/v2/cdn/endpoints?per_page=200&page=${page}`
		);
		if (!res.ok) {
			throw new Error(`CDN list failed (${res.status}): ${await res.text()}`);
		}
		const data = (await res.json()) as {
			endpoints?: CdnEndpoint[];
			links?: { pages?: { next?: string } };
		};
		const hit = data.endpoints?.find((e) => e.origin === origin);
		if (hit) return hit.id;
		if (!data.links?.pages?.next) break;
		page += 1;
	}

	throw new Error(
		`No CDN endpoint for origin ${origin}. Set DO_CDN_ENDPOINT_ID in .env or enable CDN on the bucket.`
	);
}

/** Purge cached paths (object keys under the bucket, e.g. `examples/*`). */
export async function purgeDigitalOceanCdnCache(
	token: string,
	cdnEndpointId: string,
	files: string[]
): Promise<void> {
	const res = await doFetch(
		token,
		`https://api.digitalocean.com/v2/cdn/endpoints/${cdnEndpointId}/cache`,
		{
			method: 'DELETE',
			body: JSON.stringify({ files })
		}
	);
	if (!res.ok) {
		throw new Error(`CDN purge failed (${res.status}): ${await res.text()}`);
	}
}

export function digitalOceanApiTokenFromEnv(): string | undefined {
	return (
		process.env.DIGITALOCEAN_API_TOKEN?.trim() ||
		process.env.DO_API_TOKEN?.trim() ||
		undefined
	);
}
