import type { RequestHandler } from '@sveltejs/kit';
import { GALLERY_EXAMPLES } from '$lib/examples/catalog.js';

export const GET: RequestHandler = ({ url }) => {
	const base = url.origin;
	const exampleUrls = GALLERY_EXAMPLES.map(
		(e) =>
			`  <url><loc>${base}/examples/${e.slug}</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>`
	).join('\n');
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${base}/</loc><changefreq>weekly</changefreq><priority>1</priority></url>
  <url><loc>${base}/examples</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
${exampleUrls}
  <url><loc>${base}/about</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${base}/api</loc><changefreq>monthly</changefreq><priority>0.4</priority></url>
  <url><loc>${base}/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
</urlset>`;
	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'public, max-age=86400'
		}
	});
};
