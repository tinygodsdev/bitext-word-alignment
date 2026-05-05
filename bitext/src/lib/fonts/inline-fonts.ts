import { loadCustomFontBlob } from './custom-fonts.js';
import type { LineV2 } from '$lib/serialization/schema.js';
import { googleFontStylesheetUrl } from './google-fonts.js';
import { detectFontFormat, fontFormatHint, fontMimeFor } from './font-format.js';

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
				/* network error */
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
	const buf = await blob.arrayBuffer();
	const head = new Uint8Array(buf, 0, Math.min(buf.byteLength, 8));
	const fmt = detectFontFormat(head);
	const typedBlob = new Blob([buf], { type: fontMimeFor(fmt) });
	const dataUrl = await blobToDataUrl(typedBlob);
	const safeFamily = family.replace(/"/g, '\\"');
	return `@font-face{font-family:"${safeFamily}";font-style:normal;font-weight:400 700;src:url(${dataUrl}) format("${fontFormatHint(fmt)}");font-display:swap;}`;
}

function uniqueGoogleHrefsFromLines(lines: LineV2[]): string[] {
	const urls = new Set<string>();
	for (const line of lines) {
		if (line.font.source === 'google') {
			urls.add(googleFontStylesheetUrl(line.font.family));
		}
	}
	return [...urls];
}

/** Collect one CSS string with @font-face blocks for every line font used in visualization. */
export async function buildInlinedFontCssFromLines(lines: LineV2[]): Promise<string> {
	const chunks: string[] = [];

	for (const href of uniqueGoogleHrefsFromLines(lines)) {
		const css = await inlineGoogleStylesheet(href);
		if (css) chunks.push(css);
	}

	const customFamilies = new Set<string>();
	for (const line of lines) {
		if (line.font.source === 'custom' && line.font.customName) {
			customFamilies.add(line.font.customName);
		}
	}
	for (const family of customFamilies) {
		const css = await customFontFaceCss(family);
		if (css) chunks.push(css);
	}

	return chunks.join('\n');
}
