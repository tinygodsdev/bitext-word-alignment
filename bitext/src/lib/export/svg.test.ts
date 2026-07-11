import { describe, expect, it } from 'vitest';
import { buildStandaloneSvgString } from './svg.js';
import type { Token } from '$lib/domain/tokens.js';
import type { TokenLayout } from '$lib/types/layout.js';
import type { Connection } from '$lib/domain/alignment.js';

const tok = (id: string, text: string): Token => ({ id, text }) as Token;
const box = (x: number, y: number): TokenLayout => ({ cx: x + 20, cy: y + 10, x, y, w: 40, h: 20 });

const connections: Connection[] = [
	{ id: 'c1', upperTokenId: 's-0', lowerTokenId: 't-0', color: '#ef4444' }
];

function build(style: Parameters<typeof buildStandaloneSvgString>[0]['style']): string {
	return buildStandaloneSvgString({
		width: 200,
		height: 120,
		backgroundColor: '#ffffff',
		defaultTextColor: '#0f172a',
		style,
		colorTokensByLink: false,
		lineStyle: 'curved',
		lineThickness: 3,
		lineOpacity: 1,
		lineOrder: ['s', 't'],
		lines: [
			{
				lineId: 's',
				tokens: [tok('s-0', 'Hi')],
				fontFamilyStack: 'Inter, sans-serif',
				textSizePx: 36
			},
			{
				lineId: 't',
				tokens: [tok('t-0', 'Bonjour')],
				fontFamilyStack: 'Inter, sans-serif',
				textSizePx: 36
			}
		],
		tokenLayout: { 's-0': box(20, 20), 't-0': box(20, 80) },
		connections,
		pairControls: [],
		includeAttributionFooter: false
	});
}

describe('buildStandaloneSvgString — visual style', () => {
	it('classic uses the caller-provided background fill', () => {
		const svg = build('classic');
		expect(svg).toContain('fill="#ffffff"');
		expect(svg).not.toContain('radialGradient');
	});

	it('aurora paints its gradient and adds a blurred glow (line + text)', () => {
		const svg = build('aurora');
		expect(svg).toContain('radialGradient');
		expect(svg).toContain('url(#bg-aurora)');
		// glow = a blurred copy of the stroke/glyph behind the crisp one
		expect(svg).toContain('wa-glow-line');
		expect(svg).toContain('feGaussianBlur');
		expect(svg).toContain('filter="url(#wa-glow-text)"');
	});

	it('atlas draws endpoint dots and no glow', () => {
		const svg = build('atlas');
		expect(svg).toContain('<circle');
		expect(svg).not.toContain('feGaussianBlur');
	});

	it('bauhaus draws its frame border', () => {
		const svg = build('bauhaus');
		expect(svg).toContain('stroke="#171008"');
	});
});

describe('buildStandaloneSvgString — independent background', () => {
	function buildWith(
		style: Parameters<typeof buildStandaloneSvgString>[0]['style'],
		backgroundId: Parameters<typeof buildStandaloneSvgString>[0]['backgroundId']
	): string {
		return buildStandaloneSvgString({
			width: 200,
			height: 120,
			backgroundColor: '#ffffff',
			defaultTextColor: '#0f172a',
			style,
			backgroundId,
			colorTokensByLink: true,
			lineStyle: 'curved',
			lineThickness: 3,
			lineOpacity: 1,
			lineOrder: ['s', 't'],
			lines: [
				{
					lineId: 's',
					tokens: [tok('s-0', 'Hi')],
					fontFamilyStack: 'Inter, sans-serif',
					textSizePx: 36
				},
				{
					lineId: 't',
					tokens: [tok('t-0', 'Salut')],
					fontFamilyStack: 'Inter, sans-serif',
					textSizePx: 36
				}
			],
			tokenLayout: { 's-0': box(20, 20), 't-0': box(20, 80) },
			connections,
			pairControls: [],
			includeAttributionFooter: false
		});
	}

	it('paints the chosen canvas under a different style (Bauhaus chips on Aurora)', () => {
		const svg = buildWith('bauhaus', 'aurora');
		// Aurora canvas from the override…
		expect(svg).toContain('url(#bg-aurora)');
		expect(svg).not.toContain('#fddb72'); // not Bauhaus's own yellow fill
		// …while the Bauhaus chip shadow (style-owned treatment) is still drawn.
		expect(svg).toContain('fill="#171008"');
	});

	it('a plain background falls back to the caller-provided fill', () => {
		const svg = buildWith('aurora', 'light');
		expect(svg).toContain('fill="#ffffff"');
		expect(svg).not.toContain('radialGradient');
	});

	it('a custom canvas paints the caller-provided solid color, no gradient defs', () => {
		// ExportMenu passes the custom color as backgroundColor + readable text as defaultTextColor.
		const svg = buildStandaloneSvgString({
			width: 200,
			height: 120,
			backgroundColor: '#0055ff',
			defaultTextColor: '#ffffff',
			style: 'bauhaus',
			backgroundId: 'custom',
			colorTokensByLink: false,
			lineStyle: 'curved',
			lineThickness: 3,
			lineOpacity: 1,
			lineOrder: ['s', 't'],
			lines: [
				{
					lineId: 's',
					tokens: [tok('s-0', 'Hi')],
					fontFamilyStack: 'Inter, sans-serif',
					textSizePx: 36
				},
				{
					lineId: 't',
					tokens: [tok('t-0', 'Salut')],
					fontFamilyStack: 'Inter, sans-serif',
					textSizePx: 36
				}
			],
			tokenLayout: { 's-0': box(20, 20), 't-0': box(20, 80) },
			connections,
			pairControls: [],
			includeAttributionFooter: false
		});
		expect(svg).toContain('fill="#0055ff"');
		expect(svg).not.toContain('Gradient');
	});
});
