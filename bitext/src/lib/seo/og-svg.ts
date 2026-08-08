import { escapeXml } from '$lib/export/xml.js';
import { ALIGNER_SITE_HOST } from '$lib/brand.js';
import { tokenize, tokenizeOptionsFromVisualSettings, type Token } from '$lib/domain/tokens.js';
import { connectedLinkComponents } from '$lib/domain/link-graph.js';
import { PALETTES } from '$lib/domain/palettes.js';
import type { AppStateV2 } from '$lib/serialization/schema.js';
import type { Connection } from '$lib/domain/alignment.js';

/** Social preview dimensions recommended by both Facebook and Twitter/X (1.91:1). */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

const FONT_FAMILY = 'Inter, system-ui, sans-serif';

/** Default token color (unlinked words) on the dark OG background. */
const DEFAULT_TOKEN_COLOR = '#e2e8f0';

/**
 * Character budget per sentence line.
 *
 * Inter SemiBold at 40px averages ~21–23px per glyph across Latin and Cyrillic.
 * With 60px side padding on a 1200px canvas we have 1080px to work with
 * → ~48–50 characters fits comfortably. We keep a little headroom for the
 * trailing "…" when we truncate.
 */
const CHAR_BUDGET = 50;

/** Fit tokens into the character budget, dropping trailing tokens if needed. */
function fitTokens(tokens: Token[], budget: number): { tokens: Token[]; truncated: boolean } {
	if (tokens.length === 0) return { tokens: [], truncated: false };
	const out: Token[] = [];
	let used = 0;
	for (const t of tokens) {
		const sep = out.length === 0 || t.joinLeft ? 0 : 1;
		const len = [...t.text].length;
		const next = used + sep + len;
		if (next > budget && out.length > 0) return { tokens: out, truncated: true };
		out.push(t);
		used = next;
	}
	return { tokens: out, truncated: false };
}

/**
 * Assign a vivid-palette color to each connected component of links.
 *
 * We intentionally ignore the user's saved palette and their own colors on links:
 * the OG preview must stay readable on a dark background (pastels wash out, muted
 * greys vanish) and a user who painted everything black should still see a colorful
 * card. Components are iterated in link-array order so the mapping is deterministic
 * for a given `?data=` payload.
 */
function buildTokenColorMap(connections: Connection[]): Map<string, string> {
	const byId = new Map(connections.map((l) => [l.id, l] as const));
	const map = new Map<string, string>();
	const vivid = PALETTES.vivid;
	const components = connectedLinkComponents(connections);
	components.forEach((component, idx) => {
		const color = vivid[idx % vivid.length]!;
		for (const linkId of component) {
			const link = byId.get(linkId);
			if (!link) continue;
			map.set(link.upperTokenId, color);
			map.set(link.lowerTokenId, color);
		}
	});
	return map;
}

function renderSentenceText(
	x: number,
	y: number,
	tokens: Token[],
	truncated: boolean,
	colorByTokenId: Map<string, string>,
	fontFamily: string
): string {
	const parts: string[] = [];
	tokens.forEach((t, i) => {
		const prefix = i === 0 || t.joinLeft ? '' : ' ';
		const color = colorByTokenId.get(t.id) ?? DEFAULT_TOKEN_COLOR;
		parts.push(`<tspan xml:space="preserve" fill="${color}">${escapeXml(prefix + t.text)}</tspan>`);
	});
	if (truncated) {
		parts.push(
			`<tspan xml:space="preserve" fill="${DEFAULT_TOKEN_COLOR}">${escapeXml(' …')}</tspan>`
		);
	}
	// The line's own family first: without it a Japanese or Mongolian card asks for Inter and
	// resvg draws "NO GLYPH" boxes even when the right font is loaded.
	const stack = `${escapeXml(fontFamily)}, ${FONT_FAMILY}`;
	return `<text x="${x}" y="${y}" fill="${DEFAULT_TOKEN_COLOR}" font-family="${stack}" font-size="40" font-weight="600">${parts.join('')}</text>`;
}

function plural(n: number, noun: string): string {
	return `${n} ${noun}${n === 1 ? '' : 's'}`;
}

function renderPlaceholder(x: number, y: number, text: string): string {
	return `<text x="${x}" y="${y}" fill="#64748b" font-family="${FONT_FAMILY}" font-size="40" font-weight="500" font-style="italic">${escapeXml(text)}</text>`;
}

/** One of the (at most two) sentence lines the card shows, after truncation to the budget. */
export interface OgLine {
	tokens: Token[];
	truncated: boolean;
	/** Font family the line asks for; the card needs a matching file to avoid missing glyphs. */
	family: string;
	/** Exactly the characters the card will draw — the subset request is built from this. */
	text: string;
}

/** The card shows the first two lines; everything downstream works from this shape. */
export function ogLines(state: AppStateV2): (OgLine | null)[] {
	const tz = tokenizeOptionsFromVisualSettings(state.settings);
	return [0, 1].map((i) => {
		const line = state.project.lines[i];
		if (!line) return null;
		const { tokens, truncated } = fitTokens(tokenize(line.rawText, line.id, tz), CHAR_BUDGET);
		if (tokens.length === 0) return null;
		return {
			tokens,
			truncated,
			family: line.font.family,
			text: tokens.map((t) => t.text).join(' ')
		};
	});
}

/**
 * OG preview: colored tokens from the shared state, no alignment lines.
 *
 * `unrenderable` lists line indices whose script has no usable font. Those lines fall back to a
 * neutral summary instead of the sentence, because resvg renders a missing glyph as a visible
 * "NO GLYPH" box and a card full of boxes is worse than one without the sentence.
 */
export function buildOgSvg(
	state: AppStateV2,
	unrenderable: ReadonlySet<number> = new Set()
): string {
	const colorByTokenId = buildTokenColorMap(state.project.connections);
	const [src, tgt] = ogLines(state);

	const summary = `${plural(state.project.lines.length, 'line')} · ${plural(state.project.connections.length, 'link')}`;

	function sentence(line: OgLine | null, index: number, y: number, empty: string): string {
		if (!line) return renderPlaceholder(60, y, empty);
		if (unrenderable.has(index)) return renderPlaceholder(60, y, summary);
		return renderSentenceText(60, y, line.tokens, line.truncated, colorByTokenId, line.family);
	}

	const sourceLine = sentence(src, 0, 340, 'Type a sentence…');
	const targetLine = sentence(tgt, 1, 430, 'Add its translation…');

	const w = OG_IMAGE_WIDTH;
	const h = OG_IMAGE_HEIGHT;

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
	<defs>
		<linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="#0f172a"/>
			<stop offset="100%" stop-color="#1e293b"/>
		</linearGradient>
	</defs>
	<rect width="100%" height="100%" fill="url(#bg)"/>
	<rect x="60" y="80" width="${w - 120}" height="4" fill="#6366f1" opacity="0.9"/>
	<text x="60" y="180" fill="#f8fafc" font-family="${FONT_FAMILY}" font-size="64" font-weight="700">Word-by-word translation</text>
	<text x="60" y="228" fill="#c7d2fe" font-family="${FONT_FAMILY}" font-size="26" font-weight="500">Bilingual sentence alignment visualizer</text>
	${sourceLine}
	<line x1="60" y1="372" x2="${w - 60}" y2="372" stroke="#334155" stroke-width="2" stroke-dasharray="6 8"/>
	${targetLine}
	<text x="60" y="560" fill="#94a3b8" font-family="${FONT_FAMILY}" font-size="24" font-weight="500">${escapeXml(ALIGNER_SITE_HOST)}</text>
	<text x="${w - 60}" y="560" text-anchor="end" fill="#64748b" font-family="${FONT_FAMILY}" font-size="22" font-weight="400">Free · PNG / SVG / PDF / HTML</text>
</svg>`;
}
