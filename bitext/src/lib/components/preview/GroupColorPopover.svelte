<script lang="ts">
	import { PALETTES } from '$lib/domain/palettes.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';

	const pending = $derived(selectionStore.pending);
	const colors = $derived(PALETTES[settingsStore.settings.palette]);

	// Whichever color currently applies to this selection: the group's color, or a pre-picked one.
	const activeColor = $derived.by(() => {
		const p = pending;
		if (!p) return null;
		void projectStore.connections;
		if (projectStore.hasGroup(p.tokenId)) return projectStore.groupColor(p.tokenId);
		return selectionStore.pendingColor;
	});

	const canReset = $derived.by(() => {
		const p = pending;
		if (!p) return false;
		void projectStore.connections;
		return projectStore.isGroupPinned(p.tokenId) || selectionStore.pendingColor != null;
	});

	let tipEl = $state<HTMLElement | null>(null);
	let top = $state(0);
	let left = $state(0);
	let ready = $state(false);

	const MARGIN = 8;

	function anchorRect(): DOMRect | null {
		const p = selectionStore.pending;
		if (!p || typeof document === 'undefined') return null;
		const sel = `[data-token-id="${CSS.escape(p.tokenId)}"][data-line="${CSS.escape(p.lineId)}"]`;
		for (const el of document.querySelectorAll(sel)) {
			const r = (el as HTMLElement).getBoundingClientRect();
			if (r.width > 0 && r.height > 0) return r;
		}
		return null;
	}

	function position() {
		if (!tipEl) return;
		const a = anchorRect();
		if (!a) {
			ready = false;
			return;
		}
		const t = tipEl.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		let topPx = a.top - t.height - MARGIN;
		// Drop below the word when there is no room above.
		if (topPx < MARGIN && a.bottom + t.height + MARGIN <= vh) topPx = a.bottom + MARGIN;
		let l = a.left + a.width / 2 - t.width / 2;
		l = Math.min(Math.max(l, MARGIN), vw - t.width - MARGIN);
		top = topPx;
		left = l;
		ready = true;
	}

	$effect(() => {
		void selectionStore.pending;
		void projectStore.connections;
		void projectStore.lines;
		if (!selectionStore.pending) {
			ready = false;
			return;
		}
		queueMicrotask(position);
		function onMove() {
			position();
		}
		// Clicking empty space (not a word, not this popover) drops the selection.
		function onPointerDown(e: PointerEvent) {
			const target = e.target as Element | null;
			if (!target) return;
			if (target.closest('[data-token-id]') || target.closest('[data-group-color-popover]')) return;
			selectionStore.clear();
		}
		window.addEventListener('scroll', onMove, true);
		window.addEventListener('resize', onMove);
		window.addEventListener('pointerdown', onPointerDown, true);
		return () => {
			window.removeEventListener('scroll', onMove, true);
			window.removeEventListener('resize', onMove);
			window.removeEventListener('pointerdown', onPointerDown, true);
		};
	});
</script>

{#if pending}
	<div
		bind:this={tipEl}
		role="dialog"
		aria-label="Group color"
		data-group-color-popover
		style:top="{top}px"
		style:left="{left}px"
		style:visibility={ready ? 'visible' : 'hidden'}
		class="fixed z-100 flex items-center gap-1 rounded-md border border-gray-200 bg-white p-1.5 shadow-lg dark:border-gray-600 dark:bg-gray-800"
	>
		{#each colors as color, i (i)}
			{@const on = activeColor === color}
			<button
				type="button"
				class="h-6 w-6 shrink-0 rounded-full border transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500 {on
					? 'border-gray-900 ring-2 ring-gray-900 dark:border-white dark:ring-white'
					: 'border-black/15 dark:border-white/20'}"
				style:background={color}
				aria-label="Set group color {i + 1}"
				aria-pressed={on}
				onclick={() => selectionStore.setColorForSelection(color)}
			></button>
		{/each}
		{#if canReset}
			<button
				type="button"
				class="ml-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
				title="Reset to automatic color"
				aria-label="Reset to automatic color"
				onclick={() => selectionStore.resetColorForSelection()}
			>
				<svg
					class="h-3.5 w-3.5"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
					<path d="M3 3v5h5" />
				</svg>
			</button>
		{/if}
	</div>
{/if}
