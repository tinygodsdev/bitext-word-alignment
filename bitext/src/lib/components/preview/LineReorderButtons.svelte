<script lang="ts">
	import type { LineV2 } from '$lib/serialization/schema.js';
	import { ArrowDownOutline, ArrowUpOutline } from 'flowbite-svelte-icons';
	import { projectStore } from '$lib/state/project.svelte.js';

	let {
		line,
		index,
		total
	}: {
		line: LineV2;
		index: number;
		total: number;
	} = $props();

	const stripClass =
		'z-10 flex w-[4.5rem] shrink-0 justify-center gap-1 font-sans text-[14px] [font-family:var(--font-sans,system-ui,sans-serif)]';
</script>

<div class={stripClass} aria-label="Reorder line">
	<button
		type="button"
		class="rounded-none border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus-visible:outline-primary-500"
		disabled={index === 0}
		onclick={() => projectStore.moveLine(line.id, -1)}
		aria-label="Move line up"
	>
		<ArrowUpOutline class="h-4 w-4" />
	</button>
	<button
		type="button"
		class="rounded-none border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-40 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus-visible:outline-primary-500"
		disabled={index >= total - 1}
		onclick={() => projectStore.moveLine(line.id, 1)}
		aria-label="Move line down"
	>
		<ArrowDownOutline class="h-4 w-4" />
	</button>
</div>
