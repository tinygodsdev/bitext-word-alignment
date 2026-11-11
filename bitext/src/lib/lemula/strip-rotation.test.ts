import { describe, expect, it } from 'vitest';
import { getLemulaStripPair, LEMULA_STRIP_PAIRS } from './strip-rotation.js';

const HOUR = 3_600_000;

describe('getLemulaStripPair', () => {
	it('keeps one pair for a whole UTC hour', () => {
		const start = 1_800_000_000 * 1000 - ((1_800_000_000 * 1000) % HOUR);
		expect(getLemulaStripPair(start + HOUR - 1)).toBe(getLemulaStripPair(start));
	});

	it('shows every pair over consecutive hours', () => {
		const seen = new Set(LEMULA_STRIP_PAIRS.map((_, i) => getLemulaStripPair(i * HOUR)));
		expect(seen.size).toBe(LEMULA_STRIP_PAIRS.length);
	});
});
