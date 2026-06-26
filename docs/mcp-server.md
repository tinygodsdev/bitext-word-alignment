# MCP server

Word Aligner exposes a Model Context Protocol (MCP) server so AI assistants can call it as a
native tool. It lives inside the SvelteKit app (no separate service) and reuses the same
`buildAlignUrl` logic as the HTTP API.

- **Endpoint:** `https://aligner.tinygods.dev/mcp`
- **Transport:** Streamable HTTP, stateless (one JSON-RPC request per POST, one response back).
- **Auth:** none. The API is public.

## Code

- `bitext/src/lib/mcp/server.ts` — transport-agnostic JSON-RPC handler and the tool definition.
  Unit-tested in `server.test.ts`.
- `bitext/src/routes/mcp/+server.ts` — thin HTTP wrapper (POST/GET/OPTIONS, CORS).

The tool wraps `parseAlignBody` + `buildAlignUrl` from `bitext/src/lib/api/align.ts`, so the MCP
path and the HTTP API stay in sync. The link origin comes from the request URL.

## Tool

`create_word_alignment` — input is the same shape as `POST /api/align` (`lines`, `alignments`,
`settings`, `pairs`; see `bitext/src/routes/api/align/openapi.json/+server.ts`). It returns:

- a text block with the shareable URL,
- an inline PNG preview (rendered via the OG pipeline; best-effort, omitted if rendering fails),
- `structuredContent.url` with the same link.

Annotations match the behavior: `readOnlyHint: true`, `destructiveHint: false`,
`idempotentHint: true`, `openWorldHint: false`. The tool only encodes its input into a URL and
renders a preview from that same input; it does not read or mutate external state.

### Preview image caveat

The preview reuses the social-card renderer (`buildOgSvg`), which is tuned for a 1200×630 card and
truncates each line at ~50 characters. It is a thumbnail, not a full-fidelity export. The shareable
URL always carries the complete alignment.

## Connecting

### Claude (or any MCP client)

Add a remote MCP server pointing at `https://aligner.tinygods.dev/mcp`. In Claude Code:

```bash
claude mcp add --transport http word-aligner https://aligner.tinygods.dev/mcp
```

### ChatGPT (Developer Mode)

Settings → Connectors → Advanced → Developer Mode, then add a connector with the MCP URL
`https://aligner.tinygods.dev/mcp`. No OAuth.

## Manual check

```bash
# initialize
curl -s -X POST https://aligner.tinygods.dev/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"curl","version":"0"}}}'

# list tools
curl -s -X POST https://aligner.tinygods.dev/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/list"}'

# call the tool
curl -s -X POST https://aligner.tinygods.dev/mcp -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"create_word_alignment","arguments":{"lines":["Hello world","Bonjour le monde"],"alignments":[[0,0,1,0],[0,1,1,2]]}}}'
```

## ChatGPT App Directory

Submitting to the public directory is a separate, manual task (identity/org verification, review).
This server is the prerequisite. See the project tasks for the submission checklist.
