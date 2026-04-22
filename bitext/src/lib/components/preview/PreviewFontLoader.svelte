<script lang="ts">
	import { browser } from '$app/environment';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { loadCustomFontBlob } from '$lib/fonts/custom-fonts.js';
	import { visualizationGoogleFontUrls } from '$lib/fonts/visualization-font.js';

	const s = $derived(settingsStore.settings);

	const googleUrls = $derived(visualizationGoogleFontUrls(s));

	let loadedCustom = $state<{ source?: string; target?: string; gloss?: string }>({});

	$effect(() => {
		if (!browser) return;
		void s.sourceCustomFontName;
		void s.targetCustomFontName;
		void s.glossCustomFontName;
		void s.sourceFontSource;
		void s.targetFontSource;
		void s.glossFontSource;

		async function ensure(side: 'source' | 'target' | 'gloss', name: string | undefined) {
			if (!name) return;
			const key =
				side === 'source'
					? loadedCustom.source
					: side === 'target'
						? loadedCustom.target
						: loadedCustom.gloss;
			if (key === name) return;
			const blob = await loadCustomFontBlob(name);
			if (!blob) return;
			const ff = new FontFace(name, await blob.arrayBuffer());
			await ff.load();
			document.fonts.add(ff);
			if (side === 'source') loadedCustom = { ...loadedCustom, source: name };
			else if (side === 'target') loadedCustom = { ...loadedCustom, target: name };
			else loadedCustom = { ...loadedCustom, gloss: name };
		}

		if (s.sourceFontSource === 'custom') void ensure('source', s.sourceCustomFontName);
		if (s.targetFontSource === 'custom') void ensure('target', s.targetCustomFontName);
		if (s.glossFontSource === 'custom') void ensure('gloss', s.glossCustomFontName);
	});
</script>

<svelte:head>
	{#each googleUrls as href (href)}
		<link rel="stylesheet" {href} />
	{/each}
</svelte:head>
