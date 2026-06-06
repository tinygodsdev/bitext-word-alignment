import type { GalleryExampleEntry } from '../types-gallery.js';

export const CORE_GALLERY: GalleryExampleEntry[] = [
	{
		slug: 'english-french-word-alignment',
		exampleId: 'simple',
		title: 'English and French word alignment',
		description:
			'See how “Hello world” maps to “Bonjour le monde” word by word — a simple bilingual alignment diagram for learners and teachers.',
		body: `This example shows the most common use case: two parallel sentences where most words have a clear one-to-one match. “Hello” aligns with “Bonjour”, and “world” with “le monde” — including the case where one English word corresponds to two French tokens.\n\nUse it as a template for classroom handouts, blog posts, or quick vocabulary notes. Open it in the editor to change the languages, add a gloss line, or export PNG or SVG.`,
		imageAlt:
			'Word alignment diagram linking Hello world to Bonjour le monde with colored connectors between matching words'
	},
	{
		slug: 'turkish-interlinear-gloss-ipa',
		exampleId: 'glosses',
		title: 'Turkish interlinear gloss with IPA',
		description:
			'Four-line interlinear layout: morpheme glosses, IPA, Turkish text, and English translation — with tight spacing between gloss rows.',
		body: `Linguists often stack glosses, phonetic transcription, source text, and a free translation. Here the Turkish sentence “The child is playing in the garden” is broken into morphemes with pipe characters, paired with IPA and an English line below.\n\nConnectors are hidden between the top three rows so the interlinear block reads as one unit; links appear only between Turkish and English. This pattern works well for field notes, grammar sketches, and conlang documentation.`,
		imageAlt:
			'Turkish interlinear example with glosses, IPA, Turkish tokens, and English translation linked by curved connectors'
	},
	{
		slug: 'hebrew-arabic-english-rtl',
		exampleId: 'rtl',
		title: 'Hebrew and Arabic with English (RTL scripts)',
		description:
			'Compare two right-to-left languages against English — bound prepositions, parallel adjective placement, and crossing links when word order differs.',
		body: `Hebrew and Arabic both write right to left. This alignment places Hebrew above Arabic and English below, so you can see how bound prepositions (Hebrew ב- inside בבית) and free prepositions (Arabic في) line up with English “in”.\n\nWhen Arabic and English disagree on adjective–noun order, the last two connectors cross — a visual cue that is easy to miss in plain text. Enable RTL per line in the editor when you work with Hebrew, Arabic, or other RTL scripts.`,
		imageAlt:
			'Right-to-left Hebrew and Arabic lines aligned to English with word links across three rows'
	},
	{
		slug: 'tagalog-compound-word-alignment',
		exampleId: 'tagalog',
		title: 'Tagalog compounds and hyphenated words',
		description:
			'Keep hyphens inside Tagalog compounds (bahay-kubo, tabing-ilog) instead of splitting them at every dash — a tokenizer override demo.',
		body: `Hyphens often join parts of a single word in Tagalog. If your split characters include “-”, bahay-kubo becomes three tokens and alignment breaks. This example turns off hyphen splitting while keeping other defaults, so compounds stay intact.\n\nThe English line uses the join character “+” for “nipa+hut” where two English words represent one Tagalog compound. Adjust split and join rules under Settings → Tokens for your language pair.`,
		imageAlt:
			'Tagalog sentence with hyphenated compounds aligned to English, showing compound tokens kept together'
	},
	{
		slug: 'japanese-chinese-english-word-order',
		exampleId: 'cjk',
		title: 'Japanese, Chinese, and English word order',
		description:
			'Three-line alignment across Japanese (SOV), Chinese (SVO), and English — including crossing links when the verb and object swap.',
		body: `Japanese and Chinese share many cognate morphemes but different syntax. Japanese places the object before the verb; Chinese and English follow SVO. This three-row diagram makes crossings visible: 本を/読みました vs 读了/书.\n\nSpaces mark word boundaries in the CJK lines because neither script uses spaces in normal writing. Add gloss or IPA rows in the editor, or export the diagram for handouts comparing East Asian word order.`,
		imageAlt:
			'Japanese, Chinese, and English alignment showing SOV vs SVO word order with crossing connectors'
	}
];
