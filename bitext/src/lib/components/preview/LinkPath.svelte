<script lang="ts">
	import type { LineCap } from '$lib/domain/styles.js';

	let {
		d,
		color,
		thickness,
		opacity,
		cap = 'round',
		dash,
		glow = false,
		fill = false
	}: {
		d: string;
		color: string;
		thickness: number;
		opacity: number;
		cap?: LineCap;
		dash?: string;
		glow?: boolean;
		/** Ribbon mode: `d` is a closed filled shape, not a stroked line. */
		fill?: boolean;
	} = $props();
</script>

<!-- Visual only; pointer interaction is handled by the separate hit layer. -->
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
	aria-hidden="true"
/>
