<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import {
		ExpandOutline,
		EyeOutline,
		EyeSlashOutline,
		FolderOpenOutline,
		TrashBinOutline
	} from 'flowbite-svelte-icons';
	import AlignmentPreview from '$lib/components/preview/AlignmentPreview.svelte';
	import ModeTabBar from './ModeTabBar.svelte';
	import ModeSheet from './ModeSheet.svelte';
	import TextPanel from './panels/TextPanel.svelte';
	import StylePanel from './panels/StylePanel.svelte';
	import ExportPanel from './panels/ExportPanel.svelte';
	import { workspaceStore, type WorkspaceMode } from '$lib/state/workspace.svelte.js';
	import { viewportStore } from '$lib/state/viewport.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { editorExamples, type ExampleId } from '$lib/state/examples.js';

	let {
		writesExportLayout = true,
		onExpand
	}: { writesExportLayout?: boolean; onExpand?: () => void } = $props();

	const previewHideChrome = $derived(settingsStore.settings.previewHideChrome);

	let loadExampleEl = $state<HTMLDetailsElement | null>(null);
	function pickExample(kind: ExampleId) {
		projectStore.loadExample(kind);
		if (loadExampleEl) loadExampleEl.open = false;
	}

	const railTabs: { mode: WorkspaceMode; label: string }[] = [
		{ mode: 'text', label: 'Text' },
		{ mode: 'link', label: 'Link' },
		{ mode: 'style', label: 'Style' }
	];

	const exampleDropdownBtn =
		'inline-flex list-none cursor-pointer items-center gap-1 rounded-none border border-gray-300 bg-white px-2 py-1.5 text-sm font-medium text-gray-800 shadow-sm marker:hidden outline-none hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700/80 dark:focus-visible:ring-primary-500 [&::-webkit-details-marker]:hidden';
	const exampleDropdownItem =
		'block w-full border-0 bg-transparent px-3 py-2 text-left text-sm text-gray-800 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-700/80';
</script>

<div class="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-6">
	<!-- CANVAS COLUMN -->
	<div class="flex min-w-0 flex-col">
		<!-- Toolbar above the canvas -->
		<div class="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2">
			<details bind:this={loadExampleEl} class="group relative shrink-0">
				<summary class={exampleDropdownBtn} title="Load example">
					<FolderOpenOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
					<span class="sr-only sm:not-sr-only sm:inline">Example</span>
					<svg
						class="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-180 dark:text-gray-400"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fill-rule="evenodd"
							d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
							clip-rule="evenodd"
						/>
					</svg>
				</summary>
				<div
					class="absolute left-0 top-full z-20 mt-1 min-w-[16rem] border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-600 dark:bg-gray-800"
					role="menu"
					aria-label="Example projects"
				>
					{#each editorExamples() as ex (ex.id)}
						<button
							type="button"
							class={exampleDropdownItem}
							role="menuitem"
							onclick={() => pickExample(ex.id)}
						>
							{ex.label}
						</button>
					{/each}
				</div>
			</details>

			<div class="flex flex-1 flex-wrap items-center justify-end gap-2">
				<Button
					color="light"
					size="sm"
					class="shrink-0 px-2!"
					title="Hide the controls inside the preview frame"
					aria-pressed={previewHideChrome}
					onclick={() => {
						settingsStore.patch({ previewHideChrome: !previewHideChrome });
						layoutExportStore.requestRemeasureAfterLayout();
					}}
				>
					{#if previewHideChrome}
						<EyeOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
					{:else}
						<EyeSlashOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
					{/if}
					<span class="sr-only md:not-sr-only md:ml-1 md:inline">
						{previewHideChrome ? 'Show controls' : 'Hide controls'}
					</span>
				</Button>
				<Button
					color="light"
					size="sm"
					class="shrink-0 px-2!"
					title="Remove every word link"
					disabled={projectStore.connections.length === 0}
					onclick={() => {
						projectStore.clearAllConnections();
						selectionStore.clear();
					}}
				>
					<TrashBinOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
					<span class="sr-only md:not-sr-only md:ml-1 md:inline">Clear links</span>
				</Button>
				{#if onExpand}
					<Button
						color="light"
						size="sm"
						class="shrink-0 px-2!"
						title="Expand preview to fullscreen"
						onclick={onExpand}
					>
						<ExpandOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
						<span class="sr-only md:not-sr-only md:ml-1 md:inline">Expand</span>
					</Button>
				{/if}
				<button
					type="button"
					class="inline-flex shrink-0 items-center gap-1.5 rounded-none border border-primary-700 bg-primary-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:border-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500"
					aria-pressed={workspaceStore.mode === 'export'}
					onclick={() => workspaceStore.setMode('export')}
				>
					<svg
						class="h-4 w-4"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M12 15V3M8 7l4-4 4 4M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"
						/>
					</svg>
					Export
				</button>
			</div>
		</div>

		<!-- Canvas: the single canonical preview (writes the export layout) -->
		<div class="relative -mx-4 sm:-mx-6 lg:mx-0">
			<AlignmentPreview instancePrefix="preview-inline" {writesExportLayout} />
		</div>

		<!-- Narrow: bottom mode bar, sticky to the bottom of the workspace -->
		{#if viewportStore.isNarrow}
			<div class="sticky bottom-0 z-20 -mx-4 mt-3 sm:-mx-6">
				<ModeTabBar />
			</div>
		{/if}
	</div>

	<!-- Wide: docked rail -->
	{#if !viewportStore.isNarrow}
		<aside class="min-w-0" aria-label="Controls">
			<div class="border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
				<div
					class="flex border-b border-gray-200 dark:border-gray-700"
					role="tablist"
					aria-label="Editor modes"
				>
					{#each railTabs as t (t.mode)}
						{@const active = workspaceStore.mode === t.mode}
						<button
							type="button"
							role="tab"
							aria-selected={active}
							class="flex-1 border-0 border-b-2 bg-transparent px-2 py-2.5 text-sm font-semibold transition-colors {active
								? 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-300'
								: 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'}"
							onclick={() => workspaceStore.setMode(t.mode)}
						>
							{t.label}
						</button>
					{/each}
				</div>
				<div class="p-4">
					{#if workspaceStore.mode === 'text'}
						<TextPanel />
					{:else if workspaceStore.mode === 'style'}
						<StylePanel />
					{:else if workspaceStore.mode === 'export'}
						<ExportPanel />
					{:else}
						<p class="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
							Tap a word, then its match on the next line, to connect them. Tap a thread to remove
							it. Switch to <strong>Text</strong> to edit the lines or <strong>Style</strong> to change
							the look.
						</p>
					{/if}
				</div>
			</div>
		</aside>
	{/if}
</div>

<!-- Narrow: bottom sheets (self-gated to narrow screens) -->
<ModeSheet
	open={workspaceStore.mode === 'text'}
	title="Your text"
	onClose={() => workspaceStore.closeSheet()}
>
	<TextPanel />
</ModeSheet>
<ModeSheet
	open={workspaceStore.mode === 'style'}
	title="Style"
	onClose={() => workspaceStore.closeSheet()}
>
	<StylePanel />
</ModeSheet>
<ModeSheet
	open={workspaceStore.mode === 'export'}
	title="Export & share"
	onClose={() => workspaceStore.closeSheet()}
>
	<ExportPanel />
</ModeSheet>
