<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { ALIGNER_SITE_HOST } from '$lib/brand.js';
	import { encodeState } from '$lib/serialization/encode.js';
	import { SCHEMA_VERSION, type AppStateV2 } from '$lib/serialization/schema.js';
	import { projectStore } from '$lib/state/project.svelte.js';
	import { settingsStore } from '$lib/state/settings.svelte.js';
	import { getShareUrl } from '$lib/share/url.js';
	import { shareUrlToQrDataUrl } from '$lib/share/qr.js';
	import CopyLinkButton from './CopyLinkButton.svelte';

	let modalOpen = $state(false);
	let qrSrc = $state<string | null>(null);
	let qrErr = $state<string | null>(null);
	let qrLoading = $state(false);

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
		</div>
	</div>
</Modal>
