<script lang="ts">
	import { editorShellStore, type EditorTab } from '$lib/state/editorShell.svelte.js';

	let { variant = 'rail' }: { variant?: 'rail' | 'bottom' } = $props();

	const tabs: { tab: EditorTab; label: string }[] = [
		{ tab: 'text', label: 'Text' },
		{ tab: 'style', label: 'Style' },
		{ tab: 'export', label: 'Export' }
	];

	// On the rail the panel is always visible, so "active" is just the current tab.
	// On the bottom bar a tab is active only while its sheet is open.
	function isActive(tab: EditorTab): boolean {
		if (variant === 'bottom') return editorShellStore.sheetOpen && editorShellStore.tab === tab;
		return editorShellStore.tab === tab;
	}

	function onClick(tab: EditorTab) {
		if (variant === 'bottom') editorShellStore.toggleTab(tab);
		else editorShellStore.selectTab(tab);
	}
</script>

{#if variant === 'rail'}
	<div class="flex" role="tablist" aria-label="Editor panels">
		{#each tabs as t (t.tab)}
			{@const active = isActive(t.tab)}
			<button
				type="button"
				role="tab"
				aria-selected={active}
				class="flex-1 border-0 border-b-2 bg-transparent px-2 py-2.5 text-sm font-semibold transition-colors {active
					? 'border-primary-600 text-primary-700 dark:border-primary-400 dark:text-primary-300'
					: 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-100'}"
				onclick={() => onClick(t.tab)}
			>
				{t.label}
			</button>
		{/each}
	</div>
{:else}
	<nav class="flex items-stretch" aria-label="Editor panels">
		{#each tabs as t (t.tab)}
			{@const active = isActive(t.tab)}
			<button
				type="button"
				class="flex min-h-[54px] flex-1 flex-col items-center justify-center gap-1 border-0 bg-transparent py-2 text-xs font-semibold transition-colors {active
					? 'text-primary-600 dark:text-primary-400'
					: 'text-gray-500 dark:text-gray-400'}"
				aria-pressed={active}
				onclick={() => onClick(t.tab)}
			>
				{#if t.tab === 'text'}
					<svg
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M4 6h16M4 12h16M4 18h10" />
					</svg>
				{:else if t.tab === 'style'}
					<svg
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						aria-hidden="true"
					>
						<circle cx="12" cy="12" r="9" />
						<circle cx="9" cy="9" r="1.3" fill="currentColor" stroke="none" />
						<circle cx="15" cy="9" r="1.3" fill="currentColor" stroke="none" />
						<circle cx="9.5" cy="14.5" r="1.3" fill="currentColor" stroke="none" />
					</svg>
				{:else}
					<svg
						class="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M12 15V3M8 7l4-4 4 4M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
					</svg>
				{/if}
				{t.label}
			</button>
		{/each}
	</nav>
{/if}
