import { describe, expect, it } from 'vitest';
import {
	getExamplePagePartnerId,
	getHomePartnerOrder,
	HOME_PARTNER_IDS
} from './home-rotation.js';

describe('getExamplePagePartnerId', () => {
	it('returns a pool member and is stable for the same slug', () => {
		const a = getExamplePagePartnerId('turkish-interlinear-gloss-ipa');
		const b = getExamplePagePartnerId('turkish-interlinear-gloss-ipa');
		expect(HOME_PARTNER_IDS).toContain(a);
		expect(a).toBe(b);
	});

	it('can differ across slugs', () => {
		const ids = new Set(HOME_PARTNER_IDS.map((_, i) => getExamplePagePartnerId(`slug-${i}`)));
		expect(ids.size).toBeGreaterThan(1);
	});
});

describe('getHomePartnerOrder', () => {
	it('returns two distinct partners', () => {
		const [a, b] = getHomePartnerOrder(1_700_000_000_000);
		expect(a).not.toBe(b);
	});
});
