<script lang="ts">
	import { Popover } from 'flowbite-svelte';
	import type { LineV2 } from '$lib/serialization/schema.js';
	import LineSettingsForm from './LineSettingsForm.svelte';
	import { editorUiStore } from '$lib/state/editorUi.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { viewportStore } from '$lib/state/viewport.svelte.js';

	let {
		line,
		index,
		total,
		triggeredBy
	}: {
		line: LineV2;
		index: number;
		total: number;
		triggeredBy: string;
	} = $props();

	let popoverOpen = $state(false);

	$effect(() => {
		if (viewportStore.isNarrow) return;
		popoverOpen = editorUiStore.lineSettingsId === line.id;
	});

	function onPopoverToggle(ev: ToggleEvent) {
		if (ev.newState === 'open') {
			editorUiStore.openLineSettings(line.id);
		} else {
			if (editorUiStore.lineSettingsId === line.id) {
				editorUiStore.closeLineSettings();
			}
			layoutExportStore.requestRemeasureAfterLayout();
		}
	}
</script>

<Popover
	bind:isOpen={popoverOpen}
	{triggeredBy}
	trigger="click"
	strategy="fixed"
	placement="right-start"
	arrow={false}
	ontoggle={onPopoverToggle}
	class="!rounded-none !shadow-2xl ring-1 ring-black/10 dark:ring-white/10"
	classes={{ content: '!p-[13px]' }}
>
	<div
		class="max-h-[70vh] w-[min(calc(100vw-1rem),19.5rem)] max-w-full overflow-y-auto text-left font-sans text-sm text-gray-900 dark:text-gray-100"
	>
		<LineSettingsForm {line} {index} {total} />
	</div>
</Popover>
