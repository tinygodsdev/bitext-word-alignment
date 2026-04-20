<script lang="ts">
	import { browser } from '$app/environment';
	import CopyLinkButton from './CopyLinkButton.svelte';
	import ShareDialog from './ShareDialog.svelte';
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV1 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { getShareUrl } from '$lib/share/url.js';

	let shareRef: { open: () => void } | undefined = $state();

	const canWebShare = $derived(
		browser && typeof navigator !== 'undefined' && typeof navigator.share === 'function'
	);

	async function webShare() {
		const state: AppStateV1 = {
			v: SCHEMA_VERSION,
			project: projectStore.getSnapshot(),
			settings: { ...settingsStore.settings }
		};
		const url = getShareUrl(encodeState(state));
		await navigator.share({
			title: 'Word-by-word translation visualizer',
			text: 'Bilingual alignment',
			url
		});
	}
</script>

<article class="padding border round medium-elevate settings-card">
	<h5 class="no-margin bottom-margin">Share</h5>
	<p class="small-text bottom-margin">Copy a link with your alignment encoded in the URL.</p>
	<nav class="wrap">
		<CopyLinkButton />
		{#if canWebShare}
			<button type="button" class="small border" onclick={webShare}>Share…</button>
		{/if}
		<button type="button" class="small border" onclick={() => shareRef?.open()}>
			More options
		</button>
	</nav>
</article>
<ShareDialog bind:this={shareRef} />
