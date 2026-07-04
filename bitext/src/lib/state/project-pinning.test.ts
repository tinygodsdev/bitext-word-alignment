import { beforeEach, describe, expect, it } from 'vitest';
import { projectStore } from './project.svelte.js';
import { settingsStore } from './settings.svelte.js';
import type { LineV2 } from '$lib/serialization/schema.js';

function line(id: string, rawText: string): LineV2 {
	return {
		id,
		rawText,
		font: { family: 'Inter', source: 'google' },
		textSizePx: 36,
		gapWordPx: 14
	};
}

function loadTwoLines() {
	projectStore.loadSnapshotV2({
		lines: [line('s', 'a b'), line('t', 'c d')],
		connections: [],
		pairControls: [],
		linePairGaps: []
	});
}

describe('project store: pinned group colors', () => {
	beforeEach(() => {
		settingsStore.reset();
		loadTwoLines();
	});

	it('addConnection pins the group when given an explicit color', () => {
		projectStore.addConnection('s-0', 't-0', 'pastel', '#123456');
		const c = projectStore.connections[0]!;
		expect(c.color).toBe('#123456');
		expect(c.pinned).toBe(true);
		expect(projectStore.isGroupPinned('s-0')).toBe(true);
	});

	it('a new link joining a pinned group inherits its pinned color', () => {
		projectStore.addConnection('s-0', 't-0', 'pastel', '#123456');
		// s-1 → t-0 shares t-0 with the pinned component, so it should inherit the pin.
		projectStore.addConnection('s-1', 't-0', 'pastel');
		expect(projectStore.connections.every((c) => c.color === '#123456' && c.pinned)).toBe(true);
	});

	it('recolorAllConnections keeps a pinned group and recolors the rest', () => {
		projectStore.addConnection('s-0', 't-0', 'pastel', '#123456'); // pinned
		projectStore.addConnection('s-1', 't-1', 'pastel'); // auto
		projectStore.recolorAllConnections('vivid');
		const pinned = projectStore.connections.find((c) => c.upperTokenId === 's-0')!;
		const auto = projectStore.connections.find((c) => c.upperTokenId === 's-1')!;
		expect(pinned.color).toBe('#123456');
		expect(auto.color).not.toBe('#123456');
	});

	it('unpinGroupColor clears the pin and recolors to an unused palette color', () => {
		projectStore.addConnection('s-0', 't-0', 'pastel', '#123456');
		projectStore.unpinGroupColor('s-0', 'pastel');
		const c = projectStore.connections[0]!;
		expect(c.pinned).toBe(false);
		expect(c.color).not.toBe('#123456');
		expect(projectStore.isGroupPinned('s-0')).toBe(false);
		expect(projectStore.hasGroup('s-0')).toBe(true);
	});
});
