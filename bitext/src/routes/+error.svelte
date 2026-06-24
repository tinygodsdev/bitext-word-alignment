<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';

	const isNotFound = $derived(page.status === 404);
	const heading = $derived(isNotFound ? 'Page not found' : 'Something went wrong');
	const message = $derived(
		isNotFound
			? 'The page you were looking for does not exist or may have moved.'
			: (page.error?.message ?? 'An unexpected error occurred.')
	);

	const linkClass =
		'font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';
	const ctaClass =
		'inline-flex items-center gap-1 rounded-none border border-primary-600 bg-primary-600 px-4 py-2 text-sm font-medium text-white no-underline shadow-sm hover:bg-primary-700 dark:border-primary-500 dark:bg-primary-600 dark:hover:bg-primary-500';
</script>

<svelte:head>
	<title>{page.status} · Word Aligner</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main
	class="mx-auto flex w-full max-w-3xl min-w-0 flex-col px-4 pt-10 pb-16 text-gray-700 sm:px-6 md:pt-16 md:pb-20 dark:text-gray-300"
>
	<p class="font-heading text-6xl font-bold text-gray-300 dark:text-gray-600">{page.status}</p>
	<h1 class="font-heading mt-4 text-3xl font-semibold text-gray-900 sm:text-4xl dark:text-white">
		{heading}
	</h1>
	<p class="mt-4 max-w-prose text-base leading-relaxed">{message}</p>

	<div class="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
		<a href={resolve('/')} class={ctaClass}>Open Word Aligner</a>
		<a href={resolve('/examples')} class="{linkClass} text-sm">Browse examples</a>
		<a href={resolve('/api')} class="{linkClass} text-sm">API docs</a>
	</div>

	<SiteFooter />
</main>
