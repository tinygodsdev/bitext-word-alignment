import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types.js';
import { encodeState } from '$lib/serialization/encode.js';
import { tokenize, tokenizeOptionsFromVisualSettings } from '$lib/domain/tokens.js';
import { createConnectionId, type Connection } from '$lib/domain/alignment.js';
import { assignColorsInOrder } from '$lib/domain/palettes.js';
import {
	defaultVisualSettingsV2,
	SCHEMA_VERSION,
	type AppStateV2,
	type LineV2
} from '$lib/serialization/schema.js';

const CORS = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type'
};

const DEFAULT_FONT = { family: 'Inter', source: 'google' as const };
const DEFAULT_TEXT_SIZE_PX = 36;
const DEFAULT_WORD_GAP_PX = 14;

type AlignmentTuple = [number, number, number, number];

interface AlignRequest {
	lines: string[];
	alignments?: AlignmentTuple[];
}

function parseBody(body: unknown): { ok: AlignRequest } | { err: string } {
	if (!body || typeof body !== 'object') return { err: 'Body must be a JSON object' };
	const b = body as Record<string, unknown>;

	if (!Array.isArray(b.lines) || b.lines.length === 0)
		return { err: '"lines" must be a non-empty array' };

	const lines: string[] = [];
	for (const l of b.lines) {
		if (typeof l !== 'string') return { err: 'Each element of "lines" must be a string' };
		lines.push(l);
	}
	if (lines.length > 8) return { err: 'Maximum 8 lines allowed' };

	const alignments: AlignmentTuple[] = [];
	if (b.alignments !== undefined) {
		if (!Array.isArray(b.alignments)) return { err: '"alignments" must be an array' };
		for (const a of b.alignments) {
			if (
				!Array.isArray(a) ||
				a.length !== 4 ||
				a.some((x) => typeof x !== 'number' || !Number.isInteger(x))
			)
				return { err: 'Each alignment must be [lineA, wordA, lineB, wordB] (integers)' };
			alignments.push(a as AlignmentTuple);
		}
	}

	return { ok: { lines, alignments } };
}

function buildAlignUrl(
	origin: string,
	req: AlignRequest
): { url: string } | { err: string } {
	const settings = defaultVisualSettingsV2();
	const tzOpts = tokenizeOptionsFromVisualSettings(settings);
	const { lines, alignments = [] } = req;

	const lineObjects: LineV2[] = lines.map((rawText, i) => ({
		id: `l${i}`,
		rawText,
		font: { ...DEFAULT_FONT },
		textSizePx: DEFAULT_TEXT_SIZE_PX,
		gapWordPx: DEFAULT_WORD_GAP_PX
	}));

	const tokensByLine = lineObjects.map((line) => tokenize(line.rawText, line.id, tzOpts));
	const colors = assignColorsInOrder(settings.palette, Math.max(alignments.length, 1));

	const connections: Connection[] = [];
	for (let idx = 0; idx < alignments.length; idx++) {
		const [lineA, wordA, lineB, wordB] = alignments[idx]!;

		if (lineA < 0 || lineA >= lines.length)
			return { err: `alignments[${idx}]: lineA=${lineA} out of range (0–${lines.length - 1})` };
		if (lineB < 0 || lineB >= lines.length)
			return { err: `alignments[${idx}]: lineB=${lineB} out of range (0–${lines.length - 1})` };
		if (Math.abs(lineA - lineB) !== 1)
			return {
				err: `alignments[${idx}]: lines ${lineA} and ${lineB} are not adjacent (connections only allowed between adjacent lines)`
			};

		const upperIdx = Math.min(lineA, lineB);
		const lowerIdx = Math.max(lineA, lineB);
		const upperWordIdx = lineA < lineB ? wordA : wordB;
		const lowerWordIdx = lineA < lineB ? wordB : wordA;

		const upperTokens = tokensByLine[upperIdx]!;
		const lowerTokens = tokensByLine[lowerIdx]!;

		if (upperWordIdx < 0 || upperWordIdx >= upperTokens.length)
			return {
				err: `alignments[${idx}]: word ${upperWordIdx} out of range for line ${upperIdx} ("${lines[upperIdx]}" has ${upperTokens.length} word(s))`
			};
		if (lowerWordIdx < 0 || lowerWordIdx >= lowerTokens.length)
			return {
				err: `alignments[${idx}]: word ${lowerWordIdx} out of range for line ${lowerIdx} ("${lines[lowerIdx]}" has ${lowerTokens.length} word(s))`
			};

		connections.push({
			id: createConnectionId(),
			upperTokenId: upperTokens[upperWordIdx]!.id,
			lowerTokenId: lowerTokens[lowerWordIdx]!.id,
			color: colors[idx % colors.length]
		});
	}

	const state: AppStateV2 = {
		v: SCHEMA_VERSION,
		project: { lines: lineObjects, pairControls: [], linePairGaps: [], connections },
		settings
	};

	const dataParam = encodeState(state);
	const u = new URL('/', origin);
	u.searchParams.set('data', dataParam);
	return { url: u.toString() };
}

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

	const parsed = parseBody(body);
	if ('err' in parsed) return json({ error: parsed.err }, { status: 400, headers: CORS });

	const result = buildAlignUrl(url.origin, parsed.ok);
	if ('err' in result) return json({ error: result.err }, { status: 400, headers: CORS });
	return json(result, { headers: CORS });
};
