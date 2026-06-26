import type { GalleryExampleEntry, GallerySourceAttribution } from '../types-gallery.js';

/** @see https://en.wikipedia.org/wiki/Interlinear_gloss */
export const WIKIPEDIA_INTERLINEAR_GLOSS_SOURCE = {
	url: 'https://en.wikipedia.org/wiki/Interlinear_gloss',
	title: 'Interlinear gloss'
} satisfies GallerySourceAttribution;

/** Gallery pages for Wikipedia “Interlinear gloss” article examples. */
const WIKIPEDIA_GALLERY_ENTRIES = [
	{
		slug: 'classical-nahuatl-interlinear-gloss',
		exampleId: 'wiki-nahuatl',
		title: 'Classical Nahuatl interlinear gloss (word-by-word)',
		description:
			'Vertical interlinear text for Nahuatl: segmented verb morphology (ni-, c-, chihui, -lia) aligned to English “I made my son a house”.',
		body: `Languages: Classical Nahuatl → English. Shows the classic Humboldt-style vertical gloss where each morpheme in ni-c-chihui-lia in no-piltzin ce calli sits above an English word or phrase.\n\nWhat it demonstrates: applicative -lia, possessive no-, and how object-language morpheme order differs from English syntax. Useful for Uto-Aztecan fieldwork handouts and typology classes.`,
		imageAlt:
			'Nahuatl morpheme segmentation aligned to English gloss words for I made my son a house',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Classical Nahuatl builds a verb from several stacked morphemes, and this example lines each one up against English “I made my son a house”. The clause ni-c-chihui-lia in no-piltzin ce calli reads piece by piece, so you can see where one Nahuatl word holds what English spreads across a whole phrase.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'The verb, morpheme by morpheme',
				blocks: [
					{
						kind: 'gloss',
						lead: 'The single verb word ni-c-chihui-lia carries the subject, the object, the action, and a beneficiary:',
						rows: [
							{
								token: 'ni-',
								gloss: '1SG.SUBJ',
								note: 'First-person singular subject, “I”, as a prefix on the verb.'
							},
							{
								token: 'c-',
								gloss: '3SG.OBJ',
								note: 'Third-person singular object marker.'
							},
							{ token: 'chihui', gloss: 'make', note: 'The verb stem, “make” or “do”.' },
							{
								token: '-lia',
								gloss: 'APPL',
								note: 'The applicative suffix, which adds a beneficiary to the verb, here “my son”.'
							}
						]
					},
					{
						kind: 'paragraph',
						text: 'The rest of the clause, no-piltzin (my son) and ce calli (a house), supplies the people and things the verb points to. no- is a possessive prefix meaning “my”.'
					}
				]
			},
			{
				id: 'phenomenon',
				heading: 'Why the alignment looks uneven',
				blocks: [
					{
						kind: 'paragraph',
						text: 'English needs a separate word for the subject, the verb, and each object, while Nahuatl folds the subject, object, and a beneficiary into one verb. So a single Nahuatl box links to several English words, and the morpheme order inside the verb does not follow English word order. The vertical layout keeps each morpheme directly above its gloss.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Glossing conventions used here',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Each morpheme is split with a hyphen and labeled either with a plain English word or with a Leipzig category tag such as APPL for the applicative. A period inside a tag, as in 1SG.SUBJ, joins several grammatical meanings that share one form.'
					},
					{
						kind: 'links',
						lead: 'For the category labels:',
						items: [
							{
								href: '/guide/glossing-abbreviations',
								label: 'glossing abbreviations cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example, set the morpheme boundary character under Settings → Tokens, and add a free-translation line if you want a smoother English rendering below the gloss. Export the diagram as PNG, SVG, or PDF for a fieldwork handout or a typology class.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related examples:',
						items: [
							{
								href: '/examples/nahuatl-leipzig-glossing-abbreviations',
								label: 'Nahuatl with Leipzig abbreviations',
								text: ' shows the same clause written in journal style.'
							},
							{
								href: '/examples/avar-camel-theft-interlinear',
								label: 'Avar interlinear gloss',
								text: ' shows another verb that maps to several English words.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'nahuatl-leipzig-glossing-abbreviations',
		exampleId: 'wiki-nahuatl-lgr',
		title: 'Nahuatl with Leipzig Glossing Rules abbreviations',
		description:
			'Same Nahuatl clause with grammatical category labels (1SG.SUBJ, 3SG.OBJ, APPL) instead of full English gloss words.',
		body: `Languages: Classical Nahuatl → English translation. The middle line uses standard Leipzig abbreviations rather than literal English morpheme translations — the format linguists use in journals and grammars.\n\nWhat it demonstrates: switching from pedagogical glosses to LGR-style tags while keeping morpheme boundaries hyphen-aligned. Helpful for authors preparing interlinear text for publication.`,
		imageAlt:
			'Nahuatl example with Leipzig glossing abbreviations 1SG SUBJ and APPL aligned to English',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'This is the same Nahuatl clause as the word-by-word version, but the gloss line is written the way grammars and journals write it: with category labels instead of full English words. 1SG.SUBJ stands in for “I”, 3SG.OBJ for the object, and APPL for the applicative. It is the format an author uses when preparing interlinear text for publication.'
					}
				]
			},
			{
				id: 'pedagogical-vs-publication',
				heading: 'Pedagogical gloss or publication gloss',
				blocks: [
					{
						kind: 'paragraph',
						text: 'A teaching gloss writes “make” and “my” so a beginner can read it. A publication gloss writes APPL and POSS, which are compact and unambiguous to a linguist. The morphemes and their boundaries stay the same; only the labels change. Keeping the hyphens aligned means the tag line and the source line have the same number of pieces.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Reading the abbreviations',
				blocks: [
					{
						kind: 'paragraph',
						text: 'A period inside a label, as in 1SG.SUBJ, ties several meanings that one morpheme carries at once. APPL marks the applicative, which adds a beneficiary to the verb. These tags are part of the standard Leipzig set.'
					},
					{
						kind: 'links',
						lead: 'For the full set:',
						items: [
							{
								href: '/guide/glossing-abbreviations',
								label: 'glossing abbreviations cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example and edit the gloss line to switch between teaching labels and journal tags. Tighten the gap between the gloss and the source so the block reads as one unit, then export it as PNG, SVG, or PDF for a paper or a grammar.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related examples:',
						items: [
							{
								href: '/examples/classical-nahuatl-interlinear-gloss',
								label: 'Classical Nahuatl word-by-word',
								text: ' glosses the same clause with plain English words.'
							},
							{
								href: '/examples/turkish-ablative-interlinear-gloss',
								label: 'Turkish case and verb morphology',
								text: ' shows case and person tags on a single clause.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'taiwanese-minnan-interlinear-gloss',
		exampleId: 'wiki-taiwanese-minnan',
		title: 'Taiwanese Minnan interlinear gloss',
		description:
			'Southern Min (Taiwanese) sentence with morpheme glosses and English: “I have not yet decided when I shall return”.',
		body: `Languages: Taiwanese Minnan (Hokkien, POJ romanization) → English. Based on the multi-line example in Wikipedia citing Ko & Tan’s beginner vocabulary — here condensed to gloss, source, and translation rows.\n\nWhat it demonstrates: tone-marked compounds (iáu-boē, koat-tēng), left-aligned word glosses, and a free translation that does not match source word order one-to-one.`,
		imageAlt: 'Taiwanese Minnan sentence with interlinear English glosses for decide and return',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Taiwanese Minnan is written here in POJ romanization, the system that marks tone with diacritics. The sentence means “I have not yet decided when I shall return”, and the layout pairs each Minnan word with a short gloss and a free English line below. The free translation does not run word for word, which is exactly what the alignment makes clear.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'Tone-marked compounds',
				blocks: [
					{
						kind: 'gloss',
						lead: 'Two compounds carry the core meaning, with tone written into the spelling:',
						rows: [
							{
								token: 'iáu-boē',
								gloss: 'not.yet',
								note: 'A compound meaning “not yet”. The accents mark tone, and the hyphen holds the two syllables together as one word.'
							},
							{
								token: 'koat-tēng',
								gloss: 'decide',
								note: 'The verb “decide”, again a two-syllable compound with tone diacritics.'
							}
						]
					}
				]
			},
			{
				id: 'phenomenon',
				heading: 'When the translation reorders',
				blocks: [
					{
						kind: 'paragraph',
						text: 'English wraps the idea in “when I shall return”, a clause that sits in a different place from the Minnan words it translates. So the gloss line stays close to the source order while the free translation reads naturally, and the two do not line up token for token. Aligning them shows which English words answer to which Minnan words despite the reordering.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Glossing conventions used here',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Each gloss sits left-aligned under its word, and a period inside a gloss such as not.yet joins two English words that translate one Minnan unit. The hyphen keeps a tone-marked compound together as a single token.'
					},
					{
						kind: 'links',
						lead: 'For the gloss labels:',
						items: [
							{
								href: '/guide/glossing-abbreviations',
								label: 'glossing abbreviations cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example, keep hyphen out of the split characters under Settings → Tokens so the compounds stay whole, and add an IPA line if you want a phonetic row alongside the romanization. Export the result as PNG, SVG, or PDF.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related examples:',
						items: [
							{
								href: '/examples/japanese-chinese-english-word-order',
								label: 'Japanese, Chinese, and English word order',
								text: ' compares East Asian word order in three rows.'
							},
							{
								href: '/examples/tagalog-compound-word-alignment',
								label: 'Tagalog compounds',
								text: ' keeps hyphenated words together with the tokenizer.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'lezgian-morpheme-gloss',
		exampleId: 'wiki-lezgian',
		title: 'Lezgian morpheme-by-morpheme interlinear gloss',
		description:
			'Lezgian (Northeast Caucasian) farm sentence: hyphen-aligned morphemes, OBL/GEN case tags, and FUT/NEG inflection.',
		body: `Languages: Lezgian → English. The Wikipedia example Gila abur-u-n ferma hamišaluǧ güǧüna amuqʼ-da-č illustrates the Leipzig rule that gloss lines must contain the same number of hyphens as the object line.\n\nWhat it demonstrates: ergative/absolutive-style case stacking on nouns, verb future + negation as separate morphemes, and a long free translation (“Now their farm will not stay behind forever”).`,
		imageAlt: 'Lezgian interlinear gloss with OBL GEN case markers and English translation',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'This Lezgian sentence means “Now their farm will not stay behind forever”. Lezgian is a Northeast Caucasian language that stacks case endings on nouns and builds the future and negation as separate pieces on the verb. The clause Gila abur-u-n ferma hamišaluǧ güǧüna amuqʼ-da-č is glossed morpheme by morpheme to keep each piece visible.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'Case stacking and verb pieces',
				blocks: [
					{
						kind: 'gloss',
						lead: 'Two words carry several morphemes each:',
						rows: [
							{
								token: 'abur-u-n',
								gloss: 'them-OBL-GEN',
								note: 'A pronoun with an oblique stem and a genitive ending, “their”. The case markers stack one after another.'
							},
							{
								token: 'amuqʼ-da-č',
								gloss: 'stay-FUT-NEG',
								note: 'The verb stem “stay”, the future suffix, and the negation suffix, three morphemes in one word.'
							}
						]
					}
				]
			},
			{
				id: 'phenomenon',
				heading: 'The matching-hyphen rule',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Leipzig conventions require the gloss line to have the same number of hyphens as the word above it, so abur-u-n with two hyphens is glossed them-OBL-GEN with two hyphens. The rule keeps each morpheme directly tied to its label, which matters when one word holds three or four pieces. The diagram lines them up so the counts are easy to check.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Glossing conventions used here',
				blocks: [
					{
						kind: 'paragraph',
						text: 'OBL marks an oblique stem, GEN a genitive, FUT the future, and NEG negation. Each is a separate morpheme with its own hyphen, the format used for languages with rich case and verb morphology.'
					},
					{
						kind: 'links',
						lead: 'For the case and tense labels:',
						items: [
							{
								href: '/guide/glossing-abbreviations',
								label: 'glossing abbreviations cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example, set the morpheme boundary character under Settings → Tokens, and upload a custom font if your transcription uses characters a default font lacks. Export the diagram as PNG, SVG, or PDF for a grammar or a handout.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related examples:',
						items: [
							{
								href: '/examples/turkish-ablative-interlinear-gloss',
								label: 'Turkish case and verb morphology',
								text: ' shows case and person suffixes on one clause.'
							},
							{
								href: '/examples/avar-camel-theft-interlinear',
								label: 'Avar interlinear gloss',
								text: ' shows agreement and negation in another Caucasian language.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'turkish-infinitive-gloss-come-out',
		exampleId: 'wiki-turkish-infinitive',
		title: 'Turkish infinitive gloss (one-to-many correspondence)',
		description:
			'Turkish çık-mak with gloss come.out-INF: one morpheme glossed as two English words using Leipzig period notation.',
		body: `Languages: Turkish → English. The verb çık-mak is a single token split into stem çık and infinitive -mak; the gloss come.out-INF uses a period to show one-to-many correspondence (standard Leipzig convention).\n\nWhat it demonstrates: minimal two-line interlinear for dictionary-style entries and how Aligner links one object token to multiple translation words.`,
		imageAlt: 'Turkish infinitive çık-mak aligned to English gloss come out INF',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'A single Turkish verb, çık-mak, glosses as two English words plus a tag: come.out-INF. This is the smallest interlinear case, two lines and one word, and it is the clearest place to see how one source morpheme can answer to several words in the translation. It reads like a dictionary entry.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'One stem, one suffix',
				blocks: [
					{
						kind: 'gloss',
						lead: 'The word splits into a stem and an infinitive ending:',
						rows: [
							{
								token: 'çık',
								gloss: 'come.out',
								note: 'The verb stem. English has no single word for it, so two words joined by a period stand in: come.out.'
							},
							{
								token: '-mak',
								gloss: 'INF',
								note: 'The infinitive suffix, glossed with the tag INF rather than a word.'
							}
						]
					}
				]
			},
			{
				id: 'phenomenon',
				heading: 'The period for one-to-many',
				blocks: [
					{
						kind: 'paragraph',
						text: 'When one source morpheme needs more than one English word, Leipzig conventions join those words with a period instead of a space, so come.out reads as a single gloss for a single morpheme. Writing it as two separate words would suggest two morphemes, which would break the matching count. The period keeps one piece on each side.'
					},
					{
						kind: 'links',
						lead: 'More on this mark and the others:',
						items: [
							{
								href: '/guide/glossing-abbreviations#notation',
								label: 'notation marks on the cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example and reuse it as a template for dictionary-style entries: one source word, one gloss line. Set the morpheme boundary character under Settings → Tokens to split a stem from its suffix, then export the entry as PNG, SVG, or PDF.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related examples:',
						items: [
							{
								href: '/examples/turkish-ablative-interlinear-gloss',
								label: 'Turkish case and verb morphology',
								text: ' shows a fuller clause with case and person.'
							},
							{
								href: '/examples/avar-camel-theft-interlinear',
								label: 'Avar interlinear gloss',
								text: ' shows one verb mapping to several English words.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'latin-zero-morpheme-gloss',
		exampleId: 'wiki-latin-null',
		title: 'Latin interlinear gloss with zero morpheme (ø)',
		description:
			'puer-ø glossed as boy-NOM: an overt ø marks a null nominative case exponent in the object line.',
		body: `Languages: Latin → English. When a morpheme has no surface form but appears in the gloss, Leipzig conventions use an overt ø in the object text (puer-ø).\n\nWhat it demonstrates: non-overt category marking in interlinear layouts — common in Latin, Greek, and pro-drop languages when case is null on certain noun classes.`,
		imageAlt: 'Latin puer with zero morpheme aligned to NOM gloss boy',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Latin puer means “boy”, and it is in the nominative case even though no ending is pronounced. To show that the case is there but silent, the source line writes an overt ø: puer-ø, glossed boy-NOM. The example is a small but precise case of marking something that has meaning but no sound.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'A case with no sound',
				blocks: [
					{
						kind: 'gloss',
						lead: 'The noun and its silent case ending:',
						rows: [
							{
								token: 'puer',
								gloss: 'boy',
								note: 'The noun stem, “boy”.'
							},
							{
								token: '-ø',
								gloss: 'NOM',
								note: 'The nominative case, present in the grammar but with no audible ending. The ø stands in for the missing form.'
							}
						]
					}
				]
			},
			{
				id: 'phenomenon',
				heading: 'Why mark a zero',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Some noun classes in Latin, Greek, and other languages mark a case by the absence of an ending rather than a visible suffix. Writing puer-ø with an overt ø keeps the gloss honest: the boy is a subject in the nominative, and the layout shows that even though nothing is pronounced. The matching hyphen count holds, one piece on each side.'
					},
					{
						kind: 'links',
						lead: 'More on the ø mark and the others:',
						items: [
							{
								href: '/guide/glossing-abbreviations#notation',
								label: 'notation marks on the cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example and type the ø directly in the source line where a case is silent. Set the morpheme boundary character under Settings → Tokens so the stem and the zero split cleanly, then export the diagram as PNG, SVG, or PDF.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related examples:',
						items: [
							{
								href: '/examples/german-umlaut-plural-gloss',
								label: 'German umlaut plural',
								text: ' marks a category shown inside the word rather than by a separate ending.'
							},
							{
								href: '/examples/lezgian-morpheme-gloss',
								label: 'Lezgian morpheme gloss',
								text: ' shows visible case stacking for contrast.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'tagalog-reduplication-interlinear',
		exampleId: 'wiki-tagalog-reduplication',
		title: 'Tagalog reduplication in interlinear gloss (~)',
		description:
			'Tagalog bi~bili glossed IPFV~buy: reduplication marked with a tilde per the Leipzig Glossing Rules.',
		body: `Languages: Tagalog → English. Reduplication for imperfective aspect is written bi~bili with a tilde connecting the copied syllable to the stem, mirrored in the gloss IPFV~buy.\n\nWhat it demonstrates: aspectual reduplication (distinct from the compound-hyphen Tagalog example elsewhere in this gallery). Useful for Austronesian morphology teaching.`,
		imageAlt: 'Tagalog reduplicated verb bi~bili with IPFV gloss and English is buying',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Tagalog can change a verb by copying part of it. To mark imperfective aspect, the first syllable of bili (“buy”) is repeated, giving bi~bili. The gloss mirrors the copy as IPFV~buy. This is a clean example of reduplication, a process common across Austronesian languages.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'A copied syllable',
				blocks: [
					{
						kind: 'gloss',
						lead: 'The verb and its repeated piece:',
						rows: [
							{
								token: 'bi~bili',
								gloss: 'IPFV~buy',
								note: 'The syllable bi is copied from the front of bili. The tilde ties the copy to the stem, and the gloss repeats the tilde to show the same shape: IPFV~buy.'
							}
						]
					}
				]
			},
			{
				id: 'phenomenon',
				heading: 'The tilde for reduplication',
				blocks: [
					{
						kind: 'paragraph',
						text: 'A hyphen would suggest a normal prefix, but a copied syllable is not a separate morpheme with its own meaning, so Leipzig conventions use a tilde instead. Writing bi~bili and IPFV~buy keeps the gloss aligned with the source and signals that the extra material is a copy, not an added word.'
					},
					{
						kind: 'links',
						lead: 'More on the tilde and the other marks:',
						items: [
							{
								href: '/guide/glossing-abbreviations#notation',
								label: 'notation marks on the cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example and type the tilde directly between the copied syllable and the stem. Keep the tilde out of the split characters under Settings → Tokens so the verb stays one box, then export the diagram as PNG, SVG, or PDF for a morphology lesson.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related Tagalog examples:',
						items: [
							{
								href: '/examples/tagalog-verbal-aspect-paradigm',
								label: 'Tagalog verbal aspect paradigm',
								text: ' shows reduplication alongside other verb forms.'
							},
							{
								href: '/examples/tagalog-compound-word-alignment',
								label: 'Tagalog compounds',
								text: ' uses the hyphen for compounds rather than copies.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'turkish-ablative-interlinear-gloss',
		exampleId: 'wiki-turkish-ablatives',
		title: 'Turkish case and verb morphology (Odadan hızlı çıktım)',
		description:
			'Turkish “I left the room quickly”: ablative -dan, comitative -lı, and a first-person past suffix, aligned to English word by word.',
		body: `Languages: Turkish → English. Wikipedia’s Odadan hızlı çıktım example shows morpheme-aligned glosses for case (ABL, COM) and verbal inflection (PFV, 1sg) on a single clause.\n\nWhat it demonstrates: agglutinative word structure and how English reorders “room”, “quickly”, and “left” relative to Turkish oda-dan hız-lı çık-tı-m.`,
		imageAlt: 'Turkish sentence with ABL and COM case glosses aligned to I left the room quickly',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Turkish builds a whole clause by gluing suffixes onto a few stems. The sentence Odadan hızlı çıktım means “I left the room quickly”, and every grammatical detail rides on a suffix rather than a separate word. Lined up against English, the alignment shows where one language uses a suffix and the other a full word.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'The sentence, token by token',
				blocks: [
					{
						kind: 'gloss',
						lead: 'Three Turkish words carry what English spreads across five. Each token with its gloss:',
						rows: [
							{
								token: 'Oda-dan',
								gloss: 'room-ABL',
								note: 'The ablative suffix -dan means “from”, so “from the room”. English folds that into the verb “left”.'
							},
							{
								token: 'hız-lı',
								gloss: 'speed-COM',
								note: 'The suffix -lı turns “speed” into “with speed”, which English renders as the adverb “quickly”.'
							},
							{
								token: 'çık-tı-m',
								gloss: 'exit-PFV-1SG',
								note: 'One token holds the verb stem, the completed-action aspect, and the first-person subject. English needs two words, “I left”.'
							}
						]
					}
				]
			},
			{
				id: 'why-cross',
				heading: 'Why the connectors cross',
				blocks: [
					{
						kind: 'paragraph',
						text: 'English puts the subject and verb first: “I left the room quickly.” Turkish keeps the verb last and packs case and person into suffixes. The link from oda-dan runs to “room” in the middle of the English line, while the link from çık-tı-m runs back to “I left” at the start, so the two connectors cross. In flat text that reordering is easy to miss; the diagram makes it visible at a glance.'
					}
				]
			},
			{
				id: 'agglutination',
				heading: 'Agglutination in one clause',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Turkish is agglutinative: one suffix carries one meaning, and the suffixes stack in a fixed order. çık-tı-m reads as stem, then aspect, then person, left to right. English splits the same information into separate words and word order. A single Turkish column of stacked suffixes faces three English positions.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Glossing conventions used here',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Each suffix gets its own hyphen-aligned gloss, so the source line and the gloss line carry the same number of hyphens. The labels ABL, COM, PFV, and 1SG are standard Leipzig tags for ablative case, comitative, perfective aspect, and first-person singular.'
					},
					{
						kind: 'links',
						lead: 'For the full set of these labels:',
						items: [
							{
								href: '/guide/glossing-abbreviations',
								label: 'glossing abbreviations cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example in the editor, then add an IPA line above the Turkish or a free-translation line below. To keep a suffix attached while you experiment, set the morpheme boundary character under Settings → Tokens. Export the finished diagram as PNG, SVG, or PDF for a handout or slide.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related phenomena in other examples:',
						items: [
							{
								href: '/examples/turkish-infinitive-gloss-come-out',
								label: 'Turkish infinitive gloss',
								text: ' shows one token glossed as two English words with a period.'
							},
							{
								href: '/examples/lezgian-morpheme-gloss',
								label: 'Lezgian morpheme gloss',
								text: ' shows case stacking and the rule that hyphen counts must match.'
							},
							{
								href: '/examples/russian-evening-run-interlinear',
								label: 'Russian case and gender agreement',
								text: ' shows instrumental and accusative with a gendered past tense.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'french-clitic-pronoun-gloss',
		exampleId: 'wiki-french-clitics',
		title: 'French clitic pronouns in interlinear gloss (Je t’aime)',
		description:
			'French Je t’aime with morpheme gloss I you love: the clitic pronoun t’ is aligned separately from the verb.',
		body: `Languages: French → English. Clitics are often separated with a double hyphen in Leipzig notation; here t’ is its own token between Je and aime.\n\nWhat it demonstrates: proclitic object pronouns and crossing links when English “I love you” reorder clitic and verb relative to French.`,
		imageAlt: 'French Je t aime with clitic gloss you aligned to English I love you',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'French Je t’aime means “I love you”, but the object pronoun sits before the verb, not after it. The object t’ is a clitic, a small word that leans on the verb. Aligned against English, the example shows the clitic getting its own box and the links crossing where the two languages disagree on order.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'Three tokens, reordered',
				blocks: [
					{
						kind: 'gloss',
						lead: 'Each French token and its English match:',
						rows: [
							{
								token: 'Je',
								gloss: 'I',
								note: 'The subject pronoun, matching English “I”.'
							},
							{
								token: 't’',
								gloss: 'you',
								note: 'The object pronoun, a clitic placed before the verb. In English “you” comes after the verb.'
							},
							{
								token: 'aime',
								gloss: 'love',
								note: 'The verb “love”.'
							}
						]
					}
				]
			},
			{
				id: 'why-cross',
				heading: 'Why the connectors cross',
				blocks: [
					{
						kind: 'paragraph',
						text: 'French orders the words subject, object, verb, while English orders them subject, verb, object. So t’ links to “you” at the end of the English line and aime links to “love” in the middle, and those two links cross. The crossing is the visual sign that the object and verb swap places between the languages.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Glossing conventions used here',
				blocks: [
					{
						kind: 'paragraph',
						text: 'A clitic is set off as its own token, and in some glossing styles it is joined to its host with a double hyphen or an equals sign rather than a plain space. Keeping t’ separate lets it link to its own English word and makes the reordering visible.'
					},
					{
						kind: 'links',
						lead: 'For the gloss labels and marks:',
						items: [
							{
								href: '/guide/glossing-abbreviations',
								label: 'glossing abbreviations cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example and adjust the split rules under Settings → Tokens so the elided t’ stays as one token. Export the diagram as PNG, SVG, or PDF for a lesson on pronoun placement.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related examples:',
						items: [
							{
								href: '/examples/english-french-word-alignment',
								label: 'English and French word alignment',
								text: ' is the plain one-to-one starting point.'
							},
							{
								href: '/examples/japanese-chinese-english-word-order',
								label: 'Japanese, Chinese, and English word order',
								text: ' shows crossing links from object and verb order.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'tagalog-verbal-aspect-paradigm',
		exampleId: 'wiki-tagalog-aspects',
		title: 'Tagalog verbal aspect paradigm (interlinear)',
		description:
			'Four Tagalog verb forms (sulat, su~sulat, sumulat, sumusulat) with aspect and mood glosses and English equivalents.',
		body: `Languages: Tagalog → English. Wikipedia’s affixation section uses Tagalog write paradigms to show contemplative reduplication, agent trigger infixes, and combined forms.\n\nWhat it demonstrates: paradigm-style interlinear rows (multiple forms in one diagram) rather than a single sentence — handy for morphology cheat sheets.`,
		imageAlt: 'Tagalog verb paradigm sulat sumulat with aspect glosses and English translations',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Instead of one sentence, this diagram lays out several forms of the Tagalog verb sulat (“write”) side by side. Each form changes the aspect or mood through reduplication and an infix. Reading them together shows the pattern at a glance, which is why a paradigm makes a good morphology cheat sheet.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'Four forms of one verb',
				blocks: [
					{
						kind: 'gloss',
						lead: 'The base and three derived forms:',
						rows: [
							{
								token: 'sulat',
								gloss: 'write',
								note: 'The bare stem, the starting point for the paradigm.'
							},
							{
								token: 'su~sulat',
								gloss: 'CONTEMPL~write',
								note: 'Reduplication of the first syllable marks the contemplative (a not-yet-begun action).'
							},
							{
								token: 'sumulat',
								gloss: 'write.AGT',
								note: 'An infix marks the agent trigger, the form that puts the doer in focus.'
							},
							{
								token: 'sumusulat',
								gloss: 'IPFV.AGT~write',
								note: 'The infix and reduplication combine for an ongoing, agent-focus form.'
							}
						]
					}
				]
			},
			{
				id: 'phenomenon',
				heading: 'Reading a paradigm row by row',
				blocks: [
					{
						kind: 'paragraph',
						text: 'A paradigm diagram puts related forms in parallel so the reader compares them top to bottom rather than left to right. The shared stem sulat stays constant while the affixes change, and the gloss line names what each change does. This is a different use of the tool from a single sentence: the rows are not one clause but a set of contrasts.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Glossing conventions used here',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Reduplication is written with a tilde, as in su~sulat, and a period inside a label joins meanings that one affix carries at once. The agent trigger and aspect labels follow the standard set.'
					},
					{
						kind: 'links',
						lead: 'For the labels and marks:',
						items: [
							{
								href: '/guide/glossing-abbreviations',
								label: 'glossing abbreviations cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example and treat each row as its own short line with a gloss above it. Adjust the gaps so the forms read as a stacked table, then export the paradigm as PNG, SVG, or PDF for a handout.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related Tagalog examples:',
						items: [
							{
								href: '/examples/tagalog-reduplication-interlinear',
								label: 'Tagalog reduplication',
								text: ' focuses on a single reduplicated form.'
							},
							{
								href: '/examples/tagalog-compound-word-alignment',
								label: 'Tagalog compounds',
								text: ' handles hyphenated words in the tokenizer.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'german-umlaut-plural-gloss',
		exampleId: 'wiki-german-umlaut',
		title: 'German dative plural with umlaut (unsern Vätern)',
		description:
			'German unser-n Väter-n glossed our-DAT.PL father\\PL-DAT.PL: syncretism and umlaut marked in Leipzig style.',
		body: `Languages: German → English. The plural umlaut in Väter is marked with a backslash in the gloss (father\\PL) when the boundary appears in only one line — another Leipzig punctuation rule.\n\nWhat it demonstrates: dative plural on both adjective and noun, and “to our fathers” as a phrasal English gloss.`,
		imageAlt: 'German dative plural Vätern with DAT PL glosses aligned to to our fathers',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'The German phrase unsern Vätern means “to our fathers”. The plural of Vater is Väter, where the vowel changes from a to ä instead of an ending being added. Marking that vowel change in a gloss needs a special notation, and this example shows how, alongside the dative plural that appears on both words.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'Where the plural lives',
				blocks: [
					{
						kind: 'gloss',
						lead: 'The plural and the case sit on both the possessive and the noun:',
						rows: [
							{
								token: 'unser-n',
								gloss: 'our-DAT.PL',
								note: 'The possessive “our” with a dative plural ending.'
							},
							{
								token: 'Väter-n',
								gloss: 'father\\PL-DAT.PL',
								note: 'The plural shows in the vowel change father to Väter, written with a backslash, and the dative plural ending -n adds with a hyphen.'
							}
						]
					}
				]
			},
			{
				id: 'phenomenon',
				heading: 'The backslash for a vowel change',
				blocks: [
					{
						kind: 'paragraph',
						text: 'A hyphen separates pieces that sit next to each other, but the umlaut plural is not a separable piece: it is a change inside the stem. Leipzig conventions write that with a backslash, so father\\PL means the plural is shown by the vowel, not by an added ending. The dative -n, which is a real suffix, keeps its hyphen. One word can use both marks at once.'
					},
					{
						kind: 'links',
						lead: 'More on the backslash and the other marks:',
						items: [
							{
								href: '/guide/glossing-abbreviations#notation',
								label: 'notation marks on the cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example and type the backslash in the gloss line where a category shows as a stem change. Set the morpheme boundary character under Settings → Tokens for the parts that do separate, then export the diagram as PNG, SVG, or PDF.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related examples:',
						items: [
							{
								href: '/examples/latin-zero-morpheme-gloss',
								label: 'Latin zero morpheme',
								text: ' marks a case that has meaning but no sound.'
							},
							{
								href: '/examples/turkish-ablative-interlinear-gloss',
								label: 'Turkish case and verb morphology',
								text: ' shows case marked by plain suffixes for contrast.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'avar-camel-theft-interlinear',
		exampleId: 'wiki-avar-camel',
		title: 'Avar interlinear gloss (Caucasian agreement)',
		description:
			'Avar “We didn’t steal your camel”: ergative agreement, genitive, and negation on a single verb complex.',
		body: `Languages: Avar (Northeast Caucasian) → English. From Wikipedia’s automatic-glossing section: mi-s ħumukuli elu-ab-okʼekʼ-asi anu with rich prefixal agreement and negation.\n\nWhat it demonstrates: how one verb token maps to multiple English words (didn’t steal) and non-linear alignment between translation and morpheme order.`,
		imageAlt:
			'Avar sentence with ergative agreement glosses aligned to English We did not steal your camel',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'The Avar sentence means “We didn’t steal your camel”. Avar is a Northeast Caucasian language with rich agreement marked on the verb, so a single verb complex carries the subject, the negation, and agreement that English splits across several words. The alignment shows that one Avar token answers to a phrase like “didn’t steal”.'
					}
				]
			},
			{
				id: 'phenomenon',
				heading: 'One verb, several English words',
				blocks: [
					{
						kind: 'paragraph',
						text: 'The verb complex bundles the action together with agreement and negation. English needs an auxiliary, a negator, and a main verb to say the same thing, “did not steal”, so the link from the Avar verb fans out to several English boxes that share one color. The genitive “your” on the camel and the agreement inside the verb mean the translation order does not follow the morpheme order. The connectors trace which English words each Avar piece answers to.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Glossing conventions used here',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Agreement prefixes, the genitive, and negation are each labeled on the gloss line, and a single source verb maps to several glossed words. When one form carries several grammatical meanings at once, a period joins them inside one label.'
					},
					{
						kind: 'links',
						lead: 'For the agreement and case labels:',
						items: [
							{
								href: '/guide/glossing-abbreviations',
								label: 'glossing abbreviations cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example, then link the one Avar verb to each of its English words so the shared color shows the grouping. Upload a custom font under Settings → Fonts if your transcription needs characters a default font lacks, then export as PNG, SVG, or PDF.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related examples:',
						items: [
							{
								href: '/examples/lezgian-morpheme-gloss',
								label: 'Lezgian morpheme gloss',
								text: ' shows case stacking in another Caucasian language.'
							},
							{
								href: '/examples/classical-nahuatl-interlinear-gloss',
								label: 'Classical Nahuatl word-by-word',
								text: ' shows another verb that holds subject and object.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'lojban-sumti-interlinear-gloss',
		exampleId: 'wiki-lojban',
		title: 'Lojban interlinear gloss with sumti placeholders',
		description:
			'Lojban washing sentence with x1–x4 placeholders: a logical-language structure aligned to English.',
		body: `Languages: Lojban → English. mi lumci le creka le grasu le rirxe (“I wash the grease off the shirt in the river”) uses repeated le for nested sumti; glosses mark discourse referents (shirt=x2, grease=x3, river=x4).\n\nWhat it demonstrates: constructed-language interlinear for teaching Lojban place structure and how DET slots differ from English “the”.`,
		imageAlt:
			'Lojban sentence with sumti placeholder glosses x1 x2 aligned to English wash shirt river',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Lojban is a constructed logical language. The sentence mi lumci le creka le grasu le rirxe means “I wash the grease off the shirt in the river”. Each noun phrase fills a numbered slot in the verb’s place structure, and the gloss labels those slots x1 through x4. The example is a way to teach how Lojban arranges arguments.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'Filling the place structure',
				blocks: [
					{
						kind: 'gloss',
						lead: 'The verb lumci defines slots, and each le phrase fills one:',
						rows: [
							{
								token: 'mi',
								gloss: 'I (x1)',
								note: 'The first argument, the washer.'
							},
							{
								token: 'lumci',
								gloss: 'wash',
								note: 'The verb, which defines a place structure with several numbered slots.'
							},
							{
								token: 'le creka',
								gloss: 'the shirt (x2)',
								note: 'The thing washed. le is the article that introduces a noun phrase.'
							},
							{
								token: 'le grasu',
								gloss: 'the grease (x3)',
								note: 'What is washed off.'
							},
							{
								token: 'le rirxe',
								gloss: 'the river (x4)',
								note: 'Where the washing happens.'
							}
						]
					}
				]
			},
			{
				id: 'phenomenon',
				heading: 'Slots instead of word order',
				blocks: [
					{
						kind: 'paragraph',
						text: 'In English, the role of a noun comes partly from its position and partly from prepositions like “off” and “in”. In Lojban, the verb’s place structure assigns each noun a numbered role, so the gloss can label them x1 to x4 directly. The repeated le marks each new argument, where English varies between “the”, “off the”, and “in the”. The alignment shows which English words carry the roles that Lojban states by position in the place structure.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Glossing a constructed language',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Numbered placeholders like x1 are a teaching convention for Lojban rather than a standard Leipzig tag, and they sit comfortably in the same gloss line. For the grammatical labels that do follow the standard set, such as a determiner tag for le, the usual list applies.'
					},
					{
						kind: 'links',
						lead: 'For the standard labels:',
						items: [
							{
								href: '/guide/glossing-abbreviations',
								label: 'glossing abbreviations cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example and reuse it as a template for teaching place structure in Lojban or another constructed language. Add a custom font under Settings → Fonts for an invented script, then export the diagram as PNG, SVG, or PDF.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related examples:',
						items: [
							{
								href: '/examples/classical-nahuatl-interlinear-gloss',
								label: 'Classical Nahuatl word-by-word',
								text: ' shows a verb that packs in its arguments.'
							},
							{
								href: '/examples/turkish-infinitive-gloss-come-out',
								label: 'Turkish infinitive gloss',
								text: ' is a minimal two-line template.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'russian-evening-run-interlinear',
		exampleId: 'wiki-russian-evening',
		title: 'Russian case and gender agreement (evening run)',
		description:
			'Russian “In the evening I ran to the store”: instrumental, feminine past, and accusative in one interlinear block.',
		body: `Languages: Russian (Latin transliteration) → English. Vecher-om ya pobeja-la v magazin from Wikipedia’s paradigm-extraction example shows instrumental time adverb, gendered past -la, and accusative object.\n\nWhat it demonstrates: inflectional morphology on nouns and verbs and a free translation whose word order differs from the gloss line.`,
		imageAlt:
			'Russian interlinear gloss with INS case and PFV PST FEM aligned to English evening ran store',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'The Russian sentence Vecherom ya pobejala v magazin means “In the evening I ran to the store”. Russian marks grammatical roles with endings rather than word order, and this one short clause shows three at once: an instrumental time word, a past tense that agrees with a feminine subject, and an object after a preposition.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'Endings that carry the grammar',
				blocks: [
					{
						kind: 'gloss',
						lead: 'Three words carry the inflection:',
						rows: [
							{
								token: 'Vecher-om',
								gloss: 'evening-INS',
								note: 'The instrumental ending turns “evening” into “in the evening”, a time expression without a separate preposition.'
							},
							{
								token: 'pobeja-la',
								gloss: 'run.PFV-PST.FEM',
								note: 'The verb “ran”, completed, with a past-tense ending that agrees with a feminine subject.'
							},
							{
								token: 'magazin',
								gloss: 'store',
								note: 'The destination, “store”, after the preposition v (“to”).'
							}
						]
					}
				]
			},
			{
				id: 'phenomenon',
				heading: 'Agreement and reordering',
				blocks: [
					{
						kind: 'paragraph',
						text: 'The past-tense ending -la tells you the speaker is feminine, information English carries nowhere in the sentence. The instrumental ending replaces an English preposition, and the free translation reorders the parts so the English reads naturally. Because the gloss line follows the Russian order and the translation does not, the connectors show which English words answer to which Russian endings.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Glossing conventions used here',
				blocks: [
					{
						kind: 'paragraph',
						text: 'INS marks the instrumental case, PST the past, and FEM feminine agreement. A period inside a label, as in PST.FEM, joins meanings that one ending carries together, and a hyphen separates the stem from the ending.'
					},
					{
						kind: 'links',
						lead: 'For the case and tense labels:',
						items: [
							{
								href: '/guide/glossing-abbreviations',
								label: 'glossing abbreviations cheat sheet'
							}
						]
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example, set the morpheme boundary character under Settings → Tokens to split each stem from its ending, and add an English free-translation line below the gloss. Export the diagram as PNG, SVG, or PDF for a grammar lesson.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related examples:',
						items: [
							{
								href: '/examples/turkish-ablative-interlinear-gloss',
								label: 'Turkish case and verb morphology',
								text: ' shows case and person on another agglutinative clause.'
							},
							{
								href: '/examples/german-umlaut-plural-gloss',
								label: 'German umlaut plural',
								text: ' shows case and number agreement in German.'
							}
						]
					}
				]
			}
		]
	}
] satisfies Omit<GalleryExampleEntry, 'sourceAttribution'>[];

export const WIKIPEDIA_GALLERY: GalleryExampleEntry[] = WIKIPEDIA_GALLERY_ENTRIES.map((entry) => ({
	...entry,
	sourceAttribution: WIKIPEDIA_INTERLINEAR_GLOSS_SOURCE
}));
