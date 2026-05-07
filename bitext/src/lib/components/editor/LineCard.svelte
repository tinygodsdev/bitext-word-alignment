<script lang="ts">
	import type { LineV2 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';

	let {
		line,
		index
	}: {
		line: LineV2;
		index: number;
	} = $props();

	const inputClass =
		'block h-9 w-full min-w-0 flex-1 rounded-none border border-gray-300 bg-gray-50 px-2 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500';

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
</script>

<div
	class="mb-1.5 flex w-full flex-nowrap items-center gap-2"
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
	<label class="sr-only" for="line-{line.id}">Line {index + 1} text</label>
	<input
		type="text"
		id="line-{line.id}"
		class={inputClass}
		placeholder=" "
		value={line.rawText}
		oninput={(e) => projectStore.setLineText(line.id, (e.currentTarget as HTMLInputElement).value)}
	/>
</div>
