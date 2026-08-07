import type { LayoutAxis, TokenLayout } from '$lib/types/layout.js';

/** Gap between token box and line endpoint (px), measured along the connector axis. */
const PAD = 8;

/**
 * Endpoints sit outside token boxes so strokes do not cross glyph bounds.
 *
 * `pUpper` is the token on the line that comes first in stack order. In `rows` the connector
 * leaves the box vertically, in `columns` horizontally; which edge it leaves from follows the
 * measured positions, so a reordered stack still draws the right way round.
 */
export function linkEndpoints(
	pUpper: TokenLayout,
	pLower: TokenLayout,
	pad: number = PAD,
	axis: LayoutAxis = 'rows'
): { x1: number; y1: number; x2: number; y2: number } {
	if (axis === 'columns') {
		const upperIsLeft = pUpper.cx <= pLower.cx;
		if (upperIsLeft) {
			return {
				x1: pUpper.x + pUpper.w + pad,
				y1: pUpper.cy,
				x2: pLower.x - pad,
				y2: pLower.cy
			};
		}
		return {
			x1: pUpper.x - pad,
			y1: pUpper.cy,
			x2: pLower.x + pLower.w + pad,
			y2: pLower.cy
		};
	}

	const upperIsAbove = pUpper.cy <= pLower.cy;
	if (upperIsAbove) {
		return {
			x1: pUpper.cx,
			y1: pUpper.y + pUpper.h + pad,
			x2: pLower.cx,
			y2: pLower.y - pad
		};
	}
	return {
		x1: pUpper.cx,
		y1: pUpper.y - pad,
		x2: pLower.cx,
		y2: pLower.y + pLower.h + pad
	};
}

export function linkPathD(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	style: 'straight' | 'curved',
	axis: LayoutAxis = 'rows'
): string {
	if (style === 'straight') {
		return `M ${x1} ${y1} L ${x2} ${y2}`;
	}
	if (axis === 'columns') {
		const xm = (x1 + x2) / 2;
		return `M ${x1} ${y1} C ${xm} ${y1} ${xm} ${y2} ${x2} ${y2}`;
	}
	const ym = (y1 + y2) / 2;
	return `M ${x1} ${y1} C ${x1} ${ym} ${x2} ${ym} ${x2} ${y2}`;
}

/** Cubic control points of the connector centerline (shared by stroke + ribbon). */
function centerlineControls(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	style: 'straight' | 'curved',
	axis: LayoutAxis
): [number[], number[], number[], number[]] {
	const P0 = [x1, y1];
	const P3 = [x2, y2];
	if (style === 'straight') {
		const P1 = [x1 + (x2 - x1) / 3, y1 + (y2 - y1) / 3];
		const P2 = [x1 + (2 * (x2 - x1)) / 3, y1 + (2 * (y2 - y1)) / 3];
		return [P0, P1, P2, P3];
	}
	if (axis === 'columns') {
		const xm = (x1 + x2) / 2;
		return [P0, [xm, y1], [xm, y2], P3];
	}
	const ym = (y1 + y2) / 2;
	return [P0, [x1, ym], [x2, ym], P3];
}

/**
 * Closed variable-width ribbon (filled brush stroke) around the connector centerline.
 * `taper` narrows both ends to a point. Used by the Sumi style in preview and export.
 */
export function ribbonPathD(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	style: 'straight' | 'curved',
	width: number,
	taper: boolean,
	axis: LayoutAxis = 'rows'
): string {
	const hw = width / 2;
	const [P0, P1, P2, P3] = centerlineControls(x1, y1, x2, y2, style, axis);
	const profile = taper ? (t: number) => Math.pow(Math.sin(Math.PI * t), 0.7) : () => 1;
	const N = 48;
	const left: [number, number][] = [];
	const right: [number, number][] = [];
	for (let k = 0; k <= N; k++) {
		const t = k / N;
		const mt = 1 - t;
		const bx =
			mt * mt * mt * P0[0] + 3 * mt * mt * t * P1[0] + 3 * mt * t * t * P2[0] + t * t * t * P3[0];
		const by =
			mt * mt * mt * P0[1] + 3 * mt * mt * t * P1[1] + 3 * mt * t * t * P2[1] + t * t * t * P3[1];
		const dx =
			3 * mt * mt * (P1[0] - P0[0]) + 6 * mt * t * (P2[0] - P1[0]) + 3 * t * t * (P3[0] - P2[0]);
		const dy =
			3 * mt * mt * (P1[1] - P0[1]) + 6 * mt * t * (P2[1] - P1[1]) + 3 * t * t * (P3[1] - P2[1]);
		const len = Math.hypot(dx, dy) || 1;
		const nx = -dy / len;
		const ny = dx / len;
		const w = hw * profile(t);
		left.push([bx + nx * w, by + ny * w]);
		right.push([bx - nx * w, by - ny * w]);
	}
	let d = `M ${left[0][0].toFixed(2)} ${left[0][1].toFixed(2)}`;
	for (let k = 1; k < left.length; k++) d += ` L ${left[k][0].toFixed(2)} ${left[k][1].toFixed(2)}`;
	for (let k = right.length - 1; k >= 0; k--)
		d += ` L ${right[k][0].toFixed(2)} ${right[k][1].toFixed(2)}`;
	return d + ' Z';
}
