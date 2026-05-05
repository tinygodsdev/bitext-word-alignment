import { get, set, del, keys } from 'idb-keyval';

const KEY_PREFIX = 'bitext-font:';

export function fontStorageKey(name: string): string {
	return `${KEY_PREFIX}${name}`;
}

export async function saveCustomFontBlob(name: string, blob: Blob): Promise<void> {
	await set(fontStorageKey(name), blob);
}

export async function loadCustomFontBlob(name: string): Promise<Blob | undefined> {
	return get<Blob>(fontStorageKey(name));
}

export async function removeCustomFont(name: string): Promise<void> {
	await del(fontStorageKey(name));
}

/** All stored custom font family names (from this app’s IDB prefix). */
export async function listStoredCustomFontNames(): Promise<string[]> {
	const all = await keys<string>();
	return all
		.filter((k): k is string => typeof k === 'string' && k.startsWith(KEY_PREFIX))
		.map((k) => k.slice(KEY_PREFIX.length))
		.sort((a, b) => a.localeCompare(b));
}
