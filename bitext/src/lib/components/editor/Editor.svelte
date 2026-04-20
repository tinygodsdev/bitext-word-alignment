<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import SentenceField from './SentenceField.svelte';
	import GlossInputRow from './GlossInputRow.svelte';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
</script>

<Card class="w-full max-w-none p-4 sm:p-6" aria-labelledby="editor-heading">
	<h2 id="editor-heading" class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
		Editor
	</h2>
	<div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
		<p class="max-w-prose text-sm text-gray-600 dark:text-gray-400">
			Select any words on the source line and any on the target line, then press
			<strong class="font-medium text-gray-800 dark:text-gray-200">Create link</strong>
			or <strong class="font-medium text-gray-800 dark:text-gray-200">Enter</strong>. You can select
			several words on one side to link many-to-one or one-to-many. The preview uses the same
			selection.
		</p>
		<Button color="light" size="sm" class="shrink-0" onclick={() => projectStore.loadExample()}>
			Load example
		</Button>
	</div>
	<div class="grid grid-cols-12 gap-4">
		<div class="col-span-12 md:col-span-6">
			<SentenceField
				label="Source sentence"
				side="source"
				rawText={projectStore.sourceTextRaw}
				tokens={projectStore.sourceTokens}
				onText={(v) => projectStore.setSourceText(v)}
			/>
		</div>
		<div class="col-span-12 md:col-span-6">
			<SentenceField
				label="Target sentence"
				side="target"
				rawText={projectStore.targetTextRaw}
				tokens={projectStore.targetTokens}
				onText={(v) => projectStore.setTargetText(v)}
			/>
		</div>
	</div>
	{#if settingsStore.settings.showGloss}
		<div class="mt-4 grid grid-cols-12 gap-4">
			<div class="col-span-12 md:col-span-6">
				<p class="mb-2 text-sm text-gray-600 dark:text-gray-400">Source glosses</p>
				<GlossInputRow
					tokens={projectStore.sourceTokens}
					onGloss={(id, v) => projectStore.setSourceGloss(id, v)}
				/>
			</div>
			<div class="col-span-12 md:col-span-6">
				<p class="mb-2 text-sm text-gray-600 dark:text-gray-400">Target glosses</p>
				<GlossInputRow
					tokens={projectStore.targetTokens}
					onGloss={(id, v) => projectStore.setTargetGloss(id, v)}
				/>
			</div>
		</div>
	{/if}
	<nav class="mt-4 flex flex-nowrap items-center gap-2 overflow-x-auto pb-0.5">
		<span class="inline-flex h-9 min-w-[7.5rem] shrink-0 items-center">
			{#if selectionStore.needsManualCommit()}
				<Button
					color="primary"
					size="sm"
					class="shrink-0"
					onclick={() => selectionStore.commitLink()}
				>
					Create link
				</Button>
			{/if}
		</span>
		<Button color="light" size="sm" class="shrink-0" onclick={() => selectionStore.clear()}>
			Clear selection
		</Button>
		{#if selectionStore.hasSelection()}
			<span class="min-w-0 truncate text-sm text-gray-600 dark:text-gray-400">
				Selection active · Enter also creates a link
			</span>
		{/if}
	</nav>
</Card>
