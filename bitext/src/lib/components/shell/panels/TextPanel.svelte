<script lang="ts">
	import LineCard from '$lib/components/editor/LineCard.svelte';
	import TokenizationSettings from '$lib/components/settings/TokenizationSettings.svelte';
	import { MAX_LINES } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { settingsNavStore } from '$lib/state/settingsNav.svelte.js';

	let splittingEl = $state<HTMLElement | null>(null);
	let lastTokensFocusGeneration = settingsNavStore.tokensFocusGeneration;

	// "Edit word splitting" shortcuts elsewhere land here: bring the section into view.
	$effect(() => {
		const gen = settingsNavStore.tokensFocusGeneration;
		if (gen <= lastTokensFocusGeneration) return;
		lastTokensFocusGeneration = gen;
		queueMicrotask(() => {
			splittingEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		});
	});
</script>

<div>
	{#each projectStore.lines as line, i (line.id)}
		<LineCard {line} index={i} />
	{/each}

	<div class="mt-3 flex flex-wrap items-center gap-3">
		<button
			type="button"
			class="rounded-none border border-gray-300 bg-transparent px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800/80"
			disabled={projectStore.lines.length >= MAX_LINES}
			onclick={() => projectStore.addLine()}
		>
			+ Add line
		</button>
		{#if projectStore.lines.length >= MAX_LINES}
			<p class="text-xs text-amber-700 dark:text-amber-400">
				Soft limit: {MAX_LINES} lines — consider simplifying for shorter share links.
			</p>
		{/if}
	</div>

	{#if settingsStore.settings.autoFit}
		<div
			class="mt-4 flex items-start gap-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400"
		>
			<svg
				class="mt-0.5 h-4 w-4 shrink-0 text-primary-600 dark:text-primary-400"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M20 6 9 17l-5-5" />
			</svg>
			<span
				>Long lines shrink to fit on one row automatically, so a diagram never wraps or breaks.</span
			>
		</div>
	{/if}

	<section bind:this={splittingEl} class="mt-5 border-t border-gray-200 pt-4 dark:border-gray-700">
		<h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
			Word splitting
		</h3>
		<p class="mb-3 text-xs text-gray-500 dark:text-gray-400">
			How text turns into linkable words. Applies to every line.
		</p>
		<TokenizationSettings />
	</section>
</div>
