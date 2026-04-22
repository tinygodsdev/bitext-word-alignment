import type { VisualSettingsV1 } from '$lib/serialization/schema.js';
import { googleFontStylesheetUrl } from './google-fonts.js';

export type FontSide = 'source' | 'target' | 'gloss';

export function resolveVisualizationFontCss(settings: VisualSettingsV1, side: FontSide): string {
	if (side === 'source') {
		return settings.sourceFontSource === 'custom' && settings.sourceCustomFontName
			? `"${settings.sourceCustomFontName}", sans-serif`
			: `"${settings.sourceFontFamily}", sans-serif`;
	}
	if (side === 'target') {
		return settings.targetFontSource === 'custom' && settings.targetCustomFontName
			? `"${settings.targetCustomFontName}", sans-serif`
			: `"${settings.targetFontFamily}", sans-serif`;
	}
	return settings.glossFontSource === 'custom' && settings.glossCustomFontName
		? `"${settings.glossCustomFontName}", sans-serif`
		: `"${settings.glossFontFamily}", sans-serif`;
}

/** Distinct Google Stylesheet URLs needed for the current visualization settings. */
export function visualizationGoogleFontUrls(settings: VisualSettingsV1): string[] {
	const urls = new Set<string>();
	if (settings.sourceFontSource === 'google') {
		urls.add(googleFontStylesheetUrl(settings.sourceFontFamily));
	}
	if (settings.targetFontSource === 'google') {
		urls.add(googleFontStylesheetUrl(settings.targetFontFamily));
	}
	if (settings.glossFontSource === 'google') {
		urls.add(googleFontStylesheetUrl(settings.glossFontFamily));
	}
	return [...urls];
}

/** Font stack for SVG `font-family` (no CSS quote wrappers). */
export function svgFontFamilyStack(settings: VisualSettingsV1, side: FontSide): string {
	if (side === 'source') {
		if (settings.sourceFontSource === 'custom' && settings.sourceCustomFontName) {
			return `${settings.sourceCustomFontName}, sans-serif`;
		}
		return `${settings.sourceFontFamily}, sans-serif`;
	}
	if (side === 'target') {
		if (settings.targetFontSource === 'custom' && settings.targetCustomFontName) {
			return `${settings.targetCustomFontName}, sans-serif`;
		}
		return `${settings.targetFontFamily}, sans-serif`;
	}
	if (settings.glossFontSource === 'custom' && settings.glossCustomFontName) {
		return `${settings.glossCustomFontName}, sans-serif`;
	}
	return `${settings.glossFontFamily}, sans-serif`;
}
