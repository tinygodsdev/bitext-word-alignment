import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
	const origin = url.origin;

	const schema = {
		openapi: '3.1.0',
		info: {
			title: 'Word Aligner API',
			description:
				'Generate a Word Aligner link pre-filled with text lines and optional word alignments.',
			version: '1.0.0'
		},
		servers: [{ url: origin }],
		paths: {
			'/api/align': {
				post: {
					operationId: 'createAlignment',
					summary: 'Create a Word Aligner link',
					description:
						'Returns a shareable URL that opens Word Aligner with the given text lines and word-alignment links pre-filled. Use this when you have alignment data to pass.',
					requestBody: {
						required: true,
						content: {
							'application/json': {
								schema: { $ref: '#/components/schemas/AlignRequest' },
								example: {
									lines: ['Hello world', 'Bonjour le monde'],
									alignments: [
										[0, 0, 1, 0],
										[0, 1, 1, 2]
									]
								}
							}
						}
					},
					responses: {
						'200': {
							description: 'Link generated successfully',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/AlignResponse' }
								}
							}
						},
						'400': {
							description: 'Invalid input',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' }
								}
							}
						}
					}
				},
				get: {
					operationId: 'createAlignmentSimple',
					summary: 'Create a Word Aligner link (lines only, no alignments)',
					description:
						'Returns a URL with text lines pre-filled. Use when you only want to open Word Aligner with text, without pre-drawn links.',
					parameters: [
						{
							name: 'lines',
							in: 'query',
							description: 'Text line (repeat this parameter for each line, top to bottom)',
							required: true,
							schema: { type: 'array', items: { type: 'string' }, minItems: 1, maxItems: 8 }
						}
					],
					responses: {
						'200': {
							description: 'Link generated',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/AlignResponse' }
								}
							}
						},
						'400': {
							description: 'Invalid input',
							content: {
								'application/json': {
									schema: { $ref: '#/components/schemas/ErrorResponse' }
								}
							}
						}
					}
				}
			}
		},
		components: {
			schemas: {
				AlignRequest: {
					type: 'object',
					required: ['lines'],
					properties: {
						lines: {
							type: 'array',
							items: { type: 'string' },
							minItems: 1,
							maxItems: 8,
							description:
								'Text lines to display. Line 0 is the topmost. Words are split by whitespace; default split characters (. - |) also create word boundaries.'
						},
						alignments: {
							type: 'array',
							items: {
								type: 'array',
								prefixItems: [
									{ type: 'integer', description: 'Line index A (0-based)' },
									{ type: 'integer', description: 'Word index in line A (0-based)' },
									{ type: 'integer', description: 'Line index B (0-based, must be adjacent to A: |A−B|=1)' },
									{ type: 'integer', description: 'Word index in line B (0-based)' }
								],
								minItems: 4,
								maxItems: 4
							},
							description:
								'Word-alignment pairs as [lineA, wordA, lineB, wordB]. Lines A and B must be adjacent (differ by exactly 1). Indices are 0-based. Multiple pairs can share the same word (many-to-one or many-to-many).'
						}
					}
				},
				AlignResponse: {
					type: 'object',
					properties: {
						url: {
							type: 'string',
							format: 'uri',
							description: 'Word Aligner URL with the alignment pre-filled in the ?data= parameter.'
						}
					}
				},
				ErrorResponse: {
					type: 'object',
					properties: {
						error: { type: 'string', description: 'Human-readable error description.' }
					}
				}
			}
		}
	};

	return json(schema, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Content-Disposition': 'inline; filename="openapi.json"'
		}
	});
};
