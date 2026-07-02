import { describe, expect, it } from 'vitest';
import { clampPan, clampZoom, IDENTITY_ZOOM, isIdentity, zoomAt } from './zoom.js';

describe('clampZoom', () => {
	it('clamps to [1, 6]', () => {
		expect(clampZoom(0.5)).toBe(1);
		expect(clampZoom(3)).toBe(3);
		expect(clampZoom(99)).toBe(6);
	});
});

describe('zoomAt', () => {
	it('keeps the focal point fixed on screen', () => {
		// From identity, zoom 2x around focal (100, 50).
		const s = zoomAt(IDENTITY_ZOOM, 2, { x: 100, y: 50 });
		expect(s.z).toBe(2);
		// The content point that was under (100,50) must still map to (100,50):
		// screen = translate + z * content; content = (focal - t0)/z0 = (100,50)
		const screenX = s.x + s.z * 100;
		const screenY = s.y + s.z * 50;
		expect(screenX).toBeCloseTo(100, 6);
		expect(screenY).toBeCloseTo(50, 6);
	});

	it('is reversible back to identity', () => {
		const a = zoomAt(IDENTITY_ZOOM, 3, { x: 40, y: 20 });
		const b = zoomAt(a, 1, { x: 40, y: 20 });
		expect(b.z).toBe(1);
		expect(b.x).toBeCloseTo(0, 6);
		expect(b.y).toBeCloseTo(0, 6);
	});
});

describe('clampPan', () => {
	it('pins to 0 at zoom 1', () => {
		const s = clampPan({ z: 1, x: -50, y: 30 }, 300, 200);
		expect(s.x).toBe(0);
		expect(s.y).toBe(0);
	});

	it('keeps zoomed content covering the viewport', () => {
		// z=2, viewport 300×200 → x in [-300, 0], y in [-200, 0]
		expect(clampPan({ z: 2, x: 100, y: 100 }, 300, 200).x).toBe(0);
		expect(clampPan({ z: 2, x: -999, y: -999 }, 300, 200)).toEqual({ z: 2, x: -300, y: -200 });
		expect(clampPan({ z: 2, x: -150, y: -80 }, 300, 200)).toEqual({ z: 2, x: -150, y: -80 });
	});
});

describe('isIdentity', () => {
	it('detects the untransformed state', () => {
		expect(isIdentity(IDENTITY_ZOOM)).toBe(true);
		expect(isIdentity({ z: 1.2, x: 0, y: 0 })).toBe(false);
	});
});
