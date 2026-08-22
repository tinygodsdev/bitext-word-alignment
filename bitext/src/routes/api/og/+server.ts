import { decodeState } from '$lib/serialization/decode.js';
import { OG_IMAGE_WIDTH } from '$lib/seo/og-svg.js';
import { renderOgPng } from '$lib/seo/og-render.js';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const data = url.searchParams.get('data');
	const state = decodeState(data);
	const buffer = await renderOgPng(state, OG_IMAGE_WIDTH);
	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': 'image/png',
			'Content-Length': String(buffer.length),
			'Cache-Control': 'public, max-age=3600',
			// Generated social-card image, not a document — keep it out of the index.
			'X-Robots-Tag': 'noindex'
		}
	});
};
