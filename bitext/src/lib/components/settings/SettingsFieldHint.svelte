<script lang="ts">
	/** Tooltip body (plain text; keep concise). */
	let { text }: { text: string } = $props();

	let btnEl = $state<HTMLButtonElement | null>(null);
	let tipEl = $state<HTMLElement | null>(null);
	let open = $state(false);
	let top = $state(0);
	let left = $state(0);
	let placeBelow = $state(false);

	const MARGIN = 8;

	function position() {
		if (!btnEl || !tipEl) return;
		const b = btnEl.getBoundingClientRect();
		const t = tipEl.getBoundingClientRect();
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		// Prefer above the button; drop below when there is not enough room.
		placeBelow = b.top - t.height - MARGIN < 0 && b.bottom + t.height + MARGIN <= vh;
		top = placeBelow ? b.bottom + MARGIN : b.top - t.height - MARGIN;

		// Center on the button, then clamp inside the viewport.
		let l = b.left + b.width / 2 - t.width / 2;
		l = Math.min(Math.max(l, MARGIN), vw - t.width - MARGIN);
		left = l;
	}

	function show() {
		open = true;
		// Measure after the tooltip is in the DOM.
		queueMicrotask(position);
	}

	function hide() {
		open = false;
	}

	$effect(() => {
		if (!open) return;
		function onScrollOrResize() {
			position();
		}
		window.addEventListener('scroll', onScrollOrResize, true);
		window.addEventListener('resize', onScrollOrResize);
		return () => {
			window.removeEventListener('scroll', onScrollOrResize, true);
			window.removeEventListener('resize', onScrollOrResize);
		};
	});
</script>

<span class="inline-flex items-center align-middle">
	<button
		bind:this={btnEl}
		type="button"
		class="ml-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-gray-400 bg-gray-100 text-[11px] font-bold leading-none text-gray-500 hover:border-gray-500 hover:bg-gray-200 hover:text-gray-700 focus-visible:outline focus-visible:ring-2 focus-visible:ring-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-200 dark:focus-visible:ring-gray-500"
		aria-label="More info"
		onpointerenter={show}
		onpointerleave={hide}
		onfocus={show}
		onblur={hide}
	>
		?
	</button>
	{#if open}
		<span
			bind:this={tipEl}
			role="tooltip"
			style:top="{top}px"
			style:left="{left}px"
			class="pointer-events-none fixed z-100 w-max max-w-[min(22rem,calc(100vw-1rem))] whitespace-pre-line rounded-md bg-gray-900 px-2.5 py-2 text-left text-xs font-normal leading-snug text-white shadow-md dark:bg-gray-700"
		>
			{text}
		</span>
	{/if}
</span>
