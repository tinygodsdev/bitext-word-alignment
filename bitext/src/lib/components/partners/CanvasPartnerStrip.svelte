<script lang="ts">
	import { browser } from '$app/environment';
	import { ChevronDownOutline, ChevronUpOutline } from 'flowbite-svelte-icons';
	import PartnerBannerById from './PartnerBannerById.svelte';
	import type { HomePartnerId } from '$lib/partners/home-rotation.js';
	import { viewportStore } from '$lib/state/viewport.svelte.js';

	// Banners live in the free space under a short diagram; when the diagram grows tall they auto
	// collapse to a thin bar so they never steal canvas. `scrollEl` is the canvas scroll container
	// we measure. Manual toggle overrides the automatic choice for the session.
	let { partnerIds, scrollEl }: { partnerIds: HomePartnerId[]; scrollEl: HTMLElement | null } =
		$props();

	let manual = $state<'expanded' | 'collapsed' | null>(null);
	let autoCollapsed = $state(false);
	let stripEl = $state<HTMLElement | null>(null);

	const collapsed = $derived(manual ? manual === 'collapsed' : autoCollapsed);
	const count = $derived(viewportStore.isNarrow ? 1 : Math.min(2, partnerIds.length));

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
</script>

<div
	bind:this={stripEl}
	class="shrink-0 border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
	aria-label="Partner offers"
>
	{#if collapsed}
		<button
			type="button"
			class="flex w-full items-center justify-between gap-2 border-0 bg-transparent px-4 py-1.5 text-left text-xs font-medium uppercase tracking-wide text-gray-500 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-gray-400 dark:hover:text-gray-200"
			onclick={() => (manual = 'expanded')}
			aria-expanded="false"
		>
			<span>Partner offers</span>
			<ChevronUpOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
		</button>
	{:else}
		<div class="flex items-center justify-between px-4 pt-1.5">
			<span class="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
				Partner offers
			</span>
			<button
				type="button"
				class="inline-flex h-6 w-6 items-center justify-center rounded-none border-0 bg-transparent text-gray-500 hover:text-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-gray-400 dark:hover:text-gray-200"
				onclick={() => (manual = 'collapsed')}
				aria-label="Collapse partner offers"
			>
				<ChevronDownOutline class="h-4 w-4 shrink-0" aria-hidden="true" />
			</button>
		</div>
		<div class="grid gap-3 px-4 pb-3 pt-1 {count === 2 ? 'sm:grid-cols-2' : ''}">
			{#each partnerIds.slice(0, count) as id (id)}
				{#key id}
					<PartnerBannerById partnerId={id} />
				{/key}
			{/each}
		</div>
	{/if}
</div>
