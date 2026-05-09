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
import { tokenizeOptionsFromVisualSettings, type Token } from '$lib/domain/tokens.js';
import {
	clampLineGapPx,
	clampWordGapPx,
	DEFAULT_LINE_GAP_PX,
	DEFAULT_TOKEN_MERGE_CHAR,
	DEFAULT_TOKEN_SPLIT_CHARS,
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
import { findExample, type ExampleId } from '$lib/state/examples.js';

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

	private currentTokenizeOptions() {
		return tokenizeOptionsFromVisualSettings(settingsStore.settings);
	}

	private syncAllTokens() {
		const opts = this.currentTokenizeOptions();
		const next: Record<string, Token[]> = {};
		for (const line of this.lines) {
			next[line.id] = reconcileLineTokens(this.tokensByLineId[line.id], line, opts);
		}
		this.tokensByLineId = next;
	}

	private pruneInvalidConnections() {
		this.connections = filterConnectionsByAdjacency(
			this.connections,
			this.lines,
			this.currentTokenizeOptions()
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
		const opts = this.currentTokenizeOptions();
		this.tokensByLineId = {
			...this.tokensByLineId,
			[lineId]: reconcileLineTokens(this.tokensByLineId[lineId], line, opts)
		};
		this.pruneInvalidConnections();
	}

	updateLineStyle(
		lineId: string,
		patch: Partial<Pick<LineV2, 'font' | 'textSizePx' | 'gapWordPx' | 'rtl'>>
	) {
		this.lines = this.lines.map((l) => {
			if (l.id !== lineId) return l;
			const font = patch.font ? { ...l.font, ...patch.font } : l.font;
			const textSizePx = patch.textSizePx ?? l.textSizePx;
			const gapWordPx =
				patch.gapWordPx !== undefined ? clampWordGapPx(patch.gapWordPx) : l.gapWordPx;
			const nextRtl = patch.rtl !== undefined ? (patch.rtl ? true : undefined) : l.rtl;
			const out: LineV2 = { ...l, font, textSizePx, gapWordPx };
			if (nextRtl) out.rtl = true;
			else delete out.rtl;
			return out;
		});
		if (
			patch.gapWordPx !== undefined ||
			patch.textSizePx !== undefined ||
			patch.font !== undefined ||
			patch.rtl !== undefined
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
		if (template?.rtl) newLine.rtl = true;
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
		const opts = this.currentTokenizeOptions();
		const tokenToLine = lineOrderTokenIds(this.lines, opts);
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

	loadExample(kind: ExampleId = 'simple') {
		const example = findExample(kind);
		// Reset tokenizer settings to defaults first so a previous example’s overrides
		// (custom split / merge chars, punctuation tokenization) never leak across loads,
		// then apply this example’s opt-in overrides.
		settingsStore.patch({
			tokenSplitChars: DEFAULT_TOKEN_SPLIT_CHARS,
			tokenMergeChar: DEFAULT_TOKEN_MERGE_CHAR,
			tokenSplitPunctuation: false,
			tokenPunctuationChars: '',
			...(example.settings ?? {})
		});
		const palette = settingsStore.settings.palette;
		this.loadSnapshotV2({
			lines: example.lines.map((l) => ({ ...l, font: { ...l.font } })),
			pairControls: (example.pairControls ?? []).map((p) => ({ ...p })),
			linePairGaps: (example.linePairGaps ?? []).map((g) => ({ ...g })),
			connections: []
		});
		for (const [upper, lower] of example.connections) {
			this.addConnection(upper, lower, palette);
		}
		layoutExportStore.requestRemeasureAfterLayout();
	}
}

export const projectStore = new ProjectStore();
