import { get, set, del } from 'idb-keyval';

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
