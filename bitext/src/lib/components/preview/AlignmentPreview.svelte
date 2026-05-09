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
	import { ALIGNER_SITE_HOST, ALIGNER_SITE_URL } from '$lib/brand.js';
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
	const previewDark = $derived(bg === 'dark');
	const hideChrome = $derived(settingsStore.settings.previewHideChrome);
	const chromeHiddenLayer = 'invisible pointer-events-none select-none';
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
	{#if selectionStore.showLinkHint()}
		<p
			class="preview-frame__link-hint pointer-events-none absolute left-3 top-3 z-30 max-w-[min(calc(100%-1.5rem),15rem)] px-2 py-1 text-xs leading-snug"
			role="status"
		>
			{#if selectionStore.adjacencyHint}
				Only <strong>adjacent</strong> lines can be linked — choose a word directly above or below.
			{:else}
				Click a word on an <strong>adjacent</strong> line to create the link.
			{/if}
		</p>
	{/if}
	<div class="preview-stack">
		<div
			class="mb-1 flex justify-center {hideChrome ? chromeHiddenLayer : ''}"
			aria-hidden={hideChrome ? true : undefined}
		>
			<button
				type="button"
				class="rounded-none border border-dashed px-2 py-0.5 text-xs font-medium disabled:opacity-40 {previewDark
					? 'border-gray-600 text-gray-400 hover:border-primary-400 hover:text-primary-300'
					: 'border-gray-400 text-gray-600 hover:border-primary-500 hover:text-primary-700'}"
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
				<div
					class="shrink-0 {hideChrome ? chromeHiddenLayer : ''}"
					aria-hidden={hideChrome ? true : undefined}
				>
					<LineReorderButtons {line} index={li} total={projectStore.lines.length} {previewDark} />
				</div>
				<div class="preview-gloss-wrap min-w-0 flex-1">
					<TokenRow
						tokens={projectStore.tokensOnLine(line.id)}
						lineId={line.id}
						textSizePx={line.textSizePx}
						gapWordPx={line.gapWordPx}
						showNumbers={settingsStore.settings.showNumbers}
						interactive={true}
						rtl={Boolean(line.rtl)}
					/>
				</div>
				<div
					class="shrink-0 {hideChrome ? chromeHiddenLayer : ''}"
					aria-hidden={hideChrome ? true : undefined}
				>
					<LineTrailingActions
						{line}
						index={li}
						total={projectStore.lines.length}
						{gearDomId}
						triggeredBy={`#${gearDomId}`}
						{previewDark}
					/>
				</div>
			</div>
			{#if li < projectStore.lines.length - 1}
				{@const lowerLine = projectStore.lines[li + 1]!}
				<div
					class={hideChrome ? chromeHiddenLayer : ''}
					aria-hidden={hideChrome ? true : undefined}
				>
					<LinePairGapSlider upperLineId={line.id} lowerLineId={lowerLine.id} {previewDark} />
				</div>
			{/if}
		{/each}
		<div
			class="mt-1 flex justify-center {hideChrome ? chromeHiddenLayer : ''}"
			aria-hidden={hideChrome ? true : undefined}
		>
			<button
				type="button"
				class="rounded-none border border-dashed px-2 py-0.5 text-xs font-medium disabled:opacity-40 {previewDark
					? 'border-gray-600 text-gray-400 hover:border-primary-400 hover:text-primary-300'
					: 'border-gray-400 text-gray-600 hover:border-primary-500 hover:text-primary-700'}"
				disabled={projectStore.lines.length >= MAX_LINES}
				onclick={() => projectStore.addLine()}
			>
				+ Add line
			</button>
		</div>
		{#if hideChrome}
			<p class="preview-frame__attribution">
				Created with
				<button
					type="button"
					class="preview-frame__attribution-link inline cursor-pointer border-0 bg-transparent p-0 font-inherit underline"
					onclick={() => window.open(ALIGNER_SITE_URL, '_blank', 'noopener,noreferrer')}
				>
					{ALIGNER_SITE_HOST}
				</button>
			</p>
		{/if}
	</div>
	<AlignmentSvg {rootEl} {connections} {writesExportLayout} />
</div>
