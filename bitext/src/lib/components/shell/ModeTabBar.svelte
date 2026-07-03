<script lang="ts">
	import { workspaceStore, type WorkspaceMode } from '$lib/state/workspace.svelte.js';

	// Bottom bar holds the three editing verbs. Export is a separate primary action.
	const tabs: { mode: WorkspaceMode; label: string; icon: string }[] = [
		{ mode: 'text', label: 'Text', icon: 'M4 6h16M4 12h16M4 18h10' },
		{
			mode: 'link',
			label: 'Link',
			icon: 'M9 12a3 3 0 0 1 3-3h3a3 3 0 0 1 0 6h-1 M15 12a3 3 0 0 1-3 3H9a3 3 0 0 1 0-6h1'
		},
		{ mode: 'style', label: 'Style', icon: '' }
	];

	function pick(mode: WorkspaceMode) {
		// Tapping the active mode's tab (text/style) closes back to the bare canvas.
		if (workspaceStore.mode === mode && mode !== 'link') workspaceStore.closeSheet();
		else workspaceStore.setMode(mode);
	}
</script>

<nav
	class="flex items-stretch border-t border-gray-200 bg-white lg:hidden dark:border-gray-700 dark:bg-gray-900"
	aria-label="Editor modes"
>
	{#each tabs as t (t.mode)}
		{@const active =
			workspaceStore.mode === t.mode || (t.mode === 'link' && workspaceStore.mode === 'link')}
		<button
			type="button"
			class="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-1 border-0 bg-transparent py-2 text-xs font-semibold transition-colors {active
				? 'text-primary-600 dark:text-primary-400'
				: 'text-gray-500 dark:text-gray-400'}"
			aria-current={active ? 'true' : undefined}
			onclick={() => pick(t.mode)}
		>
			{#if t.mode === 'style'}
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
					<path d={t.icon} />
				</svg>
			{/if}
			{t.label}
		</button>
	{/each}
</nav>
