import { beforeEach, describe, expect, it } from 'vitest';
import { projectStore } from './project.svelte.js';
import { settingsStore } from './settings.svelte.js';
import { decodeState } from '$lib/serialization/decode.js';
import { encodeState } from '$lib/serialization/encode.js';
import {
	SCHEMA_VERSION,
	defaultVisualSettingsV2,
	type AppStateV2,
	type LineV2
} from '$lib/serialization/schema.js';

function line(id: string, rawText: string): LineV2 {
	return {
		id,
		rawText,
		font: { family: 'Inter', source: 'google' },
		textSizePx: 36,
		gapWordPx: 14
	};
}

/** Middle line only splits into three tokens with the custom `-` separator. */
function stateWithCustomSeparator(): AppStateV2 {
	return {
		v: SCHEMA_VERSION,
		settings: { ...defaultVisualSettingsV2(), tokenSplitChars: '|-' },
		project: {
			lines: [line('s', 'a b c'), line('t', 'x-y-z'), line('u', 'd e f')],
			connections: [
				{ id: 'c1', upperTokenId: 's-0', lowerTokenId: 't-0' },
				{ id: 'c2', upperTokenId: 's-1', lowerTokenId: 't-1' },
				{ id: 'c3', upperTokenId: 's-2', lowerTokenId: 't-2' },
				{ id: 'c4', upperTokenId: 't-0', lowerTokenId: 'u-2' },
				{ id: 'c5', upperTokenId: 't-1', lowerTokenId: 'u-1' },
				{ id: 'c6', upperTokenId: 't-2', lowerTokenId: 'u-0' }
			],
			pairControls: [],
			linePairGaps: []
		}
	};
}

describe('project store: loadState', () => {
	beforeEach(() => {
		settingsStore.reset();
		projectStore.loadSnapshotV2({
			lines: [line('s', 'a'), line('t', 'b')],
			connections: [],
			pairControls: [],
			linePairGaps: []
		});
	});

	it('keeps links on tokens produced by the loaded tokenization settings', () => {
		const shared = decodeState(encodeState(stateWithCustomSeparator()));
		expect(shared.project.connections).toHaveLength(6);

		projectStore.loadState(shared);

		expect(settingsStore.settings.tokenSplitChars).toBe('|-');
		expect(projectStore.tokensOnLine('t').map((t) => t.text)).toEqual(['x', 'y', 'z']);
		expect(projectStore.connections).toHaveLength(6);
	});
});
