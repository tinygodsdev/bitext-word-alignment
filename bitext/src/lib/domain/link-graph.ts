import type { Link } from './alignment.js';

export function filterValidLinks(
	links: Link[],
	sourceIds: Set<string>,
	targetIds: Set<string>
): Link[] {
	return links.filter((l) => sourceIds.has(l.sourceId) && targetIds.has(l.targetId));
}

/** BFS over token–link adjacency; returns link ids in the connected component seeded by `seedTokenIds`. */
export function connectedLinkIds(links: Link[], seedTokenIds: Iterable<string>): Set<string> {
	const byToken = new Map<string, Link[]>();
	for (const link of links) {
		const src = byToken.get(link.sourceId) ?? [];
		src.push(link);
		byToken.set(link.sourceId, src);
		const tgt = byToken.get(link.targetId) ?? [];
		tgt.push(link);
		byToken.set(link.targetId, tgt);
	}

	const seenTokens = new Set<string>();
	const seenLinks = new Set<string>();
	const queue = [...seedTokenIds];
	for (const id of queue) seenTokens.add(id);

	while (queue.length > 0) {
		const tokenId = queue.shift();
		if (!tokenId) continue;
		for (const link of byToken.get(tokenId) ?? []) {
			if (!seenLinks.has(link.id)) seenLinks.add(link.id);
			if (!seenTokens.has(link.sourceId)) {
				seenTokens.add(link.sourceId);
				queue.push(link.sourceId);
			}
			if (!seenTokens.has(link.targetId)) {
				seenTokens.add(link.targetId);
				queue.push(link.targetId);
			}
		}
	}

	return seenLinks;
}

export function connectedLinkComponents(links: Link[]): Set<string>[] {
	const seen = new Set<string>();
	const out: Set<string>[] = [];
	for (const link of links) {
		if (seen.has(link.id)) continue;
		const comp = connectedLinkIds(links, [link.sourceId, link.targetId]);
		for (const id of comp) seen.add(id);
		out.push(comp);
	}
	return out;
}
