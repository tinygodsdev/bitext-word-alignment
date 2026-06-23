import { browser } from '$app/environment';

/**
 * GA4 custom event for partner / referral outbound links.
 * @see https://developers.google.com/analytics/devguides/collection/ga4/events
 * Custom params (partner, product, …) may need to be registered as custom dimensions in GA4 to appear in standard reports; they still show in DebugView / BigQuery.
 */
const EVENT_NAME = 'affiliate_click';

function onDocumentClickCapture(e: MouseEvent): void {
	const target = e.target;
	if (!(target instanceof Node)) return;
	const el = (target as Element).closest?.('a.affiliate-link');
	if (!(el instanceof HTMLAnchorElement)) return;
	const g = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
	if (typeof g !== 'function') return;

	const linkText = (el.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 120);

	g('event', EVENT_NAME, {
		partner: el.dataset.partner ?? '',
		product: el.dataset.product ?? '',
		link_url: el.href,
		link_text: linkText
	});
}

/** Register capture-phase listener; returns cleanup for $effect. */
export function registerAffiliateLinkClickTracking(): () => void {
	if (!browser) return () => {};
	document.addEventListener('click', onDocumentClickCapture, true);
	return () => document.removeEventListener('click', onDocumentClickCapture, true);
}
