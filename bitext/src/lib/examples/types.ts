import type { LinePairGapV2, LineV2, PairControlV2, VisualSettingsV2 } from '$lib/serialization/schema.js';

export type ExampleId = string;

/** Token id pair `[upperLineId-index, lowerLineId-index]` connected after the snapshot loads. */
export type ExampleConnection = readonly [string, string];

export interface ExampleEntry {
	id: ExampleId;
	label: string;
	lines: LineV2[];
	pairControls?: PairControlV2[];
	linePairGaps?: LinePairGapV2[];
	settings?: Partial<VisualSettingsV2>;
	connections: ExampleConnection[];
}
