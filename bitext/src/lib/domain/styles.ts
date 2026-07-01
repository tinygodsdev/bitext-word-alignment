import type { LineV2 } from '$lib/serialization/schema.js';
import type { PaletteName } from '$lib/domain/palettes.js';

/**
 * A visual style is a presentation theme layered on top of the user's own choices.
 * It controls the canvas (background, default text color, optional frame ornament),
 * the connector treatment (mode, glow, endpoint dots, dash, line cap, ink color),
 * token treatment (text glow, chips) and a default font + matching palette.
 *
 * It never overrides the user's connector geometry (straight / curved), thickness or
 * opacity. The default font applies only to lines still on the app-default font, so an
 * explicit per-line font always wins. Picking a style bundles its palette, but the
 * palette can be changed afterwards and is also selectable on its own.
 *
 * The same descriptor drives the live preview and the standalone SVG export, so a
 * shared diagram looks identical to what the editor shows.
 */

export type StyleId =
	| 'classic'
	| 'aurora'
	| 'atlas'
	| 'synthwave'
	| 'parchment'
	| 'bauhaus'
	| 'sumi'
	| 'blueprint';

export type LineCap = 'round' | 'butt' | 'square';
export type ConnectorMode = 'stroke' | 'ribbon';

export interface StyleConnector {
	/** 'stroke' (default) draws a line; 'ribbon' draws a filled brush stroke. */
	mode?: ConnectorMode;
	cap: LineCap;
	/** SVG stroke-dasharray value (e.g. "7 6"); omitted = solid. */
	dash?: string;
	/** Soft halo around the connector (neon look). */
	glow?: boolean;
	/** Override the palette/link color for connectors (e.g. dark ink). */
	lineColor?: string;
	/** Filled circles at both endpoints. */
	endpointDots?: { r: number; color?: string; ring?: string };
	/** Ribbon mode: width = user line thickness × this scale (so thickness stays editable). */
	ribbonScale?: number;
	/** Ribbon mode: taper to a point at both ends (brush feel). */
	taper?: boolean;
}

export interface StyleCanvas {
	isDark: boolean;
	/** CSS `background` shorthand for the preview frame. */
	previewBackground: string;
	/** Default token text color (unlinked words) — preview and export. */
	textColor: string;
	/** Base color links are mixed toward for the "token background" coloring mode. */
	tintBaseHex: string;
}

export interface VisualStyle {
	id: StyleId;
	label: string;
	/** One-line description shown in the style picker. */
	blurb: string;
	canvas: StyleCanvas;
	connector: StyleConnector;
	/** Add a matching halo to the token text (neon styles). */
	glowText?: boolean;
	/** Render linked tokens as solid colored chips with a hard offset shadow (Bauhaus). */
	tokenChips?: { shadow: string };
	/** Google font family applied to lines still on the app default; null keeps the user's font. */
	defaultFont: string | null;
	/** Palette bundled with the style (set when the style is picked); undefined keeps the current one. */
	palette?: PaletteName;
	/** CSS class added to the preview frame for an optional decorative border. */
	frameClass?: string;
}

/** The app-default line font; a line still on it inherits the style's default font. */
export const APP_DEFAULT_FONT_FAMILY = 'Inter';

const STYLES: Record<StyleId, VisualStyle> = {
	classic: {
		id: 'classic',
		label: 'Classic',
		blurb: 'Clean white or dark canvas — the original look.',
		canvas: {
			isDark: false,
			previewBackground: '#ffffff',
			textColor: '#0f172a',
			tintBaseHex: '#ffffff'
		},
		connector: { cap: 'round' },
		defaultFont: null
	},
	aurora: {
		id: 'aurora',
		label: 'Aurora',
		blurb: 'Dark sky with glowing neon arcs and text.',
		canvas: {
			isDark: true,
			previewBackground: 'radial-gradient(130% 130% at 50% -10%, #2a2150, #14111f 70%)',
			textColor: '#e7e3f5',
			tintBaseHex: '#14111f'
		},
		connector: { cap: 'round', glow: true },
		glowText: true,
		defaultFont: 'Sora',
		palette: 'neon'
	},
	atlas: {
		id: 'atlas',
		label: 'Atlas',
		blurb: 'Warm paper, serif type, ink endpoint dots.',
		canvas: {
			isDark: false,
			previewBackground: '#f6efe2',
			textColor: '#3a2f23',
			tintBaseHex: '#f6efe2'
		},
		connector: { cap: 'butt', endpointDots: { r: 3.2 } },
		defaultFont: 'Spectral',
		palette: 'jewel'
	},
	synthwave: {
		id: 'synthwave',
		label: 'Synthwave',
		blurb: 'Retro sunset gradient with neon glow.',
		canvas: {
			isDark: true,
			previewBackground: 'linear-gradient(180deg, #241a4d 0%, #4a1f63 52%, #6b2f3a 100%)',
			textColor: '#ffd9f4',
			tintBaseHex: '#2a1640'
		},
		connector: { cap: 'round', glow: true },
		glowText: true,
		defaultFont: 'Sora',
		palette: 'sunset'
	},
	parchment: {
		id: 'parchment',
		label: 'Parchment',
		blurb: 'Illuminated manuscript: cream, serif, gold frame.',
		canvas: {
			isDark: false,
			previewBackground: 'radial-gradient(120% 120% at 50% 30%, #efe2c2, #e2cfa0)',
			textColor: '#5b3a1a',
			tintBaseHex: '#efe2c2'
		},
		connector: { cap: 'round', endpointDots: { r: 4, color: '#b8902f', ring: '#6b4d23' } },
		defaultFont: 'Playfair Display',
		palette: 'jewel',
		frameClass: 'aligner-frame-parchment'
	},
	bauhaus: {
		id: 'bauhaus',
		label: 'Bauhaus',
		blurb: 'Bold yellow field, word cards, thick ink links.',
		canvas: {
			isDark: false,
			previewBackground: '#fddb72',
			textColor: '#171008',
			tintBaseHex: '#fddb72'
		},
		connector: { cap: 'butt', lineColor: '#171008', endpointDots: { r: 6.5, color: '#171008' } },
		tokenChips: { shadow: '#171008' },
		defaultFont: 'Sora',
		palette: 'primary',
		frameClass: 'aligner-frame-bauhaus'
	},
	sumi: {
		id: 'sumi',
		label: 'Sumi',
		blurb: 'Brush-ink ribbons on off-white paper.',
		canvas: {
			isDark: false,
			previewBackground: '#f5efe7',
			textColor: '#2a2622',
			tintBaseHex: '#f5efe7'
		},
		connector: { cap: 'round', mode: 'ribbon', ribbonScale: 6, taper: true, lineColor: '#1f1915' },
		defaultFont: 'Spectral',
		palette: 'ink'
	},
	blueprint: {
		id: 'blueprint',
		label: 'Blueprint',
		blurb: 'Drafting grid on deep blue, dashed links.',
		canvas: {
			isDark: true,
			previewBackground:
				'repeating-linear-gradient(0deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 28px), repeating-linear-gradient(90deg, rgba(255,255,255,0.10) 0 1px, transparent 1px 28px), #0e2a52',
			textColor: '#dce8fb',
			tintBaseHex: '#0e2a52'
		},
		connector: { cap: 'butt', dash: '7 6', endpointDots: { r: 3, color: '#cfe0ff' } },
		defaultFont: 'Space Grotesk',
		palette: 'cyan',
		frameClass: 'aligner-frame-blueprint'
	}
};

/** Picker order (Classic first). */
export const STYLE_ORDER: StyleId[] = [
	'classic',
	'aurora',
	'atlas',
	'synthwave',
	'parchment',
	'bauhaus',
	'sumi',
	'blueprint'
];

export function isStyleId(v: unknown): v is StyleId {
	return typeof v === 'string' && v in STYLES;
}

export function getStyle(id: StyleId): VisualStyle {
	return STYLES[id];
}

export const STYLES_LIST: VisualStyle[] = STYLE_ORDER.map((id) => STYLES[id]);

/** Connector color under a style: the style ink overrides the per-link palette color. */
export function connectorColor(style: VisualStyle, linkColor: string): string {
	return style.connector.lineColor ?? linkColor;
}

/** Readable text color on a solid fill (for chips): dark on light fills, white on dark. */
export function readableTextOn(hex: string, dark = '#171008', light = '#ffffff'): string {
	const h = hex.replace(/^#/u, '');
	if (h.length < 6) return dark;
	const r = parseInt(h.slice(0, 2), 16) / 255;
	const g = parseInt(h.slice(2, 4), 16) / 255;
	const b = parseInt(h.slice(4, 6), 16) / 255;
	const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
	const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
	return lum > 0.45 ? dark : light;
}

/**
 * Effective font family for a line under a style: the style default replaces the family only
 * when the line is still on the untouched app default. Tokens, ids and sizes are unchanged.
 */
export function effectiveLineFamily(line: LineV2, style: VisualStyle): string {
	if (
		style.defaultFont &&
		line.font.source === 'google' &&
		line.font.family === APP_DEFAULT_FONT_FAMILY
	) {
		return style.defaultFont;
	}
	return line.font.source === 'custom' && line.font.customName
		? line.font.customName
		: line.font.family;
}

/**
 * Background defs + rect(s) for the standalone SVG export. Returns null for `classic`,
 * which keeps the caller-provided light/dark fill. Mirrors `canvas.previewBackground`.
 */
export function styleExportBackground(
	style: VisualStyle,
	width: number,
	height: number
): { defs: string; rect: string } | null {
	if (style.id === 'classic') return null;
	const full = `width="${width}" height="${height}"`;
	switch (style.id) {
		case 'aurora':
			return {
				defs: `<radialGradient id="bg-aurora" cx="0.5" cy="-0.1" r="1.1"><stop offset="0" stop-color="#2a2150"/><stop offset="0.7" stop-color="#14111f"/><stop offset="1" stop-color="#14111f"/></radialGradient>`,
				rect: `<rect x="0" y="0" ${full} fill="url(#bg-aurora)"/>`
			};
		case 'synthwave':
			return {
				defs: `<linearGradient id="bg-synth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241a4d"/><stop offset="0.52" stop-color="#4a1f63"/><stop offset="1" stop-color="#6b2f3a"/></linearGradient>`,
				rect: `<rect x="0" y="0" ${full} fill="url(#bg-synth)"/>`
			};
		case 'parchment':
			return {
				defs: `<radialGradient id="bg-parch" cx="0.5" cy="0.3" r="0.9"><stop offset="0" stop-color="#efe2c2"/><stop offset="1" stop-color="#e2cfa0"/></radialGradient>`,
				rect: `<rect x="0" y="0" ${full} fill="url(#bg-parch)"/>`
			};
		case 'blueprint':
			return {
				defs: `<pattern id="bg-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#ffffff" stroke-opacity="0.10" stroke-width="1"/></pattern>`,
				rect: `<rect x="0" y="0" ${full} fill="#0e2a52"/><rect x="0" y="0" ${full} fill="url(#bg-grid)"/>`
			};
		default:
			return { defs: '', rect: `<rect x="0" y="0" ${full} fill="${style.canvas.tintBaseHex}"/>` };
	}
}

/** Decorative frame for the export, drawn over the background and under the tokens. `''` when none. */
export function styleExportFrame(style: VisualStyle, width: number, height: number): string {
	switch (style.id) {
		case 'parchment':
			return (
				`<rect x="14" y="14" width="${width - 28}" height="${height - 28}" fill="none" stroke="#b8902f" stroke-opacity="0.55" stroke-width="2"/>` +
				`<rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="#6b4d23" stroke-opacity="0.45" stroke-width="1"/>`
			);
		case 'bauhaus':
			return `<rect x="2" y="2" width="${width - 4}" height="${height - 4}" fill="none" stroke="#171008" stroke-width="4"/>`;
		case 'blueprint':
			return `<rect x="10" y="10" width="${width - 20}" height="${height - 20}" fill="none" stroke="#cfe0ff" stroke-opacity="0.35" stroke-width="1"/>`;
		default:
			return '';
	}
}

/** Lines remapped so their font reflects the style default where applicable. Pure (returns new objects). */
export function applyStyleFont(lines: LineV2[], style: VisualStyle): LineV2[] {
	if (!style.defaultFont) return lines;
	return lines.map((l) => {
		if (l.font.source === 'google' && l.font.family === APP_DEFAULT_FONT_FAMILY) {
			return { ...l, font: { ...l.font, family: style.defaultFont! } };
		}
		return l;
	});
}
