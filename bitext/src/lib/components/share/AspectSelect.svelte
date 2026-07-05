<script lang="ts">
	export type AspectOption = {
		id: string;
		label: string;
		ratio: string;
		/** Dashed placeholder glyph (Auto); otherwise a proportional rectangle. */
		dashed?: boolean;
		width?: number;
		height?: number;
	};

	let { value = $bindable(), options }: { value: string; options: AspectOption[] } = $props();

	let open = $state(false);
	let wrapEl = $state<HTMLDivElement | null>(null);

	const selected = $derived(options.find((o) => o.id === value) ?? options[0]);

	/** Proportional glyph (max 18px) so each option shows its shape. */
	function shape(o: AspectOption): { w: number; h: number } {
		if (o.dashed || !o.width || !o.height) return { w: 18, h: 18 };
		const r = o.width / o.height;
		const max = 18;
		return r >= 1
			? { w: max, h: Math.max(4, Math.round(max / r)) }
			: { w: Math.max(4, Math.round(max * r)), h: max };
	}

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

	function choose(id: string) {
		value = id;
		open = false;
	}
</script>

{#snippet glyph(o: AspectOption)}
	<span class="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center">
		{#if o.dashed}
			<span class="h-4.5 w-4.5 border border-dashed border-current opacity-70"></span>
		{:else}
			{@const sh = shape(o)}
			<span class="border border-current" style="width:{sh.w}px;height:{sh.h}px"></span>
		{/if}
	</span>
{/snippet}

<div bind:this={wrapEl} class="relative">
	<button
		type="button"
		class="flex w-full items-center gap-2 border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-800 transition-colors hover:border-gray-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-gray-500"
		aria-haspopup="listbox"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		{@render glyph(selected)}
		<span class="font-medium">{selected.label}</span>
		<span class="text-gray-400 dark:text-gray-500">{selected.ratio}</span>
		<svg
			class="ml-auto h-4 w-4 shrink-0 text-gray-500 transition-transform dark:text-gray-400 {open
				? 'rotate-180'
				: ''}"
			viewBox="0 0 20 20"
			fill="currentColor"
			aria-hidden="true"
		>
			<path
				fill-rule="evenodd"
				d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.24 4.5a.75.75 0 0 1-1.08 0l-4.24-4.5a.75.75 0 0 1 .02-1.06z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	{#if open}
		<ul
			class="absolute right-0 left-0 z-30 mt-1 max-h-72 list-none overflow-y-auto border border-gray-200 bg-white p-0 shadow-lg dark:border-gray-600 dark:bg-gray-800"
			role="listbox"
			aria-label="Export canvas"
		>
			{#each options as o (o.id)}
				<li>
					<button
						type="button"
						role="option"
						aria-selected={o.id === value}
						class="flex w-full items-center gap-2 px-2.5 py-2 text-left text-sm transition-colors {o.id ===
						value
							? 'bg-primary-50 text-primary-800 dark:bg-primary-950/40 dark:text-primary-200'
							: 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/70'}"
						onclick={() => choose(o.id)}
					>
						{@render glyph(o)}
						<span class="font-medium">{o.label}</span>
						<span class="text-gray-400 dark:text-gray-500">{o.ratio}</span>
					</button>
				</li>
			{/each}
		</ul>
	{/if}
</div>
