<script lang="ts">
	import { browser } from '$app/environment';
	import { Button, Card } from 'flowbite-svelte';
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

<Card class="mt-0 w-full p-4 sm:p-6">
	<h2 class="font-heading mb-2 text-lg font-semibold text-gray-900 dark:text-white">Share</h2>
	<p class="mb-4 text-base text-gray-600 dark:text-gray-400">
		Copy a link with your alignment encoded in the URL.
	</p>
	<div class="flex flex-nowrap items-center gap-2 overflow-x-auto pb-0.5">
		<div class="flex shrink-0 items-center gap-2">
			<CopyLinkButton />
			<Button color="light" size="sm" class="shrink-0" onclick={() => shareRef?.open()}>
				More options
			</Button>
		</div>
		{#if canWebShare}
			<Button color="light" size="sm" class="ml-auto shrink-0" onclick={webShare}>Share…</Button>
		{/if}
	</div>
</Card>
<ShareDialog bind:this={shareRef} />
