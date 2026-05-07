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
	clampLineGapPx,
	clampWordGapPx,
	DEFAULT_LINE_GAP_PX,
	DEFAULT_WORD_GAP_PX,
	defaultProjectSnapshotV2,
	MAX_LINES,
	NEW_LINE_HINT_TEXT,
	normalizeProjectSnapshotV2,
	type LinePairGapV2,
	type LineV2,
	type PairControlV2,
	type ProjectSnapshotV2
} from '$lib/serialization/schema.js';
import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
import { settingsStore } from '$lib/state/settings.svelte.js';

function newLineId(): string {
	return `l-${Math.random().toString(16).slice(2, 10)}`;
}

class ProjectStore {
	lines = $state<LineV2[]>([]);
	pairControls = $state<PairControlV2[]>([]);
	linePairGaps = $state<LinePairGapV2[]>([]);
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

	/** Resolved vertical gap (px) between two adjacent stacked lines. */
	lineGapPxBetween(upperLineId: string, lowerLineId: string): number {
		void this.lines;
		void this.linePairGaps;
		const lineIds = this.lines.map((l) => l.id);
		const pair = canonicalPair(lineIds, upperLineId, lowerLineId);
		if (!pair) return DEFAULT_LINE_GAP_PX;
		const hit = this.linePairGaps.find(
			(p) => p.upperLineId === pair.upperLineId && p.lowerLineId === pair.lowerLineId
		);
		return hit ? clampLineGapPx(hit.gapPx) : DEFAULT_LINE_GAP_PX;
	}

	setLinePairGap(upperLineId: string, lowerLineId: string, gapPx: number) {
		const lineIds = this.lines.map((l) => l.id);
		const pair = canonicalPair(lineIds, upperLineId, lowerLineId);
		if (!pair) return;
		const px = clampLineGapPx(gapPx);
		const rest = this.linePairGaps.filter(
			(p) => !(p.upperLineId === pair.upperLineId && p.lowerLineId === pair.lowerLineId)
		);
		this.linePairGaps = px === DEFAULT_LINE_GAP_PX ? rest : [...rest, { ...pair, gapPx: px }];
		layoutExportStore.requestRemeasureAfterLayout();
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

	updateLineStyle(
		lineId: string,
		patch: Partial<Pick<LineV2, 'font' | 'textSizePx' | 'gapWordPx'>>
	) {
		this.lines = this.lines.map((l) => {
			if (l.id !== lineId) return l;
			const font = patch.font ? { ...l.font, ...patch.font } : l.font;
			const textSizePx = patch.textSizePx ?? l.textSizePx;
			const gapWordPx =
				patch.gapWordPx !== undefined ? clampWordGapPx(patch.gapWordPx) : l.gapWordPx;
			return { ...l, font, textSizePx, gapWordPx };
		});
		if (
			patch.gapWordPx !== undefined ||
			patch.textSizePx !== undefined ||
			patch.font !== undefined
		) {
			layoutExportStore.requestRemeasureAfterLayout();
		}
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
		layoutExportStore.requestRemeasureAfterLayout();
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
		const idx =
			insertIndex === undefined
				? this.lines.length
				: Math.max(0, Math.min(this.lines.length, insertIndex));
		const template = this.lines[idx] ?? this.lines[idx - 1];
		const newLine: LineV2 = {
			id,
			rawText: NEW_LINE_HINT_TEXT,
			font: { family: 'Inter', source: 'google' },
			textSizePx: 36,
			gapWordPx: template?.gapWordPx ?? DEFAULT_WORD_GAP_PX
		};
		this.lines = [...this.lines.slice(0, idx), newLine, ...this.lines.slice(idx)];
		this.syncAllTokens();
		this.prunePairControls();
		this.pruneInvalidConnections();
		layoutExportStore.requestRemeasureAfterLayout();
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
		this.linePairGaps = this.linePairGaps.filter(
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
		const lineIds = this.lines.map((l) => l.id);
		this.linePairGaps = this.linePairGaps.filter((g) => {
			const iu = lineIds.indexOf(g.upperLineId);
			const il = lineIds.indexOf(g.lowerLineId);
			return iu >= 0 && il === iu + 1;
		});
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
		layoutExportStore.requestRemeasureAfterLayout();
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
		layoutExportStore.requestRemeasureAfterLayout();
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
			linePairGaps: this.linePairGaps.map((g) => ({ ...g })),
			connections: this.connections.map((c) => ({ ...c }))
		};
	}

	loadSnapshotV2(s: ProjectSnapshotV2) {
		const n = normalizeProjectSnapshotV2(s, undefined);
		this.lines = n.lines.map((l) => ({ ...l, font: { ...l.font } }));
		this.pairControls = n.pairControls.map((p) => ({ ...p }));
		this.linePairGaps = n.linePairGaps.map((g) => ({ ...g }));
		this.connections = n.connections.map((c) => ({ ...c }));
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
						textSizePx: 36,
						gapWordPx: DEFAULT_WORD_GAP_PX
					},
					{
						id: 't',
						rawText: 'Bonjour le monde',
						font: { family: 'Inter', source: 'google' },
						textSizePx: 36,
						gapWordPx: DEFAULT_WORD_GAP_PX
					}
				],
				pairControls: [],
				linePairGaps: [],
				connections: []
			});
			this.addConnection('s-0', 't-0', palette);
			this.addConnection('s-1', 't-1', palette);
			this.addConnection('s-1', 't-2', palette);
			layoutExportStore.requestRemeasureAfterLayout();
			return;
		}
		this.loadSnapshotV2({
			lines: [
				{
					id: 's',
					rawText: 'Merhaba dünya',
					font: { family: 'Inter', source: 'google' },
					textSizePx: 34,
					gapWordPx: DEFAULT_WORD_GAP_PX
				},
				{
					id: 'ipa',
					rawText: 'meɾˈhaba dyzˈnja',
					font: { family: 'Noto Sans', source: 'google' },
					textSizePx: 28,
					gapWordPx: DEFAULT_WORD_GAP_PX
				},
				{
					id: 't',
					rawText: 'Hello world',
					font: { family: 'Inter', source: 'google' },
					textSizePx: 34,
					gapWordPx: DEFAULT_WORD_GAP_PX
				}
			],
			pairControls: [],
			linePairGaps: [],
			connections: []
		});
		this.addConnection('s-0', 'ipa-0', palette);
		this.addConnection('s-1', 'ipa-1', palette);
		this.addConnection('ipa-0', 't-0', palette);
		this.addConnection('ipa-1', 't-1', palette);
		layoutExportStore.requestRemeasureAfterLayout();
	}
}

export const projectStore = new ProjectStore();
