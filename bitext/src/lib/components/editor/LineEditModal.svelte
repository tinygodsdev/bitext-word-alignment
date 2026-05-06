<script lang="ts">
	import { Modal, Button } from 'flowbite-svelte';
	import { DEFAULT_TOKEN_SPLIT_CHARS } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { editorUiStore } from '$lib/state/editorUi.svelte.js';
	import { linkHover } from '$lib/state/linkHover.svelte.js';
	import { connectionForId, primaryConnectionForToken } from '$lib/domain/alignment.js';
	import TokenChip from './TokenChip.svelte';

	let modalOpen = $state(false);

	function onModalToggle(ev: ToggleEvent) {
		if (ev.newState === 'closed') {
			editorUiStore.closeEditLine();
			queueMicrotask(() => layoutExportStore.requestRemeasure());
		}
	}

	const editingId = $derived(editorUiStore.editingLineId);
	const currentLine = $derived.by(() => {
		const id = editingId;
		if (!id) return null;
		return projectStore.lines.find((l) => l.id === id) ?? null;
	});
	const lineIndex = $derived.by(() => {
		const id = editingId;
		if (!id) return -1;
		return projectStore.lines.findIndex((l) => l.id === id);
	});

	const tokens = $derived(currentLine ? projectStore.tokensOnLine(currentLine.id) : []);
	const connections = $derived(projectStore.connections);

	const areaClass =
		'block w-full rounded-none border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500';

	$effect(() => {
		if (editorUiStore.editingLineId) {
			modalOpen = true;
		} else {
			modalOpen = false;
		}
	});

	$effect(() => {
		if (editorUiStore.editingLineId) {
			selectionStore.clear();
		}
	});

	$effect(() => {
		if (editorUiStore.editingLineId && lineIndex < 0) {
			editorUiStore.closeEditLine();
		}
	});

	function tokenLinked(id: string): boolean {
		return connections.some((c) => c.upperTokenId === id || c.lowerTokenId === id);
	}

	function tokenLinkColor(id: string): string | null {
		const c = primaryConnectionForToken(connections, id);
		return c?.color ?? null;
	}

	function tokenHighlighted(id: string): boolean {
		const hid = linkHover.id;
		if (!hid) return false;
		const c = connectionForId(connections, hid);
		if (!c) return false;
		return c.upperTokenId === id || c.lowerTokenId === id;
	}

	function done() {
		editorUiStore.closeEditLine();
		modalOpen = false;
		queueMicrotask(() => layoutExportStore.requestRemeasure());
	}
</script>

<Modal
	bind:open={modalOpen}
	ontoggle={onModalToggle}
	title={currentLine && lineIndex >= 0 ? `Edit line ${lineIndex + 1}` : 'Edit line'}
	size="lg"
>
	{#if currentLine}
		<p class="text-base text-gray-600 dark:text-gray-400">
			Whitespace splits words. Extra split characters (from Linguistics in settings) also split
			within the line (currently
			<code class="rounded-none bg-gray-200 px-1 dark:bg-gray-700"
				>{settingsStore.settings.tokenSplitChars || DEFAULT_TOKEN_SPLIT_CHARS}</code
			>). Below is a live preview of tokens.
		</p>
		<label
			class="my-3 block text-sm font-medium text-gray-900 dark:text-white"
			for="line-edit-textarea">Text</label
		>
		<textarea
			id="line-edit-textarea"
			class="{areaClass} mb-4"
			rows={4}
			placeholder=" "
			value={currentLine.rawText}
			oninput={(e) =>
				projectStore.setLineText(currentLine.id, (e.currentTarget as HTMLTextAreaElement).value)}
		></textarea>
		<div
			class="flex min-h-[2.5rem] flex-wrap items-center gap-x-2 gap-y-1.5"
			role="group"
			aria-label="Token preview"
		>
			{#each tokens as t (t.id)}
				<TokenChip
					id={t.id}
					text={t.text}
					lineId={currentLine.id}
					selected={false}
					linked={tokenLinked(t.id)}
					linkHex={tokenLinkColor(t.id)}
					highlighted={tokenHighlighted(t.id)}
				/>
			{/each}
		</div>
	{:else}
		<p class="text-gray-600 dark:text-gray-400">No line selected.</p>
	{/if}

	{#snippet footer()}
		<div class="flex justify-end gap-2">
			<Button color="primary" onclick={done}>Done</Button>
		</div>
	{/snippet}
</Modal>
