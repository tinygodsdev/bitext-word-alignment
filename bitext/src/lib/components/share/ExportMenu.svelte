<script lang="ts">
	import { Button, ButtonGroup } from 'flowbite-svelte';
	import { buildStandaloneSvgString } from '$lib/export/svg.js';
	import { svgStringToPngBlob, downloadBlob } from '$lib/export/png.js';
	import { svgStringToPdfBlob } from '$lib/export/pdf.js';
	import { wrapSvgInHtml } from '$lib/export/html.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { svgFontFamilyStack } from '$lib/fonts/visualization-font.js';

	function exportTextColor(): string {
		const bg = settingsStore.settings.background;
		if (bg === 'dark') return '#f8fafc';
		return '#0f172a';
	}

	function buildSvg(): string {
		const lay = layoutExportStore;
		const s = settingsStore.settings;
		return buildStandaloneSvgString({
			width: Math.max(1, lay.width),
			height: Math.max(1, lay.height),
			fontFamilySource: svgFontFamilyStack(s, 'source'),
			fontFamilyTarget: svgFontFamilyStack(s, 'target'),
			fontSize: s.textSizePx,
			glossFontSize: Math.max(12, s.textSizePx * 0.75),
			defaultTextColor: exportTextColor(),
			colorTokensByLink: s.colorTokensByLink,
			lineStyle: s.lineStyle,
			lineThickness: s.lineThickness,
			lineOpacity: s.lineOpacity,
			sourceTokens: projectStore.sourceTokens,
			targetTokens: projectStore.targetTokens,
			tokenLayout: lay.tokenLayout,
			links: projectStore.links,
			showGloss: s.showGloss
		});
	}

	async function downloadSvg() {
		const svg = buildSvg();
		downloadBlob('alignment.svg', new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
	}

	async function downloadPng() {
		const svg = buildSvg();
		const blob = await svgStringToPngBlob(svg, 2);
		downloadBlob('alignment.png', blob);
	}

	async function downloadPdf() {
		const svg = buildSvg();
		const blob = await svgStringToPdfBlob(svg);
		downloadBlob('alignment.pdf', blob);
	}

	function downloadHtml() {
		const svg = buildSvg();
		const html = wrapSvgInHtml(svg, 'Alignment export');
		downloadBlob('alignment.html', new Blob([html], { type: 'text/html;charset=utf-8' }));
	}
</script>

<ButtonGroup class="flex-wrap">
	<Button color="light" size="sm" onclick={downloadPng}>PNG</Button>
	<Button color="light" size="sm" onclick={downloadSvg}>SVG</Button>
	<Button color="light" size="sm" onclick={downloadPdf}>PDF</Button>
	<Button color="light" size="sm" onclick={downloadHtml}>HTML</Button>
</ButtonGroup>
