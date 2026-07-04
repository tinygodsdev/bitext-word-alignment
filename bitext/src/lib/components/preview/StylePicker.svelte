<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import StyleThumb from '$lib/components/settings/StyleThumb.svelte';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { STYLES_LIST, getStyle, type StyleId } from '$lib/domain/styles.js';

	let open = $state(false);
	let wrapEl = $state<HTMLDivElement | null>(null);

	const current = $derived(getStyle(settingsStore.settings.style));

	$effect(() => {
		if (!open) return;
		function onDown(e: PointerEvent) {
			if (wrapEl && !wrapEl.contains(e.target as Node)) open = false;
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') open = false;
		}
		window.addEventListener('pointerdown', onDown, true);
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('pointerdown', onDown, true);
			window.removeEventListener('keydown', onKey);
		};
	});

	function choose(id: StyleId) {
		const style = getStyle(id);
		settingsStore.patch({ style: id });
		// Picking a style bundles its palette; the user can change it afterwards.
		if (style.palette) {
			settingsStore.patch({ palette: style.palette });
			projectStore.recolorAllConnections(style.palette);
		}
		// Font / chips can change token metrics — recompute the export layout after the DOM settles.
		layoutExportStore.requestRemeasureAfterLayout();
		open = false;
	}
</script>

<div bind:this={wrapEl} class="relative inline-block">
	<Button
		color="light"
		size="sm"
		class="shrink-0 px-2! md:px-4!"
		title="Pick a visual style"
		aria-haspopup="menu"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		<span
			class="mr-2 inline-block h-4 w-4 shrink-0 rounded-full border border-black/15"
			style:background={current.canvas.previewBackground}
		></span>
		<span class="sr-only md:not-sr-only md:inline">Style: {current.label}</span>
		<span class="md:hidden">Style</span>
	</Button>

	{#if open}
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
					<StyleThumb {st} />
					<span class="px-0.5 text-xs font-medium text-gray-800 dark:text-gray-100">{st.label}</span
					>
				</button>
			{/each}
		</div>
	{/if}
</div>
