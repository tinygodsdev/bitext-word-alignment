<script lang="ts">
	/**
	 * Click-to-load YouTube facade: shows a branded poster and only loads the
	 * privacy-preserving nocookie iframe after the user presses play, so no
	 * request reaches YouTube until then.
	 */
	let {
		id,
		title,
		label = 'Watch the demo'
	}: { id: string; title: string; label?: string } = $props();

	let playing = $state(false);
</script>

<div
	class="relative aspect-video w-full overflow-hidden border border-gray-200 bg-gray-950 dark:border-gray-700"
>
	{#if playing}
		<iframe
			class="absolute inset-0 h-full w-full"
			src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
			{title}
			loading="lazy"
			allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
			allowfullscreen
		></iframe>
	{:else}
		<button
			type="button"
			class="group absolute inset-0 flex h-full w-full cursor-pointer flex-col items-center justify-center gap-4 bg-linear-to-br from-primary-900 via-gray-900 to-gray-950 transition-colors focus-visible:outline-none"
			onclick={() => (playing = true)}
			aria-label={`Play video: ${title}`}
		>
			<span
				class="pointer-events-none absolute inset-0"
				style="background: radial-gradient(120% 120% at 20% -10%, rgba(99,102,241,0.4), transparent 55%);"
				aria-hidden="true"
			></span>
			<span
				class="relative flex h-16 w-16 items-center justify-center rounded-full bg-white/95 ring-1 ring-white/40 transition-transform duration-200 group-hover:scale-110 group-focus-visible:scale-110"
			>
				<svg
					class="ml-1 h-7 w-7 text-primary-700"
					viewBox="0 0 24 24"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z"
					/>
				</svg>
			</span>
			<span class="font-heading relative text-sm font-medium tracking-wide text-white/90">
				{label}
			</span>
		</button>
	{/if}
</div>
