/**
 * Build a short, human-recognisable file base name from user text.
 *
 * Keeps letters and digits from any script (so Cyrillic, CJK, etc. stay
 * readable), turns everything else into single dashes, and falls back to a
 * default when nothing usable remains (empty text, punctuation-only, emoji,
 * whitespace). The result is safe as a filename: no `/ \ : * ? " < > |`,
 * no control characters, and length-capped.
 */
export function exportBaseName(
	text: string,
	opts: { prefix?: string; fallback?: string; maxLen?: number } = {}
): string {
	const prefix = opts.prefix ?? 'al';
	const fallback = opts.fallback ?? 'alignment';
	const maxLen = opts.maxLen ?? 40;

	const cleaned = (text ?? '')
		.normalize('NFC')
		.toLowerCase()
		.replace(/[^\p{L}\p{N}]+/gu, '-')
		.replace(/^-+|-+$/g, '');

	// Slice by code point so multi-unit characters are never split mid-way.
	const slug = Array.from(cleaned).slice(0, maxLen).join('').replace(/-+$/g, '');

	return slug ? `${prefix}-${slug}` : fallback;
}

/**
 * Pick the first line with visible text to seed the export file name.
 * Returns an empty string when every line is blank.
 */
export function firstNonEmptyText(lines: { rawText: string }[]): string {
	for (const line of lines) {
		if (line.rawText && line.rawText.trim()) return line.rawText;
	}
	return '';
}
