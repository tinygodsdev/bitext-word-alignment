<script lang="ts">
	import { CogOutline } from 'flowbite-svelte-icons';
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
	<div class="mb-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
		<button
			type="button"
			class="flex shrink-0 items-center gap-2 rounded-none border-0 bg-transparent p-0 text-left text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-white dark:focus-visible:outline-primary-500"
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
			<span id="line-editor-heading" class="font-heading text-lg font-semibold leading-snug">
				<span class="md:hidden" aria-hidden="true">Lines</span>
				<span class="sr-only md:hidden">Line editor</span>
				<span class="hidden md:inline">Line editor</span>
			</span>
		</button>
		<div
			class="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-x-2 gap-y-1 sm:flex-nowrap sm:justify-end"
		>
			<p
				class="m-0 max-w-full text-right text-sm leading-snug text-gray-600 dark:text-gray-400 [&>span]:mr-1 [&>span]:last:mr-0"
			>
				<span class="inline md:hidden [&>span]:mr-1 [&>span]:inline [&>span]:last:mr-0">
					<span class="sr-only">Whitespace splits words.</span>
					<span
						>Split: <code class="{chipClass} max-w-[min(100vw-4rem,24rem)] break-all"
							>{tok.extraSplitChars}</code
						></span
					>
					<span>Join: <code class={chipClass}>{tok.joinChars}</code></span>
					<span
						>Punct: <code class="{chipClass} max-w-[min(100vw-4rem,24rem)] break-all"
							>{tok.punctuationChip}</code
						></span
					>
				</span>
				<span class="hidden md:inline [&>span]:mr-1 [&>span]:inline [&>span]:last:mr-0">
					<span>Whitespace splits words.</span>
					<span>Extra split: <code class={chipClass}>{tok.extraSplitChars}</code>.</span>
					<span>Join: <code class={chipClass}>{tok.joinChars}</code>.</span>
					<span
						>Punctuation: <code class="{chipClass} max-w-[min(100vw-4rem,24rem)] break-all"
							>{tok.punctuationChip}</code
						>.</span
					>
				</span>
			</p>
			<button
				type="button"
				class="shrink-0 rounded-none border-0 bg-transparent p-1 text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:outline-primary-500"
				title="Tokenization settings (Settings → Tokens)"
				aria-label="Open tokenization settings"
				onclick={() => settingsNavStore.focusTokensTab()}
			>
				<CogOutline class="h-5 w-5" aria-hidden="true" />
			</button>
		</div>
	</div>

	{#if editorExpanded}
		<div id="editor-collapsible">
			{#each projectStore.lines as line, i (line.id)}
				<LineCard {line} index={i} />
			{/each}
			<div class="mt-2 flex flex-wrap items-center gap-3">
				<button
					type="button"
					class="rounded-none border border-gray-300 bg-transparent px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800/80"
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
