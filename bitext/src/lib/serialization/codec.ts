import { deflateSync, inflateSync, strFromU8, strToU8 } from 'fflate';

function toBase64url(bytes: Uint8Array): string {
	let bin = '';
	for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
	const b64 = btoa(bin);
	return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/u, '');
}

function fromBase64url(s: string): Uint8Array {
	const pad = (4 - (s.length % 4)) % 4;
	const b64 = s.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat(pad);
	const bin = atob(b64);
	const out = new Uint8Array(bin.length);
	for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
	return out;
}

/** Deflate JSON (or any string) and return URI-safe base64 (no padding). */
export function deflateBase64url(s: string): string {
	const bytes = deflateSync(strToU8(s), { level: 9 });
	return toBase64url(bytes);
}

export function inflateBase64url(s: string): string | null {
	try {
		const bytes = fromBase64url(s);
		return strFromU8(inflateSync(bytes));
	} catch {
		return null;
	}
}
