<script lang="ts">
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { Drawer } from 'flowbite-svelte';
	import LineSettingsForm from './LineSettingsForm.svelte';
	import { editorUiStore } from '$lib/state/editorUi.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { viewportStore } from '$lib/state/viewport.svelte.js';

	let open = $state(false);

	const lineId = $derived(editorUiStore.lineSettingsId);
	const line = $derived(lineId ? (projectStore.lines.find((l) => l.id === lineId) ?? null) : null);
	const index = $derived(line ? projectStore.lines.findIndex((l) => l.id === line.id) : -1);

	$effect(() => {
		const id = lineId;
		if (id && !projectStore.lines.some((l) => l.id === id)) {
			editorUiStore.closeLineSettings();
		}
	});

	$effect(() => {
		const wantSheet = viewportStore.isNarrow && lineId != null && line != null && index >= 0;
		open = wantSheet;
	});

	function closeSheet() {
		open = false;
		editorUiStore.closeLineSettings();
		queueMicrotask(() => layoutExportStore.requestRemeasureAfterLayout());
	}

	function onDrawerToggle(ev: ToggleEvent) {
		if (ev.newState === 'closed') {
			editorUiStore.closeLineSettings();
			queueMicrotask(() => layoutExportStore.requestRemeasureAfterLayout());
		}
	}
</script>

{#if viewportStore.isNarrow && line && index >= 0}
	<Drawer
		bind:open
		placement="bottom"
		width="full"
		modal={false}
		dismissable={false}
		outsideclose={false}
		class="pointer-events-none flex min-h-full w-full max-w-none flex-col justify-end border-0 bg-transparent p-0 shadow-none ring-0 backdrop:bg-transparent open:bg-transparent dark:bg-transparent"
		ontoggle={onDrawerToggle}
	>
		<div
			class="pointer-events-auto max-h-[85vh] w-full overflow-hidden rounded-none border border-gray-200 bg-white shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.18)] dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.45)]"
		>
			<div
				class="sticky top-0 z-10 border-b border-primary-700 bg-primary-600 dark:border-primary-800 dark:bg-primary-700"
			>
				<button
					type="button"
					class="flex w-full flex-col items-center gap-0 py-1.5 text-white outline-none hover:bg-primary-700 active:bg-primary-800 dark:hover:bg-primary-600 dark:active:bg-primary-800"
					aria-label="Close line settings"
					onclick={closeSheet}
				>
					<ChevronDownOutline class="h-4 w-4 shrink-0 opacity-95" aria-hidden="true" />
				</button>
			</div>
			<div class="max-h-[calc(85vh-2rem)] overflow-y-auto px-3 pb-4 pt-1">
				<LineSettingsForm variant="sheet" {line} {index} total={projectStore.lines.length} />
			</div>
		</div>
	</Drawer>
{/if}
