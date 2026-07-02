import { describe, expect, it } from 'vitest';
import { computeAutoFitScales, scalesChanged } from './autofit.js';

describe('computeAutoFitScales', () => {
	it('leaves lines that fit at scale 1', () => {
		const out = computeAutoFitScales(
			[
				{ lineId: 'a', width: 100, effScale: 1 },
				{ lineId: 'b', width: 200, effScale: 1 }
			],
			300,
			1
		);
		expect(out.a).toBe(1);
		expect(out.b).toBe(1);
	});

	it('per-line (variance 1): each line shrinks only as much as it needs', () => {
		const out = computeAutoFitScales(
			[
				{ lineId: 'short', width: 200, effScale: 1 },
				{ lineId: 'long', width: 400, effScale: 1 }
			],
			200,
			1
		);
		expect(out.short).toBeCloseTo(1, 5); // 200 fits
		expect(out.long).toBeCloseTo(0.5, 5); // 400 → 0.5 to fit 200
	});

	it('global (variance 0): all lines use the smallest scale', () => {
		const out = computeAutoFitScales(
			[
				{ lineId: 'short', width: 200, effScale: 1 },
				{ lineId: 'long', width: 400, effScale: 1 }
			],
			200,
			0
		);
		expect(out.short).toBeCloseTo(0.5, 5);
		expect(out.long).toBeCloseTo(0.5, 5);
	});

	it('variance interpolates between global and per-line', () => {
		const out = computeAutoFitScales(
			[
				{ lineId: 'short', width: 200, effScale: 1 },
				{ lineId: 'long', width: 400, effScale: 1 }
			],
			200,
			0.5
		);
		// short: between 0.5 (global) and 1 (own) → 0.75
		expect(out.short).toBeCloseTo(0.75, 5);
		expect(out.long).toBeCloseTo(0.5, 5);
	});

	it('honors the minimum floor and never exceeds 1', () => {
		const out = computeAutoFitScales([{ lineId: 'x', width: 10000, effScale: 1 }], 100, 1, 0.1);
		expect(out.x).toBe(0.1);
		const grow = computeAutoFitScales([{ lineId: 'y', width: 50, effScale: 0.5 }], 400, 1);
		expect(grow.y).toBe(1); // would be 4 → capped at 1
	});

	it('converges: applying the scale and re-measuring is stable', () => {
		// width scales with effScale. Start at 1, one tick, then re-measure.
		const avail = 200;
		const naturalAt1 = 400;
		let eff = 1;
		for (let i = 0; i < 4; i++) {
			const width = naturalAt1 * eff;
			eff = computeAutoFitScales([{ lineId: 'a', width, effScale: eff }], avail, 1).a;
		}
		expect(eff).toBeCloseTo(0.5, 3);
	});
});

describe('scalesChanged', () => {
	it('detects meaningful changes and ignores tiny ones', () => {
		expect(scalesChanged({ a: 1 }, { a: 0.5 })).toBe(true);
		expect(scalesChanged({ a: 0.5 }, { a: 0.5001 })).toBe(false);
		expect(scalesChanged({}, { a: 1 })).toBe(false);
		expect(scalesChanged({ a: 1 }, { a: 0.9 })).toBe(true);
	});
});
