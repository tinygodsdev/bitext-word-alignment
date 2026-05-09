import { describe, expect, it } from 'vitest';
import {
	fromCompactWire as fromCompactWireV2,
	replayLinksFromPairIndices,
	toCompactJSON as toCompactJSONV2
} from './compact-v2.js';
import { decodeState } from './decode.js';
import { encodeState } from './encode.js';
import { deflateBase64url } from './codec.js';
import {
	defaultProjectSnapshotV1,
	defaultVisualSettingsV1,
	migrate,
	normalizeVisualSettings,
	type AppStateV1,
	type AppStateV2,
	type BackgroundMode,
	type LineStyle,
	type ProjectSnapshotV2
} from './schema.js';
import { addAtomicConnections } from '$lib/domain/alignment.js';
import type { Connection } from '$lib/domain/alignment.js';

function stateV1(partial: {
	project?: Partial<AppStateV1['project']>;
	settings?: Partial<AppStateV1['settings']>;
}): AppStateV1 {
	const base: AppStateV1 = {
		v: 1,
		project: { ...defaultProjectSnapshotV1() },
		settings: defaultVisualSettingsV1()
	};
	if (partial.project) {
		base.project = { ...base.project, ...partial.project };
	}
	if (partial.settings) {
		base.settings = { ...base.settings, ...partial.settings };
	}
	return base;
}

function projKey(project: ProjectSnapshotV2): string {
	const lines = project.lines.map(
		(l) =>
			`${l.id}:${l.rawText}:${l.textSizePx}:${l.gapWordPx}:${l.font.source}:${l.font.family}:${l.font.customName ?? ''}:${l.rtl ? 1 : 0}`
	);
	const pcs = project.pairControls
		.map((p) => `${p.upperLineId}/${p.lowerLineId}:${p.showConnectors}`)
		.sort();
	const gaps = project.linePairGaps
		.map((g) => `${g.upperLineId}/${g.lowerLineId}:${g.gapPx}`)
		.sort();
	const conns = project.connections
		.map((c) => `${c.upperTokenId}<->${c.lowerTokenId}:${c.color ?? ''}`)
		.sort();
	return JSON.stringify({ lines, pcs, gaps, conns });
}

function expectProjectEquivalent(a: ProjectSnapshotV2, b: ProjectSnapshotV2): void {
	expect(projKey(a)).toBe(projKey(b));
}

function expectStateEquivalent(a: AppStateV2, b: AppStateV2): void {
	expect(a.settings).toEqual(b.settings);
	expectProjectEquivalent(a.project, b.project);
}

describe('visual settings migration (v1 wire normalizer)', () => {
	it('maps legacy textSizePx to both line sizes', () => {
		const s = normalizeVisualSettings({ textSizePx: 28 });
		expect(s.sourceTextSizePx).toBe(28);
		expect(s.targetTextSizePx).toBe(28);
	});
});

describe('compact v3 encode/decode (current share format)', () => {
	it('round-trip: defaults via migrate shape', () => {
		const s = migrate({});
		const decoded = decodeState(encodeState(s));
		expectStateEquivalent(decoded, s);
		expect(encodeState(s).length).toBeLessThan(120);
	});

	it('round-trip: three lines, connections, hidden pair control', () => {
		const base = migrate({});
		const lines = [
			{
				id: 'a',
				rawText: 'one two',
				font: { family: 'Inter', source: 'google' as const },
				textSizePx: 30,
				gapWordPx: 5
			},
			{
				id: 'l-deadbeef',
				rawText: 'mid',
				font: { family: 'Lora', source: 'google' as const },
				textSizePx: 24,
				gapWordPx: 5
			},
			{
				id: 'b',
				rawText: 'un deux',
				font: { family: 'Inter', source: 'google' as const },
				textSizePx: 30,
				gapWordPx: 5
			}
		];
		let connections: Connection[] = [];
		connections = addAtomicConnections(
			connections,
			[{ upperTokenId: 'a-0', lowerTokenId: 'l-deadbeef-0' }],
			'#abc'
		);
		connections = addAtomicConnections(
			connections,
			[{ upperTokenId: 'l-deadbeef-0', lowerTokenId: 'b-0' }],
			'#abc'
		);
		const s: AppStateV2 = {
			...base,
			project: {
				lines,
				connections,
				linePairGaps: [],
				pairControls: [{ upperLineId: 'a', lowerLineId: 'l-deadbeef', showConnectors: false }]
			},
			settings: { ...base.settings, palette: 'vivid' }
		};
		const decoded = decodeState(encodeState(s));
		expectStateEquivalent(decoded, s);
	});

	it('legacy compact v2 share URLs still decode', () => {
		const settings = { ...defaultVisualSettingsV1(), palette: 'vivid' as const };
		const links = replayLinksFromPairIndices(
			[
				[0, 0],
				[1, 1]
			],
			settings.palette
		);
		const v1 = stateV1({
			project: {
				sourceText: 'Hello world',
				targetText: 'Bonjour monde',
				sourceGlosses: [],
				targetGlosses: [],
				links
			},
			settings
		});
		const wire = toCompactJSONV2(v1);
		const payload = deflateBase64url(wire);
		const out = decodeState(payload);
		expect(out.v).toBe(2);
		expect(out.project.lines.length).toBeGreaterThanOrEqual(2);
		const joined = out.project.lines.map((l) => l.rawText).join('|');
		expect(joined).toContain('Hello world');
		expect(joined).toContain('Bonjour monde');
		expect(out.project.connections.length).toBeGreaterThanOrEqual(1);
	});

	it('bad payloads fall back to defaults', () => {
		const d = migrate({});
		for (const bad of ['', '@@@', 'not-valid-base64___', '%']) {
			const out = decodeState(bad);
			expect(out.v).toBe(d.v);
			expect(out.project.lines.length).toBe(d.project.lines.length);
		}
	});

	it('rounds lineOpacity and lineThickness', () => {
		const s = migrate({});
		const patched: AppStateV2 = {
			...s,
			settings: {
				...s.settings,
				lineOpacity: 0.45678,
				lineThickness: 3.333
			}
		};
		const decoded = decodeState(encodeState(patched));
		expect(decoded.settings.lineOpacity).toBe(0.46);
		expect(decoded.settings.lineThickness).toBe(3);
	});

	it('encode is deterministic', () => {
		const s = migrate({});
		expect(encodeState(s)).toBe(encodeState(s));
	});

	it('preview hide chrome is not part of share wire', () => {
		const base = migrate({});
		const hidden: AppStateV2 = {
			...base,
			settings: { ...base.settings, previewHideChrome: true }
		};
		const shown: AppStateV2 = {
			...base,
			settings: { ...base.settings, previewHideChrome: false }
		};
		expect(encodeState(hidden)).toBe(encodeState(shown));
		const decoded = decodeState(encodeState(hidden));
		expect(decoded.settings.previewHideChrome).toBe(false);
	});

	it('round-trip: token merge char and punctuation split', () => {
		const base = migrate({});
		const s: AppStateV2 = {
			...base,
			settings: {
				...base.settings,
				tokenMergeChar: '+',
				tokenSplitPunctuation: true,
				tokenPunctuationChars: ',;',
				tokenSplitChars: '.'
			}
		};
		const decoded = decodeState(encodeState(s));
		expect(decoded.settings.tokenMergeChar).toBe('+');
		expect(decoded.settings.tokenSplitPunctuation).toBe(true);
		expect(decoded.settings.tokenPunctuationChars).toBe(',;');
		expect(decoded.settings.tokenSplitChars).toBe('.');
	});

	it('round-trip: token link color mode (background)', () => {
		const base = migrate({});
		const s: AppStateV2 = {
			...base,
			settings: { ...base.settings, tokenLinkColorMode: 'background' }
		};
		const decoded = decodeState(encodeState(s));
		expect(decoded.settings.tokenLinkColorMode).toBe('background');
	});

	it('round-trip: line RTL flag in compact share wire', () => {
		const base = migrate({});
		const line = base.project.lines[0]!;
		const rtlLine = { ...line, rtl: true as const };
		const s: AppStateV2 = {
			...base,
			project: { ...base.project, lines: [rtlLine, base.project.lines[1]!] }
		};
		const decoded = decodeState(encodeState(s));
		expect(decoded.project.lines[0]?.rtl).toBe(true);
		expect(decoded.project.lines[1]?.rtl).toBeFalsy();
	});

	it('enum coverage: lineStyle, background', () => {
		const base = migrate({});
		const lineStyles: LineStyle[] = ['straight', 'curved'];
		const backgrounds: BackgroundMode[] = ['light', 'dark'];
		for (const lineStyle of lineStyles) {
			for (const background of backgrounds) {
				const next: AppStateV2 = {
					...base,
					settings: { ...base.settings, lineStyle, background }
				};
				const decoded = decodeState(encodeState(next));
				expect(decoded.settings.lineStyle).toBe(lineStyle);
				expect(decoded.settings.background).toBe(background);
			}
		}
	});

	it('site theme is not part of share wire', () => {
		const base = migrate({});
		const light: AppStateV2 = {
			...base,
			settings: { ...base.settings, theme: 'light' }
		};
		const dark: AppStateV2 = {
			...base,
			settings: { ...base.settings, theme: 'dark' }
		};
		expect(encodeState(light)).toBe(encodeState(dark));
		expect(decodeState(encodeState(dark)).settings.theme).toBe('light');
	});

	it('reject wrong compact wire version', () => {
		expect(() => fromCompactWireV2({ v: 99 } as never)).toThrow();
	});
});
