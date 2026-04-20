<script lang="ts">
	import { DEFAULT_DESCRIPTION, SITE_NAME } from '$lib/seo/metadata.js';

	let { origin }: { origin: string } = $props();

	const software = $derived({
		'@context': 'https://schema.org',
		'@type': 'SoftwareApplication',
		name: SITE_NAME,
		applicationCategory: 'EducationalApplication',
		offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
		description: DEFAULT_DESCRIPTION,
		url: origin + '/'
	});

	const faq = $derived({
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: [
			{
				'@type': 'Question',
				name: 'Is this a machine aligner?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'No — you align manually by clicking for full control.'
				}
			},
			{
				'@type': 'Question',
				name: 'Can I export for print or slides?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes — PNG, SVG, PDF, and HTML exports are supported.'
				}
			}
		]
	});

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
	{@html safeJsonLd(software)}
	{@html safeJsonLd(faq)}
</svelte:head>
