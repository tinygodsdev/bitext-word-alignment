import { describe, expect, it } from 'vitest';
import { lemulaBlockHtml } from './blocks.js';

describe('lemulaBlockHtml', () => {
	it('marks the call-to-action link for affiliate_click with the block name', () => {
		const html = lemulaBlockHtml('card-history');
		expect(html).toContain(
			'<a data-partner="lemula" data-product="card-history" class="affiliate-link lmb-cta'
		);
		expect(html.match(/affiliate-link/g)).toHaveLength(1);
	});

	it('keeps the UTM tags that tell the blocks apart in Lemula analytics', () => {
		expect(lemulaBlockHtml('feature')).toContain('utm_source=aligner');
		expect(lemulaBlockHtml('feature')).toContain('utm_content=feature');
	});
});
