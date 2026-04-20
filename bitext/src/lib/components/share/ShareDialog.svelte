<script lang="ts">
	/* External share URLs are intentional (not in-app routes). */
	/* eslint-disable svelte/no-navigation-without-resolve */
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV1 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { getShareUrl } from '$lib/share/url.js';
	import { shareTwitterUrl, shareFacebookUrl, shareRedditUrl } from '$lib/share/social.js';
	import CopyLinkButton from './CopyLinkButton.svelte';

	let dlg: HTMLDialogElement | undefined = $state();

	/** Called from parent via `bind:this` */
	export function open() {
		dlg?.showModal();
	}

	function buildState(): AppStateV1 {
		return {
			v: SCHEMA_VERSION,
			project: projectStore.getSnapshot(),
			settings: { ...settingsStore.settings }
		};
	}

	const shareUrl = $derived.by(() => {
		const data = encodeState(buildState());
		return getShareUrl(data);
	});

	const title = $derived('Word-by-word translation visualizer');
</script>

<dialog bind:this={dlg} class="medium padding border round">
	<h5 class="no-margin bottom-margin">Share</h5>
	<p class="small-text share-dialog-url">{shareUrl}</p>
	<nav class="wrap top-margin">
		<CopyLinkButton />
		<a
			class="button small border"
			href={shareTwitterUrl(title, shareUrl)}
			target="_blank"
			rel="noopener noreferrer">X / Twitter</a
		>
		<a
			class="button small border"
			href={shareFacebookUrl(shareUrl)}
			target="_blank"
			rel="noopener noreferrer">Facebook</a
		>
		<a
			class="button small border"
			href={shareRedditUrl(title, shareUrl)}
			target="_blank"
			rel="noopener noreferrer">Reddit</a
		>
		<button type="button" class="small border" onclick={() => dlg?.close()}>Close</button>
	</nav>
</dialog>
