<script lang="ts">
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV1 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { getShareUrl } from '$lib/share/url.js';

	let copied = $state(false);

	function buildState(): AppStateV1 {
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

<button type="button" class="small fill primary" onclick={copy}>
	{copied ? 'Copied!' : 'Copy share link'}
</button>
