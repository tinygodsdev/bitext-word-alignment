import type { GalleryExampleEntry } from '../types-gallery.js';

export const CORE_GALLERY: GalleryExampleEntry[] = [
	{
		slug: 'english-french-word-alignment',
		exampleId: 'simple',
		title: 'English and French word alignment',
		description:
			'See how “Hello world” maps to “Bonjour le monde” word by word: a simple bilingual alignment diagram for learners and teachers.',
		body: `This example shows the most common use case: two parallel sentences where most words have a clear one-to-one match. “Hello” aligns with “Bonjour”, and “world” with “le monde” — including the case where one English word corresponds to two French tokens.\n\nUse it as a template for classroom handouts, blog posts, or quick vocabulary notes. Open it in the editor to change the languages, add a gloss line, or export PNG or SVG.`,
		imageAlt:
			'Word alignment diagram linking Hello world to Bonjour le monde with colored connectors between matching words',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Two short sentences sit one above the other, and a colored line joins each English word to its French match. “Hello world” becomes “Bonjour le monde”. Most words pair off one to one, with a single spot where one English word answers to two French words. It is the plainest form of word alignment and a good first template.'
					}
				]
			},
			{
				id: 'by-token',
				heading: 'Word by word',
				blocks: [
					{
						kind: 'gloss',
						lead: 'Each English word and the French it links to:',
						rows: [
							{
								token: 'Hello',
								gloss: 'Bonjour',
								note: 'A clean one-to-one match: one word links to one word.'
							},
							{
								token: 'world',
								gloss: 'le monde',
								note: 'One English word answers to two French tokens, the article “le” and the noun “monde”. The connector fans out to both.'
							}
						]
					}
				]
			},
			{
				id: 'one-to-many',
				heading: 'One word, two tokens',
				blocks: [
					{
						kind: 'paragraph',
						text: 'French often needs an article where English does not. “world” maps to “le monde”, so the link from a single English word reaches two French boxes. Both share one color, which marks them as one correspondence. This is the same grouping the tool uses whenever several words on one side answer to one word on the other.'
					}
				]
			},
			{
				id: 'recreate',
				heading: 'Recreate it in the editor',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Open the example, then swap in your own language pair, add a gloss or IPA line, or change the link colors. Export the result as PNG, SVG, or PDF for a handout or a post. If you add a gloss line, the grammatical labels follow a standard set.'
					},
					{
						kind: 'links',
						lead: 'For those labels:',
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
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Related alignments in other examples:',
						items: [
							{
								href: '/examples/japanese-chinese-english-word-order',
								label: 'Japanese, Chinese, and English word order',
								text: ' shows connectors that cross when the verb and object swap.'
							},
							{
								href: '/examples/french-clitic-pronoun-gloss',
								label: 'French clitic pronouns',
								text: ' shows reordering between French and English inside one short clause.'
							},
							{
								href: '/examples/hebrew-arabic-english-rtl',
								label: 'Hebrew and Arabic with English',
								text: ' adds right-to-left lines to the same idea.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'turkish-interlinear-gloss-ipa',
		exampleId: 'glosses',
		title: 'Turkish interlinear gloss with IPA',
		description:
			'Four-line interlinear layout: morpheme glosses, IPA, Turkish text, and English translation, with tight spacing between the gloss rows.',
		body: `Linguists often stack glosses, phonetic transcription, source text, and a free translation. Here the Turkish sentence “The child is playing in the garden” is broken into morphemes with pipe characters, paired with IPA and an English line below.\n\nConnectors are hidden between the top three rows so the interlinear block reads as one unit; links appear only between Turkish and English. This pattern works well for field notes, grammar sketches, and conlang documentation.`,
		imageAlt:
			'Turkish interlinear example with glosses, IPA, Turkish tokens, and English translation linked by curved connectors',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'This is a full interlinear stack: a morpheme gloss line, an IPA line, the Turkish source, and an English translation, four rows for one sentence, “The child is playing in the garden”. Each Turkish word is cut into morphemes with pipe characters so the gloss above lines up piece by piece.'
					}
				]
			},
			{
				id: 'rows',
				heading: 'Reading the four rows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'The top row carries grammatical labels, the second row gives the pronunciation in IPA, the third row is the Turkish text, and the bottom row is the free English translation. The top three rows describe the same Turkish words from different angles, so they belong together as a block. The English line is the one that says what the sentence means.'
					}
				]
			},
			{
				id: 'hidden-connectors',
				heading: 'Why some connectors are hidden',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Drawing links between every adjacent row would clutter the diagram, because the gloss, IPA, and Turkish lines all stand for the same tokens. So the connectors between those three rows are turned off while the links stay in the data, and curves appear only between Turkish and English. The interlinear block then reads as one tight unit with a single set of links to the translation.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Glossing conventions used here',
				blocks: [
					{
						kind: 'paragraph',
						text: 'The gloss line uses standard Leipzig labels for grammatical categories, and the pipe character marks morpheme boundaries inside each Turkish word. Tighten the vertical gap between the gloss rows so they sit close, and keep a wider gap before the translation.'
					},
					{
						kind: 'links',
						lead: 'For the labels on the gloss line:',
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
						text: 'Open the example, then hide or show connectors per pair of lines from the line popover, adjust the gap between rows, or upload a custom font for the source. Export the finished stack as PNG, SVG, or PDF for a grammar sketch or a slide.'
					}
				]
			},
			{
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'Other multi-line layouts:',
						items: [
							{
								href: '/examples/nahuatl-leipzig-glossing-abbreviations',
								label: 'Nahuatl with Leipzig abbreviations',
								text: ' shows the gloss line written in journal style.'
							},
							{
								href: '/examples/tagalog-verbal-aspect-paradigm',
								label: 'Tagalog verbal aspect paradigm',
								text: ' stacks several verb forms in one diagram.'
							},
							{
								href: '/examples/turkish-ablative-interlinear-gloss',
								label: 'Turkish case and verb morphology',
								text: ' walks through one clause morpheme by morpheme.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'hebrew-arabic-english-rtl',
		exampleId: 'rtl',
		title: 'Hebrew and Arabic with English (RTL scripts)',
		description:
			'Compare two right-to-left languages against English: bound prepositions, parallel adjective placement, and crossing links when word order differs.',
		body: `Hebrew and Arabic both write right to left. This alignment places Hebrew above Arabic and English below, so you can see how bound prepositions (Hebrew ב- inside בבית) and free prepositions (Arabic في) line up with English “in”.\n\nWhen Arabic and English disagree on adjective–noun order, the last two connectors cross — a visual cue that is easy to miss in plain text. Enable RTL per line in the editor when you work with Hebrew, Arabic, or other RTL scripts.`,
		imageAlt:
			'Right-to-left Hebrew and Arabic lines aligned to English with word links across three rows',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Hebrew and Arabic both run right to left. Here Hebrew sits on top, Arabic in the middle, and English below, so two related Semitic languages line up against the same translation. The diagram makes two things visible at once: how each language attaches a preposition, and where word order pulls the connectors across each other.'
					}
				]
			},
			{
				id: 'prepositions',
				heading: 'Bound and free prepositions',
				blocks: [
					{
						kind: 'gloss',
						lead: 'The same English “in” attaches differently in each language:',
						rows: [
							{
								token: 'בבית',
								gloss: 'in+house',
								note: 'Hebrew writes the preposition ב- as a bound prefix glued to the front of “house”, so one written word holds both.'
							},
							{
								token: 'في',
								gloss: 'in',
								note: 'Arabic writes the preposition في as a separate word, so it gets its own box and its own link to English “in”.'
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
						text: 'Arabic places an adjective after its noun, while English places it before. When the same two words appear in opposite order, the link from the noun and the link from the adjective swap sides and cross. In plain running text that reordering is hard to spot; the crossing curves point straight at it.'
					}
				]
			},
			{
				id: 'rtl',
				heading: 'Working with RTL scripts',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Turn on right-to-left for each Hebrew or Arabic line from the line popover, and leave the English line left to right. The tool keeps the connectors correct across the direction change, so you can mix RTL and LTR rows in one diagram. The same switch works for other right-to-left scripts.'
					},
					{
						kind: 'links',
						lead: 'If you add a gloss line, the labels come from the',
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
								text: ' shows crossing links from a different word-order clash.'
							},
							{
								href: '/examples/french-clitic-pronoun-gloss',
								label: 'French clitic pronouns',
								text: ' shows reordering inside a short clause.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'tagalog-compound-word-alignment',
		exampleId: 'tagalog',
		title: 'Tagalog compounds and hyphenated words',
		description:
			'Keep hyphens inside Tagalog compounds (bahay-kubo, tabing-ilog) instead of splitting them at every dash: a tokenizer override demo.',
		body: `Hyphens often join parts of a single word in Tagalog. If your split characters include “-”, bahay-kubo becomes three tokens and alignment breaks. This example turns off hyphen splitting while keeping other defaults, so compounds stay intact.\n\nThe English line uses the join character “+” for “nipa+hut” where two English words represent one Tagalog compound. Adjust split and join rules under Settings → Tokens for your language pair.`,
		imageAlt:
			'Tagalog sentence with hyphenated compounds aligned to English, showing compound tokens kept together',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Some languages write a single word with a hyphen inside it. Tagalog does this for compounds like bahay-kubo (a nipa hut) and tabing-ilog (riverbank). This example shows how to keep those compounds whole instead of letting the hyphen break them apart, so the alignment stays clean.'
					}
				]
			},
			{
				id: 'problem',
				heading: 'The tokenizer problem',
				blocks: [
					{
						kind: 'gloss',
						lead: 'When a hyphen counts as a split character, one word turns into several boxes:',
						rows: [
							{
								token: 'bahay-kubo',
								gloss: 'nipa+hut',
								note: 'Split on the hyphen, bahay-kubo becomes three boxes (bahay, the dash, kubo), and the link to English breaks. Kept whole, it is one box that maps to one idea.'
							},
							{
								token: 'tabing-ilog',
								gloss: 'riverbank',
								note: 'The same compound pattern: one Tagalog word, one meaning, one box.'
							}
						]
					}
				]
			},
			{
				id: 'fix',
				heading: 'The fix: tokenizer override',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Turn hyphen off as a split character while keeping the other defaults, so compounds stay as single boxes. On the English side, the join character “+” ties two words into one box, so “nipa+hut” aligns as a unit to bahay-kubo. Both controls live under Settings → Tokens, where you set split characters, the join marker, and how punctuation is treated.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Boundaries and the gloss line',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Tokenization decides what counts as one word; morpheme glossing decides how to label its parts. If you add a gloss line for a compound, mark internal morpheme boundaries with a separate character such as the pipe, and keep the hyphen for the compound itself.'
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
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'More Tagalog and tokenization examples:',
						items: [
							{
								href: '/examples/tagalog-reduplication-interlinear',
								label: 'Tagalog reduplication',
								text: ' shows a copied syllable marked with a tilde.'
							},
							{
								href: '/examples/tagalog-verbal-aspect-paradigm',
								label: 'Tagalog verbal aspect paradigm',
								text: ' lays out several verb forms together.'
							}
						]
					}
				]
			}
		]
	},
	{
		slug: 'japanese-chinese-english-word-order',
		exampleId: 'cjk',
		title: 'Japanese, Chinese, and English word order',
		description:
			'Three-line alignment across Japanese (SOV), Chinese (SVO), and English, including crossing links when the verb and object swap.',
		body: `Japanese and Chinese share many cognate morphemes but different syntax. Japanese places the object before the verb; Chinese and English follow SVO. This three-row diagram makes crossings visible: 本を/読みました vs 读了/书.\n\nSpaces mark word boundaries in the CJK lines because neither script uses spaces in normal writing. Add gloss or IPA rows in the editor, or export the diagram for handouts comparing East Asian word order.`,
		imageAlt:
			'Japanese, Chinese, and English alignment showing SOV vs SVO word order with crossing connectors',
		sections: [
			{
				id: 'overview',
				heading: 'What this example shows',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Japanese, Chinese, and English describe the same event but arrange the words differently. Japanese puts the object before the verb, while Chinese and English put the verb before the object. Lined up in three rows, the diagram shows where that difference forces the connectors to cross.'
					}
				]
			},
			{
				id: 'word-order',
				heading: 'Object before verb, or after',
				blocks: [
					{
						kind: 'gloss',
						lead: 'The verb and the object sit in opposite order across the languages:',
						rows: [
							{
								token: '本を',
								gloss: 'book (object)',
								note: 'Japanese marks the object with を and places it before the verb.'
							},
							{
								token: '読みました',
								gloss: 'read',
								note: 'The Japanese verb comes last. Against Chinese 读了 (read) and 书 (book), which run verb then object, the two links cross.'
							}
						]
					}
				]
			},
			{
				id: 'spaces',
				heading: 'Spaces as word boundaries',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Japanese and Chinese do not put spaces between words in normal writing, so the tool needs a cue for where one token ends and the next begins. Here spaces are added in the source lines to mark those boundaries, which lets each token become its own clickable box for linking.'
					}
				]
			},
			{
				id: 'conventions',
				heading: 'Adding gloss or IPA',
				blocks: [
					{
						kind: 'paragraph',
						text: 'Stack a gloss line for grammatical labels or an IPA line for pronunciation above either source language. The grammatical labels follow the standard Leipzig set.'
					},
					{
						kind: 'links',
						lead: 'For those labels:',
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
				id: 'see-also',
				heading: 'See also',
				blocks: [
					{
						kind: 'links',
						lead: 'More word-order and crossing examples:',
						items: [
							{
								href: '/examples/english-french-word-alignment',
								label: 'English and French word alignment',
								text: ' is the plain one-to-one starting point.'
							},
							{
								href: '/examples/hebrew-arabic-english-rtl',
								label: 'Hebrew and Arabic with English',
								text: ' shows crossing links with right-to-left scripts.'
							}
						]
					}
				]
			}
		]
	}
];
