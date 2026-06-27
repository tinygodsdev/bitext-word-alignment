import { GA_MEASUREMENT_ID } from '$lib/brand.js';

let bootstrapped = false;

/**
 * Define the GA `gtag` shim and queue the initial config. Runs immediately and makes no network
 * request: gtag() calls accumulate in `dataLayer` and flush once gtag.js loads. Kept out of
 * app.html on purpose, so the page ships no inline script and the CSP can omit
 * script-src 'unsafe-inline'.
 */
function bootstrapGtag() {
	if (bootstrapped) return;
	bootstrapped = true;
	const w = window as typeof window & {
		dataLayer: unknown[];
		gtag: (...args: unknown[]) => void;
	};
	w.dataLayer = w.dataLayer || [];
	w.gtag = function gtag(...args: unknown[]) {
		w.dataLayer.push(args);
	};
	w.gtag('js', new Date());
	w.gtag('config', GA_MEASUREMENT_ID);
}

/**
 * Load third-party scripts (GA gtag.js, Tally widget) after the page is interactive instead of
 * during initial load, to keep their JS off the critical path (helps TBT/INP). The `gtag` shim is
 * set up synchronously here so page-view config is queued right away and SPA navigations can call
 * `window.gtag`; the heavy libraries load on the first user interaction or when the main thread
 * goes idle, whichever comes first. Returns a cleanup function.
 */
export function deferThirdPartyScripts(): () => void {
	bootstrapGtag();

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
