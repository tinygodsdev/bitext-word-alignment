<script lang="ts">
	import { Card } from 'flowbite-svelte';
	import SentenceField from './SentenceField.svelte';
	import GlossInputRow from './GlossInputRow.svelte';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
</script>

<Card class="w-full max-w-none p-4 sm:p-6" aria-labelledby="editor-heading">
	<div class="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
		<h2
			id="editor-heading"
			class="font-heading text-lg font-semibold text-gray-900 dark:text-white"
		>
			Editor
		</h2>
		<button
			type="button"
			class="shrink-0 rounded-none border-0 bg-transparent px-2 py-1 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-gray-400 dark:hover:bg-gray-800/80 dark:hover:text-gray-100 dark:focus-visible:outline-primary-500"
			onclick={() => projectStore.loadExample()}
		>
			Load example
		</button>
	</div>
	<p class="mb-4 w-full text-base text-gray-600 dark:text-gray-400">
		Edit the sentences here. To link words, click a word in the preview below, then click the
		matching word on the other line — the connector will appear. You can link a word to multiple
		words on the other side. Click a connector to remove it. Click a selected word again to deselect
		it.
	</p>
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
				<p class="mb-2 text-base text-gray-600 dark:text-gray-400">Source glosses</p>
				<GlossInputRow
					tokens={projectStore.sourceTokens}
					onGloss={(id, v) => projectStore.setSourceGloss(id, v)}
				/>
			</div>
			<div class="col-span-12 md:col-span-6">
				<p class="mb-2 text-base text-gray-600 dark:text-gray-400">Target glosses</p>
				<GlossInputRow
					tokens={projectStore.targetTokens}
					onGloss={(id, v) => projectStore.setTargetGloss(id, v)}
				/>
			</div>
		</div>
	{/if}
</Card>
