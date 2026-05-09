import { DEFAULT_WORD_GAP_PX, type LineV2 } from '$lib/serialization/schema.js';

export type ExampleId = 'simple' | 'transcription' | 'rtl' | 'cjk';

/** Token id pair `[upperLineId-index, lowerLineId-index]` connected after the snapshot loads. */
export type ExampleConnection = readonly [string, string];

export interface ExampleEntry {
	id: ExampleId;
	label: string;
	lines: LineV2[];
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
 * Each entry is a self-contained project: lines + connections to draw between them.
 *
 * Connection ids must reference `lineId-tokenIndex` after whitespace tokenization with the
 * default visual settings; do not rely on user-customized split/merge characters here.
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
		id: 'transcription',
		label: 'Turkish with IPA (3 lines)',
		lines: [
			inter('Merhaba dünya', 's', 34),
			noto('meɾˈhaba dyzˈnja', 'ipa', 'Noto Sans', 28),
			inter('Hello world', 't', 34)
		],
		connections: [
			['s-0', 'ipa-0'],
			['s-1', 'ipa-1'],
			['ipa-0', 't-0'],
			['ipa-1', 't-1']
		]
	},
	{
		id: 'rtl',
		label: 'Hebrew + Arabic + English (RTL, merged ב+בית / في+البيت)',
		lines: [
			// `+` is the default merge character: bound morphemes stay one alignment token but show
			// with a space in the preview (e.g. Hebrew inseparable preposition + noun vs. English
			// “at home” as two words).
			noto('אני אוהב ב+בית', 'he', 'Noto Sans Hebrew', 34, true),
			noto('أنا أحب في+البيت', 'ar', 'Noto Sans Arabic', 34, true),
			inter('I love at home', 'en', 32)
		],
		connections: [
			['he-0', 'ar-0'],
			['he-1', 'ar-1'],
			['he-2', 'ar-2'],
			['ar-0', 'en-0'],
			['ar-1', 'en-1'],
			['ar-2', 'en-2'],
			['ar-2', 'en-3']
		]
	},
	{
		id: 'cjk',
		label: 'Japanese + Chinese + English',
		lines: [
			// Word/phrase boundaries marked with spaces — CJK scripts have no native word
			// separators, and an alignment tool needs explicit token boundaries to draw links.
			// Horizontal Japanese and Chinese are laid out LTR here (standard typography).
			noto('私は 本を 読む', 'ja', 'Noto Sans JP', 34),
			noto('我 读 书', 'zh', 'Noto Sans SC', 34),
			inter('I read books', 'en', 32)
		],
		// Japanese is SOV (verb last) while Chinese/English are SVO — verb/object swap shows
		// up as crossing connectors between the Japanese and Chinese rows.
		connections: [
			['ja-0', 'zh-0'],
			['ja-1', 'zh-2'],
			['ja-2', 'zh-1'],
			['zh-0', 'en-0'],
			['zh-1', 'en-1'],
			['zh-2', 'en-2']
		]
	}
] as const;

export function findExample(id: ExampleId): ExampleEntry {
	const hit = EXAMPLES.find((e) => e.id === id);
	if (!hit) throw new Error(`Unknown example id: ${id}`);
	return hit;
}
