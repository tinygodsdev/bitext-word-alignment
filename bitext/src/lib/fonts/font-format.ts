/**
 * Sniff a font file’s format from its first bytes so we can:
 *   (1) produce a data-URL with a proper `font/<subtype>` MIME (some browsers
 *       refuse to load `application/octet-stream` as a font face)
 *   (2) add the `format("...")` hint required by some engines for data-URL sources.
 */
export type FontFormat = 'woff2' | 'woff' | 'otf' | 'ttf';

export function detectFontFormat(head: Uint8Array, fallbackName?: string): FontFormat {
	if (head.length >= 4) {
		const b0 = head[0]!;
		const b1 = head[1]!;
		const b2 = head[2]!;
		const b3 = head[3]!;

		if (b0 === 0x77 && b1 === 0x4f && b2 === 0x46 && b3 === 0x32) return 'woff2'; // wOF2
		if (b0 === 0x77 && b1 === 0x4f && b2 === 0x46 && b3 === 0x46) return 'woff'; // wOFF
		if (b0 === 0x4f && b1 === 0x54 && b2 === 0x54 && b3 === 0x4f) return 'otf'; // OTTO
		if (b0 === 0x00 && b1 === 0x01 && b2 === 0x00 && b3 === 0x00) return 'ttf';
		// 'true' / 'typ1' historical variants → still TTF bytes
		if (b0 === 0x74 && b1 === 0x72 && b2 === 0x75 && b3 === 0x65) return 'ttf';
		if (b0 === 0x74 && b1 === 0x79 && b2 === 0x70 && b3 === 0x31) return 'ttf';
	}
	const lower = fallbackName?.toLowerCase() ?? '';
	if (lower.endsWith('.woff2')) return 'woff2';
	if (lower.endsWith('.woff')) return 'woff';
	if (lower.endsWith('.otf')) return 'otf';
	return 'ttf';
}

export function fontMimeFor(fmt: FontFormat): string {
	if (fmt === 'woff2') return 'font/woff2';
	if (fmt === 'woff') return 'font/woff';
	if (fmt === 'otf') return 'font/otf';
	return 'font/ttf';
}

export function fontFormatHint(fmt: FontFormat): string {
	if (fmt === 'woff2') return 'woff2';
	if (fmt === 'woff') return 'woff';
	if (fmt === 'otf') return 'opentype';
	return 'truetype';
}
