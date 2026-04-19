import { Resvg } from '@resvg/resvg-js';
import { decodeState } from '$lib/serialization/decode.js';
import { buildOgSvg } from '$lib/seo/og-svg.js';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
	const data = url.searchParams.get('data');
	const state = decodeState(data);
	const svg = buildOgSvg(state);
	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: 1200
		}
	});
	const png = resvg.render();
	const buffer = png.asPng();
	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': 'image/png',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
