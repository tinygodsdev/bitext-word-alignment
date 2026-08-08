import { Resvg } from '@resvg/resvg-js';
import type { AppStateV2 } from '$lib/serialization/schema.js';
import { buildOgSvg, ogLines } from './og-svg.js';
import { loadOgFontFiles, loadSubsetFontFile, needsNonLatinFont } from './og-fonts.js';

/**
 * Render the OG card to PNG.
 *
 * Shared by `/api/og` and the MCP tool's inline preview so the font handling below cannot drift
 * between them.
 *
 * The card is drawn by resvg, which ships no fonts of its own and only reads font files from
 * disk. Only Inter is bundled, so any other script used to render as visible "NO GLYPH" boxes.
 * For each of the two lines we now pull the family it asks for from Google Fonts, subsetted to
 * the exact characters on the card (a CJK sentence is around 8 KB). A line we cannot cover
 * falls back to a neutral summary instead of boxes.
 */
export async function renderOgPng(state: AppStateV2, width: number): Promise<Buffer> {
	const [interFiles, resolved] = await Promise.all([loadOgFontFiles(), resolveLineFonts(state)]);

	const svg = buildOgSvg(state, resolved.unrenderable);
	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: width },
		// Opaque canvas — some social scrapers (Facebook's in particular) render PNGs with alpha
		// as a blank dark rectangle in their preview widget even when the pixels are fully opaque.
		background: '#0f172a',
		font: {
			fontFiles: [...interFiles, ...resolved.fontFiles],
			loadSystemFonts: false,
			defaultFontFamily: 'Inter'
		}
	});
	return Buffer.from(resvg.render().asPng());
}

/** Fetch a subset per line that needs one; report the lines left without usable glyphs. */
async function resolveLineFonts(
	state: AppStateV2
): Promise<{ fontFiles: string[]; unrenderable: Set<number> }> {
	const fontFiles: string[] = [];
	const unrenderable = new Set<number>();

	const lines = ogLines(state);
	await Promise.all(
		lines.map(async (line, index) => {
			if (!line) return;
			// Latin and Cyrillic already render from the bundled Inter; skip the network entirely.
			if (!(await needsNonLatinFont(line.text))) return;
			const path = await loadSubsetFontFile(line.family, line.text);
			if (path) fontFiles.push(path);
			else unrenderable.add(index);
		})
	);

	return { fontFiles, unrenderable };
}
