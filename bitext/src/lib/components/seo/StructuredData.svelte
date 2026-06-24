<script lang="ts">
	/** Emits one or more JSON-LD blocks into <head>. Data is trusted (built from app constants). */
	let { data }: { data: object | object[] } = $props();
	const blocks = $derived(Array.isArray(data) ? data : [data]);

	function safeJsonLd(obj: object): string {
		return (
			'<script type="application/ld+json">' +
			JSON.stringify(obj).replace(/</g, '\\u003c') +
			'</scr' +
			'ipt>'
		);
	}
</script>

<!-- @html avoids nested <script> parsing issues; content is serialized from trusted constants -->
<!-- eslint-disable svelte/no-at-html-tags -->
<svelte:head>
	{#each blocks as block (block)}
		{@html safeJsonLd(block)}
	{/each}
</svelte:head>
