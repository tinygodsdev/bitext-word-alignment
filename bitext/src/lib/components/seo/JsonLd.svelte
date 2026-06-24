<script lang="ts">
	import {
		ALIGNER_SITE_URL,
		SITE_AUTHOR_NAME,
		SITE_AUTHOR_URL,
		SITE_CONTACT_EMAIL
	} from '$lib/brand.js';
	import { SITE_NAME, DEFAULT_DESCRIPTION } from '$lib/seo/metadata.js';

	/**
	 * Homepage structured data: WebSite, WebApplication, and FAQPage.
	 *
	 * WebApplication intentionally omits `aggregateRating`/`offers.review`. Google's *rich result*
	 * for software needs a real rating, which we do not have, so this will not produce a rich
	 * result — but the markup is valid and helps search engines and LLMs identify what the tool is
	 * (entity resolution, AI Overviews/ChatGPT/Perplexity citation). Add a rating block here only
	 * when there is legitimate review data.
	 *
	 * FAQ rich results are effectively restricted to well-known health/government sites since 2023
	 * (https://developers.google.com/search/blog/2023/08/howto-faq-changes) so the FAQPage block is
	 * kept mainly for semantic coverage and AI citation. The answer text mirrors the visible FAQ
	 * copy on the page, which Google requires for any FAQPage markup.
	 */
	const creator = {
		'@type': 'Person',
		name: SITE_AUTHOR_NAME,
		url: SITE_AUTHOR_URL,
		email: SITE_CONTACT_EMAIL
	};

	const website = {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: SITE_NAME,
		url: ALIGNER_SITE_URL + '/',
		description: DEFAULT_DESCRIPTION,
		inLanguage: 'en',
		publisher: creator
	};

	const webApplication = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: SITE_NAME,
		url: ALIGNER_SITE_URL + '/',
		description: DEFAULT_DESCRIPTION,
		applicationCategory: 'EducationalApplication',
		operatingSystem: 'Any',
		browserRequirements: 'Requires a modern web browser with JavaScript enabled',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
		featureList: [
			'Word-by-word translation visualization',
			'Interlinear gloss support',
			'IPA tier support',
			'Right-to-left script support (Hebrew, Arabic)',
			'Export to PNG, SVG, PDF, and HTML',
			'Shareable URLs',
			'Free REST API'
		],
		inLanguage: 'en',
		creator
	};

	const faq = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'What is this kind of tool called?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'The formal name is a word alignment visualizer. In everyday language people also call it a word-by-word translation tool, an interlinear-style visualizer, or simply a way to see which words match in a translation.'
				}
			},
			{
				'@type': 'Question',
				name: 'Does it handle reordered translations?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. Curved connectors can cross each other freely, so sentences where the target language puts the verb, subject, or modifier in a different position still look clean. That is one of the main reasons this visualization is useful for language learning.'
				}
			},
			{
				'@type': 'Question',
				name: 'Can I align phrases, not just single words?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. Each link joins two word-sized boxes on neighboring lines. You can add several links from the same word to different partners (one-to-many or many-to-one) by clicking that word again and choosing another match on the adjacent row. To treat two written words as a single box—for example a fixed expression—use the join character under Settings → Tokens.'
				}
			},
			{
				'@type': 'Question',
				name: 'Is this a full machine translator?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'No. You type or paste the text yourself—the app does not translate it for you. The value is in the visualization and the manual control over which words count as matches.'
				}
			},
			{
				'@type': 'Question',
				name: 'Can I export the alignment as an image?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. PNG, SVG, PDF, and a self-contained HTML file are all supported, along with a shareable link that encodes every line of text, every connector, and your visual settings.'
				}
			}
		]
	};

	function safeJsonLd(obj: object): string {
		return (
			'<script type="application/ld+json">' +
			JSON.stringify(obj).replace(/</g, '\\u003c') +
			'</scr' +
			'ipt>'
		);
	}
</script>

<!-- JSON-LD is trusted (serialized from app constants); @html avoids nested script parsing issues -->
<!-- eslint-disable svelte/no-at-html-tags -->
<svelte:head>
	{@html safeJsonLd(website)}
	{@html safeJsonLd(webApplication)}
	{@html safeJsonLd(faq)}
</svelte:head>
