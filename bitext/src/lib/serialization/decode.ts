import LZString from 'lz-string';
import {
	defaultProjectSnapshot,
	defaultVisualSettings,
	migrate,
	type AppStateV1
} from './schema.js';

export function decodeState(data: string | null | undefined): AppStateV1 {
	if (!data || typeof data !== 'string') {
		return migrate({});
	}
	try {
		const json = LZString.decompressFromEncodedURIComponent(data);
		if (!json) {
			return migrate({});
		}
		const parsed = JSON.parse(json) as unknown;
		return migrate(parsed);
	} catch {
		return {
			v: 1,
			project: defaultProjectSnapshot(),
			settings: defaultVisualSettings()
		};
	}
}
