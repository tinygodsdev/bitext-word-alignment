<script lang="ts">
	import { browser } from '$app/environment';
	import { TrashBinOutline } from 'flowbite-svelte-icons';
	import { Label, Range, Popover } from 'flowbite-svelte';
	import type { LineV2 } from '$lib/serialization/schema.js';
	import { GOOGLE_FONT_OPTIONS } from '$lib/fonts/google-fonts.js';
	import {
		MAX_TEXT_SIZE_PX,
		MAX_WORD_GAP_PX,
		MIN_TEXT_SIZE_PX,
		MIN_WORD_GAP_PX
	} from '$lib/serialization/schema.js';
	import { listStoredCustomFontNames, saveCustomFontBlob } from '$lib/fonts/custom-fonts.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';

	let {
		line,
		index,
		total,
		triggeredBy
	}: {
		line: LineV2;
		index: number;
		total: number;
		triggeredBy: string;
	} = $props();

	const sel =
		'block w-full rounded-none border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-primary-500 dark:focus:ring-primary-500';

	const fileClass =
		'block w-full cursor-pointer rounded-none border border-gray-300 bg-gray-50 text-sm text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400';

	const nextLine = $derived(projectStore.lines[index + 1]);

	const popoverTitle = $derived.by(() => {
		const flat = line.rawText.replace(/\s+/g, ' ').trim();
		const prefix = `Line ${index + 1}`;
		if (!flat) return prefix;
		const max = 56;
		const slice = flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
		return `${prefix} — ${slice}`;
	});

	const popoverTitleFull = $derived.by(() => {
		const flat = line.rawText.replace(/\s+/g, ' ').trim();
		return flat ? `Line ${index + 1} — ${flat}` : `Line ${index + 1}`;
	});

	let customNames = $state<string[]>([]);

	$effect(() => {
		if (!browser) return;
		void line.font.source;
		void projectStore.lines;
		void listStoredCustomFontNames().then((n) => (customNames = n));
	});

	function lineHasAnyConnection(): boolean {
		const connections = projectStore.connections;
		return connections.some(
			(c) => c.upperTokenId.startsWith(`${line.id}-`) || c.lowerTokenId.startsWith(`${line.id}-`)
		);
	}

	function confirmRemove(): boolean {
		if (!lineHasAnyConnection()) return true;
		return typeof window !== 'undefined'
			? window.confirm('This line has connections. Removing it will delete those links. Continue?')
			: true;
	}

	async function onCustomUpload(e: Event) {
		const input = e.currentTarget as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		const name = file.name.replace(/\.[^.]+$/, '') || 'CustomFont';
		await saveCustomFontBlob(name, file);
		const buf = await file.arrayBuffer();
		if (browser) {
			const ff = new FontFace(name, buf);
			await ff.load();
			document.fonts.add(ff);
		}
		customNames = [...new Set([...customNames, name])].sort((a, b) => a.localeCompare(b));
		projectStore.updateLineStyle(line.id, {
			font: { source: 'custom', customName: name, family: name },
			textSizePx: line.textSizePx
		});
		input.value = '';
	}

	function onPopoverToggle(ev: ToggleEvent) {
		if (ev.newState === 'closed') {
			layoutExportStore.requestRemeasureAfterLayout();
		}
	}
</script>

<Popover
	{triggeredBy}
	trigger="click"
	strategy="fixed"
	placement="left"
	arrow={false}
	ontoggle={onPopoverToggle}
	classes={{ content: '!p-[13px]' }}
>
	<div
		class="max-h-[70vh] w-[min(100vw-2rem,28rem)] overflow-y-auto text-left font-sans text-sm text-gray-900 dark:text-gray-100"
	>
		<div class="mb-3 flex items-start gap-2">
			<p
				class="min-w-0 flex-1 font-heading text-sm font-semibold leading-snug text-gray-900 dark:text-white"
				title={popoverTitleFull}
			>
				<span class="line-clamp-2 break-words">{popoverTitle}</span>
			</p>
			<button
				type="button"
				class="shrink-0 rounded-none border border-red-300 bg-white p-1.5 text-red-700 hover:bg-red-50 disabled:opacity-40 dark:border-red-800 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700"
				disabled={total <= 2}
				aria-label="Remove line"
				title="Remove line"
				onclick={() => {
					if (!confirmRemove()) return;
					projectStore.removeLine(line.id);
				}}
			>
				<TrashBinOutline class="h-4 w-4" aria-hidden="true" />
			</button>
		</div>

		<div class="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
			<div class="min-w-0">
				<Label class="mb-1 block text-xs text-gray-600 dark:text-gray-400">Font source</Label>
				<select
					class={sel}
					value={line.font.source}
					onchange={(e) => {
						const v = (e.currentTarget as HTMLSelectElement).value as 'google' | 'custom';
						if (v === 'google') {
							projectStore.updateLineStyle(line.id, {
								font: { family: 'Inter', source: 'google' }
							});
						} else {
							const first = customNames[0];
							projectStore.updateLineStyle(line.id, {
								font: {
									source: 'custom',
									family: first ?? 'Custom',
									customName: first
								}
							});
						}
					}}
				>
					<option value="google">Google Fonts</option>
					<option value="custom">Custom</option>
				</select>
			</div>
			{#if line.font.source === 'google'}
				<div class="min-w-0">
					<Label class="mb-1 block text-xs text-gray-600 dark:text-gray-400">Typeface</Label>
					<select
						class={sel}
						value={line.font.family}
						onchange={(e) =>
							projectStore.updateLineStyle(line.id, {
								font: {
									family: (e.currentTarget as HTMLSelectElement).value,
									source: 'google'
								}
							})}
					>
						{#each GOOGLE_FONT_OPTIONS as o (o.family)}
							<option value={o.label}>{o.label}</option>
						{/each}
					</select>
				</div>
			{:else}
				<div class="min-w-0">
					<Label class="mb-1 block text-xs text-gray-600 dark:text-gray-400">Custom font</Label>
					<select
						class={sel}
						value={line.font.customName ?? ''}
						onchange={(e) => {
							const name = (e.currentTarget as HTMLSelectElement).value;
							projectStore.updateLineStyle(line.id, {
								font: { source: 'custom', customName: name, family: name || 'Custom' }
							});
						}}
					>
						<option value="" disabled={customNames.length > 0}>Choose uploaded font…</option>
						{#each customNames as n (n)}
							<option value={n}>{n}</option>
						{/each}
					</select>
				</div>
			{/if}
		</div>

		{#if line.font.source === 'custom'}
			<div class="mb-3">
				<input
					type="file"
					accept=".woff2,.ttf,.otf,.woff"
					class={fileClass}
					onchange={onCustomUpload}
				/>
			</div>
		{/if}

		<div class="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
			<div class="min-w-0">
				<Label class="mb-1">Size ({line.textSizePx}px)</Label>
				<Range
					appearance="auto"
					color="indigo"
					size="lg"
					min={MIN_TEXT_SIZE_PX}
					max={MAX_TEXT_SIZE_PX}
					step={1}
					value={line.textSizePx}
					oninput={(e) =>
						projectStore.updateLineStyle(line.id, {
							textSizePx: Number((e.currentTarget as HTMLInputElement).value)
						})}
				/>
			</div>
			<div class="min-w-0">
				<Label class="mb-1">Word gap ({line.gapWordPx}px)</Label>
				<Range
					appearance="auto"
					color="indigo"
					size="lg"
					min={MIN_WORD_GAP_PX}
					max={MAX_WORD_GAP_PX}
					step={1}
					value={line.gapWordPx}
					oninput={(e) =>
						projectStore.updateLineStyle(line.id, {
							gapWordPx: Number((e.currentTarget as HTMLInputElement).value)
						})}
				/>
			</div>
		</div>

		{#if nextLine}
			<div class="border-t border-gray-100 pt-3 dark:border-gray-700" role="group">
				<Label
					class="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
				>
					<input
						type="checkbox"
						class="peer h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-primary-600"
						checked={projectStore.pairShowsConnectors(line.id, nextLine.id)}
						onchange={(e) =>
							projectStore.setPairShowConnectors(
								line.id,
								nextLine.id,
								(e.currentTarget as HTMLInputElement).checked
							)}
					/>
					<span>Show connectors with line below</span>
				</Label>
			</div>
		{/if}
	</div>
</Popover>
