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
	shiftHue,
	styleExportBackground,
	styleExportFrame,
	type StyleId
} from '$lib/domain/styles.js';
import {
	chromeScale,
	AUTOFIT_LINE_STRENGTH,
	AUTOFIT_CREDIT_STRENGTH
} from '$lib/domain/autofit.js';
import { escapeXml } from './xml.js';

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
	/** Overall auto-fit text scale (mean of per-line scales); gently shrinks lines + credit. */
	contentScale?: number;
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
	/**
	 * Fit the cropped diagram into a fixed canvas (social-media aspect presets),
	 * centered with padding. When omitted the canvas tracks the content as before.
	 */
	frame?: { width: number; height: number; padding?: number; background?: string };
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
		contentScale = 1,
		lineOrder,
		lines,
		tokenLayout,
		connections,
		pairControls,
		includeAttributionFooter = true,
		embedFontCdataImports,
		embedFontCss,
		siteQrPngDataUri,
		frame
	} = args;

	const visualStyle = getStyle(style);
	const conn = visualStyle.connector;
	const isClassic = visualStyle.id === 'classic';
	const resolvedTextColor = isClassic ? defaultTextColor : visualStyle.canvas.textColor;
	const tintBase = isClassic ? backgroundColor : visualStyle.canvas.tintBaseHex;

	// Innermost frame border inset so the attribution can sit inside the frame (matching the preview).
	const frameInnerInset =
		visualStyle.id === 'parchment'
			? 20
			: visualStyle.id === 'blueprint'
				? 10
				: visualStyle.id === 'bauhaus'
					? 2
					: 0;

	// Crop tightly to the token bounding box so exports aren't stretched by editor chrome/padding.
	// The credit then sits just below the diagram instead of far down an empty canvas.
	let minX = Infinity;
	let minY = Infinity;
	let maxX = -Infinity;
	let maxY = -Infinity;
	for (const b of Object.values(tokenLayout)) {
		if (b.x < minX) minX = b.x;
		if (b.y < minY) minY = b.y;
		if (b.x + b.w > maxX) maxX = b.x + b.w;
		if (b.y + b.h > maxY) maxY = b.y + b.h;
	}
	if (!Number.isFinite(minX)) {
		minX = 0;
		minY = 0;
		maxX = width;
		maxY = height;
	}

	const PAD = 40;
	const CREDIT_GAP_TOP = 18;
	const CREDIT_TEXT = 12;
	const CREDIT_GAP_BOTTOM = 22;
	const contentCx = (minX + maxX) / 2;
	const cropX = minX - PAD;
	const cropY = minY - PAD;
	const cropW = maxX - minX + PAD * 2;
	const bottomBand = includeAttributionFooter
		? CREDIT_GAP_TOP + CREDIT_TEXT + CREDIT_GAP_BOTTOM + frameInnerInset
		: PAD;
	const cropH = maxY - minY + PAD + bottomBand;
	const attributionY = maxY + CREDIT_GAP_TOP + CREDIT_TEXT / 2;

	const exportBg = styleExportBackground(visualStyle, cropX, cropY, cropW, cropH);
	// Frame wraps the whole (cropped) canvas so the credit stays inside it.
	const frameSvg = styleExportFrame(visualStyle, cropX, cropY, cropW, cropH);

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
	// Soft glow via Gaussian blur (matches the preview's drop-shadow, not a hard outline).
	const lineScale = chromeScale(contentScale, AUTOFIT_LINE_STRENGTH);
	const creditScale = chromeScale(contentScale, AUTOFIT_CREDIT_STRENGTH);
	const effWidth = lineThickness * (conn.widthScale ?? 1) * lineScale;
	const glowDefs: string[] = [];
	if (conn.glow) {
		const sd = Math.max(2, Math.round(effWidth * 1.1));
		glowDefs.push(
			`<filter id="wa-glow-line" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="${sd}"/></filter>`
		);
	}
	if (visualStyle.glowText) {
		glowDefs.push(
			`<filter id="wa-glow-text" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4"/></filter>`
		);
	}
	const defsInner = `${fontStyleDef}${exportBg?.defs ?? ''}${glowDefs.join('')}`;
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
		const { x1, y1, x2, y2 } = linkEndpoints(p1, p2, visualStyle.tokenChips ? 0 : undefined);
		if (isRibbon) {
			const d = ribbonPathD(
				x1,
				y1,
				x2,
				y2,
				lineStyle,
				lineThickness * (conn.ribbonScale ?? 8) * lineScale,
				conn.taper ?? false
			);
			paths.push(
				`<path stroke="none" fill="${escapeXml(color)}" fill-opacity="${lineOpacity}" d="${d}"/>`
			);
			continue;
		}
		const d = linkPathD(x1, y1, x2, y2, lineStyle);
		// Glow: a blurred copy of the same stroke behind the crisp one.
		if (conn.glow) {
			paths.push(
				`<path fill="none" stroke="${escapeXml(color)}" stroke-width="${effWidth}" stroke-opacity="${lineOpacity}" stroke-linecap="round" filter="url(#wa-glow-line)" d="${d}"/>`
			);
		}
		paths.push(
			`<path fill="none" stroke="${escapeXml(color)}" stroke-width="${effWidth}" stroke-opacity="${lineOpacity}" stroke-linecap="${conn.cap}"${dashAttr} d="${d}"/>`
		);
		if (conn.endpointDots) {
			const dot = conn.endpointDots;
			const fill = escapeXml(dot.color ?? color);
			const ring = dot.ring ? ` stroke="${escapeXml(dot.ring)}" stroke-width="1.5"` : '';
			const dr = Math.round(dot.r * lineScale * 100) / 100;
			paths.push(
				`<circle cx="${x1}" cy="${y1}" r="${dr}" fill="${fill}"${ring} fill-opacity="${lineOpacity}"/>`,
				`<circle cx="${x2}" cy="${y2}" r="${dr}" fill="${fill}"${ring} fill-opacity="${lineOpacity}"/>`
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
		// Deco lettering: uppercase + letter-spacing (compensate the trailing space for centering).
		const tt = visualStyle.tokenTransform;
		const label = tt?.uppercase ? t.text.toUpperCase() : t.text;
		const ls = tt?.letterSpacingEm ? Math.round(sizePx * tt.letterSpacingEm * 100) / 100 : 0;
		const lsAttr = ls ? ` letter-spacing="${ls}"` : '';
		const cx = box.cx - ls / 2;
		const common = `font-family="${escapeXml(fontFamily)}" font-size="${sizePx}"${lsAttr} text-anchor="middle" dominant-baseline="central" transform="translate(${cx},${box.cy})"`;
		if (visualStyle.glowText) {
			// Soft halo: a blurred copy of the glyph behind the crisp one.
			texts.push(
				`<text fill="${escapeXml(fill)}" filter="url(#wa-glow-text)" font-weight="500" ${common}>${escapeXml(label)}</text>`
			);
		}
		if (visualStyle.textOffsetShadow) {
			// Riso misregistration: a hard offset copy in a hue-shifted spot ink, behind the glyph.
			const { dx, dy } = visualStyle.textOffsetShadow;
			const shadowCommon = `font-family="${escapeXml(fontFamily)}" font-size="${sizePx}"${lsAttr} text-anchor="middle" dominant-baseline="central" transform="translate(${cx + dx},${box.cy + dy})"`;
			texts.push(
				`<text fill="${escapeXml(shiftHue(fill, 165))}" font-weight="500" ${shadowCommon}>${escapeXml(label)}</text>`
			);
		}
		texts.push(
			`<text fill="${escapeXml(fill)}" font-weight="500" ${common}>${escapeXml(label)}</text>`
		);
	}

	for (const row of lines) {
		for (const t of row.tokens) {
			pushTokenText(t, row.fontFamilyStack, row.textSizePx);
		}
	}

	const bgRect = exportBg
		? exportBg.rect
		: `<rect x="${cropX}" y="${cropY}" width="${cropW}" height="${cropH}" fill="${escapeXml(backgroundColor)}"/>`;

	// Match the preview's per-style credit treatment (uppercase Bauhaus, italic serif styles).
	const isBauhausCredit = visualStyle.id === 'bauhaus';
	const italicCredit = ['atlas', 'sumi', 'parchment'].includes(visualStyle.id);
	const creditText = isBauhausCredit
		? EXPORT_ATTRIBUTION_PLAIN.toUpperCase()
		: EXPORT_ATTRIBUTION_PLAIN;
	const creditExtra = isBauhausCredit
		? ' letter-spacing="1.3" font-weight="600"'
		: italicCredit
			? ' font-style="italic"'
			: '';
	const attribution = includeAttributionFooter
		? `<text fill="${escapeXml(resolvedTextColor)}" opacity="0.6" font-family="${escapeXml(ATTRIBUTION_FONT)}" font-size="${Math.round(12 * creditScale * 100) / 100}"${creditExtra} text-anchor="middle" dominant-baseline="central" transform="translate(${contentCx},${attributionY})">${escapeXml(creditText)}</text>`
		: '';

	/** Inset from the full export rectangle (including footer band) — same on right and bottom. */
	const CORNER_INSET = 8;
	const QR_INNER_PAD = 2;
	const qrDisplay = 48;
	const qrTotal = qrDisplay + QR_INNER_PAD * 2;
	const qrLeft = cropX + cropW - CORNER_INSET - qrTotal;
	const qrTop = cropY + cropH - CORNER_INSET - qrTotal;
	const cornerQr = siteQrPngDataUri
		? `<g aria-label="QR code — ${escapeXml(ALIGNER_SITE_HOST)}">
<rect x="${qrLeft}" y="${qrTop}" width="${qrTotal}" height="${qrTotal}" fill="#ffffff" fill-opacity="0.94"/>
<image href="${escapeXml(siteQrPngDataUri)}" x="${qrLeft + QR_INNER_PAD}" y="${qrTop + QR_INNER_PAD}" width="${qrDisplay}" height="${qrDisplay}" preserveAspectRatio="xMidYMid meet"/>
</g>`
		: '';

	// Chip styles (Bauhaus) draw connectors under the cards; otherwise links sit above the text.
	const body = visualStyle.tokenChips
		? `${paths.join('')}${tokenRects.join('')}${texts.join('')}`
		: `${tokenRects.join('')}${paths.join('')}${texts.join('')}`;

	const content = `${bgRect}${frameSvg}${body}${cornerQr}${attribution}`;

	if (!frame) {
		return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${cropW}" height="${cropH}" viewBox="${cropX} ${cropY} ${cropW} ${cropH}">${fontDefs}${content}</svg>`;
	}

	// Fit the cropped diagram into the fixed canvas, centered with padding.
	const num = (n: number) => Math.round(n * 1000) / 1000;
	const fw = Math.max(1, frame.width);
	const fh = Math.max(1, frame.height);
	const pad = Math.max(0, Math.min(frame.padding ?? 0, Math.min(fw, fh) / 2 - 1));
	const fitScale = num(Math.min((fw - 2 * pad) / cropW, (fh - 2 * pad) / cropH));
	const tx = num((fw - cropW * fitScale) / 2 - cropX * fitScale);
	const ty = num((fh - cropH * fitScale) / 2 - cropY * fitScale);
	const frameBg = frame.background ?? backgroundColor;
	return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${fw}" height="${fh}" viewBox="0 0 ${fw} ${fh}">${fontDefs}<rect x="0" y="0" width="${fw}" height="${fh}" fill="${escapeXml(frameBg)}"/><g transform="translate(${tx} ${ty}) scale(${fitScale})">${content}</g></svg>`;
}
