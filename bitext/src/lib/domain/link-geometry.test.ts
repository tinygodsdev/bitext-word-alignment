import { describe, expect, it } from 'vitest';
import { linkEndpoints, linkPathD, ribbonPathD } from './link-geometry.js';
import type { TokenLayout } from '$lib/types/layout.js';

function box(x: number, y: number, w = 40, h = 20): TokenLayout {
	return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
}

describe('linkEndpoints — rows', () => {
	it('leaves the upper box from its bottom edge and enters the lower from its top', () => {
		const upper = box(0, 0);
		const lower = box(100, 200);
		const { x1, y1, x2, y2 } = linkEndpoints(upper, lower, 8, 'rows');
		expect(x1).toBe(upper.cx);
		expect(y1).toBe(upper.y + upper.h + 8);
		expect(x2).toBe(lower.cx);
		expect(y2).toBe(lower.y - 8);
	});

	it('flips the edges when the first line is rendered below the second', () => {
		const upper = box(0, 200);
		const lower = box(100, 0);
		const { y1, y2 } = linkEndpoints(upper, lower, 8, 'rows');
		expect(y1).toBe(upper.y - 8);
		expect(y2).toBe(lower.y + lower.h + 8);
	});
});

describe('linkEndpoints — columns', () => {
	it('leaves the left box from its right edge and enters the right box from its left', () => {
		const first = box(0, 0);
		const second = box(200, 100);
		const { x1, y1, x2, y2 } = linkEndpoints(first, second, 8, 'columns');
		expect(x1).toBe(first.x + first.w + 8);
		expect(y1).toBe(first.cy);
		expect(x2).toBe(second.x - 8);
		expect(y2).toBe(second.cy);
	});

	it('flips the edges when the first line sits on the right (CJK column order)', () => {
		const first = box(200, 0);
		const second = box(0, 100);
		const { x1, x2 } = linkEndpoints(first, second, 8, 'columns');
		expect(x1).toBe(first.x - 8);
		expect(x2).toBe(second.x + second.w + 8);
	});

	it('defaults to the rows axis so existing callers are unaffected', () => {
		const a = box(0, 0);
		const b = box(100, 200);
		expect(linkEndpoints(a, b)).toEqual(linkEndpoints(a, b, 8, 'rows'));
	});
});

describe('linkPathD', () => {
	it('puts curved control points on the mid Y for rows', () => {
		expect(linkPathD(0, 0, 100, 200, 'curved', 'rows')).toBe('M 0 0 C 0 100 100 100 100 200');
	});

	it('puts curved control points on the mid X for columns', () => {
		expect(linkPathD(0, 0, 200, 100, 'curved', 'columns')).toBe('M 0 0 C 100 0 100 100 200 100');
	});

	it('ignores the axis for straight lines', () => {
		expect(linkPathD(0, 0, 100, 200, 'straight', 'columns')).toBe(
			linkPathD(0, 0, 100, 200, 'straight', 'rows')
		);
	});
});

describe('ribbonPathD', () => {
	it('produces a closed shape that differs per axis for curved connectors', () => {
		const rows = ribbonPathD(0, 0, 200, 100, 'curved', 10, false, 'rows');
		const columns = ribbonPathD(0, 0, 200, 100, 'curved', 10, false, 'columns');
		expect(rows.endsWith(' Z')).toBe(true);
		expect(columns.endsWith(' Z')).toBe(true);
		expect(rows).not.toBe(columns);
	});
});
