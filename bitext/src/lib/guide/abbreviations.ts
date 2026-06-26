/**
 * Reference data for the glossing-abbreviations cheat sheet (`/guide/glossing-abbreviations`).
 * Labels and expansions follow the Leipzig Glossing Rules standard abbreviation list. Kept as data
 * so the page and its DefinedTermSet schema stay in sync from one source.
 */

export interface Abbreviation {
	label: string;
	full: string;
	note: string;
}

export interface AbbreviationGroup {
	id: string;
	title: string;
	terms: Abbreviation[];
}

export const ABBREVIATION_GROUPS: AbbreviationGroup[] = [
	{
		id: 'person-number',
		title: 'Person, number, gender',
		terms: [
			{ label: '1', full: 'first person', note: 'the speaker (I, we).' },
			{ label: '2', full: 'second person', note: 'the addressee (you).' },
			{ label: '3', full: 'third person', note: 'someone else (he, she, it, they).' },
			{ label: 'SG', full: 'singular', note: 'one referent.' },
			{ label: 'PL', full: 'plural', note: 'more than one referent.' },
			{ label: 'DU', full: 'dual', note: 'exactly two, in languages that mark it.' },
			{ label: 'M', full: 'masculine', note: 'masculine gender or noun class.' },
			{ label: 'F', full: 'feminine', note: 'feminine gender or noun class.' },
			{ label: 'N', full: 'neuter', note: 'neuter gender or noun class.' }
		]
	},
	{
		id: 'case',
		title: 'Case',
		terms: [
			{ label: 'NOM', full: 'nominative', note: 'subject of a clause.' },
			{ label: 'ACC', full: 'accusative', note: 'direct object.' },
			{ label: 'GEN', full: 'genitive', note: 'possessor or “of” relation.' },
			{ label: 'DAT', full: 'dative', note: 'recipient or “to / for” relation.' },
			{ label: 'ABL', full: 'ablative', note: 'source or “from” relation.' },
			{ label: 'LOC', full: 'locative', note: 'location or “in / at” relation.' },
			{ label: 'INS', full: 'instrumental', note: 'the means: “with / by”.' },
			{
				label: 'ERG',
				full: 'ergative',
				note: 'subject of a transitive verb in ergative languages.'
			},
			{
				label: 'ABS',
				full: 'absolutive',
				note: 'intransitive subject or transitive object in ergative languages.'
			},
			{
				label: 'OBL',
				full: 'oblique',
				note: 'a general non-core case, often a stem form before other endings.'
			},
			{ label: 'COM', full: 'comitative', note: '“with”, accompaniment.' }
		]
	},
	{
		id: 'tense-aspect-mood',
		title: 'Tense, aspect, mood',
		terms: [
			{ label: 'PRS', full: 'present', note: 'present tense.' },
			{ label: 'PST', full: 'past', note: 'past tense.' },
			{ label: 'FUT', full: 'future', note: 'future tense.' },
			{ label: 'PFV', full: 'perfective', note: 'event viewed as a whole.' },
			{ label: 'IPFV', full: 'imperfective', note: 'event viewed as ongoing or habitual.' },
			{ label: 'PRF', full: 'perfect', note: 'past event with present relevance.' },
			{ label: 'PROG', full: 'progressive', note: 'action in progress.' },
			{ label: 'IMP', full: 'imperative', note: 'command.' },
			{ label: 'SBJV', full: 'subjunctive', note: 'irrealis or dependent mood.' },
			{ label: 'COND', full: 'conditional', note: '“would” mood.' }
		]
	},
	{
		id: 'derivation-structure',
		title: 'Derivation and clause structure',
		terms: [
			{ label: 'INF', full: 'infinitive', note: 'unmarked verb form (“to do”).' },
			{ label: 'PTCP', full: 'participle', note: 'verb form acting as an adjective.' },
			{ label: 'NEG', full: 'negation', note: 'marks a negative.' },
			{
				label: 'APPL',
				full: 'applicative',
				note: 'adds an object (e.g. a beneficiary) to the verb.'
			},
			{ label: 'CAUS', full: 'causative', note: '“make / cause to”.' },
			{ label: 'PASS', full: 'passive', note: 'passive voice.' },
			{ label: 'REFL', full: 'reflexive', note: 'subject and object are the same.' },
			{ label: 'POSS', full: 'possessive', note: 'marks a possessor.' },
			{ label: 'DEF', full: 'definite', note: 'definite article or marker (“the”).' },
			{ label: 'INDF', full: 'indefinite', note: 'indefinite article or marker (“a”).' }
		]
	}
];

export interface GlossingConvention {
	mark: string;
	name: string;
	rule: string;
	/** Example page that demonstrates the convention. */
	exampleSlug?: string;
	exampleLabel?: string;
}

export const GLOSSING_CONVENTIONS: GlossingConvention[] = [
	{
		mark: '-',
		name: 'Hyphen',
		rule: 'Separates morphemes that can be cut apart. The source line and the gloss line carry the same number of hyphens, so each piece lines up.',
		exampleSlug: 'turkish-ablative-interlinear-gloss',
		exampleLabel: 'Turkish case and verb morphology'
	},
	{
		mark: '.',
		name: 'Period',
		rule: 'Joins several meanings that share one form. When one source morpheme needs two English words, the gloss links them with a period (come.out).',
		exampleSlug: 'turkish-one-to-many-morpheme-gloss',
		exampleLabel: 'Turkish infinitive (one-to-many)'
	},
	{
		mark: '~',
		name: 'Tilde',
		rule: 'Marks reduplication: a copied syllable or stem written with a tilde in both lines (bi~bili, IPFV~buy).',
		exampleSlug: 'tagalog-reduplication-interlinear',
		exampleLabel: 'Tagalog reduplication'
	},
	{
		mark: 'ø',
		name: 'Zero (ø)',
		rule: 'An overt ø stands for a morpheme that carries meaning but has no sound, common for null case endings.',
		exampleSlug: 'latin-zero-morpheme-gloss',
		exampleLabel: 'Latin zero morpheme'
	},
	{
		mark: '\\',
		name: 'Backslash',
		rule: 'Marks a category shown by a change inside the word rather than a separable piece, such as an umlaut plural (father\\PL).',
		exampleSlug: 'german-umlaut-plural-gloss',
		exampleLabel: 'German umlaut plural'
	}
];

/** Flat list for schema and counts. */
export const ALL_ABBREVIATIONS: Abbreviation[] = ABBREVIATION_GROUPS.flatMap((g) => g.terms);
