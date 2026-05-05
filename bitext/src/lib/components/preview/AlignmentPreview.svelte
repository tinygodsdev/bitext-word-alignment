<script lang="ts">
	import TokenRow from './TokenRow.svelte';
	import AlignmentSvg from './AlignmentSvg.svelte';
	import PreviewFontLoader from './PreviewFontLoader.svelte';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { resolveLineFontCss } from '$lib/fonts/visualization-font.js';

	let rootEl = $state<HTMLElement | null>(null);

	const gapLine = $derived(settingsStore.settings.gapLinePx);
	const bg = $derived(settingsStore.settings.background);
	const connections = $derived(projectStore.connections);
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
		{#each projectStore.lines as line, li (line.id)}
			<div
				data-line={line.id}
				class="preview-token-line"
				style:font-family={resolveLineFontCss(line)}
				style:margin-bottom={li < projectStore.lines.length - 1 ? `${gapLine}px` : '0'}
			>
				<TokenRow
					tokens={projectStore.tokensOnLine(line.id)}
					lineId={line.id}
					textSizePx={line.textSizePx}
					showNumbers={settingsStore.settings.showNumbers}
					interactive={true}
				/>
			</div>
		{/each}
	</div>
	<AlignmentSvg {rootEl} {connections} />
</div>
