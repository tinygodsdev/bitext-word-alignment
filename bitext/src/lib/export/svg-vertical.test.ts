import { describe, expect, it } from 'vitest';
import { buildStandaloneSvgString, refitLayoutToFill } from './svg.js';
import type { TokenLayout } from '$lib/types/layout.js';

function box(x: number, y: number, w: number, h: number): TokenLayout {
	return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

function args(overrides: Partial<Parameters<typeof buildStandaloneSvgString>[0]> = {}) {
	return {
		width: 400,
		height: 400,
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
		includeAttributionFooter: false,
		...overrides
	};
}

describe('export — vertical token text', () => {
	it('stacks one tspan per character down the box', () => {
		const svg = buildStandaloneSvgString(
			args({
				lineOrder: ['ja'],
				lines: [
					{
						lineId: 'ja',
						tokens: [{ id: 'ja-0', text: '猫だ' }],
						fontFamilyStack: 'Noto Serif JP',
						textSizePx: 40,
						orientation: 'vertical'
					}
				],
				tokenLayout: { 'ja-0': box(100, 0, 48, 88) }
			})
		);
		expect(svg).toContain('<tspan x="0" y="24">猫</tspan>');
		expect(svg).toContain('<tspan x="0" y="64">だ</tspan>');
		// Anchored to the box top-center, so the run lands where the preview measured it.
		expect(svg).toContain('transform="translate(124,0)"');
	});

	it('splits astral characters as whole glyphs, not surrogate halves', () => {
		const svg = buildStandaloneSvgString(
			args({
				lineOrder: ['x'],
				lines: [
					{
						lineId: 'x',
						tokens: [{ id: 'x-0', text: '𠮷野' }],
						fontFamilyStack: 'Noto Serif JP',
						textSizePx: 20,
						orientation: 'vertical'
					}
				],
				tokenLayout: { 'x-0': box(0, 0, 28, 48) }
			})
		);
		expect(svg).toContain('>𠮷</tspan>');
		expect(svg).toContain('>野</tspan>');
	});

	it('rotates a sideways line about the box center instead of stacking it', () => {
		const svg = buildStandaloneSvgString(
			args({
				lineOrder: ['en'],
				lines: [
					{
						lineId: 'en',
						tokens: [{ id: 'en-0', text: 'cat' }],
						fontFamilyStack: 'Inter',
						textSizePx: 20,
						orientation: 'sideways'
					}
				],
				tokenLayout: { 'en-0': box(0, 0, 24, 60) }
			})
		);
		expect(svg).toContain('transform="translate(12,30) rotate(90)"');
		expect(svg).not.toContain('<tspan');
	});

	it('leaves upright lines exactly as before', () => {
		const upright = args({
			lineOrder: ['en'],
			lines: [
				{
					lineId: 'en',
					tokens: [{ id: 'en-0', text: 'cat' }],
					fontFamilyStack: 'Inter',
					textSizePx: 20
				}
			],
			tokenLayout: { 'en-0': box(0, 0, 40, 24) }
		});
		const svg = buildStandaloneSvgString(upright);
		expect(svg).toContain('transform="translate(20,12)">cat</text>');
		expect(svg).not.toContain('<tspan');
	});
});

describe('export — column axis connectors', () => {
	const common = {
		lineOrder: ['a', 'b'],
		lines: [
			{
				lineId: 'a',
				tokens: [{ id: 'a-0', text: '猫' }],
				fontFamilyStack: 'Inter',
				textSizePx: 20
			},
			{
				lineId: 'b',
				tokens: [{ id: 'b-0', text: 'cat' }],
				fontFamilyStack: 'Inter',
				textSizePx: 20
			}
		],
		tokenLayout: { 'a-0': box(200, 0, 40, 40), 'b-0': box(0, 100, 40, 40) },
		connections: [{ id: 'c1', upperTokenId: 'a-0', lowerTokenId: 'b-0', color: '#ff0000' }]
	};

	it('runs the connector horizontally between columns', () => {
		const svg = buildStandaloneSvgString(args({ ...common, axis: 'columns' }));
		// First line sits right of the second, so it exits from its left edge at x = 200 - 8,
		// and both control points share the mid X (120) — a sideways S-curve.
		expect(svg).toContain('d="M 192 20 C 120 20 120 120 48 120"');
	});

	it('still runs vertically on the default axis', () => {
		const svg = buildStandaloneSvgString(args({ ...common }));
		// Control points share the mid Y (70) instead.
		expect(svg).toContain('d="M 220 48 C 220 70 20 70 20 92"');
	});
});

describe('refitLayoutToFill — columns', () => {
	// Two narrow columns near the left of a tall content box, exported into a wide frame.
	const layout = {
		'a-0': box(0, 0, 40, 400),
		'b-0': box(80, 0, 40, 400) // 40px gap between the columns
	};
	const groups = [['a-0'], ['b-0']];

	it('spreads the columns apart to fill a wide frame', () => {
		const out = refitLayoutToFill(layout, groups, 1200, 400, 2.5, 'columns');
		const gap = out['b-0'].x - (out['a-0'].x + out['a-0'].w);
		expect(gap).toBeGreaterThan(40);
		// cx tracks x so connectors follow.
		expect(out['b-0'].cx).toBe(out['b-0'].x + out['b-0'].w / 2);
		// y is untouched (no vertical distortion).
		expect(out['a-0'].y).toBe(0);
		expect(out['a-0'].h).toBe(400);
	});

	it('caps the growth on an extreme frame', () => {
		const out = refitLayoutToFill(layout, groups, 100000, 400, 2.5, 'columns');
		const gap = out['b-0'].x - (out['a-0'].x + out['a-0'].w);
		// capMult 2.5 × total column width (80) ⇒ gap ≤ 200.
		expect(gap).toBeLessThanOrEqual(200);
	});

	it('leaves the layout unchanged when content is wider than the frame', () => {
		expect(refitLayoutToFill(layout, groups, 50, 400, 2.5, 'columns')).toBe(layout);
	});
});
