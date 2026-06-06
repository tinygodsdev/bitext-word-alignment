import type { ExampleEntry } from '../types.js';
import { glossSourceTranslationLines, inter, noto, interlinearSettings, morphemeInterlinearSettings } from './helpers.js';

/**
 * Interlinear gloss examples from Wikipedia (“Interlinear gloss” article).
 * @see https://en.wikipedia.org/wiki/Interlinear_gloss
 */
export const WIKIPEDIA_EXAMPLES: ExampleEntry[] = [
	(() => {
		const stack = glossSourceTranslationLines(
			'I it make for to-the my son a house',
			'ni-|c-|chihui|-lia in no-|piltzin ce calli',
			'I made my son a house'
		);
		return {
			id: 'wiki-nahuatl',
			label: 'Classical Nahuatl (vertical interlinear)',
			...stack,
			settings: morphemeInterlinearSettings,
			connections: [
				['gl-0', 'src-0'],
				['gl-1', 'src-1'],
				['gl-2', 'src-2'],
				['gl-3', 'src-3'],
				['gl-4', 'src-4'],
				['gl-5', 'src-5'],
				['gl-6', 'src-6'],
				['gl-7', 'src-7'],
				['gl-8', 'src-8'],
				['src-0', 'tr-0'],
				['src-2', 'tr-1'],
				['src-5', 'tr-2'],
				['src-6', 'tr-3'],
				['src-7', 'tr-4'],
				['src-8', 'tr-5']
			]
		};
	})(),
	(() => {
		const stack = glossSourceTranslationLines(
			'1SG.SUBJ-3SG.OBJ-mach-APPL DET 1SG.POSS-son a house',
			'ni-c-chihui-lia in no-piltzin ce calli',
			'I made my son a house'
		);
		return {
			id: 'wiki-nahuatl-lgr',
			label: 'Classical Nahuatl (Leipzig abbreviations)',
			...stack,
			settings: interlinearSettings,
			connections: [
				['gl-0', 'src-0'],
				['gl-1', 'src-1'],
				['gl-2', 'src-2'],
				['gl-3', 'src-3'],
				['gl-4', 'src-4'],
				['src-0', 'tr-0'],
				['src-0', 'tr-1'],
				['src-2', 'tr-2'],
				['src-3', 'tr-3'],
				['src-4', 'tr-4'],
				['src-5', 'tr-5']
			]
		};
	})(),
	(() => {
		const stack = glossSourceTranslationLines(
			'I yet-not decide when want return',
			'goá iáu-boē koat-tēng tang-sî boeh tńg-khì',
			'I have not yet decided when I shall return'
		);
		return {
			id: 'wiki-taiwanese-minnan',
			label: 'Taiwanese Minnan (tone + gloss stack)',
			...stack,
			settings: interlinearSettings,
			connections: [
				['gl-0', 'src-0'],
				['gl-1', 'src-1'],
				['gl-2', 'src-2'],
				['gl-3', 'src-3'],
				['gl-4', 'src-4'],
				['gl-5', 'src-5'],
				['src-0', 'tr-0'],
				['src-1', 'tr-2'],
				['src-1', 'tr-3'],
				['src-2', 'tr-4'],
				['src-3', 'tr-5'],
				['src-4', 'tr-6'],
				['src-5', 'tr-8']
			]
		};
	})(),
	(() => {
		const stack = glossSourceTranslationLines(
			'now they-OBL-GEN farm forever behind stay-FUT-NEG',
			'Gila abur-u-n ferma hamišaluǧ güǧüna amuqʼ-da-č',
			'Now their farm will not stay behind forever'
		);
		return {
			id: 'wiki-lezgian',
			label: 'Lezgian (morpheme-by-morpheme)',
			...stack,
			settings: interlinearSettings,
			connections: [
				['gl-0', 'src-0'],
				['gl-1', 'src-1'],
				['gl-2', 'src-2'],
				['gl-3', 'src-3'],
				['gl-4', 'src-4'],
				['gl-5', 'src-5'],
				['src-0', 'tr-0'],
				['src-1', 'tr-1'],
				['src-2', 'tr-2'],
				['src-3', 'tr-6'],
				['src-4', 'tr-6'],
				['src-5', 'tr-3'],
				['src-5', 'tr-4']
			]
		};
	})(),
	{
		id: 'wiki-turkish-infinitive',
		label: 'Turkish (one-to-many gloss)',
		lines: [
			inter('come.out-INF', 'gl', 24),
			inter('çık-mak', 'src', 36),
			inter('to come out', 'tr', 30)
		],
		settings: interlinearSettings,
		pairControls: [{ upperLineId: 'gl', lowerLineId: 'src', showConnectors: false }],
		linePairGaps: [{ upperLineId: 'gl', lowerLineId: 'src', gapPx: 16 }],
		connections: [
			['gl-0', 'src-0'],
			['src-0', 'tr-1'],
			['src-0', 'tr-2']
		]
	},
	{
		id: 'wiki-latin-null',
		label: 'Latin (zero morpheme ø)',
		lines: [
			inter('boy-NOM', 'gl', 24),
			inter('puer-ø', 'src', 36),
			inter('boy', 'tr', 30)
		],
		settings: interlinearSettings,
		pairControls: [{ upperLineId: 'gl', lowerLineId: 'src', showConnectors: false }],
		linePairGaps: [{ upperLineId: 'gl', lowerLineId: 'src', gapPx: 16 }],
		connections: [
			['gl-0', 'src-0'],
			['src-0', 'tr-0']
		]
	},
	{
		id: 'wiki-tagalog-reduplication',
		label: 'Tagalog (reduplication ~)',
		lines: [
			inter('IPFV~buy', 'gl', 24),
			noto('bi~bili', 'src', 'Noto Sans', 36),
			inter('is buying', 'tr', 30)
		],
		settings: interlinearSettings,
		pairControls: [{ upperLineId: 'gl', lowerLineId: 'src', showConnectors: false }],
		linePairGaps: [{ upperLineId: 'gl', lowerLineId: 'src', gapPx: 16 }],
		connections: [
			['gl-0', 'src-0'],
			['src-0', 'tr-0'],
			['src-0', 'tr-1']
		]
	},
	(() => {
		const stack = glossSourceTranslationLines(
			'room-ABL speed-COM go.out-PFV-1sg',
			'oda-dan hız-lı çık-tı-m',
			'I left the room quickly'
		);
		return {
			id: 'wiki-turkish-ablatives',
			label: 'Turkish (case + verb morphology)',
			...stack,
			settings: interlinearSettings,
			connections: [
				['gl-0', 'src-0'],
				['gl-1', 'src-1'],
				['gl-2', 'src-2'],
				['src-0', 'tr-3'],
				['src-1', 'tr-4'],
				['src-2', 'tr-0']
			]
		};
	})(),
	(() => {
		const stack = glossSourceTranslationLines(
			'I you love',
			"Je t' aime",
			'I love you'
		);
		return {
			id: 'wiki-french-clitics',
			label: 'French (clitic pronouns)',
			...stack,
			settings: interlinearSettings,
			connections: [
				['gl-0', 'src-0'],
				['gl-1', 'src-1'],
				['gl-2', 'src-2'],
				['src-0', 'tr-0'],
				['src-1', 'tr-2'],
				['src-2', 'tr-1']
			]
		};
	})(),
	{
		id: 'wiki-tagalog-aspects',
		label: 'Tagalog (verbal morphology paradigm)',
		lines: [
			inter('write CONT~write AT.past+write AT+CONT~write', 'gl', 20),
			noto('sulat su~sulat sumulat sumusulat', 'src', 'Noto Sans', 30),
			inter('write is+writing wrote keeps+writing', 'tr', 28)
		],
		settings: interlinearSettings,
		pairControls: [{ upperLineId: 'gl', lowerLineId: 'src', showConnectors: false }],
		linePairGaps: [{ upperLineId: 'gl', lowerLineId: 'src', gapPx: 16 }],
		connections: [
			['gl-0', 'src-0'],
			['gl-1', 'src-1'],
			['gl-2', 'src-2'],
			['gl-3', 'src-3'],
			['src-0', 'tr-0'],
			['src-1', 'tr-1'],
			['src-2', 'tr-2'],
			['src-3', 'tr-3']
		]
	},
	(() => {
		const stack = glossSourceTranslationLines(
			'our-DAT.PL father+PL-DAT.PL',
			'unser-n Väter-n',
			'to our fathers'
		);
		return {
			id: 'wiki-german-umlaut',
			label: 'German (umlaut + plural syncretism)',
			...stack,
			settings: interlinearSettings,
			connections: [
				['gl-0', 'src-0'],
				['gl-1', 'src-1'],
				['src-0', 'tr-1'],
				['src-1', 'tr-2']
			]
		};
	})(),
	(() => {
		const stack = glossSourceTranslationLines(
			'you-GEN camel we-OBL-ERG.1.PL-steal-PRT be.NEG',
			'mi-s ħumukuli elu-ab-okʼekʼ-asi anu',
			"We didn't steal your camel"
		);
		return {
			id: 'wiki-avar-camel',
			label: 'Avar (Caucasian agreement)',
			...stack,
			settings: interlinearSettings,
			connections: [
				['gl-0', 'src-0'],
				['gl-1', 'src-1'],
				['gl-2', 'src-2'],
				['gl-3', 'src-3'],
				['src-0', 'tr-3'],
				['src-1', 'tr-4'],
				['src-2', 'tr-1'],
				['src-2', 'tr-2'],
				['src-3', 'tr-1']
			]
		};
	})(),
	(() => {
		const stack = glossSourceTranslationLines(
			'I=x1 wash DET shirt=x2 DET grease=x3 DET river=x4',
			'mi lumci le creka le grasu le rirxe',
			'I wash the grease off the shirt in the river'
		);
		return {
			id: 'wiki-lojban',
			label: 'Lojban (sumti placeholders)',
			...stack,
			settings: interlinearSettings,
			connections: [
				['gl-0', 'src-0'],
				['gl-1', 'src-1'],
				['gl-2', 'src-2'],
				['gl-3', 'src-3'],
				['gl-4', 'src-4'],
				['gl-5', 'src-5'],
				['gl-6', 'src-6'],
				['gl-7', 'src-7'],
				['src-0', 'tr-0'],
				['src-1', 'tr-1'],
				['src-2', 'tr-5'],
				['src-3', 'tr-6'],
				['src-4', 'tr-2'],
				['src-5', 'tr-3'],
				['src-6', 'tr-8'],
				['src-7', 'tr-9']
			]
		};
	})(),
	(() => {
		const stack = glossSourceTranslationLines(
			'evening-INS 1.SG.NOM run-PFV.PST.SG.FEM in store.ACC',
			'Vecher-om ya pobeja-la v magazin',
			'In the evening I ran to the store'
		);
		return {
			id: 'wiki-russian-evening',
			label: 'Russian (case + gender agreement)',
			...stack,
			settings: interlinearSettings,
			connections: [
				['gl-0', 'src-0'],
				['gl-1', 'src-1'],
				['gl-2', 'src-2'],
				['gl-3', 'src-3'],
				['gl-4', 'src-4'],
				['src-0', 'tr-1'],
				['src-0', 'tr-2'],
				['src-1', 'tr-3'],
				['src-2', 'tr-4'],
				['src-3', 'tr-5'],
				['src-4', 'tr-7']
			]
		};
	})()
];
