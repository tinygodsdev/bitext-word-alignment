import { loadCustomFontBlob } from './custom-fonts.js';
import type { LineV2 } from '$lib/serialization/schema.js';

const loadedKeys = new Set<string>();

export async function ensureVisualizationCustomFontsFromLines(lines: LineV2[]): Promise<void> {
	if (typeof document === 'undefined' || !document.fonts) return;

	const names: string[] = [];
	for (const line of lines) {
		if (line.font.source === 'custom' && line.font.customName) {
			names.push(line.font.customName);
		}
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
			/* invalid font */
		}
	}

	await document.fonts.ready;
}
