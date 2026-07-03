<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ChevronDownOutline } from 'flowbite-svelte-icons';
	import { Drawer } from 'flowbite-svelte';
	import { viewportStore } from '$lib/state/viewport.svelte.js';

	let {
		open,
		title,
		onClose,
		children
	}: { open: boolean; title: string; onClose: () => void; children: Snippet } = $props();

	// Drawer needs a two-way `open`; mirror the prop into a local writable.
	let localOpen = $state(false);
	$effect(() => {
		localOpen = open && viewportStore.isNarrow;
	});

	function onDrawerToggle(ev: ToggleEvent) {
		if (ev.newState === 'closed' && open) onClose();
	}
</script>

{#if viewportStore.isNarrow}
	<Drawer
		bind:open={localOpen}
		placement="bottom"
		width="full"
		modal={false}
		dismissable={false}
		outsideclose={false}
		class="pointer-events-none flex min-h-full w-full max-w-none flex-col justify-end border-0 bg-transparent p-0 shadow-none ring-0 backdrop:bg-transparent open:bg-transparent dark:bg-transparent"
		ontoggle={onDrawerToggle}
	>
		<div
			class="pointer-events-auto max-h-[80vh] w-full overflow-hidden rounded-none border border-gray-200 bg-white shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.18)] dark:border-gray-700 dark:bg-gray-800 dark:shadow-[0_-12px_40px_-8px_rgba(0,0,0,0.45)]"
		>
			<div
				class="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800"
			>
				<span class="font-heading text-sm font-semibold text-gray-900 dark:text-white">{title}</span
				>
				<button
					type="button"
					class="inline-flex h-8 w-8 items-center justify-center rounded-none border-0 bg-transparent text-gray-500 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-gray-400 dark:hover:text-gray-100 dark:focus-visible:outline-primary-500"
					aria-label="Close {title}"
					onclick={onClose}
				>
					<ChevronDownOutline class="h-5 w-5 shrink-0" aria-hidden="true" />
				</button>
			</div>
			<div class="max-h-[calc(80vh-3rem)] overflow-y-auto px-4 pb-6 pt-3">
				{@render children()}
			</div>
		</div>
	</Drawer>
{/if}
