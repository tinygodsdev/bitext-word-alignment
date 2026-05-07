<script lang="ts">
	import { LanguageOutline } from 'flowbite-svelte-icons';
	import LineCard from './LineCard.svelte';
	import { editorTokenizationChipValues } from '$lib/domain/tokenization-summary.js';
	import { MAX_LINES } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsNavStore } from '$lib/state/settingsNav.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	let editorExpanded = $state(true);

	const tok = $derived(editorTokenizationChipValues(settingsStore.settings));
	const chipClass =
		'rounded-none bg-gray-200 px-1.5 py-0.5 font-mono text-[0.8125rem] leading-none text-gray-900 dark:bg-gray-700 dark:text-gray-100';
</script>

<section class="mb-8" aria-labelledby="line-editor-heading">
	<div class="mb-2 flex flex-wrap items-center justify-between gap-2">
		<button
			type="button"
			class="flex items-center gap-2 rounded-none border-0 bg-transparent p-0 text-left text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-white dark:focus-visible:outline-primary-500"
			onclick={() => (editorExpanded = !editorExpanded)}
			aria-expanded={editorExpanded}
			aria-controls="editor-collapsible"
		>
			<svg
				class="h-4 w-4 shrink-0 text-gray-500 transition-transform dark:text-gray-400 {editorExpanded
					? 'rotate-90'
					: ''}"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 0 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08.0Z"
					clip-rule="evenodd"
				/>
			</svg>
			<span id="line-editor-heading" class="font-heading text-lg font-semibold">Line editor</span>
		</button>
	</div>

	{#if editorExpanded}
		<div id="editor-collapsible">
			<p
				class="mb-3 flex w-full flex-wrap items-start gap-x-2 gap-y-1 text-sm leading-snug text-gray-600 dark:text-gray-400"
			>
				<span class="min-w-0 flex-1 [&>span]:mr-1 [&>span]:inline [&>span]:last:mr-0">
					<span>Whitespace splits words.</span>
					<span>Extra split characters: <code class={chipClass}>{tok.extraSplitChars}</code>.</span>
					<span>Join characters: <code class={chipClass}>{tok.joinChars}</code>.</span>
					<span
						>Tokenize punctuation: <code class="{chipClass} max-w-[min(100%,24rem)] break-all"
							>{tok.punctuationChip}</code
						>.</span
					>
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
			{#each projectStore.lines as line, i (line.id)}
				<LineCard {line} index={i} />
			{/each}
			<div class="mt-2 flex flex-wrap items-center gap-3">
				<button
					type="button"
					class="rounded-none border border-primary-600 bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50 dark:border-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500"
					disabled={projectStore.lines.length >= MAX_LINES}
					onclick={() => projectStore.addLine()}
				>
					Add line
				</button>
				{#if projectStore.lines.length >= MAX_LINES}
					<p class="text-xs text-amber-700 dark:text-amber-400">
						Soft limit: {MAX_LINES} lines — consider simplifying for shorter share links.
					</p>
				{/if}
			</div>
		</div>
	{/if}
</section>
