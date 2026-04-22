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
	import {
		svgFontFamilyStack,
		visualizationGoogleFontUrls
	} from '$lib/fonts/visualization-font.js';
	import { buildInlinedFontCss } from '$lib/fonts/inline-fonts.js';
	import { encodeState } from '$lib/serialization/encode.js';
	import {
		SCHEMA_VERSION,
		defaultGlossFontSizePx,
		type AppStateV1
	} from '$lib/serialization/schema.js';
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

	/** Same fills as `.preview-frame--light` / `--dark` (image mode exports without photo → white). */
	function exportBackgroundColor(): string {
		const bg = settingsStore.settings.background;
		if (bg === 'dark') return '#1e1e1e';
		return '#ffffff';
	}

	function googleFontImportList(): string[] {
		return visualizationGoogleFontUrls(settingsStore.settings);
	}

	/** Pass `siteQrPngDataUri: await siteLandingQrDataUrl()` to draw the corner site QR (currently off). */
	function buildSvg(opts: {
		includeAttributionFooter: boolean;
		embedFontCss?: string;
		includeImports?: boolean;
		siteQrPngDataUri?: string;
	}): string {
		const lay = layoutExportStore;
		const s = settingsStore.settings;
		const imports = opts.includeImports !== false ? googleFontImportList() : [];
		return buildStandaloneSvgString({
			width: Math.max(1, lay.width),
			height: Math.max(1, lay.height),
			backgroundColor: exportBackgroundColor(),
			fontFamilySource: svgFontFamilyStack(s, 'source'),
			fontFamilyTarget: svgFontFamilyStack(s, 'target'),
			fontFamilyGloss: svgFontFamilyStack(s, 'gloss'),
			fontSizeSource: s.sourceTextSizePx,
			fontSizeTarget: s.targetTextSizePx,
			glossFontSize: defaultGlossFontSizePx(s),
			defaultTextColor: exportTextColor(),
			colorTokensByLink: s.colorTokensByLink,
			lineStyle: s.lineStyle,
			lineThickness: s.lineThickness,
			lineOpacity: s.lineOpacity,
			sourceTokens: projectStore.sourceTokens,
			targetTokens: projectStore.targetTokens,
			tokenLayout: lay.tokenLayout,
			links: projectStore.links,
			showGloss: s.showGloss,
			includeAttributionFooter: opts.includeAttributionFooter,
			embedFontCdataImports: imports.length ? imports : undefined,
			embedFontCss: opts.embedFontCss,
			siteQrPngDataUri: opts.siteQrPngDataUri
		});
	}

	async function downloadSvg() {
		await flushPreviewLayout();
		const svg = buildSvg({ includeAttributionFooter: true });
		downloadBlob('alignment.svg', new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
	}

	async function downloadPng() {
		await flushPreviewLayout();
		const embedFontCss = await buildInlinedFontCss(settingsStore.settings);
		const svg = buildSvg({ includeAttributionFooter: true, embedFontCss, includeImports: false });
		const blob = await svgStringToPngBlob(svg, 2);
		downloadBlob('alignment.png', blob);
	}

	async function downloadPdf() {
		await flushPreviewLayout();
		const embedFontCss = await buildInlinedFontCss(settingsStore.settings);
		const svg = buildSvg({ includeAttributionFooter: true, embedFontCss, includeImports: false });
		const blob = await svgStringToPdfBlob(svg);
		downloadBlob('alignment.pdf', blob);
	}

	async function downloadHtml() {
		await flushPreviewLayout();
		const svg = buildSvg({ includeAttributionFooter: false });
		const html = wrapSvgInHtml(svg, 'Alignment export', googleFontImportList());
		downloadBlob('alignment.html', new Blob([html], { type: 'text/html;charset=utf-8' }));
	}

	function buildState(): AppStateV1 {
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
