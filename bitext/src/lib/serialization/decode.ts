import { inflateBase64url } from './codec.js';
import {
	COMPACT_SCHEMA_VERSION as COMPACT_V2,
	fromCompactWire as fromCompactWireV2,
	type CompactV2Wire
} from './compact-v2.js';
import {
	COMPACT_SCHEMA_VERSION as COMPACT_V3,
	fromCompactWire as fromCompactWireV3,
	type CompactV3Wire
} from './compact-v3.js';
import {
	COMPACT_SCHEMA_VERSION as COMPACT_V4,
	fromCompactWire as fromCompactWireV4,
	type CompactV4Wire
} from './compact-v4.js';
import { appStateV2FromV1, migrate, type AppStateV2 } from './schema.js';

function tryDecodeV4(data: string): AppStateV2 | null {
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
	if (o.v !== COMPACT_V4) return null;
	try {
		return fromCompactWireV4(parsed as CompactV4Wire);
	} catch {
		return null;
	}
}

function tryDecodeV3(data: string): AppStateV2 | null {
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
	if (o.v !== COMPACT_V3) return null;
	try {
		return fromCompactWireV3(parsed as CompactV3Wire);
	} catch {
		return null;
	}
}

function tryDecodeV2(data: string): AppStateV2 | null {
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
	if (o.v !== COMPACT_V2) return null;
	try {
		return appStateV2FromV1(fromCompactWireV2(parsed as CompactV2Wire));
	} catch {
		return null;
	}
}

export function decodeState(data: string | null | undefined): AppStateV2 {
	if (!data || typeof data !== 'string') {
		return migrate({});
	}
	const v4 = tryDecodeV4(data);
	if (v4) return v4;
	const v3 = tryDecodeV3(data);
	if (v3) return v3;
	const v2 = tryDecodeV2(data);
	if (v2) return v2;
	return migrate({});
}
