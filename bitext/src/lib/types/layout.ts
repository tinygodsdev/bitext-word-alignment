export interface TokenLayout {
	cx: number;
	cy: number;
	x: number;
	y: number;
	w: number;
	h: number;
}

/**
 * Flow axis of the whole diagram. One project has exactly one axis: a connector between an
 * adjacent line pair needs a single consistent "between" direction, and `linePairGaps` stores
 * that distance as one number.
 *
 * - `rows` — lines stack downward, tokens flow across, connectors run vertically (the default).
 * - `columns` — lines stack sideways, tokens flow downward, connectors run horizontally
 *   (vertical writing: Japanese/Chinese tategaki, traditional Mongolian).
 *
 * The first line is always at the start of the stack: topmost in `rows`, leftmost in `columns`.
 * To put a script on the other side, reorder the lines — there is no separate direction setting,
 * because it would express nothing that line order does not already.
 */
export type LayoutAxis = 'rows' | 'columns';

/**
 * How one line's token glyphs are set, independent of {@link LayoutAxis}.
 *
 * - `upright` — words render horizontally; in column mode each word is an upright box (default).
 * - `vertical` — characters stack downward inside the token (tategaki).
 * - `sideways` — the line is rotated 90°. The book-spine look for Latin runs in vertical text, and
 *   the correct setting for traditional Mongolian, whose fonts store glyphs rotated 90°
 *   counter-clockwise and expect the line to be rotated back (UAX #50).
 */
export type TextOrientation = 'upright' | 'vertical' | 'sideways';
