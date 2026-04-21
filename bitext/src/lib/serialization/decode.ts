import { inflateBase64url } from './codec.js';
import { COMPACT_SCHEMA_VERSION, fromCompactWire, type CompactV2Wire } from './compact-v2.js';
import { migrate, type AppStateV1 } from './schema.js';

function tryDecodeV2(data: string): AppStateV1 | null {
	const json = inflateBase64url(data);
	if (!json) return null;
	let parsed: unknown;
	try {
		parsed = JSON.parse(json) as unknown;
	} catch {
		return null;
	}
	if (!parsed || typeof parsed !== 'object') return null;
	const o = parsed as { v?: unknown };
	if (o.v !== COMPACT_SCHEMA_VERSION) return null;
	try {
		return fromCompactWire(parsed as CompactV2Wire);
	} catch {
		return null;
	}
}

export function decodeState(data: string | null | undefined): AppStateV1 {
	if (!data || typeof data !== 'string') {
		return migrate({});
	}
	const v2 = tryDecodeV2(data);
	if (v2) return v2;
	return migrate({});
}
