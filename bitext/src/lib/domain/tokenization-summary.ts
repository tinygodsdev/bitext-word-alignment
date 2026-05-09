import type { VisualSettingsV2 } from '$lib/serialization/schema.js';

/** Values shown in gray chips next to tokenization labels (editor hint). */
export function editorTokenizationChipValues(s: VisualSettingsV2): {
	extraSplitChars: string;
	joinChars: string;
	punctuationChip: string;
} {
	const extraSplitChars = s.tokenSplitChars.length > 0 ? s.tokenSplitChars : 'none';
	const joinChars = s.tokenMergeChar || 'none';
	let punctuationChip: string;
	if (!s.tokenSplitPunctuation) {
		punctuationChip = 'off';
	} else if (s.tokenPunctuationChars.length > 0) {
		punctuationChip = s.tokenPunctuationChars;
	} else {
		punctuationChip = '\\p{P}';
	}
	return { extraSplitChars, joinChars, punctuationChip };
}
