import { describe, expect, it } from 'vitest';
import { recolorUnpinnedComponents } from './link-graph.js';
import type { Connection } from './alignment.js';

function conn(
	id: string,
	upper: string,
	lower: string,
	color: string,
	pinned?: boolean
): Connection {
	return {
		id,
		upperTokenId: upper,
		lowerTokenId: lower,
		color,
		...(pinned ? { pinned: true } : {})
	};
}

describe('recolorUnpinnedComponents', () => {
	const palette = ['#aaa', '#bbb', '#ccc'] as const;

	it('recolors unpinned groups by cycling the palette in component order', () => {
		const out = recolorUnpinnedComponents(
			[conn('c1', 's-0', 't-0', '#old'), conn('c2', 's-1', 't-1', '#old')],
			palette
		);
		expect(out.map((c) => c.color)).toEqual(['#aaa', '#bbb']);
	});

	it('keeps a pinned group unchanged while recoloring the rest', () => {
		const out = recolorUnpinnedComponents(
			[
				conn('c1', 's-0', 't-0', '#pinned', true),
				conn('c2', 's-1', 't-1', '#old'),
				conn('c3', 's-2', 't-2', '#old')
			],
			palette
		);
		const byId = Object.fromEntries(out.map((c) => [c.id, c]));
		expect(byId.c1.color).toBe('#pinned');
		expect(byId.c1.pinned).toBe(true);
		// The pinned component is skipped, so unpinned ones still start from the palette's first color.
		expect(byId.c2.color).toBe('#aaa');
		expect(byId.c3.color).toBe('#bbb');
	});

	it('treats a multi-connection component as one group with one color', () => {
		// s-0↔t-0 and t-0↔u-0 share t-0, so all three connections are one component.
		const out = recolorUnpinnedComponents(
			[
				conn('c1', 's-0', 't-0', '#old'),
				conn('c2', 't-0', 'u-0', '#old'),
				conn('c3', 's-1', 't-1', '#old')
			],
			palette
		);
		const byId = Object.fromEntries(out.map((c) => [c.id, c]));
		expect(byId.c1.color).toBe(byId.c2.color);
		expect(byId.c3.color).not.toBe(byId.c1.color);
	});
});
