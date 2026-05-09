<script lang="ts">
	import { browser } from '$app/environment';
	import { Button, Modal } from 'flowbite-svelte';
	import { ALIGNER_SITE_HOST } from '$lib/brand.js';
	import { encodeState } from '$lib/serialization/encode.js';
	import {
		SCHEMA_VERSION,
		defaultVisualSettingsV2,
		type AppStateV2,
		type VisualSettingsV2
	} from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { getShareUrl } from '$lib/share/url.js';
	import { shareUrlToQrDataUrl } from '$lib/share/qr.js';
	import CopyLinkButton from './CopyLinkButton.svelte';

	let modalOpen = $state(false);
	let qrSrc = $state<string | null>(null);
	let qrErr = $state<string | null>(null);
	let qrLoading = $state(false);
	let dataObjectCopied = $state(false);

	/** Called from parent via `bind:this` */
	export function open() {
		modalOpen = true;
	}

	function buildState(): AppStateV2 {
		return {
			v: SCHEMA_VERSION,
			project: projectStore.getSnapshot(),
			settings: { ...settingsStore.settings }
		};
	}

	const shareUrl = $derived.by(() => {
		const data = encodeState(buildState());
		return getShareUrl(data);
	});

	function qrTooLongMessage(): string {
		return 'This share link is too long for a single QR code. Shorten the text a bit or use Copy link instead.';
	}

	function friendlyQrError(e: unknown): string {
		const raw = e instanceof Error ? e.message : String(e);
		if (/code length overflow|too long|larger than/i.test(raw) || raw.includes('overflow')) {
			return qrTooLongMessage();
		}
		return raw || 'Could not generate QR code.';
	}

	$effect(() => {
		const open = modalOpen;
		const url = shareUrl;
		if (!open || !url) {
			qrSrc = null;
			qrErr = null;
			qrLoading = false;
			return;
		}
		let cancelled = false;
		qrLoading = true;
		qrErr = null;
		qrSrc = null;
		shareUrlToQrDataUrl(url)
			.then((src) => {
				if (!cancelled) {
					qrSrc = src;
					qrErr = null;
				}
			})
			.catch((e: unknown) => {
				if (!cancelled) {
					qrSrc = null;
					qrErr = friendlyQrError(e);
				}
			})
			.finally(() => {
				if (!cancelled) qrLoading = false;
			});
		return () => {
			cancelled = true;
		};
	});

	function downloadQrPng() {
		if (!qrSrc) return;
		const a = document.createElement('a');
		a.href = qrSrc;
		a.download = 'alignment-share-qr.png';
		a.click();
	}

	function visualSettingsDiff(): Partial<VisualSettingsV2> | undefined {
		const cur = settingsStore.settings;
		const d = defaultVisualSettingsV2();
		const patch: Partial<VisualSettingsV2> = {};
		(keysOfVisualSettings() as (keyof VisualSettingsV2)[]).forEach((k) => {
			if (cur[k] !== d[k]) (patch as Record<string, unknown>)[k] = cur[k];
		});
		return Object.keys(patch).length ? patch : undefined;
	}

	function keysOfVisualSettings(): (keyof VisualSettingsV2)[] {
		return Object.keys(defaultVisualSettingsV2()) as (keyof VisualSettingsV2)[];
	}

	/** JSON shaped like `ExampleEntry` in `src/lib/state/examples.ts` (placeholders for id/label). */
	function buildExampleDataObject(): Record<string, unknown> {
		const snap = projectStore.getSnapshot();
		const out: Record<string, unknown> = {
			format: 'bitext-example-candidate-v1',
			id: '<ExampleId>',
			label: '<Example label>',
			lines: snap.lines.map((l) => ({ ...l, font: { ...l.font } })),
			connections: snap.connections.map((c) => [c.upperTokenId, c.lowerTokenId])
		};
		if (snap.pairControls.length) {
			out.pairControls = snap.pairControls.map((p) => ({ ...p }));
		}
		if (snap.linePairGaps.length) {
			out.linePairGaps = snap.linePairGaps.map((g) => ({ ...g }));
		}
		const diff = visualSettingsDiff();
		if (diff) out.settings = diff;
		return out;
	}

	async function copyDataObject() {
		if (!browser) return;
		const text = JSON.stringify(buildExampleDataObject(), null, '\t');
		await navigator.clipboard.writeText(text);
		dataObjectCopied = true;
		setTimeout(() => (dataObjectCopied = false), 2000);
	}
</script>

<Modal bind:open={modalOpen} title="Share" size="md">
	<p class="text-base text-gray-600 dark:text-gray-400">
		The link encodes your sentences, glosses, alignments, and visualization settings in the
		<code class="text-sm">data</code> URL parameter. It can be long, but everything is restored when
		the page opens on {ALIGNER_SITE_HOST}.
	</p>
	<p class="mt-3 break-all text-base text-gray-600 dark:text-gray-400">{shareUrl}</p>

	<div
		class="mt-5 border-t border-gray-200 pt-4 dark:border-gray-600"
		aria-labelledby="share-qr-heading"
	>
		<h3 id="share-qr-heading" class="mb-1 text-sm font-semibold text-gray-900 dark:text-white">
			QR code
		</h3>
		<p class="text-base text-gray-600 dark:text-gray-400">
			Scan to open the same link — the full project is still inside the URL.
		</p>
		{#if qrLoading}
			<p class="mt-3 text-base text-gray-500 dark:text-gray-400" role="status">Generating…</p>
		{/if}
		{#if qrErr}
			<p class="mt-3 text-base text-red-600 dark:text-red-400">{qrErr}</p>
		{/if}
		{#if qrSrc}
			<img
				src={qrSrc}
				width="280"
				height="280"
				alt="QR code that encodes the share link with your alignment and settings"
				class="mx-auto mt-3 block border border-gray-200 bg-white dark:border-gray-600"
			/>
		{/if}
		<div class="mt-4 flex flex-wrap items-center gap-2">
			<CopyLinkButton />
			{#if qrSrc}
				<Button color="light" size="sm" class="shrink-0" onclick={downloadQrPng}>
					Download QR (PNG)
				</Button>
			{/if}
			<Button
				color="alternative"
				size="sm"
				class="shrink-0 border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-800"
				onclick={copyDataObject}
			>
				{dataObjectCopied ? 'Copied!' : 'Data object'}
			</Button>
		</div>
	</div>
</Modal>
