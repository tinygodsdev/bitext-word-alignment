<script lang="ts">
	import TokenRow from './TokenRow.svelte';
	import AlignmentSvg from './AlignmentSvg.svelte';
	import PreviewFontLoader from './PreviewFontLoader.svelte';
	import LineReorderButtons from './LineReorderButtons.svelte';
	import LineTrailingActions from './LineTrailingActions.svelte';
	import LinePairGapSlider from './LinePairGapSlider.svelte';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { lineIsLinkTargetWhilePending } from '$lib/domain/lines-helpers.js';
	import { resolveLineFontCss } from '$lib/fonts/visualization-font.js';
	import { MAX_LINES } from '$lib/serialization/schema.js';

	let {
		instancePrefix = 'preview-default',
		writesExportLayout = true
	}: {
		/** Unique prefix for gear `id` / Popover anchor when several previews are mounted. */
		instancePrefix?: string;
		/** Only one instance should push layout into `layoutExportStore` (export / PNG). */
		writesExportLayout?: boolean;
	} = $props();

	let rootEl = $state<HTMLElement | null>(null);

	const bg = $derived(settingsStore.settings.background);
	const connections = $derived(projectStore.connections);
	const lineIds = $derived(projectStore.lines.map((l) => l.id));
</script>

<PreviewFontLoader />

<div
	bind:this={rootEl}
	class="preview-frame"
	class:preview-frame--light={bg === 'light' || bg === 'image'}
	class:preview-frame--dark={bg === 'dark'}
	style:background-image={bg === 'image' && settingsStore.settings.backgroundImageDataUrl
		? `url(${settingsStore.settings.backgroundImageDataUrl})`
		: undefined}
	style:background-size="cover"
	style:background-position="center"
>
	{#if bg === 'image' && settingsStore.settings.backgroundImageDataUrl}
		<div class="preview-frame__image-overlay"></div>
	{/if}
	<div class="preview-stack">
		<div class="mb-1 flex justify-center">
			<button
				type="button"
				class="rounded-none border border-dashed border-gray-400 px-2 py-0.5 text-xs font-medium text-gray-600 hover:border-primary-500 hover:text-primary-700 disabled:opacity-40 dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary-400 dark:hover:text-primary-300"
				disabled={projectStore.lines.length >= MAX_LINES}
				onclick={() => projectStore.addLine(0)}
			>
				+ Add line
			</button>
		</div>
		{#each projectStore.lines as line, li (line.id)}
			{@const gearDomId = `${instancePrefix}-line-gear-${line.id}`}
			{@const pending = selectionStore.pending}
			{@const rowDimmed =
				pending != null && !lineIsLinkTargetWhilePending(lineIds, pending.lineId, line.id)}
			<div
				data-line={line.id}
				class="preview-token-line flex items-center gap-3 transition-opacity duration-150"
				class:opacity-[0.34]={rowDimmed}
				style:font-family={resolveLineFontCss(line)}
			>
				<LineReorderButtons {line} index={li} total={projectStore.lines.length} />
				<div class="preview-gloss-wrap min-w-0 flex-1">
					<TokenRow
						tokens={projectStore.tokensOnLine(line.id)}
						lineId={line.id}
						textSizePx={line.textSizePx}
						gapWordPx={line.gapWordPx}
						showNumbers={settingsStore.settings.showNumbers}
						interactive={true}
					/>
				</div>
				<LineTrailingActions
					{line}
					index={li}
					total={projectStore.lines.length}
					{gearDomId}
					triggeredBy={`#${gearDomId}`}
				/>
			</div>
			{#if li < projectStore.lines.length - 1}
				{@const lowerLine = projectStore.lines[li + 1]!}
				<LinePairGapSlider upperLineId={line.id} lowerLineId={lowerLine.id} />
			{/if}
		{/each}
		<div class="mt-1 flex justify-center">
			<button
				type="button"
				class="rounded-none border border-dashed border-gray-400 px-2 py-0.5 text-xs font-medium text-gray-600 hover:border-primary-500 hover:text-primary-700 disabled:opacity-40 dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary-400 dark:hover:text-primary-300"
				disabled={projectStore.lines.length >= MAX_LINES}
				onclick={() => projectStore.addLine()}
			>
				+ Add line
			</button>
		</div>
	</div>
	<AlignmentSvg {rootEl} {connections} {writesExportLayout} />
</div>
