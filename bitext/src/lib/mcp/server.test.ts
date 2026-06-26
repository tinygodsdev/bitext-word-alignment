import { describe, expect, it } from 'vitest';
import { handleMcpMessage, MCP_PROTOCOL_VERSION } from './server.js';
import { decodeState } from '$lib/serialization/decode.js';

const ORIGIN = 'https://example.com';

describe('handleMcpMessage — protocol', () => {
	it('responds to initialize with protocol version and tool capability', async () => {
		const res = await handleMcpMessage(
			{ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
			ORIGIN
		);
		expect(res).toMatchObject({
			jsonrpc: '2.0',
			id: 1,
			result: {
				protocolVersion: MCP_PROTOCOL_VERSION,
				capabilities: { tools: {} },
				serverInfo: { name: 'word-aligner' }
			}
		});
	});

	it('answers ping with an empty result', async () => {
		const res = await handleMcpMessage({ jsonrpc: '2.0', id: 2, method: 'ping' }, ORIGIN);
		expect(res).toMatchObject({ jsonrpc: '2.0', id: 2, result: {} });
	});

	it('lists exactly one read-only tool', async () => {
		const res = (await handleMcpMessage(
			{ jsonrpc: '2.0', id: 3, method: 'tools/list' },
			ORIGIN
		)) as { result: { tools: Array<Record<string, unknown>> } };
		expect(res.result.tools).toHaveLength(1);
		const tool = res.result.tools[0]!;
		expect(tool.name).toBe('create_word_alignment');
		expect(tool.annotations).toMatchObject({ readOnlyHint: true, openWorldHint: false });
		expect(tool.inputSchema).toMatchObject({ required: ['lines'] });
	});

	it('returns null (no reply) for a notification', async () => {
		const res = await handleMcpMessage(
			{ jsonrpc: '2.0', method: 'notifications/initialized' },
			ORIGIN
		);
		expect(res).toBeNull();
	});

	it('rejects an unknown method with -32601', async () => {
		const res = await handleMcpMessage({ jsonrpc: '2.0', id: 4, method: 'does/notExist' }, ORIGIN);
		expect(res).toMatchObject({ id: 4, error: { code: -32601 } });
	});

	it('rejects a non-object message with -32600', async () => {
		expect(await handleMcpMessage('nope', ORIGIN)).toMatchObject({ error: { code: -32600 } });
		expect(await handleMcpMessage([], ORIGIN)).toMatchObject({ error: { code: -32600 } });
	});
});

describe('handleMcpMessage — create_word_alignment', () => {
	async function callTool(args: unknown) {
		return (await handleMcpMessage(
			{
				jsonrpc: '2.0',
				id: 9,
				method: 'tools/call',
				params: { name: 'create_word_alignment', arguments: args }
			},
			ORIGIN
		)) as {
			result: {
				content: Array<{ type: string; text?: string }>;
				structuredContent?: { url: string };
				isError?: boolean;
			};
		};
	}

	it('builds a share URL whose decoded state matches the input', async () => {
		const res = await callTool({
			lines: ['Hello world', 'Bonjour le monde'],
			alignments: [
				[0, 0, 1, 0],
				[0, 1, 1, 2]
			]
		});

		const url = res.result.structuredContent!.url;
		expect(url.startsWith(`${ORIGIN}/?data=`)).toBe(true);

		const data = new URL(url).searchParams.get('data');
		const state = decodeState(data);
		expect(state.project.lines.map((l) => l.rawText)).toEqual(['Hello world', 'Bonjour le monde']);
		expect(state.project.connections).toHaveLength(2);

		const textBlock = res.result.content.find((c) => c.type === 'text');
		expect(textBlock?.text).toContain(url);
	});

	it('reports validation errors as an isError tool result, not a protocol error', async () => {
		const res = await callTool({ lines: [] });
		expect(res.result.isError).toBe(true);
		expect(res.result.content[0]!.text).toContain('Invalid input');
	});

	it('reports out-of-range word indices as an isError tool result', async () => {
		const res = await callTool({ lines: ['a', 'b'], alignments: [[0, 5, 1, 0]] });
		expect(res.result.isError).toBe(true);
		expect(res.result.content[0]!.text).toMatch(/Could not build|out of range/);
	});

	it('rejects a call for an unknown tool name with -32602', async () => {
		const res = await handleMcpMessage(
			{ jsonrpc: '2.0', id: 10, method: 'tools/call', params: { name: 'nope', arguments: {} } },
			ORIGIN
		);
		expect(res).toMatchObject({ id: 10, error: { code: -32602 } });
	});
});
