<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import LineCard from './LineCard.svelte';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { MAX_LINES } from '$lib/serialization/schema.js';
</script>

<Card class="w-full max-w-none p-4 sm:p-6" aria-labelledby="editor-heading">
	<div class="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
		<h2
			id="editor-heading"
			class="font-heading text-lg font-semibold text-gray-900 dark:text-white"
		>
			Editor
		</h2>
	</div>
	<p class="mb-4 w-full text-base text-gray-600 dark:text-gray-400">
		Each row is a line of text with its own font and size. In the preview, click a word, then click
		a word on an <strong>adjacent</strong> line to connect them. Connectors only run between neighboring
		lines. Click a connector to remove it. Click the same word again to deselect.
	</p>
	{#each projectStore.lines as line, i (line.id)}
		<LineCard {line} index={i} total={projectStore.lines.length} />
	{/each}
	<div class="mt-2 flex flex-wrap items-center gap-3">
		<button
			type="button"
			class="rounded-none border border-primary-600 bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 dark:border-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500"
			disabled={projectStore.lines.length >= MAX_LINES}
			onclick={() => projectStore.addLine()}
		>
			Add line
		</button>
		{#if projectStore.lines.length >= MAX_LINES}
			<p class="text-sm text-amber-700 dark:text-amber-400">
				Soft limit: {MAX_LINES} lines — consider simplifying for shorter share links.
			</p>
		{/if}
	</div>
</Card>
