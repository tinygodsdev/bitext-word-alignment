import type { LemulaBlockName } from '$lib/components/lemula/blocks.js';

/**
 * What the editor strip shows: a calm card next to a bold one. The pairs follow the banner set's
 * README, so a pair never shows the same example twice. The calm card comes first: a narrow
 * screen has room for one card, and the calm one is the shorter.
 */
export const LEMULA_STRIP_PAIRS = [
	['card-history', 'bold-sentence'],
	['card-glossed', 'bold-morph'],
	['card-compound', 'bold-tree'],
	['card-borrowing', 'bold-rule']
] as const satisfies readonly (readonly [LemulaBlockName, LemulaBlockName])[];

export type LemulaStripPair = (typeof LEMULA_STRIP_PAIRS)[number];

/** The next pair every UTC hour; stable within the hour, so prerender and hydration agree. */
export function getLemulaStripPair(nowMs: number): LemulaStripPair {
	const hour = Math.floor(nowMs / 3_600_000);
	return LEMULA_STRIP_PAIRS[hour % LEMULA_STRIP_PAIRS.length]!;
}
