<script lang="ts">
	/**
	 * FAQPage JSON-LD for the visible FAQ block in `SeoSections.svelte`.
	 *
	 * The `SoftwareApplication` schema used to live here too, but Google's docs require a real
	 * `aggregateRating` or `review` on that type — with no legitimate review data we were shipping
	 * invalid markup that Google ignores. We will add it back when there is something to rate.
	 *
	 * FAQ rich results are effectively restricted to well-known health/government sites since 2023
	 * (https://developers.google.com/search/blog/2023/08/howto-faq-changes) so this markup is kept
	 * mainly for semantic coverage and ordinary snippet quality. The answer text here mirrors the
	 * visible FAQ copy on the page, which Google requires for any FAQPage markup.
	 */
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
					text: 'Yes. Select several words on one side before clicking the matching word or phrase on the other. The tool supports one-to-one, one-to-many, and many-to-many links, which often reflects real translations better than a strict one-word mapping.'
				}
			},
			{
				'@type': 'Question',
				name: 'Is this a full machine translator?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'No. You provide both sentences — the tool does not translate them for you. The value is in the visualization and the manual control over which words count as matches.'
				}
			},
			{
				'@type': 'Question',
				name: 'Can I export the alignment as an image?',
				acceptedAnswer: {
					'@type': 'Answer',
					text: 'Yes. PNG, SVG, PDF, and a self-contained HTML file are all supported, along with a shareable link that encodes both sentences, every connector, and your visual settings.'
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
	{@html safeJsonLd(faq)}
</svelte:head>
