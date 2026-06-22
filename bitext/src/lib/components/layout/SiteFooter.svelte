<script lang="ts">
	import { resolve } from '$app/paths';
	import { ALIGNER_DISPLAY_NAME, TALLY_FORM_ID } from '$lib/brand.js';

	let { class: className = '' }: { class?: string } = $props();

	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';

	const feedbackBtnClass =
		'inline cursor-pointer border-0 bg-transparent p-0 text-sm text-gray-600 underline decoration-gray-400/50 underline-offset-2 transition-colors hover:text-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 dark:text-gray-400 dark:decoration-gray-500/50 dark:hover:text-gray-200 dark:focus-visible:outline-primary-500';

	const year = new Date().getFullYear();
	const authorSite = 'https://danipolani.github.io/en/';
	const toolsPage = 'https://danipolani.github.io/en/blog/tools/';
</script>

<footer
	class="mt-14 border-t border-gray-200 pt-8 text-center text-sm text-gray-600 dark:border-gray-700 dark:text-gray-400 {className}"
>
	<p class="m-0">
		<a href={resolve('/')} class={linkClass}>Open {ALIGNER_DISPLAY_NAME}</a>
		<span class="mx-2 text-gray-400 dark:text-gray-600" aria-hidden="true">·</span>
		<a href={resolve('/api')} class={linkClass}>API</a>
		<span class="mx-2 text-gray-400 dark:text-gray-600" aria-hidden="true">·</span>
		<a href={resolve('/privacy')} class={linkClass}>Privacy policy</a>
	</p>
	<p class="mx-auto mt-5 max-w-md text-base leading-relaxed text-gray-700 dark:text-gray-300">
		Created by
		<a href={authorSite} class={linkClass} target="_blank" rel="noopener noreferrer">Dani Polani</a
		>. More
		<a href={toolsPage} class={linkClass} target="_blank" rel="noopener noreferrer">tools</a> for
		linguistics and conlanging.
	</p>
	<p class="mt-4">
		<button
			type="button"
			class={feedbackBtnClass}
			data-tally-open={TALLY_FORM_ID}
			data-tally-auto-close="0"
			data-tally-hide-title="1"
			data-tally-form-events-forwarding="1"
		>
			Send feedback
		</button>
	</p>
	<p class="mt-4 text-gray-500 dark:text-gray-500">© {year} Dani Polani</p>
</footer>
