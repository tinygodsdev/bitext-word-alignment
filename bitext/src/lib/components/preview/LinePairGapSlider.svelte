<script lang="ts">
	import { Range } from 'flowbite-svelte';
	import { MAX_LINE_GAP_PX, MIN_LINE_GAP_PX } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';

	let {
		upperLineId,
		lowerLineId
	}: {
		upperLineId: string;
		lowerLineId: string;
	} = $props();

	const gapPx = $derived.by(() => {
		void projectStore.lines;
		void projectStore.linePairGaps;
		return projectStore.lineGapPxBetween(upperLineId, lowerLineId);
	});
</script>

<!-- Exact gap height between rows; slider centered and may overflow when gap is small (overflow-visible). -->
<div
	class="relative w-full overflow-visible bg-transparent"
	style:height={`${gapPx}px`}
	style:min-height={`${gapPx}px`}
	aria-label="Vertical gap between lines"
>
	<div
		class="pointer-events-none absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-center gap-3 bg-transparent"
	>
		<div class="w-[4.5rem] shrink-0 bg-transparent" aria-hidden="true"></div>
		<!-- No right spacer: match full row width so controls align with the pencil/gear column edge -->
		<div class="flex min-w-0 flex-1 justify-end bg-transparent">
			<div class="pointer-events-auto flex items-center gap-1.5 bg-transparent">
				<span class="shrink-0 tabular-nums text-[10px] text-gray-500 dark:text-gray-400"
					>{gapPx}px</span
				>
				<Range
					appearance="auto"
					color="indigo"
					size="sm"
					min={MIN_LINE_GAP_PX}
					max={MAX_LINE_GAP_PX}
					step={1}
					value={gapPx}
					class="line-gap-range !h-1 !w-[7rem] shrink-0 !rounded-none !bg-transparent py-0 shadow-none dark:!bg-transparent"
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
</div>
