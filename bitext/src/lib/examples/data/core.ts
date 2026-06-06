import type { ExampleEntry } from '../types.js';
import { inter, noto } from './helpers.js';

/** Original editor presets (not from Wikipedia). */
export const CORE_EXAMPLES: ExampleEntry[] = [
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
		id: 'glosses',
		label: 'Turkish interlinear (IPA + glosses)',
		lines: [
			inter('child garden|-|LOC play|-|PROG', 'gl', 22),
			noto('tʃodʒuk bahtʃe|de ojnu|joɾ', 'ipa', 'Noto Sans', 26),
			inter('Çocuk bahçe|de oynu|yor', 's', 36),
			inter('The child is+playing in the garden', 't', 30)
		],
		settings: { tokenSplitChars: '|' },
		pairControls: [
			{ upperLineId: 'gl', lowerLineId: 'ipa', showConnectors: false },
			{ upperLineId: 'ipa', lowerLineId: 's', showConnectors: false }
		],
		linePairGaps: [
			{ upperLineId: 'gl', lowerLineId: 'ipa', gapPx: 16 },
			{ upperLineId: 'ipa', lowerLineId: 's', gapPx: 16 }
		],
		connections: [
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
			['s-0', 't-1'],
			['s-1', 't-5'],
			['s-2', 't-3'],
			['s-3', 't-2'],
			['s-4', 't-2']
		]
	},
	{
		id: 'rtl',
		label: 'Hebrew + Arabic + English (right-to-left)',
		lines: [
			noto('אני גר ב-בית גדול', 'he', 'Noto Sans Hebrew', 36, true),
			noto('أنا أسكن في بيت كبير', 'ar', 'Noto Sans Arabic', 36, true),
			inter('I live in a big house', 'en', 30)
		],
		connections: [
			['he-0', 'ar-0'],
			['he-1', 'ar-1'],
			['he-2', 'ar-2'],
			['he-3', 'ar-3'],
			['he-4', 'ar-4'],
			['ar-0', 'en-0'],
			['ar-1', 'en-1'],
			['ar-2', 'en-2'],
			['ar-3', 'en-5'],
			['ar-4', 'en-4']
		]
	},
	{
		id: 'tagalog',
		label: 'Tagalog compounds (keep hyphens)',
		lines: [
			noto('Maganda ang bahay-kubo sa tabing-ilog', 'tl', 'Noto Sans', 34),
			inter('The nipa+hut by the river is beautiful', 'en', 30)
		],
		settings: { tokenSplitChars: '.' },
		connections: [
			['tl-0', 'en-6'],
			['tl-1', 'en-0'],
			['tl-2', 'en-1'],
			['tl-3', 'en-2'],
			['tl-4', 'en-4']
		]
	},
	{
		id: 'cjk',
		label: 'Japanese + Chinese + English (SOV ↔ SVO)',
		lines: [
			noto('今日 私は 本を 読みました', 'ja', 'Noto Sans JP', 34),
			noto('今天 我 读了 书', 'zh', 'Noto Sans SC', 34),
			inter('Today I read a book', 'en', 30)
		],
		connections: [
			['ja-0', 'zh-0'],
			['ja-1', 'zh-1'],
			['ja-2', 'zh-3'],
			['ja-3', 'zh-2'],
			['zh-0', 'en-0'],
			['zh-1', 'en-1'],
			['zh-2', 'en-2'],
			['zh-3', 'en-4']
		]
	}
];
