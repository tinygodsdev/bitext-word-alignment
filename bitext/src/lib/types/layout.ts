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
 */
export type LayoutAxis = 'rows' | 'columns';

/** Column mode only: which edge the first line sits on. `rtl` (CJK) puts it rightmost. */
export type ColumnOrder = 'rtl' | 'ltr';

/**
 * How one line's token glyphs are set, independent of {@link LayoutAxis}.
 *
 * - `upright` — words render horizontally; in column mode each word is an upright box (default).
 * - `vertical` — characters stack downward inside the token (tategaki).
 * - `sideways` — the line is rotated 90°, the book-spine look for Latin runs in vertical text.
 */
export type TextOrientation = 'upright' | 'vertical' | 'sideways';
