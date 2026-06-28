// Stateless MCP (Model Context Protocol) server for Word Aligner.
//
// Speaks JSON-RPC 2.0 over the Streamable HTTP transport. The single tool wraps the
// existing align logic (`parseAlignBody` + `buildAlignUrl`) so the MCP path and the HTTP
// API stay in sync. This module is transport-agnostic: it takes a parsed JSON-RPC message
// and the request origin, and returns the response object (or null for notifications).

import { Resvg } from '@resvg/resvg-js';
import { parseAlignBody, buildAlignUrl } from '$lib/api/align.js';
import { decodeState } from '$lib/serialization/decode.js';
import { buildOgSvg } from '$lib/seo/og-svg.js';
import { loadOgFontFiles } from '$lib/seo/og-fonts.js';

export const MCP_PROTOCOL_VERSION = '2025-06-18';

const SERVER_INFO = {
	name: 'word-aligner',
	title: 'Word Aligner',
	version: '1.0.0'
};

const SERVER_INSTRUCTIONS =
	'Word Aligner turns a phrase and its translation into a shareable visual diagram that ' +
	'connects matching words with colored arcs. Translate and tokenize the text yourself, ' +
	'work out which words correspond, then call create_word_alignment. Return the resulting ' +
	'URL to the user exactly as received, character for character without any modification; ' +
	'it opens the interactive diagram on aligner.tinygods.dev.';

// Width of the inline preview PNG. Smaller than the OG card to keep the base64 payload light.
const PREVIEW_WIDTH = 800;

const TOOL_DESCRIPTION = `Create a shareable Word Aligner diagram that shows which words match across two or more stacked lines of text (a translation and its source, an interlinear gloss, IPA, etc.). Returns a URL that opens the interactive diagram, plus a preview image.

Use this when the user wants to translate a phrase and show word correspondences, align a translation with its source (including RTL scripts like Hebrew or Arabic), or build a Leipzig-style interlinear gloss.

Word indices are 0-based token positions. Tokenize each line the same way the tool does before assigning indices:
- Whitespace always splits ("I have been going" -> I[0] have[1] been[2] going[3]).
- The characters in settings.tokenSplitChars (default ".-|") also split and are then removed from the rendered text, so "go.PST.IPFV" becomes three tokens (go, PST, IPFV) and the dots disappear. For Leipzig glosses set tokenSplitChars to "-|" to keep the dots.
- Punctuation stays attached by default ("Hello, world!" -> Hello,[0] world![1]).
- In RTL lines, word 0 is the logically first word (rightmost on screen); index in reading order.

Each alignment is [lineA, wordA, lineB, wordB]; the two lines must be vertically adjacent (|lineA - lineB| = 1). To express many-to-one, list each target word as its own tuple. Tokens that share a connection group get the same color automatically.`;

const LINE_INPUT_SCHEMA = {
	oneOf: [
		{ type: 'string', description: 'Plain line text (shorthand).' },
		{
			type: 'object',
			required: ['text'],
			additionalProperties: false,
			properties: {
				text: { type: 'string', description: 'Line text.' },
				font: {
					type: 'string',
					description: 'Google Fonts family name (e.g. "Noto Sans Hebrew"). Defaults to Inter.'
				},
				sizePx: {
					type: 'integer',
					minimum: 12,
					maximum: 64,
					description: 'Text size in px. Default 36.'
				},
				gapPx: {
					type: 'integer',
					minimum: 0,
					maximum: 56,
					description: 'Horizontal gap between word tokens in px. Default 14.'
				},
				rtl: {
					type: 'boolean',
					description: 'Right-to-left layout (Hebrew, Arabic, ...). Default false.'
				}
			}
		}
	]
};

const TOOL_INPUT_SCHEMA = {
	type: 'object',
	required: ['lines'],
	additionalProperties: false,
	properties: {
		lines: {
			type: 'array',
			minItems: 1,
			maxItems: 8,
			items: LINE_INPUT_SCHEMA,
			description:
				'Text lines, top to bottom. Each entry is a plain string or an object with per-line visual options.'
		},
		alignments: {
			type: 'array',
			description:
				'Word-alignment links as [lineA, wordA, lineB, wordB] (0-based indices, lines must be adjacent).',
			items: {
				type: 'array',
				minItems: 4,
				maxItems: 4,
				items: { type: 'integer' }
			}
		},
		settings: {
			type: 'object',
			additionalProperties: false,
			description: 'Global visual overrides. Unset fields inherit defaults.',
			properties: {
				palette: {
					type: 'string',
					enum: ['pastel', 'vivid', 'academic'],
					description: 'Connection color palette. Default pastel.'
				},
				lineStyle: {
					type: 'string',
					enum: ['straight', 'curved'],
					description: 'Connection line shape. Default curved.'
				},
				lineThickness: {
					type: 'number',
					minimum: 1,
					maximum: 8,
					description: 'Connection line thickness. Default 3.'
				},
				lineOpacity: {
					type: 'number',
					minimum: 0.2,
					maximum: 1,
					description: 'Connection line opacity. Default 1.'
				},
				background: {
					type: 'string',
					enum: ['light', 'dark'],
					description: 'Preview background. Default light.'
				},
				theme: {
					type: 'string',
					enum: ['light', 'dark'],
					description: 'UI theme (token chip color). Default light.'
				},
				showNumbers: { type: 'boolean', description: 'Show line numbers. Default false.' },
				colorTokensByLink: {
					type: 'boolean',
					description: 'Tint word tokens in their connection color. Default true.'
				},
				tokenSplitChars: {
					type: 'string',
					description:
						'Characters (besides whitespace) that split text into tokens and are then removed. Default ".-|". Set "-|" to keep periods in Leipzig glosses.'
				},
				tokenMergeChar: {
					type: 'string',
					maxLength: 1,
					description:
						'Single char that joins parts into one token rendered with a space (e.g. "is+playing"). Default "+".'
				}
			}
		},
		pairs: {
			type: 'array',
			description: 'Per-pair controls for a specific adjacent line pair.',
			items: {
				type: 'object',
				required: ['upper', 'lower'],
				additionalProperties: false,
				properties: {
					upper: { type: 'integer', description: '0-based index of the upper line.' },
					lower: {
						type: 'integer',
						description: '0-based index of the lower line (must equal upper + 1).'
					},
					gapPx: {
						type: 'integer',
						minimum: 12,
						maximum: 156,
						description: 'Vertical gap between the two lines in px. Default 120.'
					},
					showConnectors: {
						type: 'boolean',
						description: 'Draw connectors between this pair. Default true.'
					}
				}
			}
		}
	}
};

const TOOL_OUTPUT_SCHEMA = {
	type: 'object',
	properties: {
		url: {
			type: 'string',
			description:
				'The shareable diagram URL. Return this to the user exactly as received, character for character.'
		}
	},
	required: ['url']
};

const TOOL_DEFINITION = {
	name: 'create_word_alignment',
	title: 'Create word alignment diagram',
	description: TOOL_DESCRIPTION,
	inputSchema: TOOL_INPUT_SCHEMA,
	outputSchema: TOOL_OUTPUT_SCHEMA,
	// The tool only encodes its input into a URL (and renders a preview from that same input).
	// It does not read or mutate any external state, and the result is deterministic, so the
	// world of interaction is closed.
	annotations: {
		title: 'Create word alignment diagram',
		readOnlyHint: true,
		destructiveHint: false,
		idempotentHint: true,
		openWorldHint: false
	}
};

type JsonRpcId = string | number | null;

interface JsonRpcRequest {
	jsonrpc: '2.0';
	id?: JsonRpcId;
	method: string;
	params?: unknown;
}

function result(id: JsonRpcId, value: unknown) {
	return { jsonrpc: '2.0' as const, id, result: value };
}

function error(id: JsonRpcId, code: number, message: string) {
	return { jsonrpc: '2.0' as const, id, error: { code, message } };
}

/** Render an inline PNG preview of the alignment from a built share URL. Best-effort. */
async function renderPreviewPng(url: string): Promise<string | null> {
	const data = new URL(url).searchParams.get('data');
	if (!data) return null;
	const state = decodeState(data);
	const svg = buildOgSvg(state);
	const fontFiles = await loadOgFontFiles();
	const resvg = new Resvg(svg, {
		fitTo: { mode: 'width', value: PREVIEW_WIDTH },
		background: '#0f172a',
		font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' }
	});
	return Buffer.from(resvg.render().asPng()).toString('base64');
}

async function callCreateAlignment(origin: string, args: unknown) {
	const parsed = parseAlignBody(args);
	if ('err' in parsed) {
		return { content: [{ type: 'text', text: `Invalid input: ${parsed.err}` }], isError: true };
	}

	const built = buildAlignUrl(origin, parsed.ok);
	if ('err' in built) {
		return {
			content: [{ type: 'text', text: `Could not build alignment: ${built.err}` }],
			isError: true
		};
	}

	const content: Array<Record<string, unknown>> = [
		{ type: 'text', text: `Word Aligner diagram: ${built.url}` }
	];

	// The preview image is decorative; a render failure must not block returning the URL.
	let preview: string | null = null;
	try {
		preview = await renderPreviewPng(built.url);
	} catch (err) {
		console.error('mcp: preview render failed', err);
	}
	if (preview) {
		content.push({ type: 'image', data: preview, mimeType: 'image/png' });
	}

	return { content, structuredContent: { url: built.url } };
}

async function handleRequest(req: JsonRpcRequest, origin: string) {
	const id = req.id ?? null;

	switch (req.method) {
		case 'initialize':
			return result(id, {
				protocolVersion: MCP_PROTOCOL_VERSION,
				capabilities: { tools: {} },
				serverInfo: SERVER_INFO,
				instructions: SERVER_INSTRUCTIONS
			});

		case 'ping':
			return result(id, {});

		case 'tools/list':
			return result(id, { tools: [TOOL_DEFINITION] });

		case 'tools/call': {
			const params = (req.params ?? {}) as { name?: string; arguments?: unknown };
			if (params.name !== TOOL_DEFINITION.name) {
				return error(id, -32602, `Unknown tool: ${params.name}`);
			}
			return result(id, await callCreateAlignment(origin, params.arguments ?? {}));
		}

		default:
			return error(id, -32601, `Method not found: ${req.method}`);
	}
}

/**
 * Handle one JSON-RPC message. Returns the response object, or null when the message is a
 * notification (no `id`) that needs no reply.
 */
export async function handleMcpMessage(message: unknown, origin: string) {
	if (!message || typeof message !== 'object' || Array.isArray(message)) {
		return error(null, -32600, 'Invalid Request: expected a JSON-RPC object');
	}

	const req = message as JsonRpcRequest;
	if (req.jsonrpc !== '2.0' || typeof req.method !== 'string') {
		return error((req as { id?: JsonRpcId }).id ?? null, -32600, 'Invalid Request');
	}

	// Notifications (e.g. notifications/initialized) carry no id and expect no response.
	if (req.id === undefined) return null;

	return handleRequest(req, origin);
}
