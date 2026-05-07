<script lang="ts">
	/** Tooltip body (plain text; keep concise). */
	let { text }: { text: string } = $props();
</script>

<span class="relative inline-flex items-center align-middle">
	<button
		type="button"
		class="peer ml-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-400 bg-gray-100 text-[11px] font-bold leading-none text-gray-500 hover:border-gray-500 hover:bg-gray-200 hover:text-gray-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:focus-visible:ring-gray-500"
		aria-label="More info"
	>
		?
	</button>
	<span
		role="tooltip"
		class="pointer-events-none absolute bottom-full left-1/2 z-[60] mb-1.5 hidden w-max max-w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 whitespace-pre-line rounded-md bg-gray-900 px-2.5 py-2 text-left text-xs font-normal leading-snug text-white shadow-md peer-hover:block peer-focus-visible:block dark:bg-gray-700"
	>
		{text}
	</span>
</span>
