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
	import {
		getStyle,
		effectiveLineFamily,
		resolveCanvas,
		DEFAULT_CUSTOM_BACKGROUND
	} from '$lib/domain/styles.js';
	import {
		computeAutoFitScales,
		scalesChanged,
		chromeScale,
		AUTOFIT_LINE_STRENGTH,
		AUTOFIT_CREDIT_STRENGTH
	} from '$lib/domain/autofit.js';
	import {
		type ZoomState,
		IDENTITY_ZOOM,
		zoomAt,
		clampPan,
		clampZoom,
		wheelZoomFactor
	} from '$lib/domain/zoom.js';
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

	const style = $derived(getStyle(settingsStore.settings.style));
	const resolvedCanvas = $derived(
		resolveCanvas(
			settingsStore.settings.style,
			settingsStore.settings.backgroundId,
			settingsStore.settings.background === 'dark',
			settingsStore.settings.backgroundCustomColor ?? DEFAULT_CUSTOM_BACKGROUND
		)
	);
	const canvas = $derived(resolvedCanvas.canvas);
	// Plain light/dark canvases render through the preview-frame CSS classes; the rest inline.
	const plainCanvas = $derived(resolvedCanvas.plain);
	const previewDark = $derived(canvas.isDark);

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

	// Overall text scale (mean of per-line scales) → gently shrink connectors + credit with it.
	const contentScale = $derived.by(() => {
		if (!autoFit) return 1;
		const v = Object.values(effScale);
		return v.length ? v.reduce((a, b) => a + b, 0) / v.length : 1;
	});
	const thicknessScale = $derived(chromeScale(contentScale, AUTOFIT_LINE_STRENGTH));
	const creditScale = $derived(chromeScale(contentScale, AUTOFIT_CREDIT_STRENGTH));

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
			if (writesExportLayout) {
				layoutExportStore.setFontScaleByLine({});
				layoutExportStore.setContentScale(1);
			}
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
			if (writesExportLayout) {
				layoutExportStore.setFontScaleByLine(effScale);
				const vals = Object.values(effScale);
				layoutExportStore.setContentScale(
					vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 1
				);
			}
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

	// --- Interaction-only pinch/scroll zoom + pan (never affects layout or export) ---
	let zoomEl = $state<HTMLElement | null>(null);
	let zoom = $state<ZoomState>({ ...IDENTITY_ZOOM });
	const zoomTransform = $derived(`translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.z})`);

	// Imperative gesture bookkeeping — not reactive, so a plain Map is fine here.
	// eslint-disable-next-line svelte/prefer-svelte-reactivity
	const pointers = new Map<number, { x: number; y: number }>();
	let panStart: { cx: number; cy: number; x: number; y: number } | null = null;
	let pinchPrev: { dist: number; mx: number; my: number } | null = null;
	let dragged = false;

	function viewport(): { w: number; h: number } {
		return { w: zoomEl?.offsetWidth ?? 0, h: zoomEl?.offsetHeight ?? 0 };
	}
	/** Screen point → the wrapper's untransformed local space (transform-origin is 0 0). */
	function localPoint(cx: number, cy: number): { x: number; y: number } {
		if (!zoomEl) return { x: 0, y: 0 };
		const r = zoomEl.getBoundingClientRect();
		return { x: cx - (r.left - zoom.x), y: cy - (r.top - zoom.y) };
	}
	function twoFinger(): { dist: number; mx: number; my: number } | null {
		if (pointers.size < 2) return null;
		const [a, b] = [...pointers.values()];
		return {
			dist: Math.hypot(a.x - b.x, a.y - b.y),
			mx: (a.x + b.x) / 2,
			my: (a.y + b.y) / 2
		};
	}
	/** Drag on the gap sliders must adjust them, not pan. */
	function isFormControl(t: EventTarget | null): boolean {
		return t instanceof Element && !!t.closest('input, [role="slider"], .line-gap-range');
	}

	function onPointerDown(e: PointerEvent) {
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		dragged = false;
		if (pointers.size === 2) {
			panStart = null;
			pinchPrev = twoFinger();
		} else if (pointers.size === 1 && zoom.z > 1 && !isFormControl(e.target)) {
			panStart = { cx: e.clientX, cy: e.clientY, x: zoom.x, y: zoom.y };
		}
	}
	function onPointerMove(e: PointerEvent) {
		if (!pointers.has(e.pointerId)) return;
		pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
		const { w, h } = viewport();

		if (pointers.size >= 2 && pinchPrev) {
			const cur = twoFinger()!;
			const factor = cur.dist > 0 && pinchPrev.dist > 0 ? cur.dist / pinchPrev.dist : 1;
			let next = zoomAt(zoom, clampZoom(zoom.z * factor), localPoint(cur.mx, cur.my));
			next = {
				z: next.z,
				x: next.x + (cur.mx - pinchPrev.mx),
				y: next.y + (cur.my - pinchPrev.my)
			};
			zoom = clampPan(next, w, h);
			pinchPrev = cur;
			dragged = true;
			e.preventDefault();
			return;
		}
		if (pointers.size === 1 && panStart) {
			const dx = e.clientX - panStart.cx;
			const dy = e.clientY - panStart.cy;
			if (!dragged && Math.hypot(dx, dy) > 6) {
				dragged = true;
				(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
			}
			if (dragged) {
				zoom = clampPan({ z: zoom.z, x: panStart.x + dx, y: panStart.y + dy }, w, h);
				e.preventDefault();
			}
		}
	}
	function onPointerUp(e: PointerEvent) {
		pointers.delete(e.pointerId);
		if (pointers.size < 2) pinchPrev = null;
		if (pointers.size === 0) panStart = null;
	}
	function onWheel(e: WheelEvent) {
		// Trackpad pinch / ctrl+wheel zooms; a plain wheel keeps scrolling the page.
		if (!e.ctrlKey) return;
		e.preventDefault();
		const { w, h } = viewport();
		const next = zoomAt(
			zoom,
			clampZoom(zoom.z * wheelZoomFactor(e.deltaY)),
			localPoint(e.clientX, e.clientY)
		);
		zoom = clampPan(next, w, h);
	}
	function resetZoom() {
		zoom = { ...IDENTITY_ZOOM };
	}

	// Discoverability: hint that zoom exists, but only when the text got small enough to need it.
	let coarsePointer = $state(false);
	$effect(() => {
		if (browser) coarsePointer = window.matchMedia('(pointer: coarse)').matches;
	});
	const zoomHint = $derived.by(() => {
		if (readonly || hideChrome) return null;
		if (zoom.z > 1) return coarsePointer ? 'Double-tap to reset' : 'Double-click to reset';
		if (contentScale < 0.8) return coarsePointer ? 'Pinch to zoom in' : 'Ctrl + scroll to zoom in';
		return null;
	});
</script>

<PreviewFontLoader />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	bind:this={rootEl}
	class="preview-frame {style.frameClass ?? ''}"
	class:preview-frame--light={!previewDark}
	class:preview-frame--dark={previewDark}
	data-aligner-style={style.id}
	data-autofit={autoFit ? 'on' : 'off'}
	style:background={plainCanvas ? undefined : canvas.previewBackground}
	style:color={plainCanvas ? undefined : canvas.textColor}
	style:touch-action={zoom.z > 1 ? 'none' : 'pan-y'}
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
	onwheel={onWheel}
	ondblclick={resetZoom}
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
				Click on <strong>adjacent</strong> line to link.
			{/if}
		</p>
	{/if}
	{#if zoomHint}
		<div class="preview-zoom-hint" aria-hidden="true">
			<svg viewBox="0 0 16 16" class="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor">
				<circle cx="7" cy="7" r="4.5" stroke-width="1.5" />
				<path d="M10.5 10.5 L14 14" stroke-width="1.5" stroke-linecap="round" />
			</svg>
			<span>{zoomHint}</span>
		</div>
	{/if}
	<div class="preview-zoom" bind:this={zoomEl} style:transform={zoomTransform}>
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
							<LineReorderButtons
								{line}
								index={li}
								total={projectStore.lines.length}
								{previewDark}
							/>
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
				<p class="preview-frame__attribution" style:font-size="{0.75 * creditScale}rem">
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
		<AlignmentSvg
			rootEl={zoomEl}
			{connections}
			{writesExportLayout}
			{thicknessScale}
			zoom={zoom.z}
			showPins={!readonly && !hideChrome}
		/>
	</div>
</div>
