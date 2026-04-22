import { describe, expect, it } from 'vitest';
import { type Link } from '$lib/domain/alignment.js';
import {
	appStateContentEquals,
	fromCompactWire,
	replayLinksFromPairIndices,
	toCompactJSON
} from './compact-v2.js';
import { decodeState } from './decode.js';
import { encodeState } from './encode.js';
import {
	defaultProjectSnapshot,
	defaultVisualSettings,
	migrate,
	normalizeVisualSettings,
	type AppStateV1,
	type BackgroundMode,
	type LineStyle,
	type UiTheme
} from './schema.js';

function state(partial: {
	project?: Partial<AppStateV1['project']>;
	settings?: Partial<AppStateV1['settings']>;
}): AppStateV1 {
	const base: AppStateV1 = {
		v: 1,
		project: { ...defaultProjectSnapshot() },
		settings: defaultVisualSettings()
	};
	if (partial.project) {
		base.project = { ...base.project, ...partial.project };
	}
	if (partial.settings) {
		base.settings = { ...base.settings, ...partial.settings };
	}
	return base;
}

describe('visual settings migration', () => {
	it('maps legacy textSizePx to both line sizes', () => {
		const s = normalizeVisualSettings({ textSizePx: 28 });
		expect(s.sourceTextSizePx).toBe(28);
		expect(s.targetTextSizePx).toBe(28);
	});
});

describe('compact v2 encode/decode', () => {
	it('round-trip: defaults', () => {
		const s = state({});
		const encoded = encodeState(s);
		const decoded = decodeState(encoded);
		expect(appStateContentEquals(decoded, s)).toBe(true);
		expect(encoded.length).toBeLessThan(80);
	});

	it('round-trip: typical two sentences and links', () => {
		const settings = { ...defaultVisualSettings(), palette: 'vivid' as const };
		const links = replayLinksFromPairIndices(
			[
				[0, 0],
				[1, 1],
				[2, 2],
				[2, 3]
			],
			settings.palette
		);
		const s = state({
			project: {
				sourceText: 'The cat sleeps well',
				targetText: 'Le chat dort bien',
				sourceGlosses: Array(4).fill(null) as (string | null)[],
				targetGlosses: Array(4).fill(null) as (string | null)[],
				links
			},
			settings
		});
		const decoded = decodeState(encodeState(s));
		expect(appStateContentEquals(decoded, s)).toBe(true);
	});

	it('round-trip: large grid (20 tokens, 40 links)', () => {
		const src = Array.from({ length: 20 }, (_, i) => `w${i}`).join(' ');
		const tgt = Array.from({ length: 20 }, (_, i) => `t${i}`).join(' ');
		const pairs: [number, number][] = [];
		for (let i = 0; i < 20; i++) pairs.push([i, i]);
		for (let i = 0; i < 20; i++) pairs.push([i, (i + 1) % 20]);
		const settings = { ...defaultVisualSettings(), palette: 'academic' as const };
		const links = replayLinksFromPairIndices(pairs, settings.palette);
		const s = state({
			project: {
				sourceText: src,
				targetText: tgt,
				sourceGlosses: Array(20).fill(null),
				targetGlosses: Array(20).fill(null),
				links
			},
			settings
		});
		const encoded = encodeState(s);
		const decoded = decodeState(encoded);
		expect(appStateContentEquals(decoded, s)).toBe(true);
		expect(encoded.length).toBeLessThan(900);
	});

	it('preserves manual link color via lc', () => {
		const settings = { ...defaultVisualSettings(), palette: 'pastel' as const };
		let links: Link[] = replayLinksFromPairIndices(
			[
				[0, 0],
				[1, 1]
			],
			settings.palette
		);
		links = links.map((l, i) => (i === 1 ? { ...l, color: '#111111' } : l));
		const s = state({
			project: {
				sourceText: 'a b',
				targetText: 'c d',
				sourceGlosses: [null, null],
				targetGlosses: [null, null],
				links
			},
			settings
		});
		const decoded = decodeState(encodeState(s));
		expect(appStateContentEquals(decoded, s)).toBe(true);
	});

	it('custom fonts', () => {
		const s = state({
			settings: {
				sourceFontSource: 'custom',
				sourceCustomFontName: 'MyFont',
				targetFontFamily: 'Lora'
			}
		});
		const decoded = decodeState(encodeState(s));
		expect(appStateContentEquals(decoded, s)).toBe(true);
	});

	it('sparse glosses on default texts (omit st/tt)', () => {
		const def = defaultProjectSnapshot();
		const sourceGlosses: (string | null)[] = [null, 'cat'];
		const targetGlosses: (string | null)[] = [null, null, 'x'];
		const s = state({
			project: {
				sourceText: def.sourceText,
				targetText: def.targetText,
				sourceGlosses,
				targetGlosses,
				links: []
			}
		});
		const wire = JSON.parse(toCompactJSON(s)) as { p?: { st?: string; tt?: string; sg?: string } };
		expect(wire.p?.st).toBeUndefined();
		expect(wire.p?.tt).toBeUndefined();
		expect(wire.p?.sg).toBeDefined();
		const decoded = decodeState(encodeState(s));
		expect(decoded.project.sourceGlosses[1]).toBe('cat');
		expect(decoded.project.targetGlosses[2]).toBe('x');
	});

	it('enum coverage: lineStyle, background, theme', () => {
		const lineStyles: LineStyle[] = ['straight', 'curved'];
		const backgrounds: BackgroundMode[] = ['light', 'dark', 'image'];
		const themes: UiTheme[] = ['light', 'dark'];
		for (const lineStyle of lineStyles) {
			for (const background of backgrounds) {
				for (const theme of themes) {
					const s = state({ settings: { lineStyle, background, theme } });
					const decoded = decodeState(encodeState(s));
					expect(appStateContentEquals(decoded, s)).toBe(true);
				}
			}
		}
	});

	it('omit settings when equal to defaults', () => {
		const s = state({});
		const wire = JSON.parse(toCompactJSON(s)) as { s?: unknown };
		expect(wire.s).toBeUndefined();
	});

	it('preserves fractional layout settings (preview geometry)', () => {
		const s = state({
			settings: {
				sourceTextSizePx: 35.25,
				targetTextSizePx: 35.25,
				gapWordPx: 13.5,
				gapLinePx: 118.75
			}
		});
		const decoded = decodeState(encodeState(s));
		expect(decoded.settings.sourceTextSizePx).toBe(35.25);
		expect(decoded.settings.targetTextSizePx).toBe(35.25);
		expect(decoded.settings.gapWordPx).toBe(13.5);
		expect(decoded.settings.gapLinePx).toBe(118.75);
	});

	it('bad payloads fall back to defaults', () => {
		const d = migrate({});
		for (const bad of ['', '@@@', 'not-valid-base64___', '%']) {
			const out = decodeState(bad);
			expect(out.v).toBe(d.v);
			expect(out.project.sourceText).toBe(d.project.sourceText);
		}
	});

	it('rounds lineOpacity and lineThickness', () => {
		const s = state({
			settings: {
				lineOpacity: 0.12345,
				lineThickness: 3.33
			}
		});
		const decoded = decodeState(encodeState(s));
		expect(decoded.settings.lineOpacity).toBe(0.12);
		expect(decoded.settings.lineThickness).toBe(3.3);
	});

	it('encode is deterministic', () => {
		const s = state({
			settings: { sourceTextSizePx: 24, targetTextSizePx: 24, palette: 'vivid' },
			project: {
				sourceText: 'one two',
				targetText: 'un deux',
				sourceGlosses: [],
				targetGlosses: [],
				links: replayLinksFromPairIndices(
					[
						[0, 0],
						[1, 1]
					],
					'vivid'
				)
			}
		});
		expect(encodeState(s)).toBe(encodeState(s));
	});

	it('reject wrong compact wire version', () => {
		expect(() => fromCompactWire({ v: 99 } as never)).toThrow();
	});
});
