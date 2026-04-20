import LZString from 'lz-string';
import type { AppStateV1 } from './schema.js';

export function encodeState(state: AppStateV1): string {
	const slim = structuredClone(state) as AppStateV1;
	if (slim.settings.backgroundImageDataUrl) {
		delete slim.settings.backgroundImageDataUrl;
	}
	const json = JSON.stringify(slim);
	return LZString.compressToEncodedURIComponent(json);
}
