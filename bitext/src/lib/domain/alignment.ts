import type { TokenId } from './tokens.js';
import { connectedConnectionIds } from './link-graph.js';
import { pickUnusedPaletteColor, type PaletteName } from './palettes.js';

/** One adjacency pair per object; many-to-many concepts use multiple connections (same or different colors). */
export interface Connection {
	id: string;
	upperTokenId: TokenId;
	lowerTokenId: TokenId;
	color?: string;
}

let connectionCounter = 0;

export function createConnectionId(): string {
	connectionCounter += 1;
	return `conn-${Date.now()}-${connectionCounter}`;
}

export function addAtomicConnections(
	connections: Connection[],
	pairs: { upperTokenId: string; lowerTokenId: string }[],
	color: string
): Connection[] {
	const existing = new Set(connections.map((l) => `${l.upperTokenId}\0${l.lowerTokenId}`));
	const next = [...connections];
	for (const { upperTokenId, lowerTokenId } of pairs) {
		const key = `${upperTokenId}\0${lowerTokenId}`;
		if (existing.has(key)) continue;
		existing.add(key);
		next.push({ id: createConnectionId(), upperTokenId, lowerTokenId, color });
	}
	return next;
}

/** Convenience for s-* / t-* legacy pairs (source row above target). */
export function addAtomicLinks(
	connections: Connection[],
	pairs: { sourceId: string; targetId: string }[],
	color: string
): Connection[] {
	return addAtomicConnections(
		connections,
		pairs.map((p) => ({ upperTokenId: p.sourceId, lowerTokenId: p.targetId })),
		color
	);
}

export function removeConnection(connections: Connection[], connectionId: string): Connection[] {
	return connections.filter((l) => l.id !== connectionId);
}

export function findConnectionsForToken(connections: Connection[], tokenId: TokenId): Connection[] {
	return connections.filter((l) => l.upperTokenId === tokenId || l.lowerTokenId === tokenId);
}

export function connectionForId(
	connections: Connection[],
	connectionId: string
): Connection | undefined {
	return connections.find((l) => l.id === connectionId);
}

/** @deprecated use connectionForId */
export const linkForId = connectionForId;

export function primaryConnectionForToken(
	connections: Connection[],
	tokenId: TokenId
): Connection | undefined {
	return findConnectionsForToken(connections, tokenId)[0];
}

/** @deprecated Prefer primaryConnectionForToken */
export const primaryLinkForToken = primaryConnectionForToken;

/** Color batch alignment would assign for this token set (preview / selection highlight). */
export function pendingAlignmentColor(
	connections: Connection[],
	upperTokenIds: string[],
	lowerTokenIds: string[],
	palette: PaletteName
): string {
	const seedTokens = new Set<string>([...upperTokenIds, ...lowerTokenIds]);
	const componentBefore = connectedConnectionIds(connections, seedTokens);
	const used = new Set(connections.map((l) => l.color).filter((c): c is string => Boolean(c)));
	const inherited = connections.find((l) => componentBefore.has(l.id) && l.color)?.color;
	return inherited ?? pickUnusedPaletteColor(palette, used);
}
