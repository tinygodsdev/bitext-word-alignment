import adapter from '@sveltejs/adapter-node';

/**
 * Content-Security-Policy source allowlist. SvelteKit adds a nonce/hash to script-src on its own
 * injected scripts (mode 'auto': nonce for SSR, hash for prerendered), so script-src stays free of
 * 'unsafe-inline'. style-src keeps 'unsafe-inline' because the preview relies on dynamic inline
 * style attributes; SvelteKit skips adding nonces to any directive that already has 'unsafe-inline'.
 */
const cspDirectives = {
	'default-src': ["'self'"],
	'script-src': ["'self'", 'https://www.googletagmanager.com', 'https://tally.so'],
	'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
	'font-src': ["'self'", 'data:', 'https://fonts.gstatic.com'],
	'img-src': [
		"'self'",
		'data:',
		'blob:',
		'https://aligner.fra1.cdn.digitaloceanspaces.com',
		'https://www.google-analytics.com'
	],
	'connect-src': [
		"'self'",
		'https://www.googletagmanager.com',
		'https://*.google-analytics.com',
		'https://*.analytics.google.com',
		'https://fonts.gstatic.com'
	],
	'frame-src': ['https://tally.so'],
	'frame-ancestors': ["'self'"],
	'base-uri': ["'self'"],
	'form-action': ["'self'"],
	'object-src': ["'none'"],
	'report-uri': ['/api/csp-report']
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),
		/** Canonical / og:url on prerendered routes (examples, privacy). Without this, build bakes `http://sveltekit-prerender/...`. */
		prerender: {
			origin: 'https://aligner.tinygods.dev'
		},
		// Report-only first: observe violations via /api/csp-report before enforcing. Flip
		// `reportOnly` to `directives` once QA is clean (see the CSP task).
		csp: {
			mode: 'auto',
			// reportOnly: cspDirectives
			directives: cspDirectives,
		}
	}
};

export default config;
