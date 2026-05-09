import {
	DEFAULT_WORD_GAP_PX,
	type LinePairGapV2,
	type LineV2,
	type PairControlV2,
	type VisualSettingsV2
} from '$lib/serialization/schema.js';

export type ExampleId = 'simple' | 'glosses' | 'rtl' | 'tagalog' | 'cjk';

/** Token id pair `[upperLineId-index, lowerLineId-index]` connected after the snapshot loads. */
export type ExampleConnection = readonly [string, string];

export interface ExampleEntry {
	id: ExampleId;
	label: string;
	lines: LineV2[];
	/** Per-pair connector visibility (e.g., hide connectors between text and its tightly-stacked gloss row). */
	pairControls?: PairControlV2[];
	/** Per-pair vertical gaps (px); omit a pair to use the default. */
	linePairGaps?: LinePairGapV2[];
	/**
	 * Tokenizer / visual setting overrides applied while the example is loaded.
	 * Token-related fields are reset to defaults first, so customizations from a previous
	 * example never leak across loads.
	 */
	settings?: Partial<VisualSettingsV2>;
	connections: ExampleConnection[];
}

const inter = (rawText: string, id: string, textSizePx = 36): LineV2 => ({
	id,
	rawText,
	font: { family: 'Inter', source: 'google' },
	textSizePx,
	gapWordPx: DEFAULT_WORD_GAP_PX
});

const noto = (
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

/**
 * Curated, opinionated set of preset alignments shown in the “Load example” dropdown.
 * Each entry is a self-contained project: lines, optional pair controls / gaps / settings,
 * plus the connections to draw between them.
 *
 * Connection ids reference `lineId-tokenIndex` after tokenization with the example’s
 * effective settings (the loader resets token settings to defaults before applying
 * `example.settings`).
 */
export const EXAMPLES: readonly ExampleEntry[] = [
	{
		id: 'simple',
		label: 'Hello world (English ↔ French)',
		lines: [inter('Hello world', 's'), inter('Bonjour le monde', 't')],
		connections: [
			['s-0', 't-0'],
			['s-1', 't-1'],
			['s-1', 't-2']
		]
	},
	{
		// Turkish interlinear: morpheme glosses → IPA → segmented text → free translation.
		// Only `|` splits tokens here so glosses can show a literal hyphen between stem and tag
		// (`garden|-|LOC` → garden, -, LOC) while Turkish/IPA use plain `bahçe|de` / `bahtʃe|de`.
		id: 'glosses',
		label: 'Turkish interlinear (IPA + glosses)',
		lines: [
			inter('child garden|-|LOC play|-|PROG', 'gl', 22),
			noto('tʃodʒuk bahtʃe|de ojnu|joɾ', 'ipa', 'Noto Sans', 26),
			inter('Çocuk bahçe|de oynu|yor', 's', 36),
			inter('The child is+playing in the garden', 't', 30)
		],
		settings: { tokenSplitChars: '|' },
		// Top three rows form one interlinear block: tight vertical spacing, no link lines.
		// The free translation sits at a normal distance below, with full link drawing.
		pairControls: [
			{ upperLineId: 'gl', lowerLineId: 'ipa', showConnectors: false },
			{ upperLineId: 'ipa', lowerLineId: 's', showConnectors: false }
		],
		linePairGaps: [
			{ upperLineId: 'gl', lowerLineId: 'ipa', gapPx: 16 },
			{ upperLineId: 'ipa', lowerLineId: 's', gapPx: 16 }
		],
		connections: [
			// Interlinear: seven gloss tokens vs five IPA/Turkish tokens; hyphen-only gloss
			// tokens have no counterpart in orthography/IPA.
			['gl-0', 'ipa-0'],
			['gl-1', 'ipa-1'],
			['gl-3', 'ipa-2'],
			['gl-4', 'ipa-3'],
			['gl-6', 'ipa-4'],
			['ipa-0', 's-0'],
			['ipa-1', 's-1'],
			['ipa-2', 's-2'],
			['ipa-3', 's-3'],
			['ipa-4', 's-4'],
			// Segmented Turkish ↔ free translation. English uses the default merge char (`+`)
			// so “is playing” is one alignment token while still displaying as two words.
			['s-0', 't-1'], // Çocuk → child
			['s-1', 't-5'], // bahçe → garden
			['s-2', 't-3'], // de → in
			['s-3', 't-2'], // oynu → is+playing
			['s-4', 't-2'] // yor → is+playing
			// `t-0` (The) and `t-4` (the) intentionally unaligned: English-only definiteness.
		]
	},
	{
		// Hebrew → Arabic → English. Two right-to-left scripts compared against an LTR
		// translation. Hebrew writes the preposition bound to the noun (`בבית`); we mark the
		// morpheme boundary with `-` in the editor so it splits under the default tokenizer.
		id: 'rtl',
		label: 'Hebrew + Arabic + English (right-to-left)',
		lines: [
			noto('אני גר ב-בית גדול', 'he', 'Noto Sans Hebrew', 36, true),
			noto('أنا أسكن في بيت كبير', 'ar', 'Noto Sans Arabic', 36, true),
			inter('I live in a big house', 'en', 30)
		],
		connections: [
			// Hebrew (5 tokens after the `-` split) ↔ Arabic (5 tokens). Both put the
			// adjective after the noun, so the rows are parallel — no crossings.
			['he-0', 'ar-0'], // אני ↔ أنا
			['he-1', 'ar-1'], // גר ↔ أسكن
			['he-2', 'ar-2'], // ב ↔ في
			['he-3', 'ar-3'], // בית ↔ بيت
			['he-4', 'ar-4'], // גדול ↔ كبير
			// Arabic ↔ English. Adjective-noun order flips, so the last two links cross.
			['ar-0', 'en-0'], // أنا ↔ I
			['ar-1', 'en-1'], // أسكن ↔ live
			['ar-2', 'en-2'], // في ↔ in
			['ar-3', 'en-5'], // بيت ↔ house  (crossing)
			['ar-4', 'en-4'] //  كبير ↔ big   (crossing)
			// `en-3` (a) intentionally unaligned: Hebrew/Arabic have no indefinite article.
		]
	},
	{
		// Tagalog compounds often contain hyphens that should remain inside a word rather than
		// becoming alignment boundaries. This example disables `-` as a split character while
		// keeping the predicate-initial Tagalog sentence aligned to a natural English translation.
		id: 'tagalog',
		label: 'Tagalog compounds (keep hyphens)',
		lines: [
			noto('Maganda ang bahay-kubo sa tabing-ilog', 'tl', 'Noto Sans', 34),
			inter('The nipa+hut by the river is beautiful', 'en', 30)
		],
		settings: { tokenSplitChars: '.' },
		connections: [
			['tl-0', 'en-6'], // Maganda → beautiful
			['tl-1', 'en-0'], // ang → The
			['tl-2', 'en-1'], // bahay-kubo → nipa+hut
			['tl-3', 'en-2'], // sa → by
			['tl-4', 'en-4'] // tabing-ilog → river
		]
	},
	{
		// Japanese (SOV) ↔ Chinese (SVO) ↔ English (SVO). Putting two related East-Asian
		// languages side by side highlights how the verb travels in alignment, while CJK
		// scripts share most content morphemes (今日/今天, 本/书, 読/读).
		// Word boundaries are inserted with spaces because neither script uses them
		// natively — the alignment tool needs explicit token boundaries to draw links.
		id: 'cjk',
		label: 'Japanese + Chinese + English (SOV ↔ SVO)',
		lines: [
			noto('今日 私は 本を 読みました', 'ja', 'Noto Sans JP', 34),
			noto('今天 我 读了 书', 'zh', 'Noto Sans SC', 34),
			inter('Today I read a book', 'en', 30)
		],
		connections: [
			// Japanese ↔ Chinese: the object precedes the verb in Japanese (本を 読みました)
			// but follows it in Chinese (读了 书) — the swap shows up as a clean crossing.
			['ja-0', 'zh-0'], // 今日 ↔ 今天
			['ja-1', 'zh-1'], // 私は ↔ 我
			['ja-2', 'zh-3'], // 本を ↔ 书   (crossing)
			['ja-3', 'zh-2'], // 読みました ↔ 读了 (crossing)
			// Chinese ↔ English: parallel SVO. English “a” has no Chinese counterpart.
			['zh-0', 'en-0'], // 今天 ↔ Today
			['zh-1', 'en-1'], // 我 ↔ I
			['zh-2', 'en-2'], // 读了 ↔ read
			['zh-3', 'en-4'] //  书 ↔ book
		]
	}
] as const;

export function findExample(id: ExampleId): ExampleEntry {
	const hit = EXAMPLES.find((e) => e.id === id);
	if (!hit) throw new Error(`Unknown example id: ${id}`);
	return hit;
}
