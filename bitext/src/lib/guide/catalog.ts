/** The guide hub entries, shared by the /guide index and any navigation that lists guides. */

export interface GuideEntry {
	path: string;
	title: string;
	blurb: string;
}

export const GUIDES: GuideEntry[] = [
	{
		path: '/guide/interlinear-gloss-generator',
		title: 'Interlinear gloss generator',
		blurb: 'What the tool does and how to build a gloss in four steps. Start here.'
	},
	{
		path: '/guide/how-to-read-an-interlinear-gloss',
		title: 'How to read an interlinear gloss',
		blurb: 'The three lines, the small-capital labels, and the marks, for beginners.'
	},
	{
		path: '/guide/leipzig-glossing-rules',
		title: 'Leipzig Glossing Rules explained',
		blurb: 'The shared standard for morpheme-by-morpheme glosses, with an example for each rule.'
	},
	{
		path: '/guide/glossing-abbreviations',
		title: 'Glossing abbreviations cheat sheet',
		blurb: 'Case, person, tense, and the notation marks, each with a plain-language note.'
	},
	{
		path: '/guide/how-to-gloss-a-conlang',
		title: 'How to gloss your conlang',
		blurb: 'Leipzig-style glossing for an invented language, with custom scripts and fonts.'
	}
];
