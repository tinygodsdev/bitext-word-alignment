<script lang="ts">
	import type { LineV2 } from '$lib/serialization/schema.js';
	import { CogSolid, PenSolid } from 'flowbite-svelte-icons';
	import LineSettingsPopover from '$lib/components/editor/LineSettingsPopover.svelte';
	import { editorUiStore } from '$lib/state/editorUi.svelte.js';

	let {
		line,
		index,
		total,
		gearDomId,
		triggeredBy
	}: {
		line: LineV2;
		index: number;
		total: number;
		/** Unique in the document (required when multiple previews mount). */
		gearDomId: string;
		triggeredBy: string;
	} = $props();

	const stripClass =
		'z-10 flex w-[4.5rem] shrink-0 justify-center gap-1 font-sans text-[14px] [font-family:var(--font-sans,system-ui,sans-serif)]';
</script>

<div class={stripClass} aria-label="Edit and line settings">
	<button
		type="button"
		class="rounded-none border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus-visible:outline-primary-500"
		onclick={() => editorUiStore.openEditLine(line.id)}
		aria-label="Edit line text"
	>
		<PenSolid class="h-4 w-4" />
	</button>
	<button
		type="button"
		id={gearDomId}
		class="rounded-none border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus-visible:outline-primary-500"
		aria-label="Line settings"
	>
		<CogSolid class="h-4 w-4" />
	</button>
	<LineSettingsPopover {line} {index} {total} {triggeredBy} />
</div>
