<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { ALIGNER_SITE_HOST } from '$lib/brand.js';
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV1 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { getShareUrl } from '$lib/share/url.js';
	import { shareTwitterUrl, shareFacebookUrl, shareRedditUrl } from '$lib/share/social.js';
	import CopyLinkButton from './CopyLinkButton.svelte';

	let modalOpen = $state(false);

	/** Called from parent via `bind:this` */
	export function open() {
		modalOpen = true;
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

<Modal bind:open={modalOpen} title="Share" size="md">
	<p class="text-base text-gray-600 dark:text-gray-400">
		The link encodes your sentences, glosses, alignments, and visualization settings in the
		<code class="text-sm">data</code> URL parameter. It can be long, but everything is restored when
		the page opens on {ALIGNER_SITE_HOST}.
	</p>
	<p class="mt-3 break-all text-base text-gray-600 dark:text-gray-400">{shareUrl}</p>
	<div class="mt-4 flex flex-wrap gap-2">
		<CopyLinkButton />
		<Button
			href={shareTwitterUrl(title, shareUrl)}
			target="_blank"
			rel="noopener noreferrer"
			color="light"
			size="sm"
		>
			X / Twitter
		</Button>
		<Button
			href={shareFacebookUrl(shareUrl)}
			target="_blank"
			rel="noopener noreferrer"
			color="light"
			size="sm"
		>
			Facebook
		</Button>
		<Button
			href={shareRedditUrl(title, shareUrl)}
			target="_blank"
			rel="noopener noreferrer"
			color="light"
			size="sm"
		>
			Reddit
		</Button>
	</div>
</Modal>
