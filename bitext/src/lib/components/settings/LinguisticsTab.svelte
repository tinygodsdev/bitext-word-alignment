<script lang="ts">
	import { Label } from 'flowbite-svelte';
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

	const chk =
		'peer h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-primary-600';

	const inputClass =
		'block w-full rounded-none border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500';
</script>

<div class="grid grid-cols-12 gap-4">
	<div class="col-span-12">
		<div class="flex flex-wrap items-start justify-between gap-3">
			<div>
				<h3 class="font-heading text-sm font-semibold text-gray-900 dark:text-white">
					Token numbers
				</h3>
				<p class="text-base text-gray-600 dark:text-gray-400">
					Show indices on each word in the preview
				</p>
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
		<details
			class="rounded-none border border-gray-200 bg-gray-50 p-3 dark:border-gray-600 dark:bg-gray-800/50"
		>
			<summary
				class="font-heading cursor-pointer text-sm font-medium text-gray-900 dark:text-white"
			>
				Advanced tokenization
			</summary>
			<div class="mt-3">
				<p class="mb-3 text-base text-gray-600 dark:text-gray-400">
					Whitespace always splits tokens. Add extra separator characters to also split inside words
					(for example: <code class="rounded-none bg-gray-200 px-1 dark:bg-gray-700">.-</code> makes
					<code class="rounded-none bg-gray-200 px-1 dark:bg-gray-700">cat.s</code>
					and
					<code class="rounded-none bg-gray-200 px-1 dark:bg-gray-700">cat-s</code>
					become
					<code class="rounded-none bg-gray-200 px-1 dark:bg-gray-700">cat</code> +
					<code class="rounded-none bg-gray-200 px-1 dark:bg-gray-700">s</code>).
				</p>
				<Label for="token-split-chars" class="mb-2">Extra token separators</Label>
				<input
					id="token-split-chars"
					type="text"
					class={inputClass}
					placeholder={DEFAULT_TOKEN_SPLIT_CHARS}
					value={s.tokenSplitChars}
					oninput={(e) => updateTokenSplitChars((e.currentTarget as HTMLInputElement).value)}
				/>
			</div>
		</details>
	</div>
</div>
