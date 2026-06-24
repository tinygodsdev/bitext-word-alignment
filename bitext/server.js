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
// No CSP yet: the app loads Google Fonts, GA, Tally, and a DigitalOcean CDN, so a correct
// policy needs its own change.
const SECURITY_HEADERS = {
	'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
	'X-Content-Type-Options': 'nosniff',
	'X-Frame-Options': 'SAMEORIGIN',
	'Referrer-Policy': 'strict-origin-when-cross-origin',
	'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

const server = http.createServer((req, res) => {
	// Set before the handler writes; merged into the final response headers.
	for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
		res.setHeader(name, value);
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
