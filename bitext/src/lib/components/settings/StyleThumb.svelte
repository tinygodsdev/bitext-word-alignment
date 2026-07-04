<script lang="ts">
	import { connectorColor, readableTextOn, type VisualStyle } from '$lib/domain/styles.js';
	import { ribbonPathD } from '$lib/domain/link-geometry.js';
	import { PALETTES } from '$lib/domain/palettes.js';

	let { st }: { st: VisualStyle } = $props();

	const pal = $derived(PALETTES[st.palette ?? 'pastel']);
	const cA = $derived(pal[0]);
	const cB = $derived(pal[1]);
	const link = $derived(connectorColor(st, pal[0]));
	const isRibbon = $derived(st.connector.mode === 'ribbon');
	const dot = $derived(st.connector.endpointDots);
</script>

<span
	class="relative flex h-12 items-center justify-center overflow-hidden rounded-sm"
	style:background={st.canvas.previewBackground}
>
	<svg viewBox="0 0 96 52" class="h-full w-full" aria-hidden="true">
		<!-- connector (drawn first so Bauhaus cards sit on top) -->
		{#if isRibbon}
			<path d={ribbonPathD(26, 26, 70, 32, 'curved', 6, st.connector.taper ?? false)} fill={link} />
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
			<circle cx="26" cy="26" r={dot.r * 0.55} fill={dot.color ?? link} stroke={dot.ring} />
			<circle cx="70" cy="32" r={dot.r * 0.55} fill={dot.color ?? link} stroke={dot.ring} />
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
