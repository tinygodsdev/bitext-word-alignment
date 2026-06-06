import {
	DEFAULT_WORD_GAP_PX,
	type LinePairGapV2,
	type LineV2,
	type PairControlV2
} from '$lib/serialization/schema.js';

export const inter = (rawText: string, id: string, textSizePx = 36): LineV2 => ({
	id,
	rawText,
	font: { family: 'Inter', source: 'google' },
	textSizePx,
	gapWordPx: DEFAULT_WORD_GAP_PX
});

export const noto = (
	rawText: string,
	id: string,
	scriptFamily: string,
	textSizePx = 36,
	rtl = false
): LineV2 => ({
	id,
	rawText,
	font: { family: scriptFamily, source: 'google' },
	textSizePx,
	gapWordPx: DEFAULT_WORD_GAP_PX,
	...(rtl ? { rtl: true } : {})
});

/** Morpheme gloss row → source → free translation (Leipzig-style stack). */
export function glossSourceTranslationLines(
	gloss: string,
	source: string,
	translation: string,
	opts: {
		glossSize?: number;
		sourceSize?: number;
		translationSize?: number;
		sourceFont?: LineV2['font'];
		gapPx?: number;
	} = {}
): {
	lines: LineV2[];
	pairControls: PairControlV2[];
	linePairGaps: LinePairGapV2[];
} {
	const gapPx = opts.gapPx ?? 16;
	const sourceLine: LineV2 = opts.sourceFont
		? {
				id: 'src',
				rawText: source,
				font: opts.sourceFont,
				textSizePx: opts.sourceSize ?? 34,
				gapWordPx: DEFAULT_WORD_GAP_PX
			}
		: inter(source, 'src', opts.sourceSize ?? 34);
	return {
		lines: [
			inter(gloss, 'gl', opts.glossSize ?? 22),
			sourceLine,
			inter(translation, 'tr', opts.translationSize ?? 30)
		],
		pairControls: [{ upperLineId: 'gl', lowerLineId: 'src', showConnectors: false }],
		linePairGaps: [{ upperLineId: 'gl', lowerLineId: 'src', gapPx }]
	};
}

/**
 * Interlinear presets: whitespace separates words; `-` stays inside morphemes.
 * Use `|` only *inside* a word to mark morpheme boundaries without extra gap (see tokenize joinLeft).
 */
export const interlinearSettings = {
	tokenSplitChars: '',
	tokenMergeChar: '+',
	tokenSplitPunctuation: false,
	tokenPunctuationChars: ''
} as const;

/** Same as {@link interlinearSettings}, but `|` tight-joins adjacent morphemes (no extra space). */
export const morphemeInterlinearSettings = {
	...interlinearSettings,
	tokenSplitChars: '|'
} as const;
