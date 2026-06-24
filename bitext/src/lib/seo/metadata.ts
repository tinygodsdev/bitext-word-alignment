export const SITE_NAME = 'Word Aligner';

/**
 * Last meaningful content update, used for `<lastmod>` in the sitemap. Google reads lastmod as a
 * crawl-scheduling hint, so keep this honest — bump it when page copy or examples change, not on
 * every deploy. A single accurate date is better than a fabricated per-deploy timestamp.
 */
export const SITE_LASTMOD = '2026-06-24';

/**
 * Title and description favor colloquial, user-first phrasing while keeping the formal category
 * term ("word-by-word translation visualizer") so the page still matches exact-intent searches.
 * Audience signals (learners, teachers, conlang posts) help Google pair the page with relevant
 * long-tail queries without spamming keywords.
 */
export const DEFAULT_TITLE = 'Word-by-word translation visualizer — see which words match';
/** Kept ≤160 chars so Google does not truncate the SERP snippet. */
export const DEFAULT_DESCRIPTION =
	'Free word-by-word translation visualizer. Stack lines, add gloss/IPA, draw connectors, then export PNG, SVG, or PDF. For learners, teachers, and linguists.';
