<script lang="ts">
	import { browser } from '$app/environment';
	import { ChevronDownOutline, ChevronUpOutline } from 'flowbite-svelte-icons';
	import LemulaBlock from './LemulaBlock.svelte';
	import type { LemulaStripPair } from '$lib/lemula/strip-rotation.js';
	import { viewportStore } from '$lib/state/viewport.svelte.js';

	// The banners live in the free space under a short diagram; when the diagram grows tall they
	// auto collapse to a thin bar so they never steal canvas. `scrollEl` is the canvas scroll
	// container we measure. Manual toggle overrides the automatic choice for the session.
	let { pair, scrollEl }: { pair: LemulaStripPair; scrollEl: HTMLElement | null } = $props();

	let manual = $state<'expanded' | 'collapsed' | null>(null);
	let autoCollapsed = $state(false);
	let stripEl = $state<HTMLElement | null>(null);

	const collapsed = $derived(manual ? manual === 'collapsed' : autoCollapsed);
	const blocks = $derived(viewportStore.isNarrow ? pair.slice(0, 1) : pair);

	// Rough expanded height budget used as the auto-collapse threshold. Hysteresis: the strip's own
	// height is added back so expanded↔collapsed decisions do not oscillate around one diagram size.
	const EXPANDED_BUDGET_PX = 160;

	function measure() {
		if (!scrollEl) return;
		const diagram = scrollEl.scrollHeight;
		const available = scrollEl.clientHeight + (stripEl?.offsetHeight ?? 0);
		autoCollapsed = diagram + EXPANDED_BUDGET_PX > available;
	}

	$effect(() => {
		if (!browser || !scrollEl) return;
		const el = scrollEl;
		const schedule = () => requestAnimationFrame(measure);
		const ro = new ResizeObserver(schedule);
		ro.observe(el);
		if (el.firstElementChild) ro.observe(el.firstElementChild);
		if (stripEl) ro.observe(stripEl);
		window.addEventListener('resize', schedule);
		schedule();
		return () => {
			ro.disconnect();
			window.removeEventListener('resize', schedule);
		};
	});

	const toggleBtn =
		'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-none border-0 bg-transparent text-gray-500 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-gray-400 dark:hover:text-gray-200';
</script>

<aside
	bind:this={stripEl}
	class="shrink-0 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
	aria-label="Lemula banners"
>
	{#if collapsed}
		<div class="flex items-center gap-2 py-1 pr-4">
			<!-- The bar is a link over its whole width, so the expand button sits beside it. -->
			<div class="min-w-0 flex-1">
				<LemulaBlock name="bar" />
			</div>
			<button
				type="button"
				class={toggleBtn}
				onclick={() => (manual = 'expanded')}
				aria-expanded="false"
				aria-label="Expand the Lemula banner"
			>
				<ChevronUpOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
			</button>
		</div>
	{:else}
		<div class="flex justify-end px-4 pt-1">
			<button
				type="button"
				class={toggleBtn}
				onclick={() => (manual = 'collapsed')}
				aria-expanded="true"
				aria-label="Collapse the Lemula banner"
			>
				<ChevronDownOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
			</button>
		</div>
		<div class="grid gap-3 px-4 pb-3 {blocks.length === 2 ? 'sm:grid-cols-2' : ''}">
			{#each blocks as name (name)}
				<LemulaBlock {name} />
			{/each}
		</div>
	{/if}
</aside>
