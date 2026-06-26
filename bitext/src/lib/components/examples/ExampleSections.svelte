<script lang="ts">
	import type { ExampleSection } from '$lib/examples/types-gallery.js';

	let { sections, linkClass }: { sections: ExampleSection[]; linkClass: string } = $props();

	const headingClass =
		'font-heading scroll-mt-20 mt-10 mb-3 text-xl font-semibold text-gray-900 dark:text-white';

	const isExternal = (href: string) => href.startsWith('http');
</script>

{#each sections as section (section.id)}
	<section aria-labelledby={section.id}>
		<h2 id={section.id} class={headingClass}>{section.heading}</h2>
		{#each section.blocks as block, i (i)}
			{#if block.kind === 'paragraph'}
				<p class="mt-3 max-w-prose text-base leading-relaxed">{block.text}</p>
			{:else if block.kind === 'gloss'}
				{#if block.lead}
					<p class="mt-3 max-w-prose text-base leading-relaxed">{block.lead}</p>
				{/if}
				<dl class="mt-4 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[auto_1fr]">
					{#each block.rows as row (row.token)}
						<dt class="min-w-0 sm:text-right">
							<span class="font-mono text-sm font-semibold text-gray-900 dark:text-white"
								>{row.token}</span
							>
							<span class="ml-2 font-mono text-sm text-primary-700 dark:text-primary-400"
								>{row.gloss}</span
							>
						</dt>
						<dd class="m-0 text-sm leading-relaxed text-gray-600 dark:text-gray-400">{row.note}</dd>
					{/each}
				</dl>
			{:else if block.kind === 'links'}
				<p class="mt-3 max-w-prose text-base leading-relaxed">{block.lead}</p>
				<ul class="mt-2 list-disc space-y-1 pl-6">
					{#each block.items as item (item.href)}
						<li class="text-base leading-relaxed">
							<a
								href={item.href}
								class={linkClass}
								rel={isExternal(item.href) ? 'noopener noreferrer' : undefined}
								target={isExternal(item.href) ? '_blank' : undefined}>{item.label}</a
							>{#if item.text}{item.text}{/if}
						</li>
					{/each}
				</ul>
			{/if}
		{/each}
	</section>
{/each}
