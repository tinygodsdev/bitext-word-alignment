import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { handleMcpMessage, MCP_PROTOCOL_VERSION } from '$lib/mcp/server.js';

// MCP Streamable HTTP endpoint. Stateless: every POST carries one JSON-RPC message and gets
// one JSON-RPC response (or 202 for notifications). No sessions, no server-initiated streams.
const CORS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers':
		'Content-Type, Mcp-Session-Id, MCP-Protocol-Version, Authorization',
	'Access-Control-Expose-Headers': 'Mcp-Session-Id, MCP-Protocol-Version'
};

export const OPTIONS: RequestHandler = () => new Response(null, { status: 204, headers: CORS });

// We do not offer a server-initiated SSE stream; clients must POST.
export const GET: RequestHandler = () =>
	new Response('Method Not Allowed', { status: 405, headers: { ...CORS, Allow: 'POST, OPTIONS' } });

export const POST: RequestHandler = async ({ request, url }) => {
	let message: unknown;
	try {
		message = await request.json();
	} catch {
		return json(
			{ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } },
			{ status: 400, headers: CORS }
		);
	}

	const response = await handleMcpMessage(message, url.origin);

	// Notification — nothing to return.
	if (response === null) return new Response(null, { status: 202, headers: CORS });

	return json(response, { headers: { ...CORS, 'MCP-Protocol-Version': MCP_PROTOCOL_VERSION } });
};
