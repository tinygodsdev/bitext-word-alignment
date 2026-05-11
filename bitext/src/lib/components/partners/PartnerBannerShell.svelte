<script lang="ts">
	import type { Snippet } from 'svelte';
	import { PARTNER_LINK_WHY_TOOLTIP } from '$lib/brand.js';

	let {
		title,
		href,
		ctaLabel,
		toneClass,
		partner,
		product,
		children
	}: {
		title: string;
		href: string;
		ctaLabel: string;
		/** Left accent bar + pale tinted surface (light/dark), e.g. border-l-[#hex] bg-[#hex]/10 */
		toneClass: string;
		/** GA4 `affiliate_click` — stable slug, e.g. preply */
		partner: string;
		/** GA4 `affiliate_click` — offer/category slug, e.g. language_tutors */
		product: string;
		children: Snippet;
	} = $props();

	const linkClass =
		'inline-flex max-w-full items-center gap-1 text-sm font-medium text-primary-700 underline decoration-primary-700/40 underline-offset-2 hover:text-primary-800 hover:decoration-primary-800 dark:text-primary-400 dark:decoration-primary-400/50 dark:hover:text-primary-300';
</script>

<article
	class="min-w-0 rounded-md border border-gray-200 border-l-4 p-4 sm:p-5 dark:border-gray-700 {toneClass}"
	aria-label={title}
>
	<div
		class="grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start sm:gap-x-3 sm:gap-y-2"
	>
		<h3
			class="font-heading m-0 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 self-start text-base font-semibold leading-snug text-gray-900 sm:col-start-1 sm:row-start-1 sm:text-lg dark:text-white"
		>
			<span class="min-w-0">{title}</span>
			<span class="relative inline-flex shrink-0 items-center">
				<button
					type="button"
					class="peer inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gray-300/90 bg-gray-50/80 text-[10px] font-normal leading-none text-gray-400 transition-colors hover:border-gray-400 hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:ring-2 focus-visible:ring-gray-400 dark:border-gray-600 dark:bg-gray-800/60 dark:text-gray-500 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:focus-visible:ring-gray-500"
					aria-label="Why is this here?"
				>
					?
				</button>
				<span
					role="tooltip"
					class="pointer-events-none absolute top-full left-1/2 z-[60] mt-1.5 hidden w-max max-w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 whitespace-pre-line rounded-md bg-gray-900 px-3 py-2.5 text-left text-xs font-normal leading-snug text-white shadow-md peer-hover:block peer-focus-visible:block dark:bg-gray-700"
				>
					{PARTNER_LINK_WHY_TOOLTIP}
				</span>
			</span>
		</h3>
		<div
			class="text-sm leading-relaxed text-gray-600 sm:col-span-2 sm:col-start-1 sm:row-start-2 dark:text-gray-300"
		>
			{@render children()}
		</div>
		<a
			class="affiliate-link {linkClass} mt-1 max-sm:mt-2 sm:col-start-2 sm:row-start-1 sm:mt-0 sm:justify-self-end sm:text-right"
			href={href}
			data-partner={partner}
			data-product={product}
			target="_blank"
			rel="noopener noreferrer sponsored"
		>
			{ctaLabel}
			<span aria-hidden="true">→</span>
		</a>
	</div>
</article>
