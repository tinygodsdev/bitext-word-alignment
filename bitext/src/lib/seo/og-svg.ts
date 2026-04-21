import { escapeXml } from '$lib/export/xml.js';
import { ALIGNER_SITE_HOST } from '$lib/brand.js';
import type { AppStateV1 } from '$lib/serialization/schema.js';

/** Social preview dimensions recommended by both Facebook and Twitter/X (1.91:1). */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

const FONT_FAMILY = 'Inter, system-ui, sans-serif';

function truncate(text: string, max: number): string {
	const trimmed = text.trim();
	if (trimmed.length <= max) return trimmed;
	return trimmed.slice(0, Math.max(0, max - 1)).trimEnd() + '…';
}

/** Minimal OG preview: the two sentences as a visual sample of the alignment, plus branding. */
export function buildOgSvg(state: AppStateV1): string {
	const src = truncate(state.project.sourceText || 'Type a sentence…', 80);
	const tgt = truncate(state.project.targetText || 'Add its translation…', 80);
	const w = OG_IMAGE_WIDTH;
	const h = OG_IMAGE_HEIGHT;

	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
	<defs>
		<linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
			<stop offset="0%" stop-color="#0f172a"/>
			<stop offset="100%" stop-color="#1e293b"/>
		</linearGradient>
	</defs>
	<rect width="100%" height="100%" fill="url(#bg)"/>
	<rect x="60" y="80" width="${w - 120}" height="4" fill="#6366f1" opacity="0.9"/>
	<text x="60" y="180" fill="#f8fafc" font-family="${FONT_FAMILY}" font-size="64" font-weight="700">Word-by-word translation</text>
	<text x="60" y="228" fill="#c7d2fe" font-family="${FONT_FAMILY}" font-size="26" font-weight="500">Bilingual sentence alignment visualizer</text>
	<text x="60" y="340" fill="#e2e8f0" font-family="${FONT_FAMILY}" font-size="40" font-weight="600">${escapeXml(src)}</text>
	<line x1="60" y1="372" x2="${w - 60}" y2="372" stroke="#334155" stroke-width="2" stroke-dasharray="6 8"/>
	<text x="60" y="430" fill="#e2e8f0" font-family="${FONT_FAMILY}" font-size="40" font-weight="600">${escapeXml(tgt)}</text>
	<text x="60" y="560" fill="#94a3b8" font-family="${FONT_FAMILY}" font-size="24" font-weight="500">${escapeXml(ALIGNER_SITE_HOST)}</text>
	<text x="${w - 60}" y="560" text-anchor="end" fill="#64748b" font-family="${FONT_FAMILY}" font-size="22" font-weight="400">Free · PNG / SVG / PDF / HTML</text>
</svg>`;
}
