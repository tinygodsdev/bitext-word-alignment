import type { GalleryExampleEntry } from '../types-gallery.js';

const WIKI =
	'Illustrative layout based on an example in the Wikipedia article “Interlinear gloss” (Leipzig-style conventions). Open in the editor to adapt lines, export PNG/SVG, or add IPA.';

/** Gallery pages for Wikipedia “Interlinear gloss” article examples. */
export const WIKIPEDIA_GALLERY: GalleryExampleEntry[] = [
	{
		slug: 'classical-nahuatl-interlinear-gloss',
		exampleId: 'wiki-nahuatl',
		title: 'Classical Nahuatl interlinear gloss (word-by-word)',
		description:
			'Vertical interlinear text for Nahuatl: segmented verb morphology (ni-, c-, chihui, -lia) aligned to English “I made my son a house”.',
		body: `Languages: Classical Nahuatl → English. Shows the classic Humboldt-style vertical gloss where each morpheme in ni-c-chihui-lia in no-piltzin ce calli sits above an English word or phrase.\n\nWhat it demonstrates: applicative -lia, possessive no-, and how object-language morpheme order differs from English syntax. Useful for Uto-Aztecan fieldwork handouts and typology classes.\n\n${WIKI}`,
		imageAlt:
			'Nahuatl morpheme segmentation aligned to English gloss words for I made my son a house'
	},
	{
		slug: 'nahuatl-leipzig-glossing-abbreviations',
		exampleId: 'wiki-nahuatl-lgr',
		title: 'Nahuatl with Leipzig Glossing Rules abbreviations',
		description:
			'Same Nahuatl clause with grammatical category labels (1SG.SUBJ, 3SG.OBJ, APPL) instead of full English gloss words.',
		body: `Languages: Classical Nahuatl → English translation. The middle line uses standard Leipzig abbreviations rather than literal English morpheme translations — the format linguists use in journals and grammars.\n\nWhat it demonstrates: switching from pedagogical glosses to LGR-style tags while keeping morpheme boundaries hyphen-aligned. Helpful for authors preparing interlinear text for publication.\n\n${WIKI}`,
		imageAlt:
			'Nahuatl example with Leipzig glossing abbreviations 1SG SUBJ and APPL aligned to English'
	},
	{
		slug: 'taiwanese-minnan-interlinear-gloss',
		exampleId: 'wiki-taiwanese-minnan',
		title: 'Taiwanese Minnan interlinear gloss',
		description:
			'Southern Min (Taiwanese) sentence with morpheme glosses and English: “I have not yet decided when I shall return”.',
		body: `Languages: Taiwanese Minnan (Hokkien, POJ romanization) → English. Based on the multi-line example in Wikipedia citing Ko & Tan’s beginner vocabulary — here condensed to gloss, source, and translation rows.\n\nWhat it demonstrates: tone-marked compounds (iáu-boē, koat-tēng), left-aligned word glosses, and a free translation that does not match source word order one-to-one.\n\n${WIKI}`,
		imageAlt:
			'Taiwanese Minnan sentence with interlinear English glosses for decide and return'
	},
	{
		slug: 'lezgian-morpheme-gloss',
		exampleId: 'wiki-lezgian',
		title: 'Lezgian morpheme-by-morpheme interlinear gloss',
		description:
			'Lezgian (Northeast Caucasian) farm sentence — hyphen-aligned morphemes, OBL/GEN case tags, and FUT/NEG inflection.',
		body: `Languages: Lezgian → English. The Wikipedia example Gila abur-u-n ferma hamišaluǧ güǧüna amuqʼ-da-č illustrates the Leipzig rule that gloss lines must contain the same number of hyphens as the object line.\n\nWhat it demonstrates: ergative/absolutive-style case stacking on nouns, verb future + negation as separate morphemes, and a long free translation (“Now their farm will not stay behind forever”).\n\n${WIKI}`,
		imageAlt:
			'Lezgian interlinear gloss with OBL GEN case markers and English translation'
	},
	{
		slug: 'turkish-infinitive-gloss-come-out',
		exampleId: 'wiki-turkish-infinitive',
		title: 'Turkish infinitive gloss (one-to-many correspondence)',
		description:
			'Turkish çık-mak with gloss come.out-INF — one morpheme glossed as two English words using Leipzig period notation.',
		body: `Languages: Turkish → English. The verb çık-mak is a single token split into stem çık and infinitive -mak; the gloss come.out-INF uses a period to show one-to-many correspondence (standard Leipzig convention).\n\nWhat it demonstrates: minimal two-line interlinear for dictionary-style entries and how Aligner links one object token to multiple translation words.\n\n${WIKI}`,
		imageAlt: 'Turkish infinitive çık-mak aligned to English gloss come out INF'
	},
	{
		slug: 'latin-zero-morpheme-gloss',
		exampleId: 'wiki-latin-null',
		title: 'Latin interlinear gloss with zero morpheme (ø)',
		description:
			'puer-ø glossed as boy-NOM — overt ø marks a null nominative case exponent in the object line.',
		body: `Languages: Latin → English. When a morpheme has no surface form but appears in the gloss, Leipzig conventions use an overt ø in the object text (puer-ø).\n\nWhat it demonstrates: non-overt category marking in interlinear layouts — common in Latin, Greek, and pro-drop languages when case is null on certain noun classes.\n\n${WIKI}`,
		imageAlt: 'Latin puer with zero morpheme aligned to NOM gloss boy'
	},
	{
		slug: 'tagalog-reduplication-interlinear',
		exampleId: 'wiki-tagalog-reduplication',
		title: 'Tagalog reduplication in interlinear gloss (~)',
		description:
			'Tagalog bi~bili glossed IPFV~buy — reduplication marked with tilde per Leipzig Glossing Rules.',
		body: `Languages: Tagalog → English. Reduplication for imperfective aspect is written bi~bili with a tilde connecting the copied syllable to the stem, mirrored in the gloss IPFV~buy.\n\nWhat it demonstrates: aspectual reduplication (distinct from the compound-hyphen Tagalog example elsewhere in this gallery). Useful for Austronesian morphology teaching.\n\n${WIKI}`,
		imageAlt: 'Tagalog reduplicated verb bi~bili with IPFV gloss and English is buying'
	},
	{
		slug: 'turkish-ablative-interlinear-gloss',
		exampleId: 'wiki-turkish-ablatives',
		title: 'Turkish case and verb morphology (Odadan hızlı çıktım)',
		description:
			'Turkish “I left the room quickly” — ablative -dan, comitative -lı, and past 1sg -tım aligned to English.',
		body: `Languages: Turkish → English. Wikipedia’s Odadan hızlı çıktım example shows morpheme-aligned glosses for case (ABL, COM) and verbal inflection (PFV, 1sg) on a single clause.\n\nWhat it demonstrates: agglutinative word structure and how English reorders “room”, “quickly”, and “left” relative to Turkish oda-dan hız-lı çık-tı-m.\n\n${WIKI}`,
		imageAlt:
			'Turkish sentence with ABL and COM case glosses aligned to I left the room quickly'
	},
	{
		slug: 'french-clitic-pronoun-gloss',
		exampleId: 'wiki-french-clitics',
		title: 'French clitic pronouns in interlinear gloss (Je t’aime)',
		description:
			'French Je t’aime with morpheme gloss I you love — clitic pronoun t’ aligned separately from the verb.',
		body: `Languages: French → English. Clitics are often separated with a double hyphen in Leipzig notation; here t’ is its own token between Je and aime.\n\nWhat it demonstrates: proclitic object pronouns and crossing links when English “I love you” reorder clitic and verb relative to French.\n\n${WIKI}`,
		imageAlt: 'French Je t aime with clitic gloss you aligned to English I love you'
	},
	{
		slug: 'tagalog-verbal-aspect-paradigm',
		exampleId: 'wiki-tagalog-aspects',
		title: 'Tagalog verbal aspect paradigm (interlinear)',
		description:
			'Four Tagalog verb forms — sulat, su~sulat, sumulat, sumusulat — with aspect/mood glosses and English equivalents.',
		body: `Languages: Tagalog → English. Wikipedia’s affixation section uses Tagalog write paradigms to show contemplative reduplication, agent trigger infixes, and combined forms.\n\nWhat it demonstrates: paradigm-style interlinear rows (multiple forms in one diagram) rather than a single sentence — handy for morphology cheat sheets.\n\n${WIKI}`,
		imageAlt:
			'Tagalog verb paradigm sulat sumulat with aspect glosses and English translations'
	},
	{
		slug: 'german-umlaut-plural-gloss',
		exampleId: 'wiki-german-umlaut',
		title: 'German dative plural with umlaut (unsern Vätern)',
		description:
			'German unser-n Väter-n glossed our-DAT.PL father\\PL-DAT.PL — syncretism and umlaut marked in Leipzig style.',
		body: `Languages: German → English. The plural umlaut in Väter is marked with a backslash in the gloss (father\\PL) when the boundary appears in only one line — another Leipzig punctuation rule.\n\nWhat it demonstrates: dative plural on both adjective and noun, and “to our fathers” as a phrasal English gloss.\n\n${WIKI}`,
		imageAlt: 'German dative plural Vätern with DAT PL glosses aligned to to our fathers'
	},
	{
		slug: 'avar-camel-theft-interlinear',
		exampleId: 'wiki-avar-camel',
		title: 'Avar interlinear gloss (Caucasian agreement)',
		description:
			'Avar “We didn’t steal your camel” — ergative agreement, genitive, and negation on a single verb complex.',
		body: `Languages: Avar (Northeast Caucasian) → English. From Wikipedia’s automatic-glossing section: mi-s ħumukuli elu-ab-okʼekʼ-asi anu with rich prefixal agreement and negation.\n\nWhat it demonstrates: how one verb token maps to multiple English words (didn’t steal) and non-linear alignment between translation and morpheme order.\n\n${WIKI}`,
		imageAlt:
			'Avar sentence with ergative agreement glosses aligned to English We did not steal your camel'
	},
	{
		slug: 'lojban-sumti-interlinear-gloss',
		exampleId: 'wiki-lojban',
		title: 'Lojban interlinear gloss with sumti placeholders',
		description:
			'Lojban washing sentence with x1–x4 placeholders — logical language sumti aligned to English.',
		body: `Languages: Lojban → English. mi lumci le creka le grasu le rirxe (“I wash the grease off the shirt in the river”) uses repeated le for nested sumti; glosses mark discourse referents (shirt=x2, grease=x3, river=x4).\n\nWhat it demonstrates: constructed-language interlinear for teaching Lojban place structure and how DET slots differ from English “the”.\n\n${WIKI}`,
		imageAlt:
			'Lojban sentence with sumti placeholder glosses x1 x2 aligned to English wash shirt river'
	},
	{
		slug: 'russian-evening-run-interlinear',
		exampleId: 'wiki-russian-evening',
		title: 'Russian case and gender agreement (evening run)',
		description:
			'Russian “In the evening I ran to the store” — instrumental, feminine past, and accusative in one interlinear block.',
		body: `Languages: Russian (Latin transliteration) → English. Vecher-om ya pobeja-la v magazin from Wikipedia’s paradigm-extraction example shows instrumental time adverb, gendered past -la, and accusative object.\n\nWhat it demonstrates: inflectional morphology on nouns and verbs and a free translation whose word order differs from the gloss line.\n\n${WIKI}`,
		imageAlt:
			'Russian interlinear gloss with INS case and PFV PST FEM aligned to English evening ran store'
	}
];
