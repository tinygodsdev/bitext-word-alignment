import type { ExampleEntry, ExampleId } from '../types.js';
import { CORE_EXAMPLES } from './core.js';
import { WIKIPEDIA_EXAMPLES } from './wikipedia.js';

export const EXAMPLES: ExampleEntry[] = [...CORE_EXAMPLES, ...WIKIPEDIA_EXAMPLES];

/** Presets for the editor “Load example” dropdown — not the full gallery set. */
export const EDITOR_EXAMPLE_IDS: ExampleId[] = ['simple', 'glosses', 'rtl', 'tagalog', 'cjk'];

export { CORE_EXAMPLES, WIKIPEDIA_EXAMPLES };

export function editorExamples(): ExampleEntry[] {
	return EDITOR_EXAMPLE_IDS.map((id) => findExample(id));
}

export function findExample(id: ExampleId): ExampleEntry {
	const hit = EXAMPLES.find((e) => e.id === id);
	if (!hit) throw new Error(`Unknown example id: ${id}`);
	return hit;
}
