import {
	addAtomicConnections,
	pendingAlignmentColor,
	type Connection
} from '$lib/domain/alignment.js';
import { connectedConnectionIds } from '$lib/domain/link-graph.js';
import type { ExampleEntry } from '$lib/state/examples.js';
import {
	DEFAULT_TOKEN_MERGE_CHAR,
	DEFAULT_TOKEN_SPLIT_CHARS,
	normalizeProjectSnapshotV2,
	normalizeVisualSettingsV2,
	SCHEMA_VERSION,
	defaultVisualSettingsV2,
	type AppStateV2
} from '$lib/serialization/schema.js';

export type BuildAppStateFromExampleOptions = {
	/** Gallery embed: hide line controls and show in-frame attribution. */
	previewHideChrome?: boolean;
};

/** Pure snapshot builder — same alignment data as `projectStore.loadExample`, without stores. */
export function buildAppStateFromExample(
	example: ExampleEntry,
	options: BuildAppStateFromExampleOptions = {}
): AppStateV2 {
	const settings = normalizeVisualSettingsV2({
		...defaultVisualSettingsV2(),
		tokenSplitChars: DEFAULT_TOKEN_SPLIT_CHARS,
		tokenMergeChar: DEFAULT_TOKEN_MERGE_CHAR,
		tokenSplitPunctuation: false,
		tokenPunctuationChars: '',
		...(example.settings ?? {}),
		...(options.previewHideChrome ? { previewHideChrome: true } : {})
	});
	const palette = settings.palette;

	let connections: Connection[] = [];
	for (const [upper, lower] of example.connections) {
		const color = pendingAlignmentColor(connections, [upper], [lower], palette);
		const seedTokens = new Set<string>([upper, lower]);
		const merged = addAtomicConnections(
			connections,
			[{ upperTokenId: upper, lowerTokenId: lower }],
			color
		);
		const componentAfter = connectedConnectionIds(merged, seedTokens);
		connections = merged.map((c) => (componentAfter.has(c.id) ? { ...c, color } : c));
	}

	const project = normalizeProjectSnapshotV2({
		lines: example.lines.map((l) => ({ ...l, font: { ...l.font } })),
		pairControls: (example.pairControls ?? []).map((p) => ({ ...p })),
		linePairGaps: (example.linePairGaps ?? []).map((g) => ({ ...g })),
		connections
	});

	return { v: SCHEMA_VERSION, project, settings };
}
