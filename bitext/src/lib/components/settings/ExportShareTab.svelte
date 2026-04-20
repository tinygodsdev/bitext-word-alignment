<script lang="ts">
	import { browser } from '$app/environment';
	import ExportMenu from '$lib/components/share/ExportMenu.svelte';
	import CopyLinkButton from '$lib/components/share/CopyLinkButton.svelte';
	import ShareDialog from '$lib/components/share/ShareDialog.svelte';
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

<div>
	<div class="bottom-margin">
		<p class="small-text bottom-margin">Export</p>
		<p class="small-text bottom-margin">Exports match the preview area (measured after layout).</p>
		<ExportMenu />
	</div>
	<div>
		<p class="small-text bottom-margin">Share</p>
		<nav class="wrap">
			<CopyLinkButton />
			{#if canWebShare}
				<button type="button" class="small border" onclick={webShare}>Share…</button>
			{/if}
			<button type="button" class="small border" onclick={() => shareRef?.open()}>
				More share options
			</button>
		</nav>
	</div>
</div>
<ShareDialog bind:this={shareRef} />
