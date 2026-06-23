import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { buildAlignUrl, parseAlignBody } from '$lib/api/align.js';

const CORS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
};

export const OPTIONS: RequestHandler = () => new Response(null, { status: 204, headers: CORS });

export const GET: RequestHandler = ({ url }) => {
	const lines = url.searchParams.getAll('lines');
	if (!lines.length)
		return json(
			{ error: 'Provide at least one ?lines= parameter' },
			{ status: 400, headers: CORS }
		);
	if (lines.length > 8)
		return json({ error: 'Maximum 8 lines allowed' }, { status: 400, headers: CORS });
	if (lines.reduce((sum, l) => sum + l.length, 0) > 80_000)
		return json({ error: 'Total lines text exceeds maximum size' }, { status: 400, headers: CORS });

	const result = buildAlignUrl(url.origin, { lines });
	if ('err' in result) return json({ error: result.err }, { status: 400, headers: CORS });
	return json(result, { headers: CORS });
};

export const POST: RequestHandler = async ({ request, url }) => {
	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return json({ error: 'Invalid JSON' }, { status: 400, headers: CORS });
	}

	const parsed = parseAlignBody(body);
	if ('err' in parsed) return json({ error: parsed.err }, { status: 400, headers: CORS });

	const result = buildAlignUrl(url.origin, parsed.ok);
	if ('err' in result) return json({ error: result.err }, { status: 400, headers: CORS });
	return json(result, { headers: CORS });
};
