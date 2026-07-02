/**
 * Auto-fit shrinks each line's text just enough that it fits its container on a single row.
 *
 * It is display-only: the user's `textSizePx` is the maximum; the returned scales are in
 * `[min, 1]`. `variance` controls how much line scales may differ:
 *   - `0` → every line uses the single smallest scale (uniform / "global").
 *   - `1` → every line uses its own fit scale (independent / "per-line").
 *
 * `width` is a line's measured content width at its current `effScale`; `avail` is the width to fit
 * into. The width∝scale assumption is only approximate (fixed token padding), so the caller applies
 * the result and re-measures — this function converges in a couple of ticks.
 */

export interface AutoFitRow {
	lineId: string;
	/** Measured content width of the row at its current applied scale. */
	width: number;
	/** Scale currently applied to the row (1 on first pass). */
	effScale: number;
}

function clamp(n: number, lo: number, hi: number): number {
	return Math.max(lo, Math.min(hi, n));
}

export function computeAutoFitScales(
	rows: AutoFitRow[],
	avail: number,
	variance: number,
	min = 0.1
): Record<string, number> {
	const v = clamp(variance, 0, 1);
	// Per-line fit target: grow toward 1 when there's slack, shrink when overflowing.
	const perLine = new Map<string, number>();
	for (const r of rows) {
		if (r.width <= 0 || avail <= 0) {
			perLine.set(r.lineId, r.effScale);
			continue;
		}
		perLine.set(r.lineId, clamp((r.effScale * avail) / r.width, min, 1));
	}
	const values = [...perLine.values()];
	const smallest = values.length ? Math.min(...values) : 1;

	const out: Record<string, number> = {};
	for (const r of rows) {
		const si = perLine.get(r.lineId) ?? 1;
		out[r.lineId] = smallest + v * (si - smallest);
	}
	return out;
}

/** True when any line's scale changed by more than `eps` (used to stop the reactive re-measure loop). */
export function scalesChanged(
	prev: Record<string, number>,
	next: Record<string, number>,
	eps = 0.005
): boolean {
	const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
	for (const k of keys) {
		if (Math.abs((prev[k] ?? 1) - (next[k] ?? 1)) > eps) return true;
	}
	return false;
}
