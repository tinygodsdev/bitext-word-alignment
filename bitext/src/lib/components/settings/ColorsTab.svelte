<script lang="ts">
	import type { PaletteName } from '$lib/domain/palettes.js';
	import { PALETTES } from '$lib/domain/palettes.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	function setPalette(name: PaletteName) {
		settingsStore.patch({ palette: name });
		projectStore.recolorAllLinks(name);
	}

	const s = $derived(settingsStore.settings);

	const names: PaletteName[] = ['pastel', 'vivid', 'academic'];
</script>

<div>
	<div class="field middle-align bottom-margin">
		<nav>
			<div class="max">
				<h6 class="no-margin">Match token color to links</h6>
				<div class="small-text">Preview, editor chips, and exports when enabled</div>
			</div>
			<label class="switch">
				<input
					type="checkbox"
					checked={s.colorTokensByLink}
					onchange={(e) =>
						settingsStore.patch({
							colorTokensByLink: (e.currentTarget as HTMLInputElement).checked
						})}
				/>
				<span></span>
			</label>
		</nav>
	</div>
	<p class="small-text bottom-margin">
		New links pick the next color from the palette. Remove a link in the preview by clicking its
		line.
	</p>
	<nav class="wrap bottom-margin">
		{#each names as name (name)}
			<button
				type="button"
				class="small {s.palette === name ? 'fill primary' : 'border'}"
				onclick={() => setPalette(name)}
			>
				{name}
			</button>
		{/each}
	</nav>
	<div class="palette-swatches">
		{#each PALETTES[s.palette] as color, i (i)}
			<span class="palette-swatch" style:background={color} title={color}></span>
		{/each}
	</div>
</div>
