export type TokenId = string;

export interface Token {
	id: TokenId;
	text: string;
	/** No visible space before this token in preview/editor rows. */
	joinLeft?: boolean;
}

/** Options passed to {@link tokenize}; build with {@link tokenizeOptionsFromVisualSettings}. */
export interface TokenizeOptions {
	splitChars: string;
	/** Single non-whitespace character; empty disables word-join. */
	mergeChar: string;
	splitPunctuation: boolean;
	/**
	 * When `splitPunctuation` is true: empty means Unicode `\p{P}`; non-empty means only these
	 * codepoints split as punctuation tokens.
	 */
	punctuationChars: string;
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

const PUNCT_CLASS = /\p{P}/u;

function apostropheBetweenLetters(
	ch: string,
	prev: string | undefined,
	next: string | undefined
): boolean {
	return Boolean(
		(ch === "'" || ch === '\u2019') && prev && next && /\p{L}/u.test(prev) && /\p{L}/u.test(next)
	);
}

function shouldSplitPunctuation(
	ch: string,
	prev: string | undefined,
	next: string | undefined,
	punctuationSplitSet: Set<string> | null
): boolean {
	const isPunct = punctuationSplitSet ? punctuationSplitSet.has(ch) : PUNCT_CLASS.test(ch);
	if (!isPunct) return false;
	if (apostropheBetweenLetters(ch, prev, next)) return false;
	return true;
}

function expandMerge(segment: string, mergeChar: string): string {
	if (!mergeChar || !segment.includes(mergeChar)) return segment;
	return segment.split(mergeChar).join(' ');
}

function emitPiecesFromExpanded(
	expanded: string,
	firstJoinLeft: boolean,
	splitPunctuation: boolean,
	punctuationSplitSet: Set<string> | null
): Array<Pick<Token, 'text' | 'joinLeft'>> {
	if (!expanded) return [];
	if (!splitPunctuation) {
		return [{ text: expanded, joinLeft: firstJoinLeft }];
	}

	const out: Array<Pick<Token, 'text' | 'joinLeft'>> = [];
	let buf = '';

	const pushBuf = (joinLeft: boolean) => {
		if (!buf) return;
		out.push({ text: buf, joinLeft });
		buf = '';
	};

	for (let i = 0; i < expanded.length; i++) {
		const ch = expanded[i]!;
		const prev = i > 0 ? expanded[i - 1] : undefined;
		const next = i + 1 < expanded.length ? expanded[i + 1] : undefined;
		if (shouldSplitPunctuation(ch, prev, next, punctuationSplitSet)) {
			const firstWord = out.length === 0;
			pushBuf(firstWord ? firstJoinLeft : true);
			out.push({ text: ch, joinLeft: true });
		} else {
			buf += ch;
		}
	}
	pushBuf(out.length === 0 ? firstJoinLeft : true);
	return out;
}

export function tokenizeOptionsFromVisualSettings(s: {
	tokenSplitChars: string;
	tokenMergeChar?: string;
	tokenSplitPunctuation?: boolean;
	tokenPunctuationChars?: string;
}): TokenizeOptions {
	return {
		splitChars: s.tokenSplitChars,
		mergeChar: s.tokenMergeChar ?? '',
		splitPunctuation: Boolean(s.tokenSplitPunctuation),
		punctuationChars: s.tokenPunctuationChars ?? ''
	};
}

/** Non-null set when using a custom punctuation list; null means Unicode `\p{P}`. */
export function punctuationSplitSetForOptions(opts: TokenizeOptions): Set<string> | null {
	if (!opts.splitPunctuation) return null;
	if (!opts.punctuationChars) return null;
	return new Set([...opts.punctuationChars]);
}

/**
 * Split on whitespace and optional one-char split characters.
 * Optional merge character joins parts of one token; merge positions become spaces in `text`.
 * Optional punctuation splitting: default Unicode `\p{P}`, or a custom character list; apostrophe
 * between letters is kept inside the word.
 */
export function tokenize(raw: string, lineId: string, opts: TokenizeOptions): Token[] {
	const cleaned = raw.trim();
	if (!cleaned) return [];
	const splitSet = new Set(uniqChars(opts.splitChars));
	const mergeChar = opts.mergeChar;
	const punctSet = punctuationSplitSetForOptions(opts);

	const out: Token[] = [];
	let cur = '';
	let nextJoinLeft = false;

	const pushSegment = () => {
		if (!cur) return;
		const expanded = expandMerge(cur, mergeChar);
		const pieces = emitPiecesFromExpanded(expanded, nextJoinLeft, opts.splitPunctuation, punctSet);
		for (const p of pieces) {
			out.push({
				id: `${lineId}-${out.length}`,
				text: p.text,
				joinLeft: p.joinLeft
			});
		}
		cur = '';
		nextJoinLeft = false;
	};

	for (const ch of cleaned) {
		if (/\s/u.test(ch)) {
			pushSegment();
			continue;
		}
		if (splitSet.has(ch)) {
			pushSegment();
			nextJoinLeft = true;
			continue;
		}
		cur += ch;
	}
	pushSegment();
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
