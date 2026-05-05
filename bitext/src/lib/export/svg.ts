import { ALIGNER_SITE_HOST } from '$lib/brand.js';
import type { Token } from '$lib/domain/tokens.js';
import type { TokenLayout } from '$lib/types/layout.js';
import type { Connection } from '$lib/domain/alignment.js';
import { primaryConnectionForToken } from '$lib/domain/alignment.js';
import { canonicalPair, showConnectorsForPair, tokenLineId } from '$lib/domain/lines-helpers.js';
import type { PairControlV2 } from '$lib/serialization/schema.js';
import { linkEndpoints, linkPathD } from '$lib/domain/link-geometry.js';
import { escapeXml } from './xml.js';

const ATTRIBUTION_FOOTER_PX = 28;
const ATTRIBUTION_FONT = '"Google Sans", sans-serif';

function shouldRenderConnectionPath(
	conn: Connection,
	lineOrder: string[],
	pairControls: PairControlV2[]
): boolean {
	const pair = canonicalPair(
		lineOrder,
		tokenLineId(conn.upperTokenId),
		tokenLineId(conn.lowerTokenId)
	);
	if (!pair) return false;
	return showConnectorsForPair(pairControls, pair.upperLineId, pair.lowerLineId);
}

export function buildStandaloneSvgString(args: {
	width: number;
	height: number;
	/** Matches on-screen preview / raster exports (PNG, PDF). */
	backgroundColor: string;
	defaultTextColor: string;
	colorTokensByLink: boolean;
	lineStyle: 'straight' | 'curved';
	lineThickness: number;
	lineOpacity: number;
	/** In display order (top to bottom). */
	lineOrder: string[];
	lines: { lineId: string; tokens: Token[]; fontFamilyStack: string; textSizePx: number }[];
	tokenLayout: Record<string, TokenLayout>;
	connections: Connection[];
	pairControls: PairControlV2[];
	/** When true (default), reserve a footer band with static attribution (PNG/PDF/SVG file). Omit for HTML wrapper (clickable line below SVG). */
	includeAttributionFooter?: boolean;
	/** Google Fonts stylesheet URLs (@import in SVG) so standalone files resolve the same faces as the preview. */
	embedFontCdataImports?: string[];
	/** Full `@font-face` CSS with src: url(data:...). Required for PNG/PDF where SVG is loaded via `<img>` and cannot fetch external CSS. */
	embedFontCss?: string;
	/** PNG data URL for optional corner QR (site only). ExportMenu leaves this unset for now. */
	siteQrPngDataUri?: string;
}): string {
	const {
		width,
		height,
		backgroundColor,
		defaultTextColor,
		colorTokensByLink,
		lineStyle,
		lineThickness,
		lineOpacity,
		lineOrder,
		lines,
		tokenLayout,
		connections,
		pairControls,
		includeAttributionFooter = true,
		embedFontCdataImports,
		embedFontCss,
		siteQrPngDataUri
	} = args;

	const exportHeight = includeAttributionFooter ? height + ATTRIBUTION_FOOTER_PX : height;

	const styleChunks: string[] = [];
	if (embedFontCss && embedFontCss.length > 0) styleChunks.push(embedFontCss);
	if (embedFontCdataImports?.length) {
		styleChunks.push(
			embedFontCdataImports
				.map((u) => `@import url("${u.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}");`)
				.join('\n')
		);
	}
	const fontDefs = styleChunks.length
		? `<defs><style type="text/css"><![CDATA[\n${styleChunks.join('\n')}\n]]></style></defs>`
		: '';

	const paths: string[] = [];
	for (const conn of connections) {
		if (!shouldRenderConnectionPath(conn, lineOrder, pairControls)) continue;
		const color = conn.color ?? '#94a3b8';
		const p1 = tokenLayout[conn.upperTokenId];
		const p2 = tokenLayout[conn.lowerTokenId];
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
		const link = primaryConnectionForToken(connections, tokenId);
		if (!link?.color) return defaultTextColor;
		return link.color;
	}

	function pushTokenText(t: Token, fontFamily: string, sizePx: number) {
		const box = tokenLayout[t.id];
		if (!box) return;
		const fill = tokenFill(t.id);
		texts.push(
			`<text fill="${escapeXml(fill)}" font-family="${escapeXml(fontFamily)}" font-size="${sizePx}" font-weight="500" text-anchor="middle" dominant-baseline="central" transform="translate(${box.cx},${box.cy})">${escapeXml(t.text)}</text>`
		);
	}

	for (const row of lines) {
		for (const t of row.tokens) {
			pushTokenText(t, row.fontFamilyStack, row.textSizePx);
		}
	}

	const bgRect = `<rect x="0" y="0" width="${width}" height="${exportHeight}" fill="${escapeXml(backgroundColor)}"/>`;

	const attribution = includeAttributionFooter
		? `<text fill="${escapeXml(defaultTextColor)}" opacity="0.55" font-family="${escapeXml(ATTRIBUTION_FONT)}" font-size="11" text-anchor="middle" dominant-baseline="central" transform="translate(${width / 2},${height + ATTRIBUTION_FOOTER_PX / 2})">${escapeXml(`Created with ${ALIGNER_SITE_HOST}`)}</text>`
		: '';

	/** Inset from the full export rectangle (including footer band) — same on right and bottom. */
	const CORNER_INSET = 8;
	const QR_INNER_PAD = 2;
	const qrDisplay = 48;
	const qrTotal = qrDisplay + QR_INNER_PAD * 2;
	const qrLeft = width - CORNER_INSET - qrTotal;
	const qrTop = exportHeight - CORNER_INSET - qrTotal;
	const cornerQr = siteQrPngDataUri
		? `<g aria-label="QR code — ${escapeXml(ALIGNER_SITE_HOST)}">
<rect x="${qrLeft}" y="${qrTop}" width="${qrTotal}" height="${qrTotal}" fill="#ffffff" fill-opacity="0.94"/>
<image href="${escapeXml(siteQrPngDataUri)}" x="${qrLeft + QR_INNER_PAD}" y="${qrTop + QR_INNER_PAD}" width="${qrDisplay}" height="${qrDisplay}" preserveAspectRatio="xMidYMid meet"/>
</g>`
		: '';

	return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${exportHeight}" viewBox="0 0 ${width} ${exportHeight}">${fontDefs}${bgRect}${paths.join('')}${texts.join('')}${cornerQr}${attribution}</svg>`;
}
