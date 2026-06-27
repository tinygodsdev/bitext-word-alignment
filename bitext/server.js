// Production server: wraps adapter-node's request handler so baseline security headers
// are added to EVERY response — including prerendered pages and static assets, which the
// SvelteKit `handle` hook does not cover. Run via `node server.js` (see Dockerfile).
import http from 'node:http';
import process from 'node:process';
import { handler } from './build/handler.js';

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT || 3000);
const shutdownTimeout = Number(process.env.SHUTDOWN_TIMEOUT || 30) * 1000;

// HSTS is safe because the site is HTTPS-only (Railway terminates TLS, redirects HTTP).
// Content-Security-Policy is set per-page by SvelteKit (kit.csp in svelte.config.js), which can
// add the required nonce/hash to its own scripts. These headers cover everything else (including
// prerendered pages and static assets, which the SvelteKit `handle` hook does not reach).
const SECURITY_HEADERS = {
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'SAMEORIGIN',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Permanent redirects for renamed example slugs (M7). Old URLs may already be linked or indexed,
// so 301 them to the new path. Prerendered pages bypass the SvelteKit `handle` hook, so this lives
// in front of the handler here.
const REDIRECTS = {
	'/examples/avar-camel-theft-interlinear': '/examples/avar-ergative-agreement-interlinear',
	'/examples/russian-evening-run-interlinear': '/examples/russian-case-agreement-interlinear-gloss',
	'/examples/turkish-infinitive-gloss-come-out': '/examples/turkish-one-to-many-morpheme-gloss',
	'/examples/hebrew-arabic-english-rtl': '/examples/hebrew-arabic-english-rtl-interlinear',
	'/examples/tagalog-verbal-aspect-paradigm': '/examples/tagalog-verbal-aspect-interlinear-gloss'
};

const server = http.createServer((req, res) => {
	// Set before the handler writes; merged into the final response headers.
	for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
		res.setHeader(name, value);
	}
	const queryAt = req.url.indexOf('?');
	const pathname = (queryAt === -1 ? req.url : req.url.slice(0, queryAt)).replace(/\/$/, '');
	const redirectTarget = REDIRECTS[pathname];
	if (redirectTarget) {
		res.statusCode = 301;
		res.setHeader('Location', redirectTarget + (queryAt === -1 ? '' : req.url.slice(queryAt)));
		res.end();
		return;
	}
	handler(req, res, () => {
		res.statusCode = 404;
		res.end('Not Found');
	});
});

server.listen(port, host, () => {
	console.log(`Listening on http://${host}:${port}`);
});

function gracefulShutdown() {
	server.closeIdleConnections?.();
	server.close(() => process.exit(0));
	setTimeout(() => process.exit(0), shutdownTimeout).unref();
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
