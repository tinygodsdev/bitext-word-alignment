import type { LineV2 } from '$lib/serialization/schema.js';
import { googleFontStylesheetUrl } from './google-fonts.js';

export function resolveLineFontCss(line: LineV2): string {
	if (line.font.source === 'custom' && line.font.customName) {
		return `"${line.font.customName}", sans-serif`;
	}
	return `"${line.font.family}", sans-serif`;
}

/** Font stack for SVG `font-family` (no CSS quote wrappers). */
export function svgFontFamilyStackLine(line: LineV2): string {
	if (line.font.source === 'custom' && line.font.customName) {
		return `${line.font.customName}, sans-serif`;
	}
	return `${line.font.family}, sans-serif`;
}

export function googleFontUrlsForLines(lines: LineV2[]): string[] {
	const urls = new Set<string>();
	for (const line of lines) {
		if (line.font.source === 'google') {
			urls.add(googleFontStylesheetUrl(line.font.family));
		}
	}
	return [...urls];
}
