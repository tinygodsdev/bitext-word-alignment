import opentype from 'opentype.js';
import type { LineV2 } from '$lib/serialization/schema.js';
import { loadCustomFontBlob } from './custom-fonts.js';

/**
 * Rewrites `<text>` elements that use a user-uploaded font into `<g><path/></g>` vector outlines.
 *
 * Why: when PNG/PDF export rasterizes the SVG via `<img>`, the embedded `@font-face` with
 * a TTF data URL races against image decoding and often loses — the first frame gets drawn
 * in a fallback family. Converting to paths removes the font dependency from the raster path
 * entirely, so what the user previewed is what they get in the PDF.
 *
 * Leaves Google-font `<text>` alone — those reliably render via their small woff2 data URLs.
 */
export async function convertCustomFontTextToPaths(svg: string, lines: LineV2[]): Promise<string> {
	const customFamilies = collectCustomFamiliesFromLines(lines);
	if (customFamilies.size === 0) return svg;

	const fonts = new Map<string, opentype.Font>();
	for (const family of customFamilies) {
		const font = await tryLoadFont(family);
		if (font) fonts.set(family, font);
	}
	if (fonts.size === 0) return svg;

	return rewriteTextElements(svg, fonts);
}

function collectCustomFamiliesFromLines(lines: LineV2[]): Set<string> {
	const names = new Set<string>();
	for (const line of lines) {
		if (line.font.source === 'custom' && line.font.customName) names.add(line.font.customName);
	}
	return names;
}

async function tryLoadFont(family: string): Promise<opentype.Font | null> {
	const blob = await loadCustomFontBlob(family);
	if (!blob) return null;
	try {
		const buf = await blob.arrayBuffer();
		/**
		 * opentype.js 1.x parses TTF and OTF. WOFF/WOFF2 would need pre-decompression
		 * (`wawoff2` etc.) — out of scope here; in that case we return null and the
		 * upstream @font-face inlining stays as a (best-effort) fallback.
		 */
		return opentype.parse(buf);
	} catch (err) {
		console.warn(`[export] opentype.js could not parse font "${family}" — keeping <text>.`, err);
		return null;
	}
}

/**
 * Our generated SVG uses a very specific shape for token/gloss text:
 *   <text fill="..." font-family="..." font-size="N" font-weight="500"
 *         text-anchor="middle" dominant-baseline="central"
 *         transform="translate(x,y)">CONTENT</text>
 *
 * Content never contains other elements, so a simple regex is safe and fast.
 */
const TEXT_ELEMENT_REGEX = /<text\b([^>]*)>([^<]*)<\/text>/g;

function rewriteTextElements(svg: string, fonts: Map<string, opentype.Font>): string {
	return svg.replace(TEXT_ELEMENT_REGEX, (full, attrs: string, content: string) => {
		const familyAttr = extractAttr(attrs, 'font-family');
		if (!familyAttr) return full;
		const primary = primaryFamilyName(familyAttr);
		const font = fonts.get(primary);
		if (!font) return full;

		const fontSize = Number(extractAttr(attrs, 'font-size') ?? '0');
		if (!Number.isFinite(fontSize) || fontSize <= 0) return full;

		const fill = extractAttr(attrs, 'fill') ?? '#000000';
		const transform = extractAttr(attrs, 'transform') ?? '';
		const textAnchor = extractAttr(attrs, 'text-anchor') ?? 'start';
		const dominantBaseline = extractAttr(attrs, 'dominant-baseline') ?? 'alphabetic';

		const text = decodeXmlEntities(content);
		if (text.length === 0) return '';

		const width = font.getAdvanceWidth(text, fontSize);
		const x = anchorOffsetX(textAnchor, width);
		const y = baselineOffsetY(dominantBaseline, font, fontSize);

		const path = font.getPath(text, x, y, fontSize);
		const d = path.toPathData(3);
		const pathEl = `<path fill="${escapeXmlAttr(fill)}" d="${d}"/>`;
		return transform ? `<g transform="${escapeXmlAttr(transform)}">${pathEl}</g>` : pathEl;
	});
}

function extractAttr(attrs: string, name: string): string | null {
	const re = new RegExp(`\\s${escapeRegex(name)}="([^"]*)"`);
	return re.exec(attrs)?.[1] ?? null;
}

function primaryFamilyName(familyAttr: string): string {
	const first = familyAttr.split(',')[0]?.trim() ?? '';
	return first.replace(/^["']|["']$/g, '');
}

function anchorOffsetX(anchor: string, width: number): number {
	if (anchor === 'middle') return -width / 2;
	if (anchor === 'end') return -width;
	return 0;
}

/**
 * Map common SVG `dominant-baseline` values to an opentype.js baseline y.
 * `y` returned is the baseline coordinate in a local frame whose origin
 * should coincide with the SVG text's positioning point.
 */
function baselineOffsetY(baseline: string, font: opentype.Font, fontSize: number): number {
	const ascentPx = (font.ascender / font.unitsPerEm) * fontSize;
	/** font.descender is stored as a signed (typically negative) value. */
	const descentPxSigned = (font.descender / font.unitsPerEm) * fontSize;

	if (baseline === 'central' || baseline === 'middle') {
		return (ascentPx + descentPxSigned) / 2;
	}
	if (baseline === 'hanging') return ascentPx;
	if (baseline === 'text-before-edge') return ascentPx;
	if (baseline === 'text-after-edge') return descentPxSigned;
	return 0;
}

function decodeXmlEntities(s: string): string {
	return s
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'");
}

function escapeXmlAttr(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

function escapeRegex(s: string): string {
	return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
