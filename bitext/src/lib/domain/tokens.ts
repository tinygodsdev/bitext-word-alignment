export type TokenId = string;

export interface Token {
	id: TokenId;
	text: string;
	/** No visible space before this token in preview/editor rows. */
	joinLeft?: boolean;
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

/** Split on whitespace and custom one-char separators (like "." or "-"). Token ids: `${lineId}-${index}` */
export function tokenize(raw: string, lineId: string, splitChars = ''): Token[] {
	const cleaned = raw.trim();
	if (!cleaned) return [];
	const separators = new Set(uniqChars(splitChars));
	const out: Token[] = [];
	let cur = '';
	let nextJoinLeft = false;

	const pushCurrent = () => {
		if (!cur) return;
		out.push({
			id: `${lineId}-${out.length}`,
			text: cur,
			joinLeft: out.length > 0 ? nextJoinLeft : false
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
 * Preserve token ids when text edits add/remove words.
 */
export function reconcile(
	prev: Token[],
	nextTokens: Array<Pick<Token, 'text' | 'joinLeft'>>,
	lineId: string
): Token[] {
	return nextTokens.map((next, i) => {
		const old = prev[i];
		if (old) {
			return { ...old, text: next.text, joinLeft: next.joinLeft };
		}
		return {
			id: `${lineId}-${i}`,
			text: next.text,
			joinLeft: next.joinLeft
		};
	});
}
