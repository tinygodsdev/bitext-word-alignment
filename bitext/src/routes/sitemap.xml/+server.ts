import type { RequestHandler } from '@sveltejs/kit';
import { GALLERY_EXAMPLES } from '$lib/examples/catalog.js';
import { GUIDES } from '$lib/guide/catalog.js';
import { SITE_LASTMOD } from '$lib/seo/metadata.js';

// `changefreq`/`priority` are omitted on purpose — Google ignores both. Only `loc` and `lastmod`
// carry weight.
export const GET: RequestHandler = ({ url }) => {
	const base = url.origin;
	const entry = (loc: string) => `  <url><loc>${loc}</loc><lastmod>${SITE_LASTMOD}</lastmod></url>`;
	const exampleUrls = GALLERY_EXAMPLES.map((e) => entry(`${base}/examples/${e.slug}`)).join('\n');
	const guideUrls = GUIDES.map((g) => entry(`${base}${g.path}`)).join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entry(`${base}/`)}
${entry(`${base}/examples`)}
${exampleUrls}
${entry(`${base}/guide`)}
${guideUrls}
${entry(`${base}/about`)}
${entry(`${base}/api`)}
${entry(`${base}/privacy`)}
</urlset>`;
	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
