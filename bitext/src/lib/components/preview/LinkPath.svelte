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
		onenter: (id: string) => void;
		onleave: () => void;
		onclick: (id: string) => void;
	} = $props();
</script>

<path
	fill="none"
	stroke={color}
	stroke-width={thickness}
	stroke-opacity={opacity}
	stroke-linecap={cap}
	stroke-linejoin="round"
	stroke-dasharray={dash}
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
