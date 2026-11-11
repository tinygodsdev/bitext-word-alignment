import bar from './blocks/bar.html?raw';
import boldMorph from './blocks/bold-morph.html?raw';
import boldRule from './blocks/bold-rule.html?raw';
import boldSentence from './blocks/bold-sentence.html?raw';
import boldTree from './blocks/bold-tree.html?raw';
import cardBorrowing from './blocks/card-borrowing.html?raw';
import cardCompound from './blocks/card-compound.html?raw';
import cardGlossed from './blocks/card-glossed.html?raw';
import cardHistory from './blocks/card-history.html?raw';
import feature from './blocks/feature.html?raw';

/** Markup of the Lemula house banners, copied verbatim from the Lemula repo. */
const BLOCK_HTML = {
	bar,
	'bold-morph': boldMorph,
	'bold-rule': boldRule,
	'bold-sentence': boldSentence,
	'bold-tree': boldTree,
	'card-borrowing': cardBorrowing,
	'card-compound': cardCompound,
	'card-glossed': cardGlossed,
	'card-history': cardHistory,
	feature
} as const;

export type LemulaBlockName = keyof typeof BLOCK_HTML;

const CTA_OPENING = '<a class="lmb-cta';

/**
 * A block's markup with Aligner's click tracking on its link: the `affiliate_click` handler
 * listens on `a.affiliate-link` and reads the partner and product from data attributes.
 */
export function lemulaBlockHtml(name: LemulaBlockName): string {
	const html = BLOCK_HTML[name];
	if (!html.includes(CTA_OPENING)) {
		throw new Error(`Lemula block "${name}" has no call-to-action link to track`);
	}
	return html.replace(
		CTA_OPENING,
		`<a data-partner="lemula" data-product="${name}" class="affiliate-link lmb-cta`
	);
}
