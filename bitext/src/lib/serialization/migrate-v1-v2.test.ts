import { describe, expect, it } from 'vitest';
import { addAtomicConnections } from '$lib/domain/alignment.js';
import {
	defaultProjectSnapshotV1,
	defaultVisualSettingsV1,
	migrateV1ToV2,
	type ProjectSnapshotV1
} from './schema.js';

describe('migrateV1ToV2', () => {
	it('maps source/target lines and keeps connections', () => {
		const connections = addAtomicConnections(
			[],
			[{ upperTokenId: 's-0', lowerTokenId: 't-0' }],
			'#ff0000'
		);
		const project: ProjectSnapshotV1 = {
			...defaultProjectSnapshotV1(),
			sourceText: 'hello there',
			targetText: 'bonjour là',
			links: connections
		};
		const settings = defaultVisualSettingsV1();
		const { project: p2 } = migrateV1ToV2(project, settings);
		expect(p2.lines.map((l) => l.id)).toEqual(['s', 't']);
		expect(p2.lines[0]!.rawText).toBe('hello there');
		expect(p2.lines[1]!.rawText).toBe('bonjour là');
		expect(p2.connections.length).toBe(1);
		expect(p2.connections[0]!.upperTokenId).toBe('s-0');
		expect(p2.connections[0]!.lowerTokenId).toBe('t-0');
	});
});
