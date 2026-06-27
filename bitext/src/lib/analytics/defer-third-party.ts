import { GA_MEASUREMENT_ID } from '$lib/brand.js';

/**
 * Load third-party scripts (GA gtag.js, Tally widget) after the page is interactive instead of
 * during initial load, to keep their JS off the critical path (helps TBT/INP). gtag() calls made
 * before the library loads queue in `dataLayer` and flush once it arrives; Tally binds its
 * `data-tally-open` buttons on load. Triggers on the first user interaction or when the main
 * thread goes idle, whichever comes first. Returns a cleanup function.
 */
export function deferThirdPartyScripts(): () => void {
	const sources = [
		`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`,
		'https://tally.so/widgets/embed.js'
	];
	const events = ['pointerdown', 'keydown', 'touchstart', 'scroll'] as const;

	let loaded = false;

	const cancelIdle = (handle: number) => {
		if (typeof window.cancelIdleCallback === 'function') window.cancelIdleCallback(handle);
		else window.clearTimeout(handle);
	};

	const removeListeners = () => {
		for (const event of events) window.removeEventListener(event, load);
	};

	function load() {
		if (loaded) return;
		loaded = true;
		removeListeners();
		cancelIdle(idleHandle);
		for (const src of sources) {
			const script = document.createElement('script');
			script.src = src;
			script.async = true;
			document.head.appendChild(script);
		}
	}

	for (const event of events) {
		window.addEventListener(event, load, { once: true, passive: true });
	}

	const idleHandle =
		typeof window.requestIdleCallback === 'function'
			? window.requestIdleCallback(load, { timeout: 4000 })
			: window.setTimeout(load, 3000);

	return () => {
		removeListeners();
		if (!loaded) cancelIdle(idleHandle);
	};
}
