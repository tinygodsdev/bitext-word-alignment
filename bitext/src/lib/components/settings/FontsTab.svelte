<script lang="ts">
	import { GOOGLE_FONT_OPTIONS } from '$lib/fonts/google-fonts.js';
	import { saveCustomFontBlob } from '$lib/fonts/custom-fonts.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';

	const s = $derived(settingsStore.settings);

	async function onCustomFile(side: 'source' | 'target', e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const name = file.name.replace(/\.[^.]+$/, '') || 'CustomFont';
		await saveCustomFontBlob(name, file);
		const buf = await file.arrayBuffer();
		const ff = new FontFace(name, buf);
		await ff.load();
		document.fonts.add(ff);
		if (side === 'source') {
			settingsStore.patch({ sourceFontSource: 'custom', sourceCustomFontName: name });
		} else {
			settingsStore.patch({ targetFontSource: 'custom', targetCustomFontName: name });
		}
	}
</script>

<div class="grid medium-space">
	<div class="s12">
		<h6 class="no-margin bottom-margin">Source line</h6>
	</div>
	<div class="s12 m6">
		<div class="field label border">
			<select
				id="settings-font-source-src"
				class="active"
				value={s.sourceFontSource}
				onchange={(e) =>
					settingsStore.patch({
						sourceFontSource: (e.currentTarget as HTMLSelectElement).value as 'google' | 'custom'
					})}
			>
				<option value="google">Google Fonts</option>
				<option value="custom">Custom upload</option>
			</select>
			<label class="active" for="settings-font-source-src">Source font source</label>
		</div>
	</div>
	{#if s.sourceFontSource === 'google'}
		<div class="s12 m6">
			<div class="field label border">
				<select
					id="settings-font-family-src"
					class="active"
					value={s.sourceFontFamily}
					onchange={(e) =>
						settingsStore.patch({ sourceFontFamily: (e.currentTarget as HTMLSelectElement).value })}
				>
					{#each GOOGLE_FONT_OPTIONS as o (o.family)}
						<option value={o.label}>{o.label}</option>
					{/each}
				</select>
				<label class="active" for="settings-font-family-src">Source typeface</label>
			</div>
		</div>
	{:else}
		<div class="s12 m6">
			<div class="field label border">
				<input
					id="settings-font-file-src"
					type="file"
					accept=".woff2,.ttf,.otf,.woff"
					onchange={(e) => onCustomFile('source', e)}
				/>
				<label class="active" for="settings-font-file-src">Upload source font</label>
			</div>
		</div>
		{#if s.sourceCustomFontName}
			<div class="s12">
				<p class="small-text">Loaded: <strong>{s.sourceCustomFontName}</strong></p>
			</div>
		{/if}
	{/if}

	<div class="s12 top-margin">
		<h6 class="no-margin bottom-margin">Target line</h6>
	</div>
	<div class="s12 m6">
		<div class="field label border">
			<select
				id="settings-font-source-tgt"
				class="active"
				value={s.targetFontSource}
				onchange={(e) =>
					settingsStore.patch({
						targetFontSource: (e.currentTarget as HTMLSelectElement).value as 'google' | 'custom'
					})}
			>
				<option value="google">Google Fonts</option>
				<option value="custom">Custom upload</option>
			</select>
			<label class="active" for="settings-font-source-tgt">Target font source</label>
		</div>
	</div>
	{#if s.targetFontSource === 'google'}
		<div class="s12 m6">
			<div class="field label border">
				<select
					id="settings-font-family-tgt"
					class="active"
					value={s.targetFontFamily}
					onchange={(e) =>
						settingsStore.patch({ targetFontFamily: (e.currentTarget as HTMLSelectElement).value })}
				>
					{#each GOOGLE_FONT_OPTIONS as o (o.family)}
						<option value={o.label}>{o.label}</option>
					{/each}
				</select>
				<label class="active" for="settings-font-family-tgt">Target typeface</label>
			</div>
		</div>
	{:else}
		<div class="s12 m6">
			<div class="field label border">
				<input
					id="settings-font-file-tgt"
					type="file"
					accept=".woff2,.ttf,.otf,.woff"
					onchange={(e) => onCustomFile('target', e)}
				/>
				<label class="active" for="settings-font-file-tgt">Upload target font</label>
			</div>
		</div>
		{#if s.targetCustomFontName}
			<div class="s12">
				<p class="small-text">Loaded: <strong>{s.targetCustomFontName}</strong></p>
			</div>
		{/if}
	{/if}
</div>
