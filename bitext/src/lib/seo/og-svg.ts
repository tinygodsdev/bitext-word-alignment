import { escapeXml } from '$lib/export/xml.js';
import type { AppStateV1 } from '$lib/serialization/schema.js';

/** Simple OG preview (no DOM layout) — two lines of text + branding. */
export function buildOgSvg(state: AppStateV1): string {
	const src = state.project.sourceText.slice(0, 120);
	const tgt = state.project.targetText.slice(0, 120);
	const w = 1200;
	const h = 630;
	return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
<stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/>
</linearGradient></defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<text x="60" y="120" fill="#f8fafc" font-family="system-ui,sans-serif" font-size="42" font-weight="600">Word-by-word translation</text>
<text x="60" y="220" fill="#94a3b8" font-family="system-ui,sans-serif" font-size="28">${escapeXml(src)}</text>
<text x="60" y="300" fill="#e2e8f0" font-family="system-ui,sans-serif" font-size="28">${escapeXml(tgt)}</text>
<text x="60" y="560" fill="#64748b" font-family="system-ui,sans-serif" font-size="22">bitext align · word alignment visualizer</text>
</svg>`;
}
