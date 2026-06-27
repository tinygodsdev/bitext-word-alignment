import type { RequestHandler } from './$types.js';

// Collector for Content-Security-Policy-Report-Only violations. Browsers POST a JSON report here
// (Content-Type application/csp-report or application/reports+json). We log it so violations are
// visible while the policy runs in report-only mode; nothing is stored.
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	console.error('[csp-report]', body);
	return new Response(null, { status: 204 });
};
