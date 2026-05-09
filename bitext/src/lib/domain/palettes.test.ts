import { describe, expect, it } from 'vitest';
import { PALETTES, pickUnusedPaletteColor } from './palettes.js';

describe('pickUnusedPaletteColor', () => {
	it('returns first unused color when palette not exhausted', () => {
		const used = new Set<string>([PALETTES.pastel[0]!, PALETTES.pastel[1]!]);
		expect(pickUnusedPaletteColor('pastel', used, 99)).toBe(PALETTES.pastel[2]);
	});

	it('cycles when every palette color is already used', () => {
		const colors = PALETTES.pastel;
		const used = new Set(colors);
		expect(pickUnusedPaletteColor('pastel', used, 0)).toBe(colors[0]);
		expect(pickUnusedPaletteColor('pastel', used, 1)).toBe(colors[1]);
		expect(pickUnusedPaletteColor('pastel', used, colors.length)).toBe(colors[0]);
		expect(pickUnusedPaletteColor('pastel', used, colors.length + 2)).toBe(colors[2]);
	});
});
