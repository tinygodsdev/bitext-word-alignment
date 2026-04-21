import type { AppStateV1 } from './schema.js';
import { deflateBase64url } from './codec.js';
import { toCompactJSON } from './compact-v2.js';

export function encodeState(state: AppStateV1): string {
	return deflateBase64url(toCompactJSON(state));
}
