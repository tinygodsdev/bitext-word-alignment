import { describe, expect, it } from 'vitest';
import { buildAlignUrl, parseAlignBody } from './align.js';
import { decodeState } from '$lib/serialization/decode.js';

const ORIGIN = 'https://example.com';

// --- parseAlignBody ---

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

	it('rejects non-string line', () => {
		expect(parseAlignBody({ lines: [1, 2] })).toMatchObject({ err: expect.any(String) });
	});

	it('rejects more than 8 lines', () => {
		expect(parseAlignBody({ lines: Array(9).fill('x') })).toMatchObject({ err: expect.any(String) });
	});

	it('accepts lines without alignments', () => {
		const result = parseAlignBody({ lines: ['Hello', 'Bonjour'] });
		expect(result).toMatchObject({ ok: { lines: ['Hello', 'Bonjour'], alignments: [] } });
	});

	it('accepts lines with alignments', () => {
		const result = parseAlignBody({ lines: ['Hello', 'Bonjour'], alignments: [[0, 0, 1, 0]] });
		expect(result).toMatchObject({ ok: { lines: ['Hello', 'Bonjour'], alignments: [[0, 0, 1, 0]] } });
	});

	it('rejects alignment tuples that are not length-4 integer arrays', () => {
		expect(parseAlignBody({ lines: ['a', 'b'], alignments: [[0, 0, 1]] })).toMatchObject({
			err: expect.any(String)
		});
		expect(parseAlignBody({ lines: ['a', 'b'], alignments: [[0, 0, 1, 0.5]] })).toMatchObject({
			err: expect.any(String)
		});
	});
});

// --- buildAlignUrl ---

describe('buildAlignUrl', () => {
	it('returns a URL with ?data= for two lines', () => {
		const result = buildAlignUrl(ORIGIN, { lines: ['Hello world', 'Bonjour le monde'] });
		expect(result).not.toHaveProperty('err');
		if ('url' in result) {
			expect(result.url).toMatch(/^https:\/\/example\.com\/\?data=/);
		}
	});

	it('the encoded URL round-trips: decoding it yields the original lines', () => {
		const lines = ['Hello world', 'Bonjour le monde'];
		const result = buildAlignUrl(ORIGIN, { lines });
		expect(result).not.toHaveProperty('err');
		if (!('url' in result)) return;

		const dataParam = new URL(result.url).searchParams.get('data');
		expect(dataParam).toBeTruthy();
		const state = decodeState(dataParam);
		expect(state.project.lines.map((l) => l.rawText)).toEqual(lines);
	});

	it('encodes alignments correctly: connections appear in decoded state', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: ['Hello world', 'Bonjour le monde'],
			alignments: [[0, 0, 1, 0]]
		});
		expect(result).not.toHaveProperty('err');
		if (!('url' in result)) return;

		const dataParam = new URL(result.url).searchParams.get('data');
		const state = decodeState(dataParam);
		expect(state.project.connections).toHaveLength(1);
		expect(state.project.connections[0]!.upperTokenId).toBe('l0-0');
		expect(state.project.connections[0]!.lowerTokenId).toBe('l1-0');
	});

	it('maps word indices to correct token IDs for multi-word line', () => {
		// "Bonjour le monde": word 2 → "monde" → token id l1-2
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
		// "спать" → "to" and "спать" → "sleep": both connections must share a color
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
		expect(result).not.toHaveProperty('err');
		if (!('url' in result)) return;
		const state = decodeState(new URL(result.url).searchParams.get('data'));
		expect(state.project.connections).toHaveLength(2);
	});

	it('rejects line index out of range', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: ['a', 'b'],
			alignments: [[0, 0, 5, 0]]
		});
		expect(result).toMatchObject({ err: expect.stringContaining('lineB=5') });
	});

	it('rejects non-adjacent lines', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: ['a', 'b', 'c'],
			alignments: [[0, 0, 2, 0]]
		});
		expect(result).toMatchObject({ err: expect.stringContaining('not adjacent') });
	});

	it('rejects word index out of range with helpful message', () => {
		const result = buildAlignUrl(ORIGIN, {
			lines: ['Hello', 'World'],
			alignments: [[0, 5, 1, 0]]
		});
		expect(result).toMatchObject({ err: expect.stringContaining('word 5 out of range') });
	});

	it('works with a single line and no alignments', () => {
		const result = buildAlignUrl(ORIGIN, { lines: ['Solo line'] });
		expect(result).not.toHaveProperty('err');
	});

	it('handles 8 lines (max)', () => {
		const lines = Array.from({ length: 8 }, (_, i) => `line ${i}`);
		const result = buildAlignUrl(ORIGIN, { lines });
		expect(result).not.toHaveProperty('err');
	});
});
