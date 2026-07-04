<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV2 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { getShareUrl } from '$lib/share/url.js';

	let copied = $state(false);

	function buildState(): AppStateV2 {
		return {
			v: SCHEMA_VERSION,
			project: projectStore.getSnapshot(),
			settings: { ...settingsStore.settings }
		};
	}

	async function copy() {
		const data = encodeState(buildState());
		const url = getShareUrl(data);
		await navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<Button
	color="primary"
	size="sm"
	class="inline-flex min-w-[5.5rem] shrink-0 justify-center px-2.5!"
	onclick={copy}
>
	{copied ? 'Copied!' : 'Copy link'}
</Button>
