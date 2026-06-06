/**
 * Re-export preset alignments for stores and routes.
 * Implementation lives under `$lib/examples/`.
 */
export type { ExampleConnection, ExampleEntry, ExampleId } from '$lib/examples/types.js';
export {
	EXAMPLES,
	EDITOR_EXAMPLE_IDS,
	CORE_EXAMPLES,
	WIKIPEDIA_EXAMPLES,
	editorExamples,
	findExample
} from '$lib/examples/data/index.js';
