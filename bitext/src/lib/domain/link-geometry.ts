import type { TokenLayout } from '$lib/types/layout.js';

/** Vertical gap between token box and line endpoint (px). */
const PAD = 8;

/**
 * Endpoints sit outside token boxes so strokes do not cross glyph bounds.
 * upperToken layout is treated as the higher (smaller cy) row when rows differ.
 */
export function linkEndpoints(
	pUpper: TokenLayout,
	pLower: TokenLayout
): { x1: number; y1: number; x2: number; y2: number } {
	const upperIsAbove = pUpper.cy <= pLower.cy;
	if (upperIsAbove) {
		return {
			x1: pUpper.cx,
			y1: pUpper.y + pUpper.h + PAD,
			x2: pLower.cx,
			y2: pLower.y - PAD
		};
	}
	return {
		x1: pUpper.cx,
		y1: pUpper.y - PAD,
		x2: pLower.cx,
		y2: pLower.y + pLower.h + PAD
	};
}

export function linkPathD(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	style: 'straight' | 'curved'
): string {
	if (style === 'straight') {
		return `M ${x1} ${y1} L ${x2} ${y2}`;
	}
	const ym = (y1 + y2) / 2;
	return `M ${x1} ${y1} C ${x1} ${ym} ${x2} ${ym} ${x2} ${y2}`;
}
