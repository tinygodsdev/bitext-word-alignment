<script lang="ts">
	import { browser } from '$app/environment';
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import { tick } from 'svelte';
	import { buildStandaloneSvgString } from '$lib/export/svg.js';
	import { svgStringToPngBlob, downloadBlob } from '$lib/export/png.js';
	import { svgStringToPdfBlob } from '$lib/export/pdf.js';
	import { wrapSvgInHtml } from '$lib/export/html.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { googleFontUrlsForLines, svgFontFamilyStackLine } from '$lib/fonts/visualization-font.js';
	import { buildInlinedFontCssFromLines } from '$lib/fonts/inline-fonts.js';
	import { ensureVisualizationCustomFontsFromLines } from '$lib/fonts/ensure-document-fonts.js';
	import { convertCustomFontTextToPaths } from '$lib/fonts/text-to-paths.js';
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV2 } from '$lib/serialization/schema.js';
	import { getShareUrl } from '$lib/share/url.js';
	import { shareUrlToQrDataUrl } from '$lib/share/qr.js';

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

	function googleFontImportList(): string[] {
		return googleFontUrlsForLines(projectStore.lines);
	}

	function buildSvg(opts: {
		includeAttributionFooter: boolean;
		embedFontCss?: string;
		includeImports?: boolean;
		siteQrPngDataUri?: string;
	}): string {
		const lay = layoutExportStore;
		const s = settingsStore.settings;
		const imports = opts.includeImports !== false ? googleFontImportList() : [];
		const lineOrder = projectStore.lines.map((l) => l.id);
		const lines = projectStore.lines.map((l) => ({
			lineId: l.id,
			tokens: projectStore.tokensOnLine(l.id),
			fontFamilyStack: svgFontFamilyStackLine(l),
			textSizePx: l.textSizePx
		}));
		return buildStandaloneSvgString({
			width: Math.max(1, lay.width),
			height: Math.max(1, lay.height),
			backgroundColor: exportBackgroundColor(),
			defaultTextColor: exportTextColor(),
			colorTokensByLink: s.colorTokensByLink,
			lineStyle: s.lineStyle,
			lineThickness: s.lineThickness,
			lineOpacity: s.lineOpacity,
			lineOrder,
			lines,
			tokenLayout: lay.tokenLayout,
			connections: projectStore.connections,
			pairControls: projectStore.pairControls,
			includeAttributionFooter: opts.includeAttributionFooter,
			embedFontCdataImports: imports.length ? imports : undefined,
			embedFontCss: opts.embedFontCss,
			siteQrPngDataUri: opts.siteQrPngDataUri
		});
	}

	async function downloadSvg() {
		await flushPreviewLayout();
		const rawSvg = buildSvg({ includeAttributionFooter: true });
		const svg = await convertCustomFontTextToPaths(rawSvg, projectStore.lines);
		downloadBlob('alignment.svg', new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
	}

	async function buildRasterSvg(): Promise<string> {
		await ensureVisualizationCustomFontsFromLines(projectStore.lines);
		const embedFontCss = await buildInlinedFontCssFromLines(projectStore.lines);
		const svg = buildSvg({ includeAttributionFooter: true, embedFontCss, includeImports: false });
		return await convertCustomFontTextToPaths(svg, projectStore.lines);
	}

	async function downloadPng() {
		await flushPreviewLayout();
		const svg = await buildRasterSvg();
		const blob = await svgStringToPngBlob(svg, 2);
		downloadBlob('alignment.png', blob);
	}

	async function downloadPdf() {
		await flushPreviewLayout();
		const svg = await buildRasterSvg();
		const blob = await svgStringToPdfBlob(svg);
		downloadBlob('alignment.pdf', blob);
	}

	async function downloadHtml() {
		await flushPreviewLayout();
		const rawSvg = buildSvg({ includeAttributionFooter: false });
		const svg = await convertCustomFontTextToPaths(rawSvg, projectStore.lines);
		const html = wrapSvgInHtml(svg, 'Alignment export', googleFontImportList());
		downloadBlob('alignment.html', new Blob([html], { type: 'text/html;charset=utf-8' }));
	}

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
			a.download = 'alignment-share-qr.png';
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

<ButtonGroup class="flex-wrap">
	<Button color="light" size="sm" onclick={downloadPng}>PNG</Button>
	<Button color="light" size="sm" onclick={downloadSvg}>SVG</Button>
	<Button color="light" size="sm" onclick={downloadPdf}>PDF</Button>
	<Button color="light" size="sm" onclick={downloadHtml}>HTML</Button>
	<Button color="light" size="sm" onclick={downloadShareQrPng} title="QR with full share link"
		>QR</Button
	>
</ButtonGroup>
