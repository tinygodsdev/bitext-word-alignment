<script lang="ts">
	import type { LineV2 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { ButtonGroup, Input, InputAddon } from 'flowbite-svelte';

	let {
		line,
		index
	}: {
		line: LineV2;
		index: number;
	} = $props();

	function onDragStart(e: DragEvent) {
		e.dataTransfer?.setData('text/plain', line.id);
		e.dataTransfer!.effectAllowed = 'move';
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		const draggedId = e.dataTransfer?.getData('text/plain');
		if (!draggedId || draggedId === line.id) return;
		projectStore.moveLineToIndex(draggedId, index);
	}

	function toggleLineDir() {
		projectStore.updateLineStyle(line.id, { rtl: !line.rtl });
	}
</script>

<div
	class="mb-1.5 flex w-full flex-nowrap items-center gap-x-2"
	ondragover={onDragOver}
	ondrop={onDrop}
	role="group"
	aria-label="Line {index + 1}"
>
	<div class="flex shrink-0 items-center gap-1.5">
		<button
			type="button"
			class="cursor-grab select-none border-0 bg-transparent p-0.5 text-gray-400 active:cursor-grabbing dark:text-gray-500"
			draggable="true"
			ondragstart={onDragStart}
			title="Drag to reorder"
			aria-label="Drag to reorder line">⠿</button
		>
		<span
			class="font-heading w-[3.25rem] shrink-0 text-sm font-semibold text-gray-900 dark:text-white"
		>
			Line {index + 1}
		</span>
	</div>

	<ButtonGroup class="w-full min-w-32 flex-1 basis-48 sm:basis-auto">
		<label class="sr-only" for="line-{line.id}">Line {index + 1} text</label>
		<Input
			id="line-{line.id}"
			type="text"
			placeholder=" "
			value={line.rawText}
			dir={line.rtl ? 'rtl' : 'ltr'}
			class="min-w-0 flex-1"
			oninput={(e) =>
				projectStore.setLineText(line.id, (e.currentTarget as HTMLInputElement).value)}
		/>
		<InputAddon
			class="rounded-e-none! border-gray-300! bg-gray-50! px-2! dark:border-gray-600! dark:bg-gray-700!"
		>
			<button
				type="button"
				class="min-w-9 cursor-pointer select-none border-0 bg-transparent p-0 text-center text-[10px] font-medium tracking-wide text-gray-600 uppercase hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:ring-primary-400 dark:focus-visible:ring-offset-gray-800"
				title="Row direction — click to switch LTR / RTL"
				aria-label={line.rtl ? 'Right-to-left; switch to LTR' : 'Left-to-right; switch to RTL'}
				aria-pressed={line.rtl}
				onclick={toggleLineDir}
			>
				{line.rtl ? 'RTL' : 'LTR'}
			</button>
		</InputAddon>
	</ButtonGroup>
</div>
