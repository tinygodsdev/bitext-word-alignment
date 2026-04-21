import { Resvg } from '@resvg/resvg-js';
import { decodeState } from '$lib/serialization/decode.js';
import { buildOgSvg, OG_IMAGE_WIDTH } from '$lib/seo/og-svg.js';
import { loadOgFontFiles } from '$lib/seo/og-fonts.js';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	const data = url.searchParams.get('data');
	const state = decodeState(data);
	const svg = buildOgSvg(state);
	const fontFiles = await loadOgFontFiles();
	const resvg = new Resvg(svg, {
		fitTo: {
			mode: 'width',
			value: OG_IMAGE_WIDTH
		},
		// Opaque canvas — some social scrapers (Facebook's in particular) render PNGs with alpha
		// as a blank dark rectangle in their preview widget even when the pixels are fully opaque.
		background: '#0f172a',
		font: {
			fontFiles,
			loadSystemFonts: false,
			defaultFontFamily: 'Inter'
		}
	});
	const png = resvg.render();
	const buffer = png.asPng();
	return new Response(new Uint8Array(buffer), {
		headers: {
			'Content-Type': 'image/png',
			'Content-Length': String(buffer.length),
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
