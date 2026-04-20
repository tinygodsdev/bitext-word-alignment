import type { TokenLayout } from '$lib/types/layout.js';

/** Vertical gap between token box and line endpoint (px). */
const PAD = 8;

/**
 * Endpoints sit outside token boxes so strokes do not cross glyph bounds.
 * Uses row order (source row above target in typical layout).
 */
export function linkEndpoints(
	pSource: TokenLayout,
	pTarget: TokenLayout
): { x1: number; y1: number; x2: number; y2: number } {
	const sourceAbove = pSource.cy <= pTarget.cy;
	if (sourceAbove) {
		return {
			x1: pSource.cx,
			y1: pSource.y + pSource.h + PAD,
			x2: pTarget.cx,
			y2: pTarget.y - PAD
		};
	}
	return {
		x1: pSource.cx,
		y1: pSource.y - PAD,
		x2: pTarget.cx,
		y2: pTarget.y + pTarget.h + PAD
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
