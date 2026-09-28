<script lang="ts">
	import { onMount, tick } from 'svelte';
	import AlignmentPreview from '$lib/components/preview/AlignmentPreview.svelte';
	import { buildAppStateFromExample } from '$lib/examples/build-app-state.js';
	import { findExample, type ExampleId } from '$lib/state/examples.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';

	let {
		exampleId,
		instancePrefix = 'gallery-preview',
		onReady
	}: {
		exampleId: ExampleId;
		instancePrefix?: string;
		/** Playwright render: signal after example state, fonts, and layout are ready. */
		onReady?: () => void;
	} = $props();

	onMount(() => {
		void (async () => {
			projectStore.loadState(
				buildAppStateFromExample(findExample(exampleId), { previewHideChrome: true })
			);
			layoutExportStore.requestRemeasureAfterLayout();
			await document.fonts.ready;
			await tick();
			await new Promise<void>((resolve) => {
				requestAnimationFrame(() =>
					requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
				);
			});
			onReady?.();
		})();
	});
</script>

<!-- Readonly + previewHideChrome: no editor chrome, but line gaps still render. -->
<AlignmentPreview {instancePrefix} readonly writesExportLayout={false} />
