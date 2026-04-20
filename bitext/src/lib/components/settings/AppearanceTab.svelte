<script lang="ts">
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { MAX_LINE_GAP_PX, MIN_LINE_GAP_PX } from '$lib/serialization/schema.js';

	const s = $derived(settingsStore.settings);
</script>

<div class="grid medium-space">
	<div class="s12 m6">
		<div class="field label border">
			<select
				id="settings-theme"
				class="active"
				value={s.theme}
				onchange={(e) =>
					settingsStore.patch({
						theme: (e.currentTarget as HTMLSelectElement).value as 'light' | 'dark'
					})}
			>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
			</select>
			<label class="active" for="settings-theme">Theme</label>
		</div>
	</div>
	<div class="s12 m6">
		<div class="field label border">
			<select
				id="settings-background"
				class="active"
				value={s.background}
				onchange={(e) =>
					settingsStore.patch({
						background: (e.currentTarget as HTMLSelectElement).value as 'light' | 'dark' | 'image'
					})}
			>
				<option value="light">Light</option>
				<option value="dark">Dark</option>
				<option value="image">Image</option>
			</select>
			<label class="active" for="settings-background">Background</label>
		</div>
	</div>
	{#if s.background === 'image'}
		<div class="s12">
			<div class="field label border">
				<input
					id="settings-bg-file"
					type="file"
					accept="image/*"
					onchange={async (e) => {
						const f = (e.currentTarget as HTMLInputElement).files?.[0];
						if (!f) return;
						const dataUrl = await new Promise<string>((res, rej) => {
							const r = new FileReader();
							r.onload = () => res(String(r.result));
							r.onerror = () => rej(new Error('read'));
							r.readAsDataURL(f);
						});
						settingsStore.patch({ backgroundImageDataUrl: dataUrl });
					}}
				/>
				<label class="active" for="settings-bg-file">Background image</label>
			</div>
		</div>
	{/if}
	<div class="s12 m6">
		<div class="field">
			<span class="small-text">Text size ({s.textSizePx}px)</span>
			<div class="slider">
				<input
					type="range"
					min="12"
					max="36"
					step="1"
					value={s.textSizePx}
					oninput={(e) =>
						settingsStore.patch({
							textSizePx: Number((e.currentTarget as HTMLInputElement).value)
						})}
				/>
				<span></span>
			</div>
		</div>
	</div>
	<div class="s12 m6">
		<div class="field">
			<span class="small-text">Word gap ({s.gapWordPx}px)</span>
			<div class="slider">
				<input
					type="range"
					min="0"
					max="32"
					step="1"
					value={s.gapWordPx}
					oninput={(e) =>
						settingsStore.patch({ gapWordPx: Number((e.currentTarget as HTMLInputElement).value) })}
				/>
				<span></span>
			</div>
		</div>
	</div>
	<div class="s12 m6">
		<div class="field">
			<span class="small-text">Line gap ({s.gapLinePx}px)</span>
			<div class="slider">
				<input
					type="range"
					min={MIN_LINE_GAP_PX}
					max={MAX_LINE_GAP_PX}
					step="1"
					value={s.gapLinePx}
					oninput={(e) =>
						settingsStore.patch({ gapLinePx: Number((e.currentTarget as HTMLInputElement).value) })}
				/>
				<span></span>
			</div>
		</div>
	</div>
	<div class="s12 m6">
		<div class="field">
			<span class="small-text">Line thickness ({s.lineThickness}px)</span>
			<div class="slider">
				<input
					type="range"
					min="1"
					max="8"
					step="1"
					value={s.lineThickness}
					oninput={(e) =>
						settingsStore.patch({
							lineThickness: Number((e.currentTarget as HTMLInputElement).value)
						})}
				/>
				<span></span>
			</div>
		</div>
	</div>
	<div class="s12 m6">
		<div class="field">
			<span class="small-text">Line opacity ({Math.round(s.lineOpacity * 100)}%)</span>
			<div class="slider">
				<input
					type="range"
					min="0.2"
					max="1"
					step="0.05"
					value={s.lineOpacity}
					oninput={(e) =>
						settingsStore.patch({
							lineOpacity: Number((e.currentTarget as HTMLInputElement).value)
						})}
				/>
				<span></span>
			</div>
		</div>
	</div>
	<div class="s12 m6">
		<div class="field label border">
			<select
				id="settings-line-style"
				class="active"
				value={s.lineStyle}
				onchange={(e) =>
					settingsStore.patch({
						lineStyle: (e.currentTarget as HTMLSelectElement).value as 'straight' | 'curved'
					})}
			>
				<option value="straight">Straight</option>
				<option value="curved">Curved</option>
			</select>
			<label class="active" for="settings-line-style">Line style</label>
		</div>
	</div>
</div>
