<script lang="ts">
	let {
		d,
		color,
		thickness,
		opacity,
		linkId,
		onenter,
		onleave,
		onclick
	}: {
		d: string;
		color: string;
		thickness: number;
		opacity: number;
		linkId: string;
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
	stroke-linecap="round"
	stroke-linejoin="round"
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
