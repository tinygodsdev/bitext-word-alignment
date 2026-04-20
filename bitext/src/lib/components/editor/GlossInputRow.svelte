<script lang="ts">
	import type { Token } from '$lib/domain/tokens.js';

	let {
		tokens,
		onGloss
	}: {
		tokens: Token[];
		onGloss: (tokenId: string, value: string) => void;
	} = $props();
</script>

<div class="gloss-input-wrap" aria-label="Gloss inputs">
	{#each tokens as t (t.id)}
		<div class="field label border small">
			<input
				id="gloss-input-{t.id}"
				type="text"
				placeholder=" "
				value={t.gloss ?? ''}
				oninput={(e) => onGloss(t.id, (e.currentTarget as HTMLInputElement).value)}
			/>
			<label class="small-text active" for="gloss-input-{t.id}">{t.text}</label>
		</div>
	{/each}
</div>
