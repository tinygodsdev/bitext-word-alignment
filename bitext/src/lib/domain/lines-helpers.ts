import type { Connection } from '$lib/domain/alignment.js';
import { tokenize, reconcile, type Token } from '$lib/domain/tokens.js';
import type { LineV2, PairControlV2 } from '$lib/serialization/schema.js';

export function lineOrderTokenIds(lines: LineV2[], splitChars: string): Map<string, string> {
	const m = new Map<string, string>();
	for (const line of lines) {
		for (const t of tokenize(line.rawText, line.id, splitChars)) {
			m.set(t.id, line.id);
		}
	}
	return m;
}

/** Undirected adjacency: keys `a\0b` with a,b adjacent in stack order (either orientation). */
export function adjacentLineKeys(lineIds: string[]): Set<string> {
	const s = new Set<string>();
	for (let i = 0; i < lineIds.length - 1; i++) {
		const a = lineIds[i]!;
		const b = lineIds[i + 1]!;
		s.add(`${a}\0${b}`);
		s.add(`${b}\0${a}`);
	}
	return s;
}

export function tokensAreAdjacentLines(
	upperTokenId: string,
	lowerTokenId: string,
	tokenToLine: Map<string, string>,
	adjKeys: Set<string>
): boolean {
	const lu = tokenToLine.get(upperTokenId);
	const ll = tokenToLine.get(lowerTokenId);
	if (lu == null || ll == null) return false;
	return adjKeys.has(`${lu}\0${ll}`);
}

export function filterConnectionsByAdjacency(
	connections: Connection[],
	lines: LineV2[],
	splitChars: string
): Connection[] {
	const tokenToLine = lineOrderTokenIds(lines, splitChars);
	const lineIds = lines.map((l) => l.id);
	const adj = adjacentLineKeys(lineIds);
	const tokens = new Set(tokenToLine.keys());
	return connections.filter(
		(c) =>
			tokens.has(c.upperTokenId) &&
			tokens.has(c.lowerTokenId) &&
			tokensAreAdjacentLines(c.upperTokenId, c.lowerTokenId, tokenToLine, adj)
	);
}

export function showConnectorsForPair(
	pairControls: PairControlV2[],
	upperLineId: string,
	lowerLineId: string
): boolean {
	return !pairControls.some((p) => p.upperLineId === upperLineId && p.lowerLineId === lowerLineId);
}

/** Canonical key: upper line is earlier in `lineIds` array than lower. */
export function canonicalPair(
	lineIds: string[],
	lineA: string,
	lineB: string
): { upperLineId: string; lowerLineId: string } | null {
	const ia = lineIds.indexOf(lineA);
	const ib = lineIds.indexOf(lineB);
	if (ia < 0 || ib < 0 || Math.abs(ia - ib) !== 1) return null;
	return ia < ib
		? { upperLineId: lineA, lowerLineId: lineB }
		: { upperLineId: lineB, lowerLineId: lineA };
}

export function reconcileLineTokens(
	prev: Token[] | undefined,
	line: LineV2,
	splitChars: string
): Token[] {
	const next = tokenize(line.rawText, line.id, splitChars);
	if (!prev) return next;
	return reconcile(prev, next, line.id);
}

/** Line id prefix of token id (`l-abc-3` → `l-abc`). */
export function tokenLineId(tokenId: string): string {
	const i = tokenId.lastIndexOf('-');
	return i > 0 ? tokenId.slice(0, i) : tokenId;
}

/**
 * While a token is pinned for linking, these are the line ids the user may click on
 * (that line and its vertical neighbors in the stack).
 */
export function lineIsLinkTargetWhilePending(
	lineIds: string[],
	pendingLineId: string,
	rowLineId: string
): boolean {
	const i = lineIds.indexOf(pendingLineId);
	if (i < 0) return false;
	if (rowLineId === pendingLineId) return true;
	if (i > 0 && rowLineId === lineIds[i - 1]) return true;
	if (i + 1 < lineIds.length && rowLineId === lineIds[i + 1]) return true;
	return false;
}

/**
 * While a token is selected for linking (`pendingLineId`), only connectors on the pair(s)
 * that include that line and a vertically adjacent line are "active"; others are dimmed in the UI.
 */
export function connectionIsActiveForPendingSelection(
	lineIds: string[],
	conn: Connection,
	pendingLineId: string
): boolean {
	const a = tokenLineId(conn.upperTokenId);
	const b = tokenLineId(conn.lowerTokenId);
	return (
		lineIsLinkTargetWhilePending(lineIds, pendingLineId, a) &&
		lineIsLinkTargetWhilePending(lineIds, pendingLineId, b)
	);
}

/** True when `upper` is directly above `lower` in the current line stack. */
export function isStackedAdjacentPair(
	lines: LineV2[],
	upperLineId: string,
	lowerLineId: string
): boolean {
	const i = lines.findIndex((l) => l.id === upperLineId);
	const j = lines.findIndex((l) => l.id === lowerLineId);
	return i >= 0 && j === i + 1;
}
