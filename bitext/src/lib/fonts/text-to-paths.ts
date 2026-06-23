import opentype from 'opentype.js';
import type { LineV2 } from '$lib/serialization/schema.js';
import { loadCustomFontBlob } from './custom-fonts.js';
import {
	getHarfBuzz,
	type HarfbuzzFont,
	type HarfbuzzModule,
	type HbGlyphJson
} from './harfbuzz-loader.js';

/**
 * Rewrites `<text>` elements that use a user-uploaded font into `<g><path/></g>` vector outlines.
 *
 * Why: when PNG/PDF export rasterizes the SVG via `<img>`, the embedded `@font-face` with
 * a TTF data URL races against image decoding and often loses — the first frame gets drawn
 * in a fallback family. Converting to paths removes the font dependency from the raster path
 * entirely, so what the user previewed is what they get in the PDF.
 *
 * Shaping uses **harfbuzzjs** (same engine family as browsers) so ligatures, contextual
 * substitutions, and RTL behave like the preview. Outlines use **opentype.js** `glyph.getPath`
 * at each shaped glyph ID — HarfBuzz’s `glyphToPath` uses Y-up typographic coords, which
 * maps upside-down in SVG (Y-down). **opentype.js** stays pinned at **1.3.4** for parsing and
 * paths, with emergency full-string fallback if shaping fails.
 *
 * Leaves Google-font `<text>` alone — those reliably render via their small woff2 data URLs.
 */
export async function convertCustomFontTextToPaths(svg: string, lines: LineV2[]): Promise<string> {
	const customFamilies = collectCustomFamiliesFromLines(lines);
	if (customFamilies.size === 0) return svg;

	const loads = new Map<string, { ot: opentype.Font; buffer: ArrayBuffer }>();
	for (const family of customFamilies) {
		const loaded = await tryLoadFont(family);
		if (loaded) loads.set(family, loaded);
	}
	if (loads.size === 0) return svg;

	let hb: HarfbuzzModule;
	try {
		hb = await getHarfBuzz();
	} catch (err) {
		console.warn('[export] harfbuzzjs failed to load — using opentype.js outlines.', err);
		return rewriteTextElementsOpentypeOnly(svg, loads);
	}

	const sessions = new Map<string, HarfbuzzSession>();
	try {
		for (const family of loads.keys()) {
			sessions.set(family, new HarfbuzzSession(hb, loads.get(family)!.buffer));
		}
		return await rewriteTextElementsHb(svg, loads, sessions);
	} finally {
		for (const s of sessions.values()) s.destroy();
	}
}

/** OpenType features passed to `hb_shape` (comma-separated tags). */
const EXPORT_HB_FEATURES = 'kern,liga,rlig,clig,calt,ccmp';

class HarfbuzzSession {
	readonly hb: HarfbuzzModule;
	readonly hbFont: HarfbuzzFont;
	private readonly blob: ReturnType<HarfbuzzModule['createBlob']>;
	private readonly face: ReturnType<HarfbuzzModule['createFace']>;

	constructor(hb: HarfbuzzModule, buffer: ArrayBuffer) {
		this.hb = hb;
		this.blob = hb.createBlob(buffer);
		this.face = hb.createFace(this.blob, 0);
		this.hbFont = hb.createFont(this.face);
	}

	destroy() {
		this.hbFont.destroy();
		this.face.destroy();
		this.blob.destroy();
	}
}

function collectCustomFamiliesFromLines(lines: LineV2[]): Set<string> {
	const names = new Set<string>();
	for (const line of lines) {
		if (line.font.source === 'custom' && line.font.customName) names.add(line.font.customName);
	}
	return names;
}

async function tryLoadFont(
	family: string
): Promise<{ ot: opentype.Font; buffer: ArrayBuffer } | null> {
	const blob = await loadCustomFontBlob(family);
	if (!blob) return null;
	try {
		const buffer = await blob.arrayBuffer();
		/**
		 * opentype.js 1.x parses TTF and OTF. WOFF/WOFF2 would need pre-decompression
		 * (`wawoff2` etc.) — out of scope here; in that case we return null and the
		 * upstream @font-face inlining stays as a (best-effort) fallback.
		 */
		const ot = opentype.parse(buffer);
		return { ot, buffer };
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

async function rewriteTextElementsHb(
	svg: string,
	loads: Map<string, { ot: opentype.Font; buffer: ArrayBuffer }>,
	sessions: Map<string, HarfbuzzSession>
): Promise<string> {
	let out = '';
	let last = 0;
	TEXT_ELEMENT_REGEX.lastIndex = 0;
	let m: RegExpExecArray | null;
	while ((m = TEXT_ELEMENT_REGEX.exec(svg))) {
		out += svg.slice(last, m.index);
		out += await replaceOneTextHb(m[1], m[2], loads, sessions);
		last = TEXT_ELEMENT_REGEX.lastIndex;
	}
	out += svg.slice(last);
	return out;
}

async function replaceOneTextHb(
	attrs: string,
	content: string,
	loads: Map<string, { ot: opentype.Font; buffer: ArrayBuffer }>,
	sessions: Map<string, HarfbuzzSession>
): Promise<string> {
	const familyAttr = extractAttr(attrs, 'font-family');
	if (!familyAttr) return `<text${attrs}>${content}</text>`;
	const primary = primaryFamilyName(familyAttr);
	const load = loads.get(primary);
	const session = sessions.get(primary);
	if (!load || !session) return `<text${attrs}>${content}</text>`;

	const fontSize = Number(extractAttr(attrs, 'font-size') ?? '0');
	if (!Number.isFinite(fontSize) || fontSize <= 0) return `<text${attrs}>${content}</text>`;

	const fill = extractAttr(attrs, 'fill') ?? '#000000';
	const transform = extractAttr(attrs, 'transform') ?? '';
	const textAnchor = extractAttr(attrs, 'text-anchor') ?? 'start';
	const dominantBaseline = extractAttr(attrs, 'dominant-baseline') ?? 'alphabetic';

	const text = decodeXmlEntities(content);
	if (text.length === 0) return '';

	try {
		const inner = shapeCustomTextToSvgInner(
			session,
			load.ot,
			text,
			fontSize,
			textAnchor,
			dominantBaseline,
			fill
		);
		if (!inner) return '';
		const body = transform ? `<g transform="${escapeXmlAttr(transform)}">${inner}</g>` : inner;
		return body;
	} catch (err) {
		console.warn('[export] HarfBuzz path export failed — opentype.js fallback for token.', err);
		return replaceOneTextOpentype(attrs, content, load.ot);
	}
}

function shapeCustomTextToSvgInner(
	session: HarfbuzzSession,
	otFont: opentype.Font,
	text: string,
	fontSizePx: number,
	textAnchor: string,
	dominantBaseline: string,
	fill: string
): string {
	const { hb, hbFont } = session;
	hbFont.setScale(fontSizePx, fontSizePx);

	const buffer = hb.createBuffer();
	buffer.addText(text);
	buffer.guessSegmentProperties();
	hb.shape(hbFont, buffer, EXPORT_HB_FEATURES);
	const glyphs = buffer.json();
	buffer.destroy();

	if (glyphs.length === 0) return '';

	const totalWidth = glyphs.reduce((s, g) => s + g.ax, 0);
	const rtl = isRtlGlyphOrder(glyphs);
	const penStart = anchorOffsetX(textAnchor, totalWidth);
	const baselineShift = baselineOffsetY(dominantBaseline, otFont, fontSizePx);

	const paths: string[] = [];
	if (rtl) {
		let xPen = penStart + totalWidth;
		for (const g of glyphs) {
			xPen -= g.ax;
			pushShapedGlyphPath(paths, otFont, g, xPen, baselineShift, fontSizePx, fill);
		}
	} else {
		let xPen = penStart;
		for (const g of glyphs) {
			pushShapedGlyphPath(paths, otFont, g, xPen, baselineShift, fontSizePx, fill);
			xPen += g.ax;
		}
	}

	return paths.join('');
}

function pushShapedGlyphPath(
	paths: string[],
	otFont: opentype.Font,
	g: HbGlyphJson,
	xPen: number,
	baselineShift: number,
	fontSizePx: number,
	fill: string
) {
	const glyph = otFont.glyphs.get(g.g);
	if (!glyph) return;

	const gx = xPen + g.dx;
	const gy = baselineShift + g.dy;
	const p = glyph.getPath(gx, gy, fontSizePx);
	const d = p.toPathData(3);
	if (!d) return;
	paths.push(`<path fill="${escapeXmlAttr(fill)}" d="${escapeXmlAttr(d)}"/>`);
}

/** When logical cluster indices decrease along the buffer, treat as RTL drawing order. */
function isRtlGlyphOrder(glyphs: HbGlyphJson[]): boolean {
	if (glyphs.length < 2) return false;
	return glyphs[0].cl > glyphs[glyphs.length - 1].cl;
}

function rewriteTextElementsOpentypeOnly(
	svg: string,
	loads: Map<string, { ot: opentype.Font; buffer: ArrayBuffer }>
): string {
	const fonts = new Map<string, opentype.Font>();
	for (const [k, v] of loads) fonts.set(k, v.ot);
	return svg.replace(TEXT_ELEMENT_REGEX, (full, attrs: string, content: string) => {
		const familyAttr = extractAttr(attrs, 'font-family');
		if (!familyAttr) return full;
		const primary = primaryFamilyName(familyAttr);
		const font = fonts.get(primary);
		if (!font) return full;
		return replaceOneTextOpentype(attrs, content, font);
	});
}

function replaceOneTextOpentype(attrs: string, content: string, font: opentype.Font): string {
	const fontSize = Number(extractAttr(attrs, 'font-size') ?? '0');
	if (!Number.isFinite(fontSize) || fontSize <= 0) return `<text${attrs}>${content}</text>`;

	const fill = extractAttr(attrs, 'fill') ?? '#000000';
	const transform = extractAttr(attrs, 'transform') ?? '';
	const textAnchor = extractAttr(attrs, 'text-anchor') ?? 'start';
	const dominantBaseline = extractAttr(attrs, 'dominant-baseline') ?? 'alphabetic';

	const text = decodeXmlEntities(content);
	if (text.length === 0) return '';

	const featureFlags: Record<string, boolean> = {
		liga: true,
		rlig: true,
		clig: true,
		calt: true,
		ccmp: true
	};
	const shapeOpts = { features: featureFlags };
	const width = font.getAdvanceWidth(text, fontSize, shapeOpts);
	const x = anchorOffsetX(textAnchor, width);
	const y = baselineOffsetY(dominantBaseline, font, fontSize);

	const path = font.getPath(text, x, y, fontSize, shapeOpts);
	const d = path.toPathData(3);
	const pathEl = `<path fill="${escapeXmlAttr(fill)}" d="${escapeXmlAttr(d)}"/>`;
	return transform ? `<g transform="${escapeXmlAttr(transform)}">${pathEl}</g>` : pathEl;
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
