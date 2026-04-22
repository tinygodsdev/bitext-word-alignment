<script lang="ts">
	import TokenRow from './TokenRow.svelte';
	import GlossRow from './GlossRow.svelte';
	import AlignmentSvg from './AlignmentSvg.svelte';
	import PreviewFontLoader from './PreviewFontLoader.svelte';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { resolveVisualizationFontCss } from '$lib/fonts/visualization-font.js';
	import { phraseHasAnyGloss } from '$lib/domain/tokens.js';

	let rootEl = $state<HTMLElement | null>(null);

	const gapLine = $derived(settingsStore.settings.gapLinePx);
	const glossGap = $derived(settingsStore.settings.glossLineGapPx);
	const bg = $derived(settingsStore.settings.background);
	const fontSource = $derived(resolveVisualizationFontCss(settingsStore.settings, 'source'));
	const fontTarget = $derived(resolveVisualizationFontCss(settingsStore.settings, 'target'));
	const fontGloss = $derived(resolveVisualizationFontCss(settingsStore.settings, 'gloss'));
	/** Explicit subscription — plain `projectStore.links` in children may not invalidate UI. */
	const links = $derived(projectStore.links);

	const showSourceGloss = $derived(
		settingsStore.settings.showGloss && phraseHasAnyGloss(projectStore.sourceTokens)
	);
	const showTargetGloss = $derived(
		settingsStore.settings.showGloss && phraseHasAnyGloss(projectStore.targetTokens)
	);
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
		{#if showSourceGloss}
			<div
				data-gloss-row="source"
				class="preview-gloss-wrap"
				style:font-family={fontGloss}
				style:margin-bottom="{glossGap}px"
			>
				<GlossRow tokens={projectStore.sourceTokens} side="source" />
			</div>
		{/if}
		<div
			class="preview-token-line"
			style:font-family={fontSource}
			style:margin-bottom="{gapLine}px"
		>
			<TokenRow
				tokens={projectStore.sourceTokens}
				side="source"
				showNumbers={settingsStore.settings.showNumbers}
				interactive={true}
			/>
		</div>
		<div
			class="preview-token-line"
			style:font-family={fontTarget}
			style:margin-bottom={showTargetGloss ? `${glossGap}px` : '0'}
		>
			<TokenRow
				tokens={projectStore.targetTokens}
				side="target"
				showNumbers={settingsStore.settings.showNumbers}
				interactive={true}
			/>
		</div>
		{#if showTargetGloss}
			<div data-gloss-row="target" class="preview-gloss-wrap" style:font-family={fontGloss}>
				<GlossRow tokens={projectStore.targetTokens} side="target" />
			</div>
		{/if}
	</div>
	<AlignmentSvg {rootEl} {links} />
</div>
