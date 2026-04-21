export type TokenId = string;

export interface Token {
	id: TokenId;
	text: string;
	/** No visible space before this token in preview/editor rows. */
	joinLeft?: boolean;
	gloss?: string;
}

function uniqChars(input: string): string[] {
	const out: string[] = [];
	const seen = new Set<string>();
	for (const ch of input) {
		if (/\s/u.test(ch)) continue;
		if (seen.has(ch)) continue;
		seen.add(ch);
		out.push(ch);
	}
	return out;
}

/** Split on whitespace and custom one-char separators (like "." or "-"). */
export function tokenize(raw: string, side: 'source' | 'target', splitChars = ''): Token[] {
	const cleaned = raw.trim();
	if (!cleaned) return [];
	const prefix = side === 'source' ? 's' : 't';
	const separators = new Set(uniqChars(splitChars));
	const out: Token[] = [];
	let cur = '';
	let nextJoinLeft = false;

	const pushCurrent = () => {
		if (!cur) return;
		out.push({
			id: `${prefix}-${out.length}`,
			text: cur,
			joinLeft: out.length > 0 ? nextJoinLeft : false,
			gloss: undefined
		});
		cur = '';
		nextJoinLeft = false;
	};

	for (const ch of cleaned) {
		if (/\s/u.test(ch)) {
			pushCurrent();
			nextJoinLeft = false;
			continue;
		}
		if (separators.has(ch)) {
			pushCurrent();
			nextJoinLeft = true;
			continue;
		}
		cur += ch;
	}
	pushCurrent();
	return out;
}

/**
 * Preserve token ids/glosses by index when text edits add/remove words.
 */
export function reconcile(
	prev: Token[],
	nextTokens: Array<Pick<Token, 'text' | 'joinLeft'>>,
	side: 'source' | 'target'
): Token[] {
	const prefix = side === 'source' ? 's' : 't';
	return nextTokens.map((next, i) => {
		const old = prev[i];
		if (old) {
			return { ...old, text: next.text, joinLeft: next.joinLeft };
		}
		return {
			id: `${prefix}-${i}`,
			text: next.text,
			joinLeft: next.joinLeft,
			gloss: undefined
		};
	});
}

/** True if the phrase has at least one non-empty gloss (for conditional gloss rows in the preview). */
export function phraseHasAnyGloss(tokens: Token[]): boolean {
	return tokens.some((t) => (t.gloss?.trim() ?? '').length > 0);
}

export function textsFromTokens(tokens: Token[]): string {
	return tokens.map((t) => t.text).join(' ');
}
