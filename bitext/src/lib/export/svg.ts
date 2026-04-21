import { ALIGNER_SITE_HOST } from '$lib/brand.js';
import type { Token } from '$lib/domain/tokens.js';
import type { TokenLayout } from '$lib/types/layout.js';
import type { Link } from '$lib/domain/alignment.js';
import { primaryLinkForToken } from '$lib/domain/alignment.js';
import { linkEndpoints, linkPathD } from '$lib/domain/link-geometry.js';
import { escapeXml } from './xml.js';

const ATTRIBUTION_FOOTER_PX = 28;
const ATTRIBUTION_FONT = '"Google Sans", sans-serif';

export function buildStandaloneSvgString(args: {
	width: number;
	height: number;
	/** Matches on-screen preview / raster exports (PNG, PDF). */
	backgroundColor: string;
	fontFamilySource: string;
	fontFamilyTarget: string;
	fontSize: number;
	glossFontSize: number;
	defaultTextColor: string;
	colorTokensByLink: boolean;
	lineStyle: 'straight' | 'curved';
	lineThickness: number;
	lineOpacity: number;
	sourceTokens: Token[];
	targetTokens: Token[];
	tokenLayout: Record<string, TokenLayout>;
	links: Link[];
	showGloss: boolean;
	/** When true (default), reserve a footer band with static attribution (PNG/PDF/SVG file). Omit for HTML wrapper (clickable line below SVG). */
	includeAttributionFooter?: boolean;
}): string {
	const {
		width,
		height,
		backgroundColor,
		fontFamilySource,
		fontFamilyTarget,
		fontSize,
		glossFontSize,
		defaultTextColor,
		colorTokensByLink,
		lineStyle,
		lineThickness,
		lineOpacity,
		sourceTokens,
		targetTokens,
		tokenLayout,
		links,
		showGloss,
		includeAttributionFooter = true
	} = args;

	const exportHeight = includeAttributionFooter ? height + ATTRIBUTION_FOOTER_PX : height;

	const paths: string[] = [];
	for (const link of links) {
		const color = link.color ?? '#94a3b8';
		const p1 = tokenLayout[link.sourceId];
		const p2 = tokenLayout[link.targetId];
		if (!p1 || !p2) continue;
		const { x1, y1, x2, y2 } = linkEndpoints(p1, p2);
		const d = linkPathD(x1, y1, x2, y2, lineStyle);
		paths.push(
			`<path fill="none" stroke="${escapeXml(color)}" stroke-width="${lineThickness}" stroke-opacity="${lineOpacity}" stroke-linecap="round" d="${d}"/>`
		);
	}

	const texts: string[] = [];

	function tokenFill(tokenId: string): string {
		if (!colorTokensByLink) return defaultTextColor;
		const link = primaryLinkForToken(links, tokenId);
		if (!link?.color) return defaultTextColor;
		return link.color;
	}

	function pushTokenText(t: Token, fontFamily: string) {
		const box = tokenLayout[t.id];
		if (!box) return;
		const fill = tokenFill(t.id);
		texts.push(
			`<text fill="${escapeXml(fill)}" font-family="${escapeXml(fontFamily)}" font-size="${fontSize}" text-anchor="middle" dominant-baseline="central" transform="translate(${box.cx},${box.cy})">${escapeXml(t.text)}</text>`
		);
	}

	for (const t of sourceTokens) pushTokenText(t, fontFamilySource);
	for (const t of targetTokens) pushTokenText(t, fontFamilyTarget);

	if (showGloss) {
		for (const t of sourceTokens) {
			const gid = `gloss-${t.id}`;
			const box = tokenLayout[gid];
			const g = t.gloss?.trim();
			if (!box || !g) continue;
			texts.push(
				`<text fill="${escapeXml(defaultTextColor)}" font-family="${escapeXml(fontFamilySource)}" font-size="${glossFontSize}" opacity="0.85" text-anchor="middle" dominant-baseline="central" transform="translate(${box.cx},${box.cy})">${escapeXml(g)}</text>`
			);
		}
	}

	const bgRect = `<rect x="0" y="0" width="${width}" height="${exportHeight}" fill="${escapeXml(backgroundColor)}"/>`;

	const attribution = includeAttributionFooter
		? `<text fill="${escapeXml(defaultTextColor)}" opacity="0.55" font-family="${escapeXml(ATTRIBUTION_FONT)}" font-size="11" text-anchor="middle" dominant-baseline="central" transform="translate(${width / 2},${height + ATTRIBUTION_FOOTER_PX / 2})">${escapeXml(`Created with ${ALIGNER_SITE_HOST}`)}</text>`
		: '';

	return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${exportHeight}" viewBox="0 0 ${width} ${exportHeight}">${bgRect}${paths.join('')}${texts.join('')}${attribution}</svg>`;
}
