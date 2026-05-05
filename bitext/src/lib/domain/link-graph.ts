import type { Connection } from './alignment.js';

/** Keep only connections whose endpoints are in the allowed token-id set and form an adjacent line pair. */
export function filterValidConnections(
	connections: Connection[],
	tokenIds: Set<string>,
	tokenIdToLineId: Map<string, string>,
	adjacentLinePairs: Set<string>
): Connection[] {
	return connections.filter((c) => {
		if (!tokenIds.has(c.upperTokenId) || !tokenIds.has(c.lowerTokenId)) return false;
		const u = tokenIdToLineId.get(c.upperTokenId);
		const l = tokenIdToLineId.get(c.lowerTokenId);
		if (u == null || l == null) return false;
		const key1 = `${u}\0${l}`;
		const key2 = `${l}\0${u}`;
		return adjacentLinePairs.has(key1) || adjacentLinePairs.has(key2);
	});
}

/** @deprecated v1 bipartite filter */
export function filterValidLinks(
	connections: Connection[],
	_sourceIds: Set<string>,
	_targetIds: Set<string>
): Connection[] {
	return connections.filter(
		(c) => _sourceIds.has(c.upperTokenId) && _targetIds.has(c.lowerTokenId)
	);
}

/** BFS over token–connection adjacency; returns connection ids in the component seeded by `seedTokenIds`. */
export function connectedConnectionIds(
	connections: Connection[],
	seedTokenIds: Iterable<string>
): Set<string> {
	const byToken = new Map<string, Connection[]>();
	for (const conn of connections) {
		const up = byToken.get(conn.upperTokenId) ?? [];
		up.push(conn);
		byToken.set(conn.upperTokenId, up);
		const lo = byToken.get(conn.lowerTokenId) ?? [];
		lo.push(conn);
		byToken.set(conn.lowerTokenId, lo);
	}

	const seenTokens = new Set<string>();
	const seenConns = new Set<string>();
	const queue = [...seedTokenIds];
	for (const id of queue) seenTokens.add(id);

	while (queue.length > 0) {
		const tokenId = queue.shift();
		if (!tokenId) continue;
		for (const conn of byToken.get(tokenId) ?? []) {
			if (!seenConns.has(conn.id)) seenConns.add(conn.id);
			if (!seenTokens.has(conn.upperTokenId)) {
				seenTokens.add(conn.upperTokenId);
				queue.push(conn.upperTokenId);
			}
			if (!seenTokens.has(conn.lowerTokenId)) {
				seenTokens.add(conn.lowerTokenId);
				queue.push(conn.lowerTokenId);
			}
		}
	}

	return seenConns;
}

/** @deprecated */
export const connectedLinkIds = connectedConnectionIds;

export function connectedConnectionComponents(connections: Connection[]): Set<string>[] {
	const seen = new Set<string>();
	const out: Set<string>[] = [];
	for (const conn of connections) {
		if (seen.has(conn.id)) continue;
		const comp = connectedConnectionIds(connections, [conn.upperTokenId, conn.lowerTokenId]);
		for (const id of comp) seen.add(id);
		out.push(comp);
	}
	return out;
}

/** @deprecated */
export const connectedLinkComponents = connectedConnectionComponents;
