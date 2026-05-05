import {
	addAtomicConnections,
	pendingAlignmentColor,
	removeConnection,
	type Connection
} from '$lib/domain/alignment.js';
import { connectedConnectionComponents, connectedConnectionIds } from '$lib/domain/link-graph.js';
import {
	filterConnectionsByAdjacency,
	canonicalPair,
	lineOrderTokenIds,
	reconcileLineTokens,
	showConnectorsForPair,
	adjacentLineKeys,
	isStackedAdjacentPair
} from '$lib/domain/lines-helpers.js';
import { PALETTES, type PaletteName } from '$lib/domain/palettes.js';
import type { Token } from '$lib/domain/tokens.js';
import {
	defaultProjectSnapshotV2,
	MAX_LINES,
	type LineV2,
	type PairControlV2,
	type ProjectSnapshotV2
} from '$lib/serialization/schema.js';
import { settingsStore } from '$lib/state/settings.svelte.js';

function newLineId(): string {
	return `l-${Math.random().toString(16).slice(2, 10)}`;
}

class ProjectStore {
	lines = $state<LineV2[]>([]);
	pairControls = $state<PairControlV2[]>([]);
	connections = $state<Connection[]>([]);
	tokensByLineId = $state<Record<string, Token[]>>({});

	constructor() {
		this.loadSnapshotV2(defaultProjectSnapshotV2());
	}

	private currentSplitChars(): string {
		return settingsStore.settings.tokenSplitChars;
	}

	private syncAllTokens() {
		const split = this.currentSplitChars();
		const next: Record<string, Token[]> = {};
		for (const line of this.lines) {
			next[line.id] = reconcileLineTokens(this.tokensByLineId[line.id], line, split);
		}
		this.tokensByLineId = next;
	}

	private pruneInvalidConnections() {
		this.connections = filterConnectionsByAdjacency(
			this.connections,
			this.lines,
			this.currentSplitChars()
		);
	}

	tokensOnLine(lineId: string): Token[] {
		return this.tokensByLineId[lineId] ?? [];
	}

	setLineText(lineId: string, raw: string) {
		this.lines = this.lines.map((l) => (l.id === lineId ? { ...l, rawText: raw } : l));
		const line = this.lines.find((l) => l.id === lineId);
		if (!line) return;
		const split = this.currentSplitChars();
		this.tokensByLineId = {
			...this.tokensByLineId,
			[lineId]: reconcileLineTokens(this.tokensByLineId[lineId], line, split)
		};
		this.pruneInvalidConnections();
	}

	updateLineStyle(lineId: string, patch: Partial<Pick<LineV2, 'font' | 'textSizePx'>>) {
		this.lines = this.lines.map((l) => {
			if (l.id !== lineId) return l;
			const font = patch.font ? { ...l.font, ...patch.font } : l.font;
			const textSizePx = patch.textSizePx ?? l.textSizePx;
			return { ...l, font, textSizePx };
		});
	}

	setPairShowConnectors(upperLineId: string, lowerLineId: string, show: boolean) {
		const lineIds = this.lines.map((l) => l.id);
		const pair = canonicalPair(lineIds, upperLineId, lowerLineId);
		if (!pair) return;
		const { upperLineId: u, lowerLineId: lo } = pair;
		if (show) {
			this.pairControls = this.pairControls.filter(
				(p) => !(p.upperLineId === u && p.lowerLineId === lo)
			);
		} else {
			const rest = this.pairControls.filter((p) => !(p.upperLineId === u && p.lowerLineId === lo));
			this.pairControls = [...rest, { upperLineId: u, lowerLineId: lo, showConnectors: false }];
		}
	}

	pairShowsConnectors(upperLineId: string, lowerLineId: string): boolean {
		const lineIds = this.lines.map((l) => l.id);
		const pair = canonicalPair(lineIds, upperLineId, lowerLineId);
		if (!pair) return true;
		return showConnectorsForPair(this.pairControls, pair.upperLineId, pair.lowerLineId);
	}

	addLine(insertIndex?: number) {
		if (this.lines.length >= MAX_LINES) return;
		const id = newLineId();
		const newLine: LineV2 = {
			id,
			rawText: '',
			font: { family: 'Inter', source: 'google' },
			textSizePx: 36
		};
		const idx =
			insertIndex === undefined
				? this.lines.length
				: Math.max(0, Math.min(this.lines.length, insertIndex));
		this.lines = [...this.lines.slice(0, idx), newLine, ...this.lines.slice(idx)];
		this.tokensByLineId = { ...this.tokensByLineId, [id]: [] };
		this.prunePairControls();
		this.pruneInvalidConnections();
	}

	removeLine(lineId: string) {
		if (this.lines.length <= 2) return;
		this.lines = this.lines.filter((l) => l.id !== lineId);

		const nextTok: Record<string, Token[]> = { ...this.tokensByLineId };
		delete nextTok[lineId];
		this.tokensByLineId = nextTok;
		this.pairControls = this.pairControls.filter(
			(p) => p.upperLineId !== lineId && p.lowerLineId !== lineId
		);
		this.syncAllTokens();
		this.prunePairControls();
		this.pruneInvalidConnections();
	}

	private prunePairControls() {
		this.pairControls = this.pairControls.filter((p) =>
			isStackedAdjacentPair(this.lines, p.upperLineId, p.lowerLineId)
		);
	}

	moveLine(lineId: string, direction: -1 | 1) {
		const i = this.lines.findIndex((l) => l.id === lineId);
		if (i < 0) return;
		const j = i + direction;
		if (j < 0 || j >= this.lines.length) return;
		const next = [...this.lines];
		[next[i]!, next[j]!] = [next[j]!, next[i]!];
		this.lines = next;
		this.prunePairControls();
		this.pruneInvalidConnections();
	}

	/** Move `lineId` to zero-based index `newIndex` in the line stack (for drag-and-drop). */
	moveLineToIndex(lineId: string, newIndex: number) {
		const i = this.lines.findIndex((l) => l.id === lineId);
		if (i < 0) return;
		const line = this.lines[i]!;
		const rest = this.lines.filter((l) => l.id !== lineId);
		const j = Math.max(0, Math.min(newIndex, rest.length));
		this.lines = [...rest.slice(0, j), line, ...rest.slice(j)];
		this.prunePairControls();
		this.pruneInvalidConnections();
	}

	addConnection(upperTokenId: string, lowerTokenId: string, palette: PaletteName) {
		const split = this.currentSplitChars();
		const tokenToLine = lineOrderTokenIds(this.lines, split);
		const lineIds = this.lines.map((l) => l.id);
		const adj = adjacentLineKeys(lineIds);
		const lu = tokenToLine.get(upperTokenId);
		const ll = tokenToLine.get(lowerTokenId);
		if (lu == null || ll == null) return;
		if (!adj.has(`${lu}\0${ll}`)) return;
		const color = pendingAlignmentColor(this.connections, [upperTokenId], [lowerTokenId], palette);
		const seedTokens = new Set<string>([upperTokenId, lowerTokenId]);
		const merged = addAtomicConnections(this.connections, [{ upperTokenId, lowerTokenId }], color);
		const componentAfter = connectedConnectionIds(merged, seedTokens);
		this.connections = merged.map((c) => (componentAfter.has(c.id) ? { ...c, color } : c));
	}

	recolorAllConnections(palette: PaletteName) {
		const pool = PALETTES[palette];
		const components = connectedConnectionComponents(this.connections);
		const colorById: Record<string, string> = {};
		components.forEach((component, i) => {
			const color = pool[i % pool.length]!;
			component.forEach((id) => {
				colorById[id] = color;
			});
		});
		this.connections = this.connections.map((c) => ({
			...c,
			color: colorById[c.id] ?? pool[0]!
		}));
	}

	removeConnectionById(connectionId: string) {
		this.connections = removeConnection(this.connections, connectionId);
	}

	clearAllConnections() {
		this.connections = [];
	}

	updateConnectionColor(connectionId: string, color: string) {
		const c = this.connections.find((x) => x.id === connectionId);
		if (!c) return;
		const component = connectedConnectionIds(this.connections, [c.upperTokenId, c.lowerTokenId]);
		this.connections = this.connections.map((x) => (component.has(x.id) ? { ...x, color } : x));
	}

	getSnapshot(): ProjectSnapshotV2 {
		return {
			lines: this.lines.map((l) => ({ ...l, font: { ...l.font } })),
			pairControls: this.pairControls.map((p) => ({ ...p })),
			connections: this.connections.map((c) => ({ ...c }))
		};
	}

	loadSnapshotV2(s: ProjectSnapshotV2) {
		this.lines = s.lines.map((l) => ({ ...l, font: { ...l.font } }));
		this.pairControls = s.pairControls.map((p) => ({ ...p }));
		this.connections = s.connections.map((c) => ({ ...c }));
		this.syncAllTokens();
		this.pruneInvalidConnections();
	}

	retokenizeFromSettings() {
		this.syncAllTokens();
		this.pruneInvalidConnections();
	}

	loadExample(kind: 'simple' | 'complex' = 'simple') {
		const palette = settingsStore.settings.palette;
		if (kind === 'simple') {
			this.loadSnapshotV2({
				lines: [
					{
						id: 's',
						rawText: 'Hello world',
						font: { family: 'Inter', source: 'google' },
						textSizePx: 36
					},
					{
						id: 't',
						rawText: 'Bonjour le monde',
						font: { family: 'Inter', source: 'google' },
						textSizePx: 36
					}
				],
				pairControls: [],
				connections: []
			});
			this.addConnection('s-0', 't-0', palette);
			this.addConnection('s-1', 't-1', palette);
			this.addConnection('s-1', 't-2', palette);
			return;
		}
		this.loadSnapshotV2({
			lines: [
				{
					id: 's',
					rawText: 'Merhaba dünya',
					font: { family: 'Inter', source: 'google' },
					textSizePx: 34
				},
				{
					id: 'ipa',
					rawText: 'meɾˈhaba dyzˈnja',
					font: { family: 'Noto Sans', source: 'google' },
					textSizePx: 28
				},
				{
					id: 't',
					rawText: 'Hello world',
					font: { family: 'Inter', source: 'google' },
					textSizePx: 34
				}
			],
			pairControls: [],
			connections: []
		});
		this.addConnection('s-0', 'ipa-0', palette);
		this.addConnection('s-1', 'ipa-1', palette);
		this.addConnection('ipa-0', 't-0', palette);
		this.addConnection('ipa-1', 't-1', palette);
	}
}

export const projectStore = new ProjectStore();
