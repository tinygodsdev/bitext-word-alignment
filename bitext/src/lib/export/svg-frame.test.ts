import { describe, expect, it } from 'vitest';
import { buildStandaloneSvgString, refitLayoutToFill } from './svg.js';

function box(x: number, y: number, w: number, h: number) {
	return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

/** Minimal valid args; empty tokenLayout makes the crop fall back to the content width/height. */
function baseArgs() {
	return {
		width: 400,
		height: 200,
		backgroundColor: '#ffffff',
		defaultTextColor: '#000000',
		colorTokensByLink: false,
		lineStyle: 'curved' as const,
		lineThickness: 3,
		lineOpacity: 1,
		lineOrder: [] as string[],
		lines: [],
		tokenLayout: {},
		connections: [],
		pairControls: [],
		includeAttributionFooter: false
	};
}

describe('buildStandaloneSvgString framing', () => {
	it('does not wrap content in a frame when no frame is given', () => {
		const svg = buildStandaloneSvgString(baseArgs());
		expect(svg).toMatch(/^<\?xml[^\n]*\n<svg /);
		expect(svg).not.toContain('<g transform="translate(');
	});

	it('emits the exact preset canvas and wraps content in a transform', () => {
		const svg = buildStandaloneSvgString({
			...baseArgs(),
			frame: { width: 1080, height: 1080, padding: 64, background: '#ffffff' }
		});
		expect(svg).toMatch(/<svg[^>]*width="1080"[^>]*height="1080"/);
		expect(svg).toContain('viewBox="0 0 1080 1080"');
		expect(svg).toContain('<g transform="translate(');
		// A full-canvas background rect is drawn behind the fitted diagram.
		expect(svg).toContain('width="1080" height="1080" fill="#ffffff"');
	});

	it('uses the frame background when it differs from the content background', () => {
		const svg = buildStandaloneSvgString({
			...baseArgs(),
			frame: { width: 1200, height: 630, background: '#1e1e1e' }
		});
		expect(svg).toContain('width="1200" height="630" fill="#1e1e1e"');
	});
});

describe('refitLayoutToFill', () => {
	// Two short rows near the top of a wide content box, exported into a tall frame.
	const layout = {
		'a-0': box(0, 0, 400, 40),
		'b-0': box(0, 80, 400, 40) // 40px gap between the rows
	};
	const groups = [['a-0'], ['b-0']];

	it('spreads the rows apart to fill a tall frame', () => {
		const out = refitLayoutToFill(layout, groups, 400, 1200);
		const gap = out['b-0'].y - (out['a-0'].y + out['a-0'].h);
		expect(gap).toBeGreaterThan(40);
		// cy tracks y so connectors follow.
		expect(out['b-0'].cy).toBe(out['b-0'].y + out['b-0'].h / 2);
		// x is untouched (no horizontal distortion).
		expect(out['a-0'].x).toBe(0);
		expect(out['a-0'].w).toBe(400);
	});

	it('caps the growth (does not glue rows to the edges) on an extreme frame', () => {
		const out = refitLayoutToFill(layout, groups, 400, 100000);
		const gap = out['b-0'].y - (out['a-0'].y + out['a-0'].h);
		// capMult 2.5 × total row height (80) ⇒ gap ≤ 200, far from filling 100000.
		expect(gap).toBeLessThanOrEqual(200);
	});

	it('leaves a single row unchanged', () => {
		const single = { 'a-0': box(0, 0, 400, 40) };
		expect(refitLayoutToFill(single, [['a-0']], 400, 1200)).toBe(single);
	});

	it('leaves the layout unchanged when content is taller than the frame', () => {
		expect(refitLayoutToFill(layout, groups, 400, 50)).toBe(layout);
	});
});
