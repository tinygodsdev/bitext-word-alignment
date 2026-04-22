import { loadCustomFontBlob } from './custom-fonts.js';
import type { VisualSettingsV1 } from '$lib/serialization/schema.js';
import { googleFontStylesheetUrl } from './google-fonts.js';

/**
 * Fetches a Google Fonts stylesheet (forcing woff2 via UA-less fetch),
 * inlines referenced font files as `src: url(data:font/woff2;base64,...)`.
 *
 * Used for PNG/PDF exports where the SVG is loaded through `<img>` and cannot
 * fetch cross-origin CSS/fonts. For SVG/HTML files we still link fonts externally.
 */
async function blobToDataUrl(blob: Blob): Promise<string> {
	return await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(String(reader.result));
		reader.onerror = () => reject(reader.error ?? new Error('FileReader failed'));
		reader.readAsDataURL(blob);
	});
}

async function inlineGoogleStylesheet(href: string): Promise<string | null> {
	let css: string;
	try {
		const res = await fetch(href, { mode: 'cors' });
		if (!res.ok) return null;
		css = await res.text();
	} catch {
		return null;
	}
	const urlPattern = /url\((https:\/\/[^)]+)\)/g;
	const urls = new Set<string>();
	let m: RegExpExecArray | null;
	while ((m = urlPattern.exec(css))) urls.add(m[1]!);
	const replacements = new Map<string, string>();
	await Promise.all(
		[...urls].map(async (u) => {
			try {
				const r = await fetch(u, { mode: 'cors' });
				if (!r.ok) return;
				const blob = await r.blob();
				replacements.set(u, await blobToDataUrl(blob));
			} catch {
				/* network error — skip this src */
			}
		})
	);
	if (replacements.size === 0) return css;
	return css.replace(urlPattern, (_match, src: string) => {
		const data = replacements.get(src);
		return data ? `url(${data})` : `url(${src})`;
	});
}

async function customFontFaceCss(family: string): Promise<string | null> {
	const blob = await loadCustomFontBlob(family);
	if (!blob) return null;
	const dataUrl = await blobToDataUrl(blob);
	const safeFamily = family.replace(/"/g, '\\"');
	return `@font-face{font-family:"${safeFamily}";font-style:normal;font-weight:400 700;src:url(${dataUrl});font-display:swap;}`;
}

function uniqueGoogleHrefs(settings: VisualSettingsV1): string[] {
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

/** Collect one CSS string with @font-face blocks for every family used in visualization. */
export async function buildInlinedFontCss(settings: VisualSettingsV1): Promise<string> {
	const chunks: string[] = [];

	for (const href of uniqueGoogleHrefs(settings)) {
		const css = await inlineGoogleStylesheet(href);
		if (css) chunks.push(css);
	}

	const customFamilies = new Set<string>();
	if (settings.sourceFontSource === 'custom' && settings.sourceCustomFontName) {
		customFamilies.add(settings.sourceCustomFontName);
	}
	if (settings.targetFontSource === 'custom' && settings.targetCustomFontName) {
		customFamilies.add(settings.targetCustomFontName);
	}
	if (settings.glossFontSource === 'custom' && settings.glossCustomFontName) {
		customFamilies.add(settings.glossCustomFontName);
	}
	for (const family of customFamilies) {
		const css = await customFontFaceCss(family);
		if (css) chunks.push(css);
	}

	return chunks.join('\n');
}
