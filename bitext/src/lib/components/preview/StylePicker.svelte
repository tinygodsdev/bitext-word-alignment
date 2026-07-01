<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import {
		STYLES_LIST,
		getStyle,
		connectorColor,
		readableTextOn,
		type StyleId
	} from '$lib/domain/styles.js';
	import { ribbonPathD } from '$lib/domain/link-geometry.js';
	import { PALETTES } from '$lib/domain/palettes.js';

	let open = $state(false);
	let wrapEl = $state<HTMLDivElement | null>(null);

	const current = $derived(getStyle(settingsStore.settings.style));

	$effect(() => {
		if (!open) return;
		function onDown(e: PointerEvent) {
			if (wrapEl && !wrapEl.contains(e.target as Node)) open = false;
		}
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') open = false;
		}
		window.addEventListener('pointerdown', onDown, true);
		window.addEventListener('keydown', onKey);
		return () => {
			window.removeEventListener('pointerdown', onDown, true);
			window.removeEventListener('keydown', onKey);
		};
	});

	function choose(id: StyleId) {
		const style = getStyle(id);
		settingsStore.patch({ style: id });
		// Picking a style bundles its palette; the user can change it afterwards.
		if (style.palette) {
			settingsStore.patch({ palette: style.palette });
			projectStore.recolorAllConnections(style.palette);
		}
		// Font / chips can change token metrics — recompute the export layout after the DOM settles.
		layoutExportStore.requestRemeasureAfterLayout();
		open = false;
	}
</script>

<div bind:this={wrapEl} class="relative inline-block">
	<Button
		color="light"
		size="sm"
		class="shrink-0 px-2! md:px-4!"
		title="Pick a visual style"
		aria-haspopup="menu"
		aria-expanded={open}
		onclick={() => (open = !open)}
	>
		<span
			class="mr-2 inline-block h-4 w-4 shrink-0 rounded-full border border-black/15"
			style:background={current.canvas.previewBackground}
		></span>
		<span class="sr-only md:not-sr-only md:inline">Style: {current.label}</span>
		<span class="md:hidden">Style</span>
	</Button>

	{#if open}
		<div
			class="absolute right-0 z-30 mt-1 grid w-[min(20rem,80vw)] grid-cols-2 gap-2 border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-600 dark:bg-gray-800"
			role="menu"
			aria-label="Visual styles"
		>
			{#each STYLES_LIST as st (st.id)}
				{@const selected = st.id === current.id}
				{@const pal = PALETTES[st.palette ?? 'pastel']}
				{@const cA = pal[0]}
				{@const cB = pal[1]}
				{@const link = connectorColor(st, cA)}
				{@const isRibbon = st.connector.mode === 'ribbon'}
				{@const dot = st.connector.endpointDots}
				<button
					type="button"
					role="menuitemradio"
					aria-checked={selected}
					class="flex flex-col gap-1 border p-1 text-left transition-colors {selected
						? 'border-primary-500 ring-1 ring-primary-500'
						: 'border-gray-200 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-400'}"
					onclick={() => choose(st.id)}
				>
					<span
						class="relative flex h-12 items-center justify-center overflow-hidden rounded-sm"
						style:background={st.canvas.previewBackground}
					>
						<svg viewBox="0 0 96 52" class="h-full w-full" aria-hidden="true">
							<!-- connector (drawn first so Bauhaus cards sit on top) -->
							{#if isRibbon}
								<path
									d={ribbonPathD(26, 26, 70, 32, 'curved', 6, st.connector.taper ?? false)}
									fill={link}
								/>
							{:else}
								<path
									d="M 26 26 C 26 33 70 25 70 32"
									fill="none"
									stroke={link}
									stroke-width="2.4"
									stroke-linecap={st.connector.cap}
									stroke-dasharray={st.connector.dash}
									style:filter={st.connector.glow ? `drop-shadow(0 0 2.5px ${link})` : undefined}
								/>
							{/if}
							{#if dot}
								<circle
									cx="26"
									cy="26"
									r={dot.r * 0.55}
									fill={dot.color ?? link}
									stroke={dot.ring}
								/>
								<circle
									cx="70"
									cy="32"
									r={dot.r * 0.55}
									fill={dot.color ?? link}
									stroke={dot.ring}
								/>
							{/if}

							{#if st.tokenChips}
								<!-- word cards with hard offset shadow -->
								<rect x="16.6" y="9.6" width="19" height="18" fill={st.tokenChips.shadow} />
								<rect x="15" y="8" width="19" height="18" fill={cA} />
								<text
									x="24.5"
									y="22"
									font-size="15"
									font-weight="700"
									text-anchor="middle"
									fill={readableTextOn(cA)}>A</text
								>
								<rect x="62.6" y="27.6" width="19" height="18" fill={st.tokenChips.shadow} />
								<rect x="61" y="26" width="19" height="18" fill={cB} />
								<text
									x="70.5"
									y="40"
									font-size="15"
									font-weight="700"
									text-anchor="middle"
									fill={readableTextOn(cB)}>a</text
								>
							{:else}
								<text
									x="26"
									y="22"
									font-size="17"
									font-weight="600"
									text-anchor="middle"
									fill={cA}
									style:filter={st.glowText ? `drop-shadow(0 0 2px ${cA})` : undefined}>A</text
								>
								<text
									x="70"
									y="44"
									font-size="17"
									font-weight="600"
									text-anchor="middle"
									fill={cB}
									style:filter={st.glowText ? `drop-shadow(0 0 2px ${cB})` : undefined}>a</text
								>
							{/if}
						</svg>
					</span>
					<span class="px-0.5 text-xs font-medium text-gray-800 dark:text-gray-100">{st.label}</span
					>
				</button>
			{/each}
		</div>
	{/if}
</div>
