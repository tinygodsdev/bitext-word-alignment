<script lang="ts">
	import { browser } from '$app/environment';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { googleFontUrlsForLines } from '$lib/fonts/visualization-font.js';
	import { loadCustomFontBlob } from '$lib/fonts/custom-fonts.js';

	const googleUrls = $derived(googleFontUrlsForLines(projectStore.lines));

	let loadedCustom = $state<Record<string, true>>({});

	$effect(() => {
		if (!browser) return;
		const lines = projectStore.lines;
		void lines;
		async function ensure(name: string | undefined) {
			if (!name) return;
			if (loadedCustom[name]) return;
			const blob = await loadCustomFontBlob(name);
			if (!blob) return;
			const ff = new FontFace(name, await blob.arrayBuffer());
			await ff.load();
			document.fonts.add(ff);
			loadedCustom = { ...loadedCustom, [name]: true };
		}
		for (const line of projectStore.lines) {
			if (line.font.source === 'custom' && line.font.customName) {
				void ensure(line.font.customName);
			}
		}
	});
</script>

<svelte:head>
	{#each googleUrls as href (href)}
		<link rel="stylesheet" {href} />
	{/each}
</svelte:head>
