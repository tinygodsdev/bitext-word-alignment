export type PaletteName = 'pastel' | 'vivid' | 'academic';

export const PALETTES: Record<PaletteName, readonly string[]> = {
	pastel: ['#fda4af', '#93c5fd', '#86efac', '#fcd34d', '#d8b4fe', '#67e8f9', '#fca5a5', '#a5b4fc'],
	vivid: ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#06b6d4', '#f97316', '#ec4899'],
	academic: ['#64748b', '#475569', '#334155', '#78716c', '#57534e', '#71717a', '#52525b', '#3f3f46']
};

/**
 * Next palette color not yet present in `usedHex`. When every palette color already appears somewhere,
 * cycles with `cycleOrdinal` (e.g. `connections.length` before adding the next link).
 */
export function pickUnusedPaletteColor(
	palette: PaletteName,
	usedHex: ReadonlySet<string>,
	cycleOrdinal = 0
): string {
	const colors = PALETTES[palette];
	for (const c of colors) {
		if (!usedHex.has(c)) return c;
	}
	return colors[cycleOrdinal % colors.length]!;
}

/** Assign `count` colors in order, reusing only after the palette is exhausted. */
export function assignColorsInOrder(palette: PaletteName, count: number): string[] {
	const colors = PALETTES[palette];
	const out: string[] = [];
	for (let i = 0; i < count; i++) {
		out.push(colors[i % colors.length]);
	}
	return out;
}
