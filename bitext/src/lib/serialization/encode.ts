import type { AppStateV2 } from './schema.js';
import { deflateBase64url } from './codec.js';
import { toCompactJSON } from './compact-v3.js';

export function encodeState(state: AppStateV2): string {
	return deflateBase64url(toCompactJSON(state));
}
