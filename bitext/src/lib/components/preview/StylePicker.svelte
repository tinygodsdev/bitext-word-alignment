<script lang="ts">
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { STYLES_LIST, getStyle, type StyleId } from '$lib/domain/styles.js';

	let open = $state(false);
	let detailsEl = $state<HTMLDetailsElement | null>(null);

	const current = $derived(getStyle(settingsStore.settings.style));

	function choose(id: StyleId) {
		settingsStore.patch({ style: id });
		// Font / dots can change token metrics — recompute the export layout after the DOM settles.
		layoutExportStore.requestRemeasureAfterLayout();
		open = false;
		detailsEl?.removeAttribute('open');
	}
</script>

<details
	bind:this={detailsEl}
	bind:open
	class="relative inline-block"
	onfocusout={(e) => {
		if (!detailsEl?.contains(e.relatedTarget as Node)) open = false;
	}}
>
	<summary
		class="flex h-8 shrink-0 cursor-pointer list-none items-center gap-2 border border-gray-300 bg-white px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
		title="Pick a visual style"
	>
		<span
			class="inline-block h-4 w-4 shrink-0 rounded-full border border-black/15"
			style:background={current.canvas.previewBackground}
		></span>
		<span class="sr-only md:not-sr-only md:inline">Style: {current.label}</span>
		<span class="md:hidden">Style</span>
	</summary>

	<div
		class="absolute right-0 z-30 mt-1 grid w-[min(20rem,80vw)] grid-cols-2 gap-2 border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-600 dark:bg-gray-800"
		role="menu"
		aria-label="Visual styles"
	>
		{#each STYLES_LIST as st (st.id)}
			{@const selected = st.id === current.id}
			<button
				type="button"
				role="menuitemradio"
				aria-checked={selected}
				class="flex flex-col gap-1 border p-1 text-left transition-colors {selected
					? 'border-primary-500 ring-1 ring-primary-500'
					: 'border-gray-200 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-400'}"
				onclick={() => choose(st.id)}
			>
				<span
					class="relative flex h-12 items-center justify-center overflow-hidden rounded-sm"
					style:background={st.canvas.previewBackground}
				>
					<svg viewBox="0 0 80 40" class="h-full w-full" aria-hidden="true">
						<path
							d="M 22 13 C 22 26 58 14 58 27"
							fill="none"
							stroke="#ef4444"
							stroke-width="2.4"
							stroke-linecap={st.connector.cap}
							stroke-dasharray={st.connector.dash}
							style:filter={st.connector.glow ? 'drop-shadow(0 0 3px #ef4444)' : undefined}
						/>
						{#if st.connector.endpointDots}
							<circle
								cx="22"
								cy="13"
								r={st.connector.endpointDots.r * 0.5}
								fill={st.connector.endpointDots.color ?? '#ef4444'}
							/>
							<circle
								cx="58"
								cy="27"
								r={st.connector.endpointDots.r * 0.5}
								fill={st.connector.endpointDots.color ?? '#ef4444'}
							/>
						{/if}
						<text x="14" y="20" font-size="13" font-weight="600" fill={st.canvas.textColor}>A</text>
						<text x="56" y="34" font-size="13" font-weight="600" fill={st.canvas.textColor}>a</text>
					</svg>
				</span>
				<span class="px-0.5 text-xs font-medium text-gray-800 dark:text-gray-100">{st.label}</span>
			</button>
		{/each}
	</div>
</details>
