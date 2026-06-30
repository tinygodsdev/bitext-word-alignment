import { describe, expect, it } from 'vitest';
import {
	applyStyleFont,
	effectiveLineFamily,
	getStyle,
	isStyleId,
	styleExportBackground,
	STYLE_ORDER
} from './styles.js';
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
	const atlas = getStyle('atlas'); // defaultFont: 'Source Serif 4'

	it('replaces the family only for the untouched app default', () => {
		const def = line({ family: 'Inter', source: 'google' });
		expect(effectiveLineFamily(def, atlas)).toBe('Source Serif 4');
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
		expect(out[0].font.family).toBe('Source Serif 4');
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
