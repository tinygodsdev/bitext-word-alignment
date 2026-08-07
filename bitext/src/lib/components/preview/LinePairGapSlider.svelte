<script lang="ts">
	import { Range } from 'flowbite-svelte';
	import { MAX_LINE_GAP_PX, MIN_LINE_GAP_PX } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import type { LayoutAxis } from '$lib/types/layout.js';

	let {
		upperLineId,
		lowerLineId,
		previewDark = false,
		axis = 'rows',
		showControls = true
	}: {
		upperLineId: string;
		lowerLineId: string;
		previewDark?: boolean;
		/** `rows` reserves gap height between stacked rows; `columns` reserves width between columns. */
		axis?: LayoutAxis;
		/** When false, only reserve the gap (gallery / headless render). */
		showControls?: boolean;
	} = $props();

	const columns = $derived(axis === 'columns');

	const gapPx = $derived.by(() => {
		void projectStore.lines;
		void projectStore.linePairGaps;
		return projectStore.lineGapPxBetween(upperLineId, lowerLineId);
	});
</script>

<!-- Exact gap size between lines; the control is centered and may overflow when the gap is
     small, which `overflow-visible` allows. -->
<div
	class="relative shrink-0 overflow-visible bg-transparent"
	class:w-full={!columns}
	class:h-full={columns}
	style:width={columns ? `${gapPx}px` : undefined}
	style:min-width={columns ? `${gapPx}px` : undefined}
	style:height={columns ? undefined : `${gapPx}px`}
	style:min-height={columns ? undefined : `${gapPx}px`}
	aria-label={columns ? 'Gap between columns' : 'Vertical gap between lines'}
>
	{#if showControls}
		{#if columns}
			<!-- Column mode: the strip is only `gapPx` wide, so the control sits at its top and
			     overflows sideways rather than being squeezed. -->
			<div
				class="pointer-events-none absolute left-1/2 top-0 z-10 flex -translate-x-1/2 items-center gap-1.5 bg-transparent"
			>
				<div class="pointer-events-auto flex items-center gap-1.5 bg-transparent">
					<span
						class="shrink-0 tabular-nums text-[10px] {previewDark
							? 'text-gray-400'
							: 'text-gray-500'}">{gapPx}px</span
					>
					<Range
						appearance="auto"
						aria-label="Gap between these two lines in pixels"
						color="indigo"
						size="sm"
						min={MIN_LINE_GAP_PX}
						max={MAX_LINE_GAP_PX}
						step={1}
						value={gapPx}
						class="line-gap-range !h-1 !w-[7rem] shrink-0 !rounded-none !bg-transparent py-0 shadow-none"
						oninput={(e) =>
							projectStore.setLinePairGap(
								upperLineId,
								lowerLineId,
								Number((e.currentTarget as HTMLInputElement).value)
							)}
					/>
				</div>
			</div>
		{:else}
			<div
				class="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-center gap-3 bg-transparent"
			>
				<div class="w-[4.5rem] shrink-0 bg-transparent" aria-hidden="true"></div>
				<!-- No right spacer: match full row width so controls align with the pencil/gear column edge -->
				<div class="flex min-w-0 flex-1 justify-end bg-transparent">
					<div class="pointer-events-auto flex items-center gap-1.5 bg-transparent">
						<span
							class="shrink-0 tabular-nums text-[10px] {previewDark
								? 'text-gray-400'
								: 'text-gray-500'}">{gapPx}px</span
						>
						<Range
							appearance="auto"
							aria-label="Gap between these two lines in pixels"
							color="indigo"
							size="sm"
							min={MIN_LINE_GAP_PX}
							max={MAX_LINE_GAP_PX}
							step={1}
							value={gapPx}
							class="line-gap-range !h-1 !w-[7rem] shrink-0 !rounded-none !bg-transparent py-0 shadow-none"
							oninput={(e) =>
								projectStore.setLinePairGap(
									upperLineId,
									lowerLineId,
									Number((e.currentTarget as HTMLInputElement).value)
								)}
						/>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>
