<script lang="ts">
	import TokenRow from './TokenRow.svelte';
	import GlossRow from './GlossRow.svelte';
	import AlignmentSvg from './AlignmentSvg.svelte';
	import PreviewFontLoader from './PreviewFontLoader.svelte';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { resolveVisualizationFontCss } from '$lib/fonts/visualization-font.js';

	let rootEl = $state<HTMLElement | null>(null);

	const gapLine = $derived(settingsStore.settings.gapLinePx);
	const bg = $derived(settingsStore.settings.background);
	const fontSource = $derived(resolveVisualizationFontCss(settingsStore.settings, 'source'));
	const fontTarget = $derived(resolveVisualizationFontCss(settingsStore.settings, 'target'));
	/** Explicit subscription — plain `projectStore.links` in children may not invalidate UI. */
	const links = $derived(projectStore.links);
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
	<div class="preview-stack" style:gap="{gapLine}px">
		<div class="preview-token-line" style:font-family={fontSource}>
			<TokenRow
				tokens={projectStore.sourceTokens}
				side="source"
				showNumbers={settingsStore.settings.showNumbers}
				interactive={true}
			/>
		</div>
		{#if settingsStore.settings.showGloss}
			<div data-gloss-row class="preview-gloss-wrap" style:font-family={fontSource}>
				<GlossRow tokens={projectStore.sourceTokens} side="source" />
			</div>
		{/if}
		<div class="preview-token-line" style:font-family={fontTarget}>
			<TokenRow
				tokens={projectStore.targetTokens}
				side="target"
				showNumbers={settingsStore.settings.showNumbers}
				interactive={true}
			/>
		</div>
	</div>
	<AlignmentSvg {rootEl} {links} />
</div>
