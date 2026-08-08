import { describe, expect, it } from 'vitest';
import { buildOgSvg, ogLines } from './og-svg.js';
import { defaultAppStateV2, type AppStateV2, type LineV2 } from '$lib/serialization/schema.js';

function line(id: string, rawText: string, family = 'Inter'): LineV2 {
	return {
		id,
		rawText,
		font: { family, source: 'google' },
		textSizePx: 36,
		gapWordPx: 14
	};
}

function stateWith(lines: LineV2[]): AppStateV2 {
	const base = defaultAppStateV2();
	return { ...base, project: { ...base.project, lines, connections: [] } };
}

describe('ogLines', () => {
	it('reports the family and the exact text each line will draw', () => {
		const out = ogLines(stateWith([line('a', '今日 私は', 'Noto Sans JP'), line('b', 'Today I')]));
		expect(out[0]).toMatchObject({ family: 'Noto Sans JP', text: '今日 私は' });
		expect(out[1]).toMatchObject({ family: 'Inter', text: 'Today I' });
	});

	it('reports only the text left after truncation, so the subset stays minimal', () => {
		const long = Array.from({ length: 40 }, (_, i) => `word${i}`).join(' ');
		const out = ogLines(stateWith([line('a', long), line('b', 'short')]));
		expect(out[0]!.truncated).toBe(true);
		expect(out[0]!.text.length).toBeLessThan(long.length);
	});

	it('returns null for a missing or empty line', () => {
		const out = ogLines(stateWith([line('a', 'only one')]));
		expect(out[0]).not.toBeNull();
		expect(out[1]).toBeNull();
	});
});

describe('buildOgSvg', () => {
	it("puts the line's own family ahead of Inter so the right glyphs are picked", () => {
		const svg = buildOgSvg(stateWith([line('a', '今日', 'Noto Sans JP'), line('b', 'Today')]));
		expect(svg).toContain('font-family="Noto Sans JP, Inter, system-ui, sans-serif"');
	});

	it('falls back to a neutral summary for a line with no usable font', () => {
		const svg = buildOgSvg(
			stateWith([line('a', '今日 私は', 'Made Up'), line('b', 'Today I')]),
			new Set([0])
		);
		expect(svg).toContain('2 lines · 0 links');
		expect(svg).not.toContain('今日');
		// The renderable line is untouched: the fallback is per line, not per card.
		expect(svg).toContain('Today');
	});

	it('counts in singular when there is one of something', () => {
		const base = defaultAppStateV2();
		const state: AppStateV2 = {
			...base,
			project: {
				...base.project,
				lines: [line('a', '今日')],
				connections: [{ id: 'c', upperTokenId: 'a-0', lowerTokenId: 'b-0', color: '#fff' }]
			}
		};
		expect(buildOgSvg(state, new Set([0]))).toContain('1 line · 1 link');
	});

	it('keeps the placeholder wording for a genuinely empty project', () => {
		const svg = buildOgSvg(stateWith([]));
		expect(svg).toContain('Type a sentence…');
		expect(svg).toContain('Add its translation…');
	});
});
