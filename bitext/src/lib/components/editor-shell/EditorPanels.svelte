<script lang="ts">
	import TextPanel from '$lib/components/shell/panels/TextPanel.svelte';
	import StylePanel from '$lib/components/shell/panels/StylePanel.svelte';
	import ExportPanel from '$lib/components/shell/panels/ExportPanel.svelte';
	import { editorShellStore } from '$lib/state/editorShell.svelte.js';
</script>

{#if editorShellStore.tab === 'text'}
	<TextPanel />
{:else if editorShellStore.tab === 'style'}
	<StylePanel />
{:else}
	<ExportPanel />
{/if}
