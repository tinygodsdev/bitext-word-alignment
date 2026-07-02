import { describe, expect, it } from 'vitest';
import {
	applyStyleFont,
	connectorColor,
	effectiveLineFamily,
	getStyle,
	isStyleId,
	readableTextOn,
	styleExportBackground,
	STYLE_ORDER
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
		expect(styleExportBackground(getStyle('classic'), 100, 100)).toBeNull();
	});

	it('produces gradient defs for aurora', () => {
		const bg = styleExportBackground(getStyle('aurora'), 100, 100);
		expect(bg?.defs).toContain('radialGradient');
		expect(bg?.rect).toContain('url(#bg-aurora)');
	});

	it('produces a solid fill for atlas', () => {
		const bg = styleExportBackground(getStyle('atlas'), 100, 100);
		expect(bg?.defs).toBe('');
		expect(bg?.rect).toContain(getStyle('atlas').canvas.tintBaseHex);
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
