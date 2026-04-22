import { loadCustomFontBlob } from './custom-fonts.js';
import type { VisualSettingsV1 } from '$lib/serialization/schema.js';

const loadedKeys = new Set<string>();

/**
 * Custom fonts in Bitext are stored in IDB; SVG rasterization (PNG/PDF) often does not
 * apply @font-face from `<defs><style>` in an SVG blob, but the same family names can resolve
 * if the faces are registered on `document.fonts` (same as preview).
 */
export async function ensureVisualizationCustomFontsInDocument(
	settings: VisualSettingsV1
): Promise<void> {
	if (typeof document === 'undefined' || !document.fonts) return;

	const names: string[] = [];
	if (settings.sourceFontSource === 'custom' && settings.sourceCustomFontName) {
		names.push(settings.sourceCustomFontName);
	}
	if (settings.targetFontSource === 'custom' && settings.targetCustomFontName) {
		names.push(settings.targetCustomFontName);
	}
	if (settings.glossFontSource === 'custom' && settings.glossCustomFontName) {
		names.push(settings.glossCustomFontName);
	}

	for (const name of names) {
		if (loadedKeys.has(name)) continue;
		let inDocument = false;
		for (const f of document.fonts) {
			if (f.family === name) {
				inDocument = true;
				break;
			}
		}
		if (inDocument) {
			loadedKeys.add(name);
			continue;
		}
		const blob = await loadCustomFontBlob(name);
		if (!blob) continue;
		const ff = new FontFace(name, await blob.arrayBuffer());
		try {
			await ff.load();
			document.fonts.add(ff);
			loadedKeys.add(name);
		} catch {
			/* invalid font or decode error */
		}
	}

	await document.fonts.ready;
}
