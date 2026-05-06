<script lang="ts">
	import { browser } from '$app/environment';
	import { Label, Range, Popover } from 'flowbite-svelte';
	import type { LineV2 } from '$lib/serialization/schema.js';
	import { GOOGLE_FONT_OPTIONS } from '$lib/fonts/google-fonts.js';
	import { MAX_TEXT_SIZE_PX, MIN_TEXT_SIZE_PX } from '$lib/serialization/schema.js';
	import { listStoredCustomFontNames, saveCustomFontBlob } from '$lib/fonts/custom-fonts.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { layoutExportStore } from '$lib/state/layoutExport.svelte.js';
	import { linkHover } from '$lib/state/linkHover.svelte.js';
	import { connectionForId, primaryConnectionForToken } from '$lib/domain/alignment.js';
	import TokenChip from './TokenChip.svelte';

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

	const tokens = $derived(projectStore.tokensOnLine(line.id));
	const connections = $derived(projectStore.connections);
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

	function tokenLinked(id: string): boolean {
		return connections.some((c) => c.upperTokenId === id || c.lowerTokenId === id);
	}

	function tokenLinkColor(id: string): string | null {
		const c = primaryConnectionForToken(connections, id);
		return c?.color ?? null;
	}

	function tokenHighlighted(id: string): boolean {
		const hid = linkHover.id;
		if (!hid) return false;
		const c = connectionForId(connections, hid);
		if (!c) return false;
		return c.upperTokenId === id || c.lowerTokenId === id;
	}

	function lineHasAnyConnection(): boolean {
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

	function onPopoverToggle() {
		layoutExportStore.requestRemeasureAfterLayout();
	}
</script>

<Popover {triggeredBy} trigger="click" placement="left" arrow={false} ontoggle={onPopoverToggle}>
	<div
		class="max-h-[70vh] w-[min(100vw-2rem,22rem)] overflow-y-auto text-left font-sans text-sm text-gray-900 dark:text-gray-100"
	>
		<p
			class="mb-3 max-w-full font-heading text-sm font-semibold whitespace-nowrap text-gray-900 text-ellipsis overflow-hidden dark:text-white"
			title={popoverTitleFull}
		>
			{popoverTitle}
		</p>
		<div class="mb-3 flex flex-wrap items-center justify-end gap-2">
			<button
				type="button"
				class="rounded-none border border-red-300 px-2 py-0.5 text-xs text-red-700 disabled:opacity-40 dark:border-red-800 dark:text-red-400"
				disabled={total <= 2}
				onclick={() => {
					if (!confirmRemove()) return;
					projectStore.removeLine(line.id);
				}}
			>
				Remove
			</button>
		</div>

		<div class="mb-3 grid grid-cols-12 gap-3">
			<div class="col-span-12">
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
				<div class="col-span-12">
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
				<div class="col-span-12">
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
					<input
						type="file"
						accept=".woff2,.ttf,.otf,.woff"
						class="{fileClass} mt-2"
						onchange={onCustomUpload}
					/>
				</div>
			{/if}
			<div class="col-span-12">
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
		</div>

		<div class="mb-2 text-xs text-gray-600 dark:text-gray-400">Preview tokens</div>
		<div
			class="mb-3 flex max-h-24 flex-wrap items-center gap-x-2 gap-y-1.5 overflow-y-auto"
			role="group"
			aria-label="Word tokens"
		>
			{#each tokens as t (t.id)}
				<TokenChip
					id={t.id}
					text={t.text}
					lineId={line.id}
					selected={false}
					linked={tokenLinked(t.id)}
					linkHex={tokenLinkColor(t.id)}
					highlighted={tokenHighlighted(t.id)}
				/>
			{/each}
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
