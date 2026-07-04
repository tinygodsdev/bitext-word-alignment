<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import SeoIntro from './SeoIntro.svelte';
	import SeoSections from './SeoSections.svelte';

	// The panel stays in the DOM whether open or closed so its copy is crawlable; it is only
	// slid off-canvas and made inert when closed. Do NOT wrap the content in `{#if open}`.
	let { open = $bindable(false) }: { open?: boolean } = $props();

	const authorSite = 'https://danipolani.github.io/en/';
	const toolsPage = 'https://danipolani.github.io/en/blog/tools/';
	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';

	$effect(() => {
		if (!browser || !open) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === 'Escape') open = false;
		}
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});
</script>

{#if open}
	<button
		type="button"
		class="fixed inset-x-0 bottom-0 top-14 z-40 cursor-default bg-black/40 backdrop-blur-[1px]"
		aria-label="Close about panel"
		onclick={() => (open = false)}
	></button>
{/if}

<aside
	class="fixed bottom-0 left-0 top-14 z-50 flex w-[min(32rem,92vw)] flex-col border-r border-gray-200 bg-white shadow-xl transition-transform duration-200 dark:border-gray-700 dark:bg-gray-900 {open
		? 'translate-x-0'
		: '-translate-x-full'}"
	aria-label="About Word Aligner"
	aria-hidden={!open}
	inert={!open}
>
	<div
		class="flex shrink-0 items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-gray-700"
	>
		<h2 class="font-heading text-base font-semibold text-gray-900 dark:text-white">
			About Word Aligner
		</h2>
		<button
			type="button"
			class="inline-flex h-8 w-8 items-center justify-center rounded-none border-0 bg-transparent text-gray-500 hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-gray-400 dark:hover:text-gray-100"
			aria-label="Close about panel"
			onclick={() => (open = false)}
		>
			<CloseOutline class="h-5 w-5 shrink-0" aria-hidden="true" />
		</button>
	</div>

	<div class="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-4">
		<p class="max-w-prose text-base leading-relaxed text-gray-600 dark:text-gray-400">
			See exactly which word matches which across stacked lines. Add rows for glosses or IPA, click
			a word then its match on the line above or below, and export or share the diagram. Good for
			lessons, posts, or conlang notes.
		</p>

		<figure class="mt-4 mb-0">
			<div
				class="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
			>
				<img
					src="/examples/action.gif"
					alt="Animated demo: creating word links between “Hello world” and its French translation"
					loading="lazy"
					decoding="async"
					class="h-full w-full object-contain"
					style:clip-path="inset(10% 0 10% 0)"
				/>
			</div>
			<figcaption class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
				Linking words between two sentences
			</figcaption>
		</figure>

		<SeoIntro />

		<figure class="my-6">
			<div
				class="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
			>
				<img
					src="/examples/conlang_gloss.png"
					alt="Conlang example with a custom script font, interlinear glosses, and an English translation"
					loading="lazy"
					decoding="async"
					class="h-full w-full object-contain"
					style:clip-path="inset(10% 0 10% 0)"
				/>
			</div>
			<figcaption class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
				Conlang with a custom font and interlinear glosses
			</figcaption>
		</figure>

		<SeoSections />

		<p class="mt-8 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
			More in the <a href={resolve('/guide')} class={linkClass}>guides</a> and
			<a href={resolve('/examples')} class={linkClass}>examples</a>. Created by
			<a href={authorSite} class={linkClass} target="_blank" rel="noopener noreferrer">Dani</a>; see
			other
			<a href={toolsPage} class={linkClass} target="_blank" rel="noopener noreferrer">tools</a> for linguistics
			and conlanging.
		</p>
	</div>
</aside>
