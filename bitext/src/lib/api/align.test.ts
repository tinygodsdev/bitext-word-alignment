import { describe, expect, it } from 'vitest';
import { buildAlignUrl, parseAlignBody } from './align.js';
import { decodeState } from '$lib/serialization/decode.js';

const ORIGIN = 'https://example.com';

// ── parseAlignBody ────────────────────────────────────────────────────────────

describe('parseAlignBody', () => {
	it('rejects non-object body', () => {
		expect(parseAlignBody(null)).toMatchObject({ err: expect.any(String) });
		expect(parseAlignBody('string')).toMatchObject({ err: expect.any(String) });
	});

	it('rejects missing lines', () => {
		expect(parseAlignBody({})).toMatchObject({ err: expect.stringContaining('"lines"') });
	});

	it('rejects empty lines array', () => {
		expect(parseAlignBody({ lines: [] })).toMatchObject({ err: expect.any(String) });
	});

	it('rejects invalid line entry (number)', () => {
		expect(parseAlignBody({ lines: [1, 2] })).toMatchObject({ err: expect.any(String) });
	});

	it('rejects more than 8 lines', () => {
		expect(parseAlignBody({ lines: Array(9).fill('x') })).toMatchObject({ err: expect.any(String) });
	});

	it('accepts string lines without alignments (backward compat)', () => {
		const result = parseAlignBody({ lines: ['Hello', 'Bonjour'] });
		expect(result).toMatchObject({ ok: { lines: [{ text: 'Hello' }, { text: 'Bonjour' }], alignments: [] } });
	});

	it('accepts string lines with alignments', () => {
		const result = parseAlignBody({ lines: ['Hello', 'Bonjour'], alignments: [[0, 0, 1, 0]] });
		expect(result).toMatchObject({ ok: { alignments: [[0, 0, 1, 0]] } });
	});

	it('accepts object lines with per-line options', () => {
		const result = parseAlignBody({
			lines: [{ text: 'שלום', rtl: true, sizePx: 40 }, 'Hello']
		});
		expect(result).toMatchObject({
			ok: { lines: [{ text: 'שלום', rtl: true, sizePx: 40 }, { text: 'Hello' }] }
		});
	});

	it('rejects object line missing text', () => {
		expect(parseAlignBody({ lines: [{ font: 'Noto Serif' }] })).toMatchObject({ err: expect.any(String) });
	});

	it('rejects alignment tuples that are not length-4 integer arrays', () => {
		expect(parseAlignBody({ lines: ['a', 'b'], alignments: [[0, 0, 1]] })).toMatchObject({
			err: expect.any(String)
		});
		expect(parseAlignBody({ lines: ['a', 'b'], alignments: [[0, 0, 1, 0.5]] })).toMatchObject({
			err: expect.any(String)
		});
	});

	it('accepts valid settings object', () => {
		const result = parseAlignBody({
			lines: ['a', 'b'],
			settings: { palette: 'vivid', lineStyle: 'straight', lineThickness: 5 }
		});
		expect(result).toMatchObject({ ok: { settings: { palette: 'vivid', lineStyle: 'straight' } } });
	});

	it('rejects invalid palette value', () => {
		expect(parseAlignBody({ lines: ['a', 'b'], settings: { palette: 'rainbow' } })).toMatchObject({
			err: expect.stringContaining('palette')
		});
	});

	it('accepts pairs array', () => {
		const result = parseAlignBody({
			lines: ['a', 'b', 'c'],
			pairs: [{ upper: 0, lower: 1, gapPx: 200, showConnectors: false }]
		});
		expect(result).toMatchObject({
			ok: { pairs: [{ upper: 0, lower: 1, gapPx: 200, showConnectors: false }] }
		});
	});

	it('rejects pair where lower !== upper+1', () => {
		expect(
			parseAlignBody({ lines: ['a', 'b', 'c'], pairs: [{ upper: 0, lower: 2 }] })
		).toMatchObject({ err: expect.stringContaining('lower must equal upper + 1') });
	});
});

// ── buildAlignUrl ─────────────────────────────────────────────────────────────

describe('buildAlignUrl', () => {
	it('returns a URL with ?data= for two string lines', () => {
		const result = buildAlignUrl(ORIGIN, { lines: ['Hello world', 'Bonjour le monde'] });
		expect(result).not.toHaveProperty('err');
		if ('url' in result) expect(result.url).toMatch(/^https:\/\/example\.com\/\?data=/);
	});

	it('round-trips: decoded state contains original line texts', () => {
		const lines = ['Hello world', 'Bonjour le monde'];
		const result = buildAlignUrl(ORIGIN, { lines });
		if (!('url' in result)) throw new Error('expected url');
		const state = decodeState(new URL(result.url).searchParams.get('data'));
		expect(state.project.lines.map((l) => l.rawText)).toEqual(lines);
	});

	it('encodes alignments: connections appear with correct token IDs', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: ['Hello world', 'Bonjour le monde'],
			alignments: [[0, 0, 1, 0]]
		});
		if (!('url' in result)) throw new Error('expected url');
		const state = decodeState(new URL(result.url).searchParams.get('data'));
		expect(state.project.connections).toHaveLength(1);
		expect(state.project.connections[0]!.upperTokenId).toBe('l0-0');
		expect(state.project.connections[0]!.lowerTokenId).toBe('l1-0');
	});

	it('maps word indices to correct token IDs for multi-word line', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: ['Hello world', 'Bonjour le monde'],
			alignments: [[0, 1, 1, 2]]
		});
		if (!('url' in result)) throw new Error('expected url');
		const state = decodeState(new URL(result.url).searchParams.get('data'));
		expect(state.project.connections[0]!.upperTokenId).toBe('l0-1'); // "world"
		expect(state.project.connections[0]!.lowerTokenId).toBe('l1-2'); // "monde"
	});

	it('shared token gets the same color on both connections (many-to-one grouping)', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: ['я хочу спать', 'I want to sleep'],
			alignments: [
				[0, 2, 1, 2],
				[0, 2, 1, 3]
			]
		});
		if (!('url' in result)) throw new Error('expected url');
		const state = decodeState(new URL(result.url).searchParams.get('data'));
		const conns = state.project.connections;
		expect(conns).toHaveLength(2);
		expect(conns[0]!.color).toBe(conns[1]!.color);
	});

	it('handles 3 lines with alignments between each adjacent pair', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: ['A B', 'C D', 'E F'],
			alignments: [
				[0, 0, 1, 0],
				[1, 1, 2, 1]
			]
		});
		if (!('url' in result)) throw new Error('expected url');
		const state = decodeState(new URL(result.url).searchParams.get('data'));
		expect(state.project.connections).toHaveLength(2);
	});

	it('applies settings overrides (palette, lineStyle)', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: ['Hello', 'World'],
			settings: { palette: 'vivid', lineStyle: 'straight', lineThickness: 5, lineOpacity: 0.7 }
		});
		if (!('url' in result)) throw new Error('expected url');
		const state = decodeState(new URL(result.url).searchParams.get('data'));
		expect(state.settings.palette).toBe('vivid');
		expect(state.settings.lineStyle).toBe('straight');
		expect(state.settings.lineThickness).toBe(5);
		expect(state.settings.lineOpacity).toBe(0.7);
	});

	it('applies per-line options (font, sizePx, rtl)', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: [
				{ text: 'שלום עולם', rtl: true, sizePx: 48 },
				{ text: 'Hello world', font: 'Noto Serif', sizePx: 32 }
			]
		});
		if (!('url' in result)) throw new Error('expected url');
		const state = decodeState(new URL(result.url).searchParams.get('data'));
		expect(state.project.lines[0]!.rtl).toBe(true);
		expect(state.project.lines[0]!.textSizePx).toBe(48);
		expect(state.project.lines[1]!.font.family).toBe('Noto Serif');
		expect(state.project.lines[1]!.textSizePx).toBe(32);
	});

	it('clamps lineThickness and lineOpacity to valid ranges', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: ['a', 'b'],
			settings: { lineThickness: 100, lineOpacity: -5 }
		});
		if (!('url' in result)) throw new Error('expected url');
		const state = decodeState(new URL(result.url).searchParams.get('data'));
		expect(state.settings.lineThickness).toBe(8);
		expect(state.settings.lineOpacity).toBe(0.2);
	});

	it('applies pair gapPx and showConnectors=false', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: ['A', 'B', 'C'],
			pairs: [
				{ upper: 0, lower: 1, gapPx: 200 },
				{ upper: 1, lower: 2, showConnectors: false }
			]
		});
		if (!('url' in result)) throw new Error('expected url');
		const state = decodeState(new URL(result.url).searchParams.get('data'));
		expect(state.project.linePairGaps).toHaveLength(1);
		expect(state.project.linePairGaps[0]!.gapPx).toBe(156); // clamped to max
		expect(state.project.pairControls).toHaveLength(1);
		expect(state.project.pairControls[0]!.showConnectors).toBe(false);
	});

	it('rejects line index out of range', () => {
		expect(
			buildAlignUrl(ORIGIN, { lines: ['a', 'b'], alignments: [[0, 0, 5, 0]] })
		).toMatchObject({ err: expect.stringContaining('lineB=5') });
	});

	it('rejects non-adjacent lines', () => {
		expect(
			buildAlignUrl(ORIGIN, { lines: ['a', 'b', 'c'], alignments: [[0, 0, 2, 0]] })
		).toMatchObject({ err: expect.stringContaining('not adjacent') });
	});

	it('rejects word index out of range with helpful message', () => {
		expect(
			buildAlignUrl(ORIGIN, { lines: ['Hello', 'World'], alignments: [[0, 5, 1, 0]] })
		).toMatchObject({ err: expect.stringContaining('word 5 out of range') });
	});

	it('works with a single line and no alignments', () => {
		expect(buildAlignUrl(ORIGIN, { lines: ['Solo line'] })).not.toHaveProperty('err');
	});

	it('handles 8 lines (max)', () => {
		const lines = Array.from({ length: 8 }, (_, i) => `line ${i}`);
		expect(buildAlignUrl(ORIGIN, { lines })).not.toHaveProperty('err');
	});
});
