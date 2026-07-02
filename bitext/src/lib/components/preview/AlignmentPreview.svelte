<script lang="ts">
	import { browser } from '$app/environment';
	import TokenRow from './TokenRow.svelte';
	import AlignmentSvg from './AlignmentSvg.svelte';
	import PreviewFontLoader from './PreviewFontLoader.svelte';
	import LineReorderButtons from './LineReorderButtons.svelte';
	import LineTrailingActions from './LineTrailingActions.svelte';
	import LinePairGapSlider from './LinePairGapSlider.svelte';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { lineIsLinkTargetWhilePending } from '$lib/domain/lines-helpers.js';
	import { getStyle, effectiveLineFamily } from '$lib/domain/styles.js';
	import { computeAutoFitScales, scalesChanged } from '$lib/domain/autofit.js';
	import type { LineV2 } from '$lib/serialization/schema.js';
	import { ALIGNER_SITE_HOST, ALIGNER_SITE_URL } from '$lib/brand.js';
	import { MAX_LINES } from '$lib/serialization/schema.js';

	let {
		instancePrefix = 'preview-default',
		writesExportLayout = true,
		readonly = false
	}: {
		/** Unique prefix for gear `id` / Popover anchor when several previews are mounted. */
		instancePrefix?: string;
		/** Only one instance should push layout into `layoutExportStore` (export / PNG). */
		writesExportLayout?: boolean;
		/** Gallery embed: no editing controls, non-interactive tokens. */
		readonly?: boolean;
	} = $props();

	let rootEl = $state<HTMLElement | null>(null);

	const bg = $derived(settingsStore.settings.background);
	const style = $derived(getStyle(settingsStore.settings.style));
	const isClassicStyle = $derived(style.id === 'classic');
	const previewDark = $derived(isClassicStyle ? bg === 'dark' : style.canvas.isDark);

	function lineFontCss(line: LineV2): string {
		return `"${effectiveLineFamily(line, style)}", sans-serif`;
	}
	const hideChrome = $derived(readonly || settingsStore.settings.previewHideChrome);
	const chromeHiddenLayer = 'invisible pointer-events-none select-none';
	const connections = $derived(projectStore.connections);
	const lineIds = $derived(projectStore.lines.map((l) => l.id));

	// --- Auto-fit: shrink font/gap so a line never wraps to a second row ---
	const autoFit = $derived(settingsStore.settings.autoFit);
	const autoFitVariance = $derived(settingsStore.settings.autoFitVariance);
	let effScale = $state<Record<string, number>>({});

	function scaleFor(id: string): number {
		return autoFit ? (effScale[id] ?? 1) : 1;
	}

	$effect(() => {
		// Re-run when anything that changes line widths changes.
		void projectStore.lines;
		for (const l of projectStore.lines) {
			void l.rawText;
			void l.textSizePx;
			void l.gapWordPx;
			void l.font;
		}
		void settingsStore.settings.autoFit;
		void settingsStore.settings.autoFitVariance;
		void settingsStore.settings.showNumbers;
		void settingsStore.settings.tokenSplitChars;
		void settingsStore.settings.style;
		void writesExportLayout;
		void layoutExportStore.layoutRemeasureTick;

		if (!browser || !rootEl) return;

		if (!autoFit) {
			if (Object.keys(effScale).length) effScale = {};
			if (writesExportLayout) layoutExportStore.setFontScaleByLine({});
			return;
		}

		function recompute() {
			if (!rootEl) return;
			const rows: { lineId: string; width: number; effScale: number }[] = [];
			let avail = Infinity;
			rootEl.querySelectorAll<HTMLElement>('.token-row[data-line]').forEach((row) => {
				const id = row.dataset.line;
				if (!id) return;
				const a = row.parentElement?.clientWidth ?? row.clientWidth;
				if (a > 0) avail = Math.min(avail, a);
				rows.push({ lineId: id, width: row.scrollWidth, effScale: effScale[id] ?? 1 });
			});
			if (!rows.length || !Number.isFinite(avail)) return;
			const next = computeAutoFitScales(rows, avail * 0.98, autoFitVariance);
			if (scalesChanged(effScale, next)) effScale = next;
			if (writesExportLayout) layoutExportStore.setFontScaleByLine(effScale);
		}

		const ro = new ResizeObserver(() => {
			requestAnimationFrame(() => recompute());
		});
		ro.observe(rootEl);
		requestAnimationFrame(() => requestAnimationFrame(() => recompute()));

		let cancelled = false;
		if (document.fonts) {
			void document.fonts.ready.then(() => {
				if (!cancelled) recompute();
			});
			document.fonts.addEventListener('loadingdone', recompute);
		}
		return () => {
			cancelled = true;
			ro.disconnect();
			if (document.fonts) document.fonts.removeEventListener('loadingdone', recompute);
		};
	});
</script>

<PreviewFontLoader />

<div
	bind:this={rootEl}
	class="preview-frame {style.frameClass ?? ''}"
	class:preview-frame--light={!previewDark}
	class:preview-frame--dark={previewDark}
	data-aligner-style={style.id}
	data-autofit={autoFit ? 'on' : 'off'}
	style:background={isClassicStyle ? undefined : style.canvas.previewBackground}
	style:color={isClassicStyle ? undefined : style.canvas.textColor}
>
	{#if style.id === 'deco'}
		<span class="aligner-deco-diamond aligner-deco-diamond--top" aria-hidden="true"></span>
		<span class="aligner-deco-diamond aligner-deco-diamond--bottom" aria-hidden="true"></span>
	{/if}
	{#if !readonly && selectionStore.showLinkHint()}
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
		{#if !readonly}
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
		{/if}
		{#each projectStore.lines as line, li (line.id)}
			{@const gearDomId = `${instancePrefix}-line-gear-${line.id}`}
			{@const pending = selectionStore.pending}
			{@const rowDimmed =
				pending != null && !lineIsLinkTargetWhilePending(lineIds, pending.lineId, line.id)}
			<div
				data-line={line.id}
				class="preview-token-line flex items-center gap-3 transition-opacity duration-150"
				class:opacity-[0.34]={!readonly && rowDimmed}
				style:font-family={lineFontCss(line)}
			>
				{#if !readonly}
					<div
						class="shrink-0 {hideChrome ? chromeHiddenLayer : ''}"
						aria-hidden={hideChrome ? true : undefined}
					>
						<LineReorderButtons {line} index={li} total={projectStore.lines.length} {previewDark} />
					</div>
				{/if}
				<div class="preview-gloss-wrap min-w-0 flex-1">
					<TokenRow
						tokens={projectStore.tokensOnLine(line.id)}
						lineId={line.id}
						textSizePx={line.textSizePx * scaleFor(line.id)}
						gapWordPx={line.gapWordPx * scaleFor(line.id)}
						showNumbers={settingsStore.settings.showNumbers}
						interactive={!readonly}
						rtl={Boolean(line.rtl)}
					/>
				</div>
				{#if !readonly}
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
				{/if}
			</div>
			{#if li < projectStore.lines.length - 1}
				{@const lowerLine = projectStore.lines[li + 1]!}
				<LinePairGapSlider
					upperLineId={line.id}
					lowerLineId={lowerLine.id}
					{previewDark}
					showControls={!readonly && !hideChrome}
				/>
			{/if}
		{/each}
		{#if !readonly}
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
		{/if}
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
