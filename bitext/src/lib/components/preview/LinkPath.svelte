<script lang="ts">
	import type { LineCap } from '$lib/domain/styles.js';

	let {
		d,
		color,
		thickness,
		opacity,
		linkId,
		cap = 'round',
		dash,
		glow = false,
		fill = false,
		onenter,
		onleave,
		onclick
	}: {
		d: string;
		color: string;
		thickness: number;
		opacity: number;
		linkId: string;
		cap?: LineCap;
		dash?: string;
		glow?: boolean;
		/** Ribbon mode: `d` is a closed filled shape, not a stroked line. */
		fill?: boolean;
		onenter: (id: string) => void;
		onleave: () => void;
		onclick: (id: string) => void;
	} = $props();
</script>

<path
	fill={fill ? color : 'none'}
	stroke={fill ? 'none' : color}
	stroke-width={fill ? undefined : thickness}
	stroke-opacity={fill ? undefined : opacity}
	fill-opacity={fill ? opacity : undefined}
	stroke-linecap={fill ? undefined : cap}
	stroke-linejoin="round"
	stroke-dasharray={fill ? undefined : dash}
	style:filter={glow ? `drop-shadow(0 0 ${thickness * 2}px ${color})` : undefined}
	{d}
	class="link-path"
	role="button"
	tabindex="0"
	aria-label="Alignment link"
	data-link-id={linkId}
	onmouseenter={() => onenter(linkId)}
	onmouseleave={onleave}
	onclick={() => onclick(linkId)}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			onclick(linkId);
		}
	}}
/>
