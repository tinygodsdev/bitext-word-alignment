<script lang="ts">
	import { browser } from '$app/environment';
	import { FacebookSolid, RedditSolid, TwitterSolid } from 'flowbite-svelte-icons';
	import { Button } from 'flowbite-svelte';
	import CopyLinkButton from './CopyLinkButton.svelte';
	import ShareDialog from './ShareDialog.svelte';
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV2 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { getShareUrl } from '$lib/share/url.js';
	import { shareTwitterUrl, shareFacebookUrl, shareRedditUrl } from '$lib/share/social.js';

	let shareRef: { open: () => void } | undefined = $state();

	const shareTitle = 'Word-by-word translation visualizer';

	const shareUrl = $derived.by(() => {
		const state: AppStateV2 = {
			v: SCHEMA_VERSION,
			project: projectStore.getSnapshot(),
			settings: { ...settingsStore.settings }
		};
		return getShareUrl(encodeState(state));
	});

	const twitterHref = $derived(shareTwitterUrl(shareTitle, shareUrl));
	const facebookHref = $derived(shareFacebookUrl(shareUrl));
	const redditHref = $derived(shareRedditUrl(shareTitle, shareUrl));

	const canWebShare = $derived(
		browser && typeof navigator !== 'undefined' && typeof navigator.share === 'function'
	);

	async function webShare() {
		const state: AppStateV2 = {
			v: SCHEMA_VERSION,
			project: projectStore.getSnapshot(),
			settings: { ...settingsStore.settings }
		};
		const url = getShareUrl(encodeState(state));
		await navigator.share({
			title: shareTitle,
			text: 'Bilingual alignment',
			url
		});
	}

	const iconLinkClass =
		'inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-none border-0 bg-transparent text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-primary-400 dark:hover:bg-primary-900/40 dark:hover:text-primary-300';
</script>

<div>
	<p class="text-xs text-gray-500 dark:text-gray-400 {browser ? 'mb-3' : 'mb-4'}">
		Copy a link with your alignment in the URL, or share to social media.
	</p>
	{#if browser}
		<div class="mb-4 flex flex-wrap items-center gap-3" aria-label="Share on social media">
			<a
				href={twitterHref}
				target="_blank"
				rel="noopener noreferrer external"
				class={iconLinkClass}
				title="Share on X (Twitter)"
				aria-label="Share on X (Twitter)"
			>
				<TwitterSolid class="h-8 w-8 shrink-0" aria-hidden="true" />
			</a>
			<a
				href={facebookHref}
				target="_blank"
				rel="noopener noreferrer external"
				class={iconLinkClass}
				title="Share on Facebook"
				aria-label="Share on Facebook"
			>
				<FacebookSolid class="h-8 w-8 shrink-0" aria-hidden="true" />
			</a>
			<a
				href={redditHref}
				target="_blank"
				rel="noopener noreferrer external"
				class={iconLinkClass}
				title="Share on Reddit"
				aria-label="Share on Reddit"
			>
				<RedditSolid class="h-8 w-8 shrink-0" aria-hidden="true" />
			</a>
		</div>
	{/if}
	<div class="flex flex-wrap items-center gap-2">
		<CopyLinkButton />
		<Button color="light" size="sm" class="shrink-0 px-2.5!" onclick={() => shareRef?.open()}>
			More
		</Button>
		{#if canWebShare}
			<Button color="light" size="sm" class="shrink-0 px-2.5!" onclick={webShare}>Share…</Button>
		{/if}
	</div>
</div>
<ShareDialog bind:this={shareRef} />
