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
	| 'blueprint'
	| 'deco'
	| 'nouveau'
	| 'riso'
	| 'spectrum';

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
	/** Stroke mode: multiply the user line thickness by this (thicker-by-default styles). */
	widthScale?: number;
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
	/** Risograph misregistration: a hard offset copy of the token text in a shifted spot color. */
	textOffsetShadow?: { dx: number; dy: number };
	/** Deco lettering: uppercase + letter-spacing (em) applied to token text. */
	tokenTransform?: { uppercase?: boolean; letterSpacingEm?: number };
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
		defaultFont: 'Space Grotesk',
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
		connector: { cap: 'butt', lineColor: '#171008', widthScale: 3 },
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
		connector: { cap: 'round', mode: 'ribbon', ribbonScale: 4, taper: true, lineColor: '#1f1915' },
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
	},
	deco: {
		id: 'deco',
		label: 'Deco',
		blurb: 'Gold on dark emerald, geometric frame.',
		canvas: {
			isDark: true,
			previewBackground: 'linear-gradient(160deg, #0c2a22, #07181b)',
			textColor: '#ecca76',
			tintBaseHex: '#0c2a22'
		},
		connector: {
			cap: 'butt',
			lineColor: '#e9be57',
			widthScale: 0.6,
			endpointDots: { r: 4, color: '#e9be57' }
		},
		tokenTransform: { uppercase: true, letterSpacingEm: 0.1 },
		defaultFont: 'Poiret One',
		palette: 'deco',
		frameClass: 'aligner-frame-deco'
	},
	nouveau: {
		id: 'nouveau',
		label: 'Nouveau',
		blurb: 'Flowing ribbons on cream, muted botanicals.',
		canvas: {
			isDark: false,
			previewBackground: 'linear-gradient(180deg, #f3efdb, #e5e7cd)',
			textColor: '#5f5a3a',
			tintBaseHex: '#f3efdb'
		},
		connector: { cap: 'round', mode: 'ribbon', taper: true, ribbonScale: 5, lineColor: '#515e30' },
		defaultFont: 'Amarante',
		palette: 'nouveau',
		frameClass: 'aligner-frame-nouveau'
	},
	riso: {
		id: 'riso',
		label: 'Riso',
		blurb: 'Risograph overprint: spot inks, grain, offset.',
		canvas: {
			isDark: false,
			previewBackground:
				'radial-gradient(circle, rgba(40,25,10,0.10) 0.6px, transparent 0.8px) 0 0 / 5px 5px, #f2eadd',
			textColor: '#584332',
			tintBaseHex: '#f2eadd'
		},
		connector: { cap: 'round', widthScale: 2.6 },
		textOffsetShadow: { dx: 2, dy: 2 },
		defaultFont: 'Sora',
		palette: 'riso'
	},
	spectrum: {
		id: 'spectrum',
		label: 'Spectrum',
		blurb: 'Bold color ribbons on deep violet.',
		canvas: {
			isDark: true,
			previewBackground: 'linear-gradient(160deg, #130d21, #060613)',
			textColor: '#e0d4ff',
			tintBaseHex: '#130d21'
		},
		connector: { cap: 'round', mode: 'ribbon', taper: false, ribbonScale: 6 },
		defaultFont: 'Sora',
		palette: 'spectrum'
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
	'blueprint',
	'deco',
	'nouveau',
	'riso',
	'spectrum'
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

/** Rotate a hex color's hue by `deg` (for the Riso misregistration companion ink). */
export function shiftHue(hex: string, deg: number): string {
	const h = hex.replace(/^#/u, '');
	if (h.length < 6) return hex;
	let r = parseInt(h.slice(0, 2), 16) / 255;
	let g = parseInt(h.slice(2, 4), 16) / 255;
	let b = parseInt(h.slice(4, 6), 16) / 255;
	const max = Math.max(r, g, b);
	const min = Math.min(r, g, b);
	const l = (max + min) / 2;
	let hue = 0;
	let sat = 0;
	if (max !== min) {
		const d = max - min;
		sat = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		if (max === r) hue = ((g - b) / d + (g < b ? 6 : 0)) / 6;
		else if (max === g) hue = ((b - r) / d + 2) / 6;
		else hue = ((r - g) / d + 4) / 6;
	}
	hue = (hue + deg / 360) % 1;
	if (hue < 0) hue += 1;
	const hueToRgb = (p: number, q: number, t: number) => {
		if (t < 0) t += 1;
		if (t > 1) t -= 1;
		if (t < 1 / 6) return p + (q - p) * 6 * t;
		if (t < 1 / 2) return q;
		if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
		return p;
	};
	const q = l < 0.5 ? l * (1 + sat) : l + sat - l * sat;
	const p = 2 * l - q;
	r = hueToRgb(p, q, hue + 1 / 3);
	g = hueToRgb(p, q, hue);
	b = hueToRgb(p, q, hue - 1 / 3);
	const c = (n: number) =>
		Math.round(Math.max(0, Math.min(1, n)) * 255)
			.toString(16)
			.padStart(2, '0');
	return '#' + c(r) + c(g) + c(b);
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
	x: number,
	y: number,
	width: number,
	height: number
): { defs: string; rect: string } | null {
	if (style.id === 'classic') return null;
	const box = `x="${x}" y="${y}" width="${width}" height="${height}"`;
	switch (style.id) {
		case 'aurora':
			return {
				defs: `<radialGradient id="bg-aurora" cx="0.5" cy="-0.1" r="1.1"><stop offset="0" stop-color="#2a2150"/><stop offset="0.7" stop-color="#14111f"/><stop offset="1" stop-color="#14111f"/></radialGradient>`,
				rect: `<rect ${box} fill="url(#bg-aurora)"/>`
			};
		case 'synthwave':
			return {
				defs: `<linearGradient id="bg-synth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#241a4d"/><stop offset="0.52" stop-color="#4a1f63"/><stop offset="1" stop-color="#6b2f3a"/></linearGradient>`,
				rect: `<rect ${box} fill="url(#bg-synth)"/>`
			};
		case 'parchment':
			return {
				defs: `<radialGradient id="bg-parch" cx="0.5" cy="0.3" r="0.9"><stop offset="0" stop-color="#efe2c2"/><stop offset="1" stop-color="#e2cfa0"/></radialGradient>`,
				rect: `<rect ${box} fill="url(#bg-parch)"/>`
			};
		case 'blueprint':
			return {
				defs: `<pattern id="bg-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#ffffff" stroke-opacity="0.10" stroke-width="1"/></pattern>`,
				rect: `<rect ${box} fill="#0e2a52"/><rect ${box} fill="url(#bg-grid)"/>`
			};
		case 'deco':
			return {
				defs: `<linearGradient id="bg-deco" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#0c2a22"/><stop offset="1" stop-color="#07181b"/></linearGradient>`,
				rect: `<rect ${box} fill="url(#bg-deco)"/>`
			};
		case 'nouveau':
			return {
				defs: `<linearGradient id="bg-nouv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3efdb"/><stop offset="1" stop-color="#e5e7cd"/></linearGradient>`,
				rect: `<rect ${box} fill="url(#bg-nouv)"/>`
			};
		case 'spectrum':
			return {
				defs: `<linearGradient id="bg-spec" x1="0" y1="0" x2="0.6" y2="1"><stop offset="0" stop-color="#130d21"/><stop offset="1" stop-color="#060613"/></linearGradient>`,
				rect: `<rect ${box} fill="url(#bg-spec)"/>`
			};
		case 'riso':
			// Off-white + a faint halftone dot grain (parity-friendly stand-in for film grain).
			return {
				defs: `<pattern id="bg-riso" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.6" fill="#281909" fill-opacity="0.10"/></pattern>`,
				rect: `<rect ${box} fill="#f2eadd"/><rect ${box} fill="url(#bg-riso)"/>`
			};
		default:
			return { defs: '', rect: `<rect ${box} fill="${style.canvas.tintBaseHex}"/>` };
	}
}

/** Decorative frame for the export, drawn over the background and under the tokens. `''` when none. */
export function styleExportFrame(
	style: VisualStyle,
	x: number,
	y: number,
	width: number,
	height: number
): string {
	const bottom = y + height;
	const cx = x + width / 2;
	switch (style.id) {
		case 'parchment':
			return (
				`<rect x="${x + 14}" y="${y + 14}" width="${width - 28}" height="${height - 28}" fill="none" stroke="#b8902f" stroke-opacity="0.55" stroke-width="2"/>` +
				`<rect x="${x + 20}" y="${y + 20}" width="${width - 40}" height="${height - 40}" fill="none" stroke="#6b4d23" stroke-opacity="0.45" stroke-width="1"/>`
			);
		case 'bauhaus':
			return `<rect x="${x + 2}" y="${y + 2}" width="${width - 4}" height="${height - 4}" fill="none" stroke="#171008" stroke-width="4"/>`;
		case 'blueprint':
			return `<rect x="${x + 10}" y="${y + 10}" width="${width - 20}" height="${height - 20}" fill="none" stroke="#cfe0ff" stroke-opacity="0.35" stroke-width="1"/>`;
		case 'deco': {
			const dia = (dy: number) =>
				`<rect x="${cx - 7}" y="${dy - 7}" width="14" height="14" fill="#e9be57" transform="rotate(45 ${cx} ${dy})"/>`;
			return (
				`<rect x="${x + 16}" y="${y + 16}" width="${width - 32}" height="${height - 32}" fill="none" stroke="#e9be57" stroke-opacity="0.55" stroke-width="1.5"/>` +
				`<rect x="${x + 22}" y="${y + 22}" width="${width - 44}" height="${height - 44}" fill="none" stroke="#e9be57" stroke-opacity="0.3" stroke-width="0.75"/>` +
				dia(y + 16) +
				dia(bottom - 16)
			);
		}
		case 'nouveau':
			return `<rect x="${x + 16}" y="${y + 16}" width="${width - 32}" height="${height - 32}" rx="90" ry="18" fill="none" stroke="#7b865d" stroke-opacity="0.5" stroke-width="1"/>`;
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
