<script lang="ts">
	import { Label } from 'flowbite-svelte';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { selectionStore } from '$lib/state/selection.svelte.js';
	import {
		DEFAULT_TOKEN_MERGE_CHAR,
		DEFAULT_TOKEN_SPLIT_CHARS,
		normalizeTokenMergeCharField,
		normalizeTokenPunctuationCharsField
	} from '$lib/serialization/schema.js';
	import SettingsFieldHint from './SettingsFieldHint.svelte';

	const s = $derived(settingsStore.settings);

	function updateTokenSplitChars(raw: string) {
		const chars = [...raw]
			.filter((ch, i, arr) => !/\s/u.test(ch) && arr.indexOf(ch) === i)
			.join('');
		settingsStore.patch({ tokenSplitChars: chars });
		selectionStore.clear();
		projectStore.retokenizeFromSettings();
	}

	function updateTokenMergeChar(raw: string) {
		settingsStore.patch({ tokenMergeChar: normalizeTokenMergeCharField(raw) });
		selectionStore.clear();
		projectStore.retokenizeFromSettings();
	}

	function updateTokenSplitPunctuation(checked: boolean) {
		settingsStore.patch({ tokenSplitPunctuation: checked });
		selectionStore.clear();
		projectStore.retokenizeFromSettings();
	}

	function updateTokenPunctuationChars(raw: string) {
		settingsStore.patch({ tokenPunctuationChars: normalizeTokenPunctuationCharsField(raw) });
		selectionStore.clear();
		projectStore.retokenizeFromSettings();
	}

	const chk =
		'peer h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600';

	const inputClass =
		'block w-full rounded-none border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500';

	const hintNumbers = 'Show index numbers on each token in the alignment preview.';
	const hintSplit =
		'Whitespace always splits words. These characters also split inside a word. Example: .- turns cat.s into cat + s.';
	const hintJoin =
		'Single character that merges adjacent parts into one alignment token; shown as a space in the preview (e.g. hello+world with + → one token). It cannot also be an extra separator—it is removed from that list.';
	const hintPunct =
		"When enabled, Unicode \\p{P} marks become separate tokens by default. Apostrophe between letters stays inside the word (e.g. don't). Use “custom punctuation” below to split only on listed characters instead of \\p{P}.";
	const hintPunctCustom =
		'Leave empty for Unicode \\p{P}. Otherwise only these characters are split as separate punctuation tokens.';
</script>

<div class="grid grid-cols-12 gap-4">
	<div class="col-span-12">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div class="flex flex-wrap items-center gap-0.5">
				<h3 class="font-heading text-sm font-semibold text-gray-900 dark:text-white">
					Token numbers
				</h3>
				<SettingsFieldHint text={hintNumbers} />
			</div>
			<Label class="inline-flex cursor-pointer items-center gap-2">
				<input
					type="checkbox"
					class={chk}
					checked={s.showNumbers}
					onchange={(e) =>
						settingsStore.patch({ showNumbers: (e.currentTarget as HTMLInputElement).checked })}
				/>
				<span class="text-sm text-gray-700 dark:text-gray-300">Show</span>
			</Label>
		</div>
	</div>

	<div class="col-span-12">
		<h3 class="font-heading mb-3 text-sm font-semibold text-gray-900 dark:text-white">
			Advanced tokenization
		</h3>

		<div class="mb-3">
			<div class="mb-2 flex flex-wrap items-center gap-0.5">
				<Label for="token-split-chars" class="mb-0">Extra token separators</Label>
				<SettingsFieldHint text={hintSplit} />
			</div>
			<input
				id="token-split-chars"
				type="text"
				class={inputClass}
				placeholder={DEFAULT_TOKEN_SPLIT_CHARS}
				value={s.tokenSplitChars}
				oninput={(e) => updateTokenSplitChars((e.currentTarget as HTMLInputElement).value)}
			/>
		</div>

		<div class="mb-4">
			<div class="mb-2 flex flex-wrap items-center gap-0.5">
				<Label for="token-merge-char" class="mb-0">Join character</Label>
				<SettingsFieldHint text={hintJoin} />
			</div>
			<input
				id="token-merge-char"
				type="text"
				class={inputClass}
				maxlength="8"
				placeholder={DEFAULT_TOKEN_MERGE_CHAR}
				value={s.tokenMergeChar}
				oninput={(e) => updateTokenMergeChar((e.currentTarget as HTMLInputElement).value)}
			/>
		</div>

		<div class="flex flex-wrap items-start justify-between gap-3">
			<div class="flex min-w-0 flex-1 flex-wrap items-center gap-0.5">
				<h4 class="font-heading text-sm font-semibold text-gray-900 dark:text-white">
					Split punctuation
				</h4>
				<SettingsFieldHint text={hintPunct} />
			</div>
			<Label class="inline-flex shrink-0 cursor-pointer items-center gap-2">
				<input
					type="checkbox"
					class={chk}
					checked={s.tokenSplitPunctuation}
					onchange={(e) =>
						updateTokenSplitPunctuation((e.currentTarget as HTMLInputElement).checked)}
				/>
				<span class="text-sm text-gray-700 dark:text-gray-300">Enable</span>
			</Label>
		</div>

		{#if s.tokenSplitPunctuation}
			<div class="mt-3">
				<div class="mb-2 flex flex-wrap items-center gap-0.5">
					<Label for="token-punct-chars" class="mb-0">Custom punctuation characters</Label>
					<SettingsFieldHint text={hintPunctCustom} />
				</div>
				<input
					id="token-punct-chars"
					type="text"
					class={inputClass}
					placeholder={'Leave empty for Unicode \\p{P}; or e.g. ,.;:!?'}
					value={s.tokenPunctuationChars}
					oninput={(e) => updateTokenPunctuationChars((e.currentTarget as HTMLInputElement).value)}
				/>
			</div>
		{/if}
	</div>
</div>
