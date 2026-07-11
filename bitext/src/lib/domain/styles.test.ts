import { describe, expect, it } from 'vitest';
import {
	applyStyleFont,
	connectorColor,
	effectiveLineFamily,
	getStyle,
	isStyleId,
	readableTextOn,
	shiftHue,
	styleExportBackground,
	styleExportFrame,
	STYLE_ORDER,
	BACKGROUNDS_LIST,
	BACKGROUND_ORDER,
	backgroundExport,
	getBackground,
	isBackgroundId,
	isPlainBackground,
	resolveBackgroundId,
	resolveCanvas,
	computeSolidCanvas
} from './styles.js';
import { isPaletteName, PALETTE_NAMES, PALETTES } from './palettes.js';
import { ribbonPathD } from './link-geometry.js';
import type { LineV2 } from '$lib/serialization/schema.js';

function line(font: LineV2['font']): LineV2 {
	return { id: 's', rawText: 'hi', font, textSizePx: 36, gapWordPx: 14 };
}

describe('style catalog', () => {
	it('classic is first and every id resolves', () => {
		expect(STYLE_ORDER[0]).toBe('classic');
		for (const id of STYLE_ORDER) expect(getStyle(id).id).toBe(id);
	});

	it('isStyleId guards unknown values', () => {
		expect(isStyleId('aurora')).toBe(true);
		expect(isStyleId('nope')).toBe(false);
		expect(isStyleId(undefined)).toBe(false);
	});
});

describe('style default font', () => {
	const atlas = getStyle('atlas'); // defaultFont: 'Spectral'

	it('replaces the family only for the untouched app default', () => {
		const def = line({ family: 'Inter', source: 'google' });
		expect(effectiveLineFamily(def, atlas)).toBe('Spectral');
	});

	it('keeps an explicit user font', () => {
		const chosen = line({ family: 'Lora', source: 'google' });
		expect(effectiveLineFamily(chosen, atlas)).toBe('Lora');
		const custom = line({ family: 'X', source: 'custom', customName: 'MyFont' });
		expect(effectiveLineFamily(custom, atlas)).toBe('MyFont');
	});

	it('classic never overrides the font', () => {
		const def = line({ family: 'Inter', source: 'google' });
		expect(effectiveLineFamily(def, getStyle('classic'))).toBe('Inter');
	});

	it('applyStyleFont is pure and only touches default lines', () => {
		const lines = [
			line({ family: 'Inter', source: 'google' }),
			line({ family: 'Lora', source: 'google' })
		];
		const out = applyStyleFont(lines, atlas);
		expect(out[0].font.family).toBe('Spectral');
		expect(out[1].font.family).toBe('Lora');
		expect(lines[0].font.family).toBe('Inter'); // original untouched
	});
});

describe('style export background', () => {
	it('returns null for classic (caller-provided fill)', () => {
		expect(styleExportBackground(getStyle('classic'), 0, 0, 100, 100)).toBeNull();
	});

	it('produces gradient defs for aurora', () => {
		const bg = styleExportBackground(getStyle('aurora'), 0, 0, 100, 100);
		expect(bg?.defs).toContain('radialGradient');
		expect(bg?.rect).toContain('url(#bg-aurora)');
	});

	it('produces a solid fill for atlas', () => {
		const bg = styleExportBackground(getStyle('atlas'), 0, 0, 100, 100);
		expect(bg?.defs).toBe('');
		expect(bg?.rect).toContain(getStyle('atlas').canvas.tintBaseHex);
	});

	it('deco/nouveau/spectrum use gradients; riso adds a grain pattern', () => {
		expect(styleExportBackground(getStyle('deco'), 0, 0, 100, 100)?.rect).toContain(
			'url(#bg-deco)'
		);
		expect(styleExportBackground(getStyle('nouveau'), 0, 0, 100, 100)?.rect).toContain(
			'url(#bg-nouv)'
		);
		expect(styleExportBackground(getStyle('spectrum'), 0, 0, 100, 100)?.rect).toContain(
			'url(#bg-spec)'
		);
		const riso = styleExportBackground(getStyle('riso'), 0, 0, 100, 100);
		expect(riso?.defs).toContain('pattern');
		expect(riso?.rect).toContain('url(#bg-riso)');
	});
});

describe('background catalog', () => {
	it('lists light/dark first, then every themed style (Classic excluded)', () => {
		expect(BACKGROUND_ORDER.slice(0, 2)).toEqual(['light', 'dark']);
		expect(BACKGROUND_ORDER).not.toContain('classic');
		for (const id of STYLE_ORDER) {
			if (id === 'classic') continue;
			expect(BACKGROUND_ORDER).toContain(id);
		}
		expect(BACKGROUNDS_LIST).toHaveLength(BACKGROUND_ORDER.length);
	});

	it('themed backgrounds reuse the style canvas', () => {
		expect(getBackground('aurora').canvas).toEqual(getStyle('aurora').canvas);
	});

	it('isBackgroundId guards unknown values', () => {
		expect(isBackgroundId('aurora')).toBe(true);
		expect(isBackgroundId('light')).toBe(true);
		expect(isBackgroundId('classic')).toBe(false);
		expect(isBackgroundId('nope')).toBe(false);
	});

	it('isPlainBackground only for light/dark', () => {
		expect(isPlainBackground('light')).toBe(true);
		expect(isPlainBackground('dark')).toBe(true);
		expect(isPlainBackground('aurora')).toBe(false);
	});
});

describe('resolveBackgroundId', () => {
	it('an explicit override always wins', () => {
		expect(resolveBackgroundId('bauhaus', 'aurora', false)).toBe('aurora');
		expect(resolveBackgroundId('classic', 'synthwave', true)).toBe('synthwave');
	});

	it('classic without override follows the legacy light/dark toggle', () => {
		expect(resolveBackgroundId('classic', undefined, false)).toBe('light');
		expect(resolveBackgroundId('classic', undefined, true)).toBe('dark');
	});

	it('a themed style without override uses its own canvas', () => {
		expect(resolveBackgroundId('aurora', undefined, true)).toBe('aurora');
	});
});

describe('backgroundExport', () => {
	it('returns null for the plain light/dark canvases', () => {
		expect(backgroundExport('light', 0, 0, 100, 100)).toBeNull();
		expect(backgroundExport('dark', 0, 0, 100, 100)).toBeNull();
	});

	it('paints a themed canvas regardless of the style', () => {
		expect(backgroundExport('aurora', 0, 0, 100, 100)?.rect).toContain('url(#bg-aurora)');
	});

	it('returns null for the custom solid canvas (caller fills it)', () => {
		expect(backgroundExport('custom', 0, 0, 100, 100)).toBeNull();
	});
});

describe('custom canvas', () => {
	it('isBackgroundId accepts custom; it is not a plain (CSS-class) canvas', () => {
		expect(isBackgroundId('custom')).toBe(true);
		expect(isPlainBackground('custom')).toBe(false);
	});

	it('computeSolidCanvas derives readable text + isDark from luminance', () => {
		const dark = computeSolidCanvas('#101020');
		expect(dark.isDark).toBe(true);
		expect(dark.textColor).toBe('#ffffff');
		expect(dark.previewBackground).toBe('#101020');

		const light = computeSolidCanvas('#fef3c7');
		expect(light.isDark).toBe(false);
		expect(light.textColor).toBe('#171008');
	});

	it('resolveCanvas builds the custom canvas from the chosen color', () => {
		const r = resolveCanvas('bauhaus', 'custom', false, '#0055ff');
		expect(r.id).toBe('custom');
		expect(r.plain).toBe(false);
		expect(r.canvas.previewBackground).toBe('#0055ff');
	});

	it('resolveCanvas falls back to the style default when no override', () => {
		const r = resolveCanvas('aurora', undefined, false, '#0055ff');
		expect(r.id).toBe('aurora');
		expect(r.canvas).toEqual(getStyle('aurora').canvas);
	});
});

describe('connector + chip helpers', () => {
	it('ink styles override the link color, others keep it', () => {
		expect(connectorColor(getStyle('bauhaus'), '#ef4444')).toBe('#171008'); // ink override
		expect(connectorColor(getStyle('aurora'), '#ef4444')).toBe('#ef4444'); // palette kept
	});

	it('chip text is readable on the fill', () => {
		expect(readableTextOn('#171008')).toBe('#ffffff'); // dark fill → light text
		expect(readableTextOn('#fddb72')).toBe('#171008'); // light fill → dark text
	});

	it('ribbon path is a closed filled shape', () => {
		const d = ribbonPathD(0, 0, 100, 100, 'curved', 24, true);
		expect(d.startsWith('M ')).toBe(true);
		expect(d.endsWith(' Z')).toBe(true);
	});

	it('shiftHue returns a different valid hex (Riso companion ink)', () => {
		const out = shiftHue('#df2321', 165);
		expect(out).toMatch(/^#[0-9a-f]{6}$/);
		expect(out).not.toBe('#df2321');
	});

	it('deco frame draws corner diamonds; nouveau frame is rounded', () => {
		const deco = styleExportFrame(getStyle('deco'), 0, 0, 200, 120);
		expect(deco).toContain('#e9be57');
		expect(deco).toContain('rotate(45');
		expect(styleExportFrame(getStyle('nouveau'), 0, 0, 200, 120)).toContain('rx="90"');
	});
});

describe('palettes', () => {
	it('every picker name resolves and guards work', () => {
		for (const n of PALETTE_NAMES) expect(PALETTES[n].length).toBeGreaterThan(0);
		expect(isPaletteName('neon')).toBe(true);
		expect(isPaletteName('bogus')).toBe(false);
	});

	it('each non-classic style bundles an existing palette', () => {
		for (const id of STYLE_ORDER) {
			const p = getStyle(id).palette;
			if (p) expect(isPaletteName(p)).toBe(true);
		}
	});
});
