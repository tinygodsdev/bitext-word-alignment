<script lang="ts">
	import type { LineV2 } from '$lib/serialization/schema.js';
	import {
		ArrowDownOutline,
		ArrowLeftOutline,
		ArrowRightOutline,
		ArrowUpOutline
	} from 'flowbite-svelte-icons';
	import { projectStore } from '$lib/state/project.svelte.js';
	import type { ColumnOrder, LayoutAxis } from '$lib/types/layout.js';

	let {
		line,
		index,
		total,
		previewDark = false,
		axis = 'rows',
		columnOrder = 'rtl'
	}: {
		line: LineV2;
		index: number;
		total: number;
		/** Match preview canvas background (Appearance), not site light/dark theme. */
		previewDark?: boolean;
		axis?: LayoutAxis;
		columnOrder?: ColumnOrder;
	} = $props();

	/** Arrows point where the line actually moves: earlier in stack order is left unless columns run RTL. */
	const EarlierIcon = $derived(
		axis === 'rows' ? ArrowUpOutline : columnOrder === 'rtl' ? ArrowRightOutline : ArrowLeftOutline
	);
	const LaterIcon = $derived(
		axis === 'rows'
			? ArrowDownOutline
			: columnOrder === 'rtl'
				? ArrowLeftOutline
				: ArrowRightOutline
	);
	const earlierLabel = $derived(axis === 'rows' ? 'Move line up' : 'Move line earlier');
	const laterLabel = $derived(axis === 'rows' ? 'Move line down' : 'Move line later');

	const stripClass =
		'z-10 flex w-[4.5rem] shrink-0 justify-center gap-1 font-sans text-[14px] [font-family:var(--font-sans,system-ui,sans-serif)]';

	const iconBtnClass = $derived(
		previewDark
			? 'rounded-none border border-gray-600 bg-gray-800 p-1.5 text-gray-200 hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:opacity-40'
			: 'rounded-none border border-gray-300 bg-white p-1.5 text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-40'
	);
</script>

<div class={stripClass} aria-label="Reorder line">
	<button
		type="button"
		class={iconBtnClass}
		disabled={index === 0}
		onclick={() => projectStore.moveLine(line.id, -1)}
		aria-label={earlierLabel}
	>
		<EarlierIcon class="h-4 w-4" />
	</button>
	<button
		type="button"
		class={iconBtnClass}
		disabled={index >= total - 1}
		onclick={() => projectStore.moveLine(line.id, 1)}
		aria-label={laterLabel}
	>
		<LaterIcon class="h-4 w-4" />
	</button>
</div>
