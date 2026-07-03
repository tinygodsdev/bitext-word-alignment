<script lang="ts">
	import ColorsTab from '$lib/components/settings/ColorsTab.svelte';
	import AppearanceTab from '$lib/components/settings/AppearanceTab.svelte';
	import LinguisticsTab from '$lib/components/settings/LinguisticsTab.svelte';
	import FontsTab from '$lib/components/settings/FontsTab.svelte';
	import { workspaceStore } from '$lib/state/workspace.svelte.js';
</script>

<div class="flex flex-col gap-5">
	<div>
		<p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
			Colors
		</p>
		<ColorsTab />
	</div>

	<div>
		<p class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
			Look
		</p>
		<AppearanceTab group="basic" />
	</div>

	<div class="border-t border-gray-200 pt-3 dark:border-gray-700">
		<button
			type="button"
			class="flex w-full items-center justify-between rounded-none border-0 bg-transparent p-0 text-left text-sm font-semibold text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-white dark:focus-visible:outline-primary-500"
			aria-expanded={workspaceStore.fineTuneOpen}
			onclick={() => (workspaceStore.fineTuneOpen = !workspaceStore.fineTuneOpen)}
		>
			<span>Fine-tune</span>
			<svg
				class="h-4 w-4 shrink-0 text-gray-500 transition-transform dark:text-gray-400 {workspaceStore.fineTuneOpen
					? 'rotate-90'
					: ''}"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M7.21 14.77a.75.75 0 0 1 .02-1.06L10.94 10 7.23 6.29a.75.75 0 0 1 1.06-1.06l4.24 4.24a.75.75 0 0 1 0 1.06l-4.24 4.24a.75.75 0 0 1-1.08.0Z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
		{#if workspaceStore.fineTuneOpen}
			<div class="mt-3 flex flex-col gap-5">
				<p class="text-xs text-gray-500 dark:text-gray-400">
					Rarely needed. The choices above already produce a clean diagram.
				</p>
				<AppearanceTab group="fine" />
				<div>
					<p
						class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
					>
						Tokenization
					</p>
					<LinguisticsTab />
				</div>
				<div>
					<p
						class="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400"
					>
						Fonts
					</p>
					<FontsTab />
				</div>
			</div>
		{/if}
	</div>
</div>
