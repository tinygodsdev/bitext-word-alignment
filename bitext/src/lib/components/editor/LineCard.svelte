<script lang="ts">
	import { TrashBinOutline } from 'flowbite-svelte-icons';
	import type { LineV2 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { lineDrag } from '$lib/state/lineDrag.svelte.js';
	import { ButtonGroup, Input, InputAddon } from 'flowbite-svelte';

	const addonClass = 'border-gray-300! bg-gray-50! px-2! dark:border-gray-600! dark:bg-gray-700!';

	let {
		line,
		index
	}: {
		line: LineV2;
		index: number;
	} = $props();

	const isDragging = $derived(lineDrag.draggingId === line.id);
	const draggingIndex = $derived(
		lineDrag.draggingId ? projectStore.lines.findIndex((l) => l.id === lineDrag.draggingId) : -1
	);
	const isDropTarget = $derived(
		lineDrag.draggingId != null && lineDrag.draggingId !== line.id && lineDrag.overIndex === index
	);
	// A drop line above / below this row, hidden for the two gaps that would leave the row in place.
	const showDropBefore = $derived(
		isDropTarget && lineDrag.overPos === 'before' && index !== draggingIndex + 1
	);
	const showDropAfter = $derived(
		isDropTarget && lineDrag.overPos === 'after' && index !== draggingIndex - 1
	);

	function dropPosition(e: DragEvent): 'before' | 'after' {
		const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
		return e.clientY < rect.top + rect.height / 2 ? 'before' : 'after';
	}

	function onDragStart(e: DragEvent) {
		e.dataTransfer?.setData('text/plain', line.id);
		e.dataTransfer!.effectAllowed = 'move';
		lineDrag.start(line.id);
	}

	function onDragOver(e: DragEvent) {
		e.preventDefault();
		if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
		if (lineDrag.draggingId && lineDrag.draggingId !== line.id) {
			lineDrag.over(index, dropPosition(e));
		}
	}

	function onDrop(e: DragEvent) {
		e.preventDefault();
		const draggedId = e.dataTransfer?.getData('text/plain');
		const pos = dropPosition(e);
		lineDrag.end();
		if (!draggedId || draggedId === line.id) return;
		const dragIndex = projectStore.lines.findIndex((l) => l.id === draggedId);
		if (dragIndex < 0) return;
		// Position in the full list where it should land, then adjust for its own removal.
		const insertBefore = pos === 'before' ? index : index + 1;
		const restIndex = insertBefore > dragIndex ? insertBefore - 1 : insertBefore;
		projectStore.moveLineToIndex(draggedId, restIndex);
	}

	function toggleLineDir() {
		projectStore.updateLineStyle(line.id, { rtl: !line.rtl });
	}

	function lineHasAnyConnection(): boolean {
		const connections = projectStore.connections;
		return connections.some(
			(c) => c.upperTokenId.startsWith(`${line.id}-`) || c.lowerTokenId.startsWith(`${line.id}-`)
		);
	}

	function confirmRemove(): boolean {
		if (!lineHasAnyConnection()) return true;
		return typeof window !== 'undefined'
			? window.confirm('This line has connections. Removing it will delete those links. Continue?')
			: true;
	}

	function removeThisLine() {
		if (!confirmRemove()) return;
		projectStore.removeLine(line.id);
	}
</script>

<div
	class="relative mb-1.5 flex w-full flex-nowrap items-center gap-x-2 transition-opacity {isDragging
		? 'opacity-40'
		: ''}"
	ondragover={onDragOver}
	ondrop={onDrop}
	role="group"
	aria-label="Line {index + 1}"
>
	{#if showDropBefore}
		<span
			class="pointer-events-none absolute -top-[3px] right-0 left-0 h-0.5 rounded bg-primary-500 dark:bg-primary-400"
			aria-hidden="true"
		></span>
	{/if}
	{#if showDropAfter}
		<span
			class="pointer-events-none absolute -bottom-[3px] right-0 left-0 h-0.5 rounded bg-primary-500 dark:bg-primary-400"
			aria-hidden="true"
		></span>
	{/if}
	<div class="flex shrink-0 items-center gap-1.5">
		<button
			type="button"
			class="cursor-grab select-none border-0 bg-transparent p-0.5 text-gray-400 active:cursor-grabbing dark:text-gray-500"
			draggable="true"
			ondragstart={onDragStart}
			ondragend={() => lineDrag.end()}
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
	<ButtonGroup class="w-full min-w-32 flex-1 basis-48 sm:basis-auto">
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
		<InputAddon class={addonClass}>
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
		<InputAddon class="{addonClass} rounded-e-none!">
			<button
				type="button"
				class="flex cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-gray-500 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-gray-500 dark:text-gray-400 dark:hover:text-red-400 dark:focus-visible:ring-primary-400 dark:focus-visible:ring-offset-gray-800 dark:disabled:hover:text-gray-400"
				title="Remove line"
				aria-label="Remove line"
				disabled={projectStore.lines.length <= 2}
				onclick={removeThisLine}
			>
				<TrashBinOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
			</button>
		</InputAddon>
	</ButtonGroup>
</div>
