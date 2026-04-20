<script lang="ts">
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import { DEFAULT_TOKEN_SPLIT_CHARS } from '$lib/serialization/schema.js';

	const s = $derived(settingsStore.settings);

	function updateTokenSplitChars(raw: string) {
		const chars = [...raw]
			.filter((ch, i, arr) => !/\s/u.test(ch) && arr.indexOf(ch) === i)
			.join('');
		settingsStore.patch({ tokenSplitChars: chars });
		selectionStore.clear();
		projectStore.retokenizeFromSettings();
	}
</script>

<div class="grid medium-space">
	<div class="s12">
		<div class="field middle-align">
			<nav>
				<div class="max">
					<h6 class="no-margin">Interlinear gloss row</h6>
					<div class="small-text">Shown between source and target in the preview</div>
				</div>
				<label class="switch">
					<input
						type="checkbox"
						checked={s.showGloss}
						onchange={(e) =>
							settingsStore.patch({ showGloss: (e.currentTarget as HTMLInputElement).checked })}
					/>
					<span></span>
				</label>
			</nav>
		</div>
	</div>
	<div class="s12">
		<div class="field middle-align">
			<nav>
				<div class="max">
					<h6 class="no-margin">Token numbers</h6>
					<div class="small-text">Show indices on each word in the preview</div>
				</div>
				<label class="switch">
					<input
						type="checkbox"
						checked={s.showNumbers}
						onchange={(e) =>
							settingsStore.patch({ showNumbers: (e.currentTarget as HTMLInputElement).checked })}
					/>
					<span></span>
				</label>
			</nav>
		</div>
	</div>
	<div class="s12">
		<details class="border round padding">
			<summary><strong>Advanced tokenization</strong></summary>
			<div class="top-margin">
				<p class="small-text">
					Whitespace always splits tokens. Add extra separator characters to also split inside words
					(for example: <code>.-</code> makes <code>cat.s</code> and <code>cat-s</code> become
					<code>cat</code> + <code>s</code>).
				</p>
				<div class="field label border">
					<input
						id="token-split-chars"
						type="text"
						placeholder={DEFAULT_TOKEN_SPLIT_CHARS}
						value={s.tokenSplitChars}
						oninput={(e) => updateTokenSplitChars((e.currentTarget as HTMLInputElement).value)}
					/>
					<label class="active" for="token-split-chars">Extra token separators</label>
				</div>
			</div>
		</details>
	</div>
</div>
