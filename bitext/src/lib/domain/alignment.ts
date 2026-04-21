import type { TokenId } from './tokens.js';
import { connectedLinkIds } from './link-graph.js';
import { pickUnusedPaletteColor, type PaletteName } from './palettes.js';

/** One source–target pair per object so 1-to-many is multiple links (same or different colors). */
export interface Link {
	id: string;
	sourceId: TokenId;
	targetId: TokenId;
	color?: string;
}

let linkCounter = 0;

export function createLinkId(): string {
	linkCounter += 1;
	return `link-${Date.now()}-${linkCounter}`;
}

export function addAtomicLinks(
	links: Link[],
	pairs: { sourceId: string; targetId: string }[],
	color: string
): Link[] {
	const existing = new Set(links.map((l) => `${l.sourceId}\0${l.targetId}`));
	const next = [...links];
	for (const { sourceId, targetId } of pairs) {
		const key = `${sourceId}\0${targetId}`;
		if (existing.has(key)) continue;
		existing.add(key);
		next.push({ id: createLinkId(), sourceId, targetId, color });
	}
	return next;
}

export function removeLink(links: Link[], linkId: string): Link[] {
	return links.filter((l) => l.id !== linkId);
}

export function findLinksForToken(links: Link[], tokenId: TokenId): Link[] {
	return links.filter((l) => l.sourceId === tokenId || l.targetId === tokenId);
}

export function linkForId(links: Link[], linkId: string): Link | undefined {
	return links.find((l) => l.id === linkId);
}

/** First link involving this token (for token tint when multiple links share a token). */
export function primaryLinkForToken(links: Link[], tokenId: TokenId): Link | undefined {
	return findLinksForToken(links, tokenId)[0];
}

/** Color `addAlignment` would assign for this token set (preview / selection highlight). */
export function pendingAlignmentColor(
	links: Link[],
	sourceIds: string[],
	targetIds: string[],
	palette: PaletteName
): string {
	const seedTokens = new Set<string>([...sourceIds, ...targetIds]);
	const componentBefore = connectedLinkIds(links, seedTokens);
	const used = new Set(links.map((l) => l.color).filter((c): c is string => Boolean(c)));
	const inherited = links.find((l) => componentBefore.has(l.id) && l.color)?.color;
	return inherited ?? pickUnusedPaletteColor(palette, used);
}
