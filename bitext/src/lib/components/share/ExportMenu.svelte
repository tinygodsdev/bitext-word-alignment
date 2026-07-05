<script lang="ts">
	import { browser } from '$app/environment';
	import { Button, ButtonGroup, Label } from 'flowbite-svelte';
	import { tick } from 'svelte';
	import SettingsFieldHint from '$lib/components/settings/SettingsFieldHint.svelte';
	import { buildStandaloneSvgString } from '$lib/export/svg.js';
	import { svgStringToPngBlob, downloadBlob } from '$lib/export/png.js';
	import { exportBaseName, firstNonEmptyText } from '$lib/export/filename.js';
	import { ASPECT_PRESETS, presetPadding, findAspectPreset } from '$lib/export/aspect-presets.js';
	import AspectSelect, { type AspectOption } from './AspectSelect.svelte';
	import { svgStringToPdfBlob } from '$lib/export/pdf.js';
	import { wrapSvgInHtml } from '$lib/export/html.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { googleFontUrlsForLines, svgFontFamilyStackLine } from '$lib/fonts/visualization-font.js';
	import { applyStyleFont, getStyle } from '$lib/domain/styles.js';
	import { buildInlinedFontCssFromLines } from '$lib/fonts/inline-fonts.js';
	import { ensureVisualizationCustomFontsFromLines } from '$lib/fonts/ensure-document-fonts.js';
	import { convertCustomFontTextToPaths } from '$lib/fonts/text-to-paths.js';
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV2 } from '$lib/serialization/schema.js';
	import { getShareUrl } from '$lib/share/url.js';
	import { shareUrlToQrDataUrl } from '$lib/share/qr.js';

	const RASTER_SCALE_OPTIONS = [2, 3, 4, 5, 6] as const;
	const hintRasterScale =
		'PNG and PDF are rasterized from the preview. Higher scale = sharper detail for small fonts or long sentences, but larger files and more memory use.\n\nSVG and HTML are vector exports and do not use this setting.';

	let rasterExportScale = $state<(typeof RASTER_SCALE_OPTIONS)[number]>(2);

	function isRasterScale(n: number): n is (typeof RASTER_SCALE_OPTIONS)[number] {
		return (RASTER_SCALE_OPTIONS as readonly number[]).includes(n);
	}

	const hintAspect =
		'Auto fits the canvas to your diagram, as before. A preset exports a fixed size for a platform: the diagram is scaled and spread to fill the card, on the theme background. PNG and PDF for a preset export at the exact pixel size shown.';

	// Export canvas: 'auto' (dynamic, current behaviour) or a fixed social preset.
	let selectedAspect = $state<'auto' | string>('auto');
	const activePreset = $derived(
		selectedAspect === 'auto' ? undefined : findAspectPreset(selectedAspect)
	);

	function activeFrame() {
		const p = activePreset;
		if (!p) return undefined;
		return {
			width: p.width,
			height: p.height,
			padding: presetPadding(p),
			background: exportBackgroundColor()
		};
	}

	const aspectOptions: AspectOption[] = [
		{ id: 'auto', label: 'Auto', ratio: 'fits diagram', dashed: true },
		...ASPECT_PRESETS.map((p) => ({
			id: p.id,
			label: p.label,
			ratio: p.ratio,
			width: p.width,
			height: p.height
		}))
	];

	async function flushPreviewLayout() {
		if (!browser) return;
		layoutExportStore.requestRemeasure();
		await tick();
		await document.fonts?.ready;
		await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
	}

	function exportTextColor(): string {
		const bg = settingsStore.settings.background;
		if (bg === 'dark') return '#f8fafc';
		return '#0f172a';
	}

	function exportBackgroundColor(): string {
		const bg = settingsStore.settings.background;
		if (bg === 'dark') return '#1e1e1e';
		return '#ffffff';
	}

	/** File name seeded from the first non-empty line, plus the preset id, e.g. `al-hello-world-square.png`. */
	function exportName(ext: string): string {
		const base = exportBaseName(firstNonEmptyText(projectStore.lines));
		const suffix = activePreset ? `-${activePreset.id}` : '';
		return `${base}${suffix}.${ext}`;
	}

	/** Lines with the active style's default font applied (so exports embed it like the preview). */
	function exportStyledLines() {
		return applyStyleFont(projectStore.lines, getStyle(settingsStore.settings.style));
	}

	function googleFontImportList(): string[] {
		return googleFontUrlsForLines(exportStyledLines());
	}

	function buildSvg(opts: {
		includeAttributionFooter: boolean;
		embedFontCss?: string;
		includeImports?: boolean;
		siteQrPngDataUri?: string;
		frame?: { width: number; height: number; padding?: number; background?: string };
	}): string {
		const lay = layoutExportStore;
		const s = settingsStore.settings;
		const imports = opts.includeImports !== false ? googleFontImportList() : [];
		const lineOrder = projectStore.lines.map((l) => l.id);
		const styledLines = exportStyledLines();
		// Auto-fit scales the DOM font size; the export draws glyphs at that same scaled size so
		// they match the measured token boxes (positions already reflect the scaled DOM).
		const lines = styledLines.map((l) => ({
			lineId: l.id,
			tokens: projectStore.tokensOnLine(l.id),
			fontFamilyStack: svgFontFamilyStackLine(l),
			textSizePx: l.textSizePx * (lay.fontScaleByLine[l.id] ?? 1)
		}));
		return buildStandaloneSvgString({
			width: Math.max(1, lay.width),
			height: Math.max(1, lay.height),
			backgroundColor: exportBackgroundColor(),
			defaultTextColor: exportTextColor(),
			style: s.style,
			colorTokensByLink: s.colorTokensByLink,
			tokenLinkColorMode: s.tokenLinkColorMode,
			lineStyle: s.lineStyle,
			lineThickness: s.lineThickness,
			lineOpacity: s.lineOpacity,
			contentScale: lay.contentScale,
			lineOrder,
			lines,
			tokenLayout: lay.tokenLayout,
			connections: projectStore.connections,
			pairControls: projectStore.pairControls,
			includeAttributionFooter: opts.includeAttributionFooter,
			embedFontCdataImports: imports.length ? imports : undefined,
			embedFontCss: opts.embedFontCss,
			siteQrPngDataUri: opts.siteQrPngDataUri,
			frame: opts.frame
		});
	}

	async function downloadSvg() {
		await flushPreviewLayout();
		const rawSvg = buildSvg({ includeAttributionFooter: true, frame: activeFrame() });
		const svg = await convertCustomFontTextToPaths(rawSvg, projectStore.lines);
		downloadBlob(exportName('svg'), new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
	}

	async function buildRasterSvg(): Promise<string> {
		await ensureVisualizationCustomFontsFromLines(projectStore.lines);
		const embedFontCss = await buildInlinedFontCssFromLines(exportStyledLines());
		const svg = buildSvg({
			includeAttributionFooter: true,
			embedFontCss,
			includeImports: false,
			frame: activeFrame()
		});
		return await convertCustomFontTextToPaths(svg, projectStore.lines);
	}

	async function downloadPng() {
		await flushPreviewLayout();
		const svg = await buildRasterSvg();
		// A preset is already sized in pixels; render 1:1. Auto uses the chosen scale.
		const blob = await svgStringToPngBlob(svg, activePreset ? 1 : rasterExportScale);
		downloadBlob(exportName('png'), blob);
	}

	async function downloadPdf() {
		await flushPreviewLayout();
		const svg = await buildRasterSvg();
		const blob = await svgStringToPdfBlob(svg, activePreset ? 1 : rasterExportScale);
		downloadBlob(exportName('pdf'), blob);
	}

	async function downloadHtml() {
		await flushPreviewLayout();
		const rawSvg = buildSvg({ includeAttributionFooter: false, frame: activeFrame() });
		const svg = await convertCustomFontTextToPaths(rawSvg, projectStore.lines);
		const html = wrapSvgInHtml(svg, 'Alignment export', googleFontImportList());
		downloadBlob(exportName('html'), new Blob([html], { type: 'text/html;charset=utf-8' }));
	}

	// Live mini-preview of the export — the framed card for a preset, or the
	// content-sized diagram for Auto.
	let previewUrl = $state<string | null>(null);
	$effect(() => {
		if (!browser) {
			previewUrl = null;
			return;
		}
		// Track the inputs that change the layout.
		void selectedAspect;
		void projectStore.lines;
		void projectStore.connections;
		void projectStore.pairControls;
		void settingsStore.settings;
		void layoutExportStore.width;
		void layoutExportStore.height;
		void layoutExportStore.tokenLayout;
		const t = setTimeout(() => {
			try {
				const svg = buildSvg({ includeAttributionFooter: true, frame: activeFrame() });
				previewUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
			} catch {
				previewUrl = null;
			}
		}, 120);
		return () => clearTimeout(t);
	});

	function buildState(): AppStateV2 {
		return {
			v: SCHEMA_VERSION,
			project: projectStore.getSnapshot(),
			settings: { ...settingsStore.settings }
		};
	}

	async function downloadShareQrPng() {
		if (!browser) return;
		const url = getShareUrl(encodeState(buildState()));
		if (!url) return;
		try {
			const dataUrl = await shareUrlToQrDataUrl(url);
			const a = document.createElement('a');
			a.href = dataUrl;
			a.download = `${exportBaseName(firstNonEmptyText(projectStore.lines))}-share-qr.png`;
			a.click();
		} catch (e: unknown) {
			const raw = e instanceof Error ? e.message : String(e);
			const friendly =
				/code length overflow|too long|larger than/i.test(raw) || raw.includes('overflow')
					? 'This share link is too long for a single QR code. Shorten the text a bit or use Copy share link.'
					: raw || 'Could not generate QR code.';
			window.alert(friendly);
		}
	}
</script>

<div class="mb-3">
	<div class="mb-1.5 flex items-center gap-2">
		<Label class="mb-0 text-sm text-gray-600 dark:text-gray-400">Canvas</Label>
		<SettingsFieldHint text={hintAspect} />
	</div>
	<AspectSelect bind:value={selectedAspect} options={aspectOptions} />

	<div class="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
		<div
			class="flex max-w-55 items-center justify-center border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-900/40"
		>
			{#if previewUrl}
				<img
					src={previewUrl}
					alt={`Preview of the ${activePreset ? activePreset.label : 'Auto'} export`}
					class="max-h-56 w-auto max-w-full"
				/>
			{:else}
				<div class="flex h-24 w-24 items-center justify-center text-xs text-gray-400">…</div>
			{/if}
		</div>
		<p class="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
			{#if activePreset}
				<span class="font-medium text-gray-800 dark:text-gray-200"
					>{activePreset.width} × {activePreset.height} px</span
				><br />
				{activePreset.note}.<br />
				The diagram fills the card; PNG and PDF export at this exact size.
			{:else}
				<span class="font-medium text-gray-800 dark:text-gray-200">Fits your diagram</span><br />
				The canvas tracks the content, as on screen. PNG and PDF use the scale below.
			{/if}
		</p>
	</div>
</div>

{#if !activePreset}
	<div class="mb-3 flex flex-wrap items-center gap-2">
		<Label for="export-raster-scale" class="mb-0 text-sm text-gray-600 dark:text-gray-400">
			PNG / PDF scale
		</Label>
		<select
			id="export-raster-scale"
			class="rounded-lg border border-gray-300 bg-gray-50 py-1.5 pl-2 pr-8 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
			value={String(rasterExportScale)}
			onchange={(e) => {
				const n = Number((e.currentTarget as HTMLSelectElement).value);
				if (isRasterScale(n)) rasterExportScale = n;
			}}
		>
			{#each RASTER_SCALE_OPTIONS as s (s)}
				<option value={String(s)}>{s}×</option>
			{/each}
		</select>
		<SettingsFieldHint text={hintRasterScale} />
	</div>
{/if}

<ButtonGroup class="flex-wrap">
	<Button color="light" size="sm" onclick={downloadPng}>PNG</Button>
	<Button color="light" size="sm" onclick={downloadSvg}>SVG</Button>
	<Button color="light" size="sm" onclick={downloadPdf}>PDF</Button>
	<Button color="light" size="sm" onclick={downloadHtml}>HTML</Button>
	<Button color="light" size="sm" onclick={downloadShareQrPng} title="QR with full share link"
		>QR</Button
	>
</ButtonGroup>
