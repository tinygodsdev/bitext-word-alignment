<script lang="ts">
	import { LanguageOutline } from 'flowbite-svelte-icons';
	import { Modal, Button, Label } from 'flowbite-svelte';
	import { editorTokenizationChipValues } from '$lib/domain/tokenization-summary.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsNavStore } from '$lib/state/settingsNav.svelte.js';
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
	const tok = $derived(editorTokenizationChipValues(settingsStore.settings));
	const chipClass =
		'rounded-none bg-gray-200 px-1.5 py-0.5 font-mono text-[0.8125rem] leading-none text-gray-900 dark:bg-gray-700 dark:text-gray-100';

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
		<p
			class="flex flex-wrap items-start gap-x-2 gap-y-1 text-sm leading-snug text-gray-600 dark:text-gray-400"
		>
			<span class="min-w-0 flex-1 [&>span]:mr-1 [&>span]:last:mr-0">
				<span
					class="inline md:hidden [&>span]:mr-1 [&>span]:inline [&>span]:last:mr-0"
				>
					<span class="sr-only">Whitespace splits words.</span>
					<span
						>Split: <code class="{chipClass} max-w-[min(100%,24rem)] break-all"
							>{tok.extraSplitChars}</code
						>.</span
					>
					<span>Join: <code class={chipClass}>{tok.joinChars}</code>.</span>
					<span
						>Punct: <code class="{chipClass} max-w-[min(100%,24rem)] break-all"
							>{tok.punctuationChip}</code
						>.</span
					>
				</span>
				<span
					class="hidden md:inline [&>span]:mr-1 [&>span]:inline [&>span]:last:mr-0"
				>
					<span>Whitespace splits words.</span>
					<span>Extra split characters: <code class={chipClass}>{tok.extraSplitChars}</code>.</span>
					<span>Join characters: <code class={chipClass}>{tok.joinChars}</code>.</span>
					<span
						>Tokenize punctuation: <code class="{chipClass} max-w-[min(100%,24rem)] break-all"
							>{tok.punctuationChip}</code
						>.</span
					>
				</span>
				<span>Preview below.</span>
			</span>
			<button
				type="button"
				class="shrink-0 rounded-none border border-gray-300 bg-gray-50 p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:focus-visible:outline-gray-400"
				title="Edit tokenization (Settings → Tokens)"
				aria-label="Edit tokenization rules"
				onclick={() => settingsNavStore.focusTokensTab()}
			>
				<LanguageOutline class="h-5 w-5" aria-hidden="true" />
			</button>
		</p>
		<label
			class="my-3 block text-sm font-medium text-gray-900 dark:text-white"
			for="line-edit-textarea">Text</label
		>
		<textarea
			id="line-edit-textarea"
			class="{areaClass} mb-3"
			rows={4}
			placeholder=" "
			value={currentLine.rawText}
			dir={currentLine.rtl ? 'rtl' : 'ltr'}
			oninput={(e) =>
				projectStore.setLineText(currentLine.id, (e.currentTarget as HTMLTextAreaElement).value)}
		></textarea>
		<div class="mb-4">
			<Label
				class="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
			>
				<input
					type="checkbox"
					class="peer h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600"
					checked={Boolean(currentLine.rtl)}
					onchange={(e) =>
						projectStore.updateLineStyle(currentLine.id, {
							rtl: (e.currentTarget as HTMLInputElement).checked
						})}
				/>
				<span>Right-to-left row</span>
			</Label>
		</div>
		<div
			class="flex min-h-[2.5rem] flex-wrap items-center gap-x-2 gap-y-1.5"
			role="group"
			aria-label="Token preview"
			dir={currentLine.rtl ? 'rtl' : 'ltr'}
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
