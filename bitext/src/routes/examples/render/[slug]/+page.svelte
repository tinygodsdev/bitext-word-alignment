<script lang="ts">
	/**
	 * Headless render target for `npm run examples:render` (Playwright).
	 * Not linked from the public site.
	 */
	import ExamplePreviewEmbed from '$lib/components/examples/ExamplePreviewEmbed.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	/** Fixed canvas width — must match `EXAMPLE_RENDER_WIDTH` in scripts/render-example-previews.ts */
	const RENDER_WIDTH_PX = 960;

	function markRenderReady() {
		document.documentElement.dataset.exampleRenderReady = 'true';
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>

<div class="min-h-screen bg-white p-0">
	<div class="inline-block bg-white" style:width="{RENDER_WIDTH_PX}px">
		{#key data.entry.exampleId}
			<div data-example-render-target>
				<ExamplePreviewEmbed
					exampleId={data.entry.exampleId}
					instancePrefix={`render-${data.entry.slug}`}
					onReady={markRenderReady}
				/>
			</div>
		{/key}
	</div>
</div>
