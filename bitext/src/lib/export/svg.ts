import { ALIGNER_SITE_HOST, EXPORT_ATTRIBUTION_PLAIN } from '$lib/brand.js';
import type { Token } from '$lib/domain/tokens.js';
import type { TokenLayout } from '$lib/types/layout.js';
import type { Connection } from '$lib/domain/alignment.js';
import { primaryConnectionForToken } from '$lib/domain/alignment.js';
import { canonicalPair, showConnectorsForPair, tokenLineId } from '$lib/domain/lines-helpers.js';
import type { PairControlV2, TokenLinkColorMode } from '$lib/serialization/schema.js';
import { linkEndpoints, linkPathD, ribbonPathD } from '$lib/domain/link-geometry.js';
import {
	connectorColor,
	getStyle,
	readableTextOn,
	styleExportBackground,
	styleExportFrame,
	type StyleId
} from '$lib/domain/styles.js';
import { escapeXml } from './xml.js';

const ATTRIBUTION_FOOTER_PX = 28;
const ATTRIBUTION_FONT = '"Google Sans", sans-serif';

function parseHexRgb(hex: string): [number, number, number] | null {
	let h = hex.replace(/^#/u, '').replace(/[^0-9a-fA-F]/gu, '');
	if (h.length === 3) {
		h = h
			.split('')
			.map((c) => c + c)
			.join('');
	}
	if (!/^[0-9a-fA-F]{6}$/u.test(h)) return null;
	return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function byteHex(n: number): string {
	const x = Math.max(0, Math.min(255, Math.round(n)));
	return x.toString(16).padStart(2, '0');
}

/** Linear blend toward canvas background (aligned with preview token background tint). */
function mixLinkBackground(linkHex: string, canvasHex: string, linkWeight = 0.28): string {
	const a = parseHexRgb(linkHex);
	const b = parseHexRgb(canvasHex);
	if (!a || !b) return linkHex;
	const t = Math.max(0, Math.min(1, linkWeight));
	const r = a[0] * t + b[0] * (1 - t);
	const g = a[1] * t + b[1] * (1 - t);
	const bl = a[2] * t + b[2] * (1 - t);
	return `#${byteHex(r)}${byteHex(g)}${byteHex(bl)}`;
}

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
	/** Matches on-screen preview / raster exports (PNG, PDF). Used for the `classic` style. */
	backgroundColor: string;
	defaultTextColor: string;
	/** Visual style preset; drives canvas, frame and connector treatment. */
	style?: StyleId;
	colorTokensByLink: boolean;
	tokenLinkColorMode?: TokenLinkColorMode;
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
		style = 'classic',
		colorTokensByLink,
		tokenLinkColorMode = 'text',
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

	const visualStyle = getStyle(style);
	const conn = visualStyle.connector;
	const isClassic = visualStyle.id === 'classic';
	const resolvedTextColor = isClassic ? defaultTextColor : visualStyle.canvas.textColor;
	const tintBase = isClassic ? backgroundColor : visualStyle.canvas.tintBaseHex;
	const exportBg = styleExportBackground(visualStyle, width, exportHeight);
	const frameSvg = styleExportFrame(visualStyle, width, height);

	const styleChunks: string[] = [];
	if (embedFontCss && embedFontCss.length > 0) styleChunks.push(embedFontCss);
	if (embedFontCdataImports?.length) {
		styleChunks.push(
			embedFontCdataImports
				.map((u) => `@import url("${u.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}");`)
				.join('\n')
		);
	}
	const fontStyleDef = styleChunks.length
		? `<style type="text/css"><![CDATA[\n${styleChunks.join('\n')}\n]]></style>`
		: '';
	const defsInner = `${fontStyleDef}${exportBg?.defs ?? ''}`;
	const fontDefs = defsInner ? `<defs>${defsInner}</defs>` : '';

	const dashAttr = conn.dash ? ` stroke-dasharray="${escapeXml(conn.dash)}"` : '';
	const isRibbon = conn.mode === 'ribbon';
	const paths: string[] = [];
	for (const c of connections) {
		if (!shouldRenderConnectionPath(c, lineOrder, pairControls)) continue;
		const color = connectorColor(visualStyle, c.color ?? '#94a3b8');
		const p1 = tokenLayout[c.upperTokenId];
		const p2 = tokenLayout[c.lowerTokenId];
		if (!p1 || !p2) continue;
		const { x1, y1, x2, y2 } = linkEndpoints(p1, p2);
		if (isRibbon) {
			const d = ribbonPathD(x1, y1, x2, y2, lineStyle, conn.ribbonWidth ?? 24, conn.taper ?? false);
			paths.push(
				`<path stroke="none" fill="${escapeXml(color)}" fill-opacity="${lineOpacity}" d="${d}"/>`
			);
			continue;
		}
		const d = linkPathD(x1, y1, x2, y2, lineStyle);
		// Glow: a wider, low-opacity underlay of the same color (portable across renderers).
		if (conn.glow) {
			const glowWidth = Math.round(lineThickness * 2.4 * 100) / 100;
			const glowOpacity = Math.round(lineOpacity * 0.35 * 1000) / 1000;
			paths.push(
				`<path fill="none" stroke="${escapeXml(color)}" stroke-width="${glowWidth}" stroke-opacity="${glowOpacity}" stroke-linecap="round" d="${d}"/>`
			);
		}
		paths.push(
			`<path fill="none" stroke="${escapeXml(color)}" stroke-width="${lineThickness}" stroke-opacity="${lineOpacity}" stroke-linecap="${conn.cap}"${dashAttr} d="${d}"/>`
		);
		if (conn.endpointDots) {
			const dot = conn.endpointDots;
			const fill = escapeXml(dot.color ?? color);
			const ring = dot.ring ? ` stroke="${escapeXml(dot.ring)}" stroke-width="1.5"` : '';
			paths.push(
				`<circle cx="${x1}" cy="${y1}" r="${dot.r}" fill="${fill}"${ring} fill-opacity="${lineOpacity}"/>`,
				`<circle cx="${x2}" cy="${y2}" r="${dot.r}" fill="${fill}"${ring} fill-opacity="${lineOpacity}"/>`
			);
		}
	}

	const tokenRects: string[] = [];
	const texts: string[] = [];

	function tokenFill(tokenId: string): string {
		if (!colorTokensByLink) return resolvedTextColor;
		const link = primaryConnectionForToken(connections, tokenId);
		if (!link?.color) return resolvedTextColor;
		if (tokenLinkColorMode === 'background') return resolvedTextColor;
		return link.color;
	}

	function tokenBgHex(tokenId: string): string | null {
		if (!colorTokensByLink || tokenLinkColorMode !== 'background') return null;
		const link = primaryConnectionForToken(connections, tokenId);
		if (!link?.color) return null;
		return mixLinkBackground(link.color, tintBase, 0.28);
	}

	function pushTokenText(t: Token, fontFamily: string, sizePx: number) {
		const box = tokenLayout[t.id];
		if (!box) return;
		const link = primaryConnectionForToken(connections, t.id);
		const chipColor = visualStyle.tokenChips && link?.color ? link.color : null;

		if (chipColor) {
			// Word card: hard offset shadow + solid chip + readable text.
			const off = Math.round(sizePx * 0.11 * 100) / 100;
			const shadow = visualStyle.tokenChips!.shadow;
			tokenRects.push(
				`<rect x="${box.x + off}" y="${box.y + off}" width="${box.w}" height="${box.h}" fill="${escapeXml(shadow)}"/>`,
				`<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="${escapeXml(chipColor)}"/>`
			);
			texts.push(
				`<text fill="${escapeXml(readableTextOn(chipColor))}" font-family="${escapeXml(fontFamily)}" font-size="${sizePx}" font-weight="700" text-anchor="middle" dominant-baseline="central" transform="translate(${box.cx},${box.cy})">${escapeXml(t.text)}</text>`
			);
			return;
		}

		const fill = tokenFill(t.id);
		const bg = tokenBgHex(t.id);
		if (bg) {
			tokenRects.push(
				`<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="${escapeXml(bg)}"/>`
			);
		}
		const common = `font-family="${escapeXml(fontFamily)}" font-size="${sizePx}" text-anchor="middle" dominant-baseline="central" transform="translate(${box.cx},${box.cy})"`;
		if (visualStyle.glowText) {
			// Portable halo: a soft wide outline of the same color behind the crisp glyph.
			const halo = Math.round(sizePx * 0.18 * 100) / 100;
			texts.push(
				`<text fill="none" stroke="${escapeXml(fill)}" stroke-width="${halo}" stroke-opacity="0.5" stroke-linejoin="round" font-weight="500" ${common}>${escapeXml(t.text)}</text>`
			);
		}
		texts.push(
			`<text fill="${escapeXml(fill)}" font-weight="500" ${common}>${escapeXml(t.text)}</text>`
		);
	}

	for (const row of lines) {
		for (const t of row.tokens) {
			pushTokenText(t, row.fontFamilyStack, row.textSizePx);
		}
	}

	const bgRect = exportBg
		? exportBg.rect
		: `<rect x="0" y="0" width="${width}" height="${exportHeight}" fill="${escapeXml(backgroundColor)}"/>`;

	const attribution = includeAttributionFooter
		? `<text fill="${escapeXml(resolvedTextColor)}" opacity="0.55" font-family="${escapeXml(ATTRIBUTION_FONT)}" font-size="11" text-anchor="middle" dominant-baseline="central" transform="translate(${width / 2},${height + ATTRIBUTION_FOOTER_PX / 2})">${escapeXml(EXPORT_ATTRIBUTION_PLAIN)}</text>`
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

	return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${exportHeight}" viewBox="0 0 ${width} ${exportHeight}">${fontDefs}${bgRect}${frameSvg}${tokenRects.join('')}${paths.join('')}${texts.join('')}${cornerQr}${attribution}</svg>`;
}
