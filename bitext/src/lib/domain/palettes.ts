export type PaletteName =
	| 'pastel'
	| 'vivid'
	| 'academic'
	| 'neon'
	| 'sunset'
	| 'primary'
	| 'jewel'
	| 'earth'
	| 'ink'
	| 'cyan';

export const PALETTES: Record<PaletteName, readonly string[]> = {
	pastel: ['#fda4af', '#93c5fd', '#86efac', '#fcd34d', '#d8b4fe', '#67e8f9', '#fca5a5', '#a5b4fc'],
	vivid: ['#ef4444', '#3b82f6', '#22c55e', '#eab308', '#a855f7', '#06b6d4', '#f97316', '#ec4899'],
	academic: [
		'#64748b',
		'#475569',
		'#334155',
		'#78716c',
		'#57534e',
		'#71717a',
		'#52525b',
		'#3f3f46'
	],
	// Style-matched palettes — also selectable on their own.
	neon: ['#ff5d8f', '#5cc8ff', '#b18cff', '#7af0c8', '#ffd86b', '#ff8a5c', '#6ee7ff', '#c77dff'],
	sunset: ['#ff3caa', '#22d3ee', '#f97316', '#a855f7', '#ff6ec7', '#38bdf8', '#fb7185', '#facc15'],
	primary: ['#d40924', '#1466d4', '#f4b400', '#0a8f4f', '#e8602c', '#6a3fb5', '#1f9e9e', '#171008'],
	jewel: ['#9c3b2e', '#2f5d8a', '#3f7a4f', '#9a7b2e', '#6b4d8a', '#2f8a8a', '#a85d3c', '#54616e'],
	earth: ['#8a3b2e', '#2f4f7a', '#3f6a4f', '#7a6a2e', '#5a4a8a', '#2f6a6a', '#9a5d3c', '#444c55'],
	ink: ['#2a2622', '#55504a', '#3a4a52', '#6a4a3a', '#454a3a', '#7a6a5a', '#3a3a4a', '#5a4a4a'],
	cyan: ['#cfe0ff', '#7ec8ff', '#a5f3ff', '#ffd27e', '#b9a5ff', '#7affd0', '#ff9ecf', '#dfe8f5']
};

/** Picker order: base palettes first, then style-matched ones. */
export const PALETTE_NAMES: PaletteName[] = [
	'pastel',
	'vivid',
	'academic',
	'neon',
	'sunset',
	'primary',
	'jewel',
	'earth',
	'ink',
	'cyan'
];

export function isPaletteName(v: unknown): v is PaletteName {
	return typeof v === 'string' && v in PALETTES;
}

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
