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
								examples: {
									simple: {
										summary: 'Two string lines with alignments',
										value: {
											lines: ['Hello world', 'Bonjour le monde'],
											alignments: [
												[0, 0, 1, 0],
												[0, 1, 1, 2]
											]
										}
									},
									withSettings: {
										summary: 'Custom palette and line style',
										value: {
											lines: ['Hello world', 'Bonjour le monde'],
											alignments: [[0, 0, 1, 0]],
											settings: { palette: 'vivid', lineStyle: 'straight' }
										}
									},
									rtl: {
										summary: 'Hebrew with RTL layout',
										value: {
											lines: [
												{ text: 'שלום עולם', rtl: true, sizePx: 48 },
												{ text: 'Hello world', sizePx: 40 }
											],
											alignments: [
												[0, 0, 1, 0],
												[0, 1, 1, 1]
											]
										}
									},
									multiLine: {
										summary: '3 lines, gloss row with larger gap',
										value: {
											lines: ['Я ходил', 'I have been going', 'PRON.1SG PST.IPFV'],
											alignments: [
												[0, 0, 1, 0],
												[0, 1, 1, 1],
												[0, 1, 1, 2],
												[0, 1, 1, 3]
											],
											pairs: [{ upper: 1, lower: 2, gapPx: 60 }]
										}
									}
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
				LineInput: {
					oneOf: [
						{ type: 'string', description: 'Plain text (shorthand).' },
						{
							type: 'object',
							required: ['text'],
							properties: {
								text: { type: 'string', description: 'Line text.' },
								font: {
									type: 'string',
									description: 'Google Fonts family name (e.g. "Noto Serif", "Noto Sans Arabic"). Defaults to Inter.'
								},
								sizePx: {
									type: 'integer',
									minimum: 12,
									maximum: 64,
									description: 'Text size in px. Defaults to 36.'
								},
								gapPx: {
									type: 'integer',
									minimum: 0,
									maximum: 56,
									description: 'Horizontal gap between word tokens in px. Defaults to 14.'
								},
								rtl: {
									type: 'boolean',
									description: 'Right-to-left layout for Hebrew, Arabic, etc. Defaults to false.'
								}
							}
						}
					]
				},
				SettingsInput: {
					type: 'object',
					description: 'Visual settings overrides. Unset fields inherit defaults.',
					properties: {
						palette: {
							type: 'string',
							enum: ['pastel', 'vivid', 'academic'],
							description: 'Color palette for connection lines. Default: pastel.'
						},
						lineStyle: {
							type: 'string',
							enum: ['straight', 'curved'],
							description: 'Connection line shape. Default: curved.'
						},
						lineThickness: {
							type: 'number',
							minimum: 1,
							maximum: 8,
							description: 'Connection line thickness. Default: 3.'
						},
						lineOpacity: {
							type: 'number',
							minimum: 0.2,
							maximum: 1,
							description: 'Connection line opacity. Default: 1.'
						},
						background: {
							type: 'string',
							enum: ['light', 'dark'],
							description: 'Preview background. Default: light.'
						},
						theme: {
							type: 'string',
							enum: ['light', 'dark'],
							description: 'UI theme (affects token chip color). Default: light.'
						},
						showNumbers: {
							type: 'boolean',
							description: 'Show line numbers. Default: false.'
						},
						colorTokensByLink: {
							type: 'boolean',
							description: 'Tint word tokens in the color of their connection. Default: true.'
						}
					}
				},
				PairInput: {
					type: 'object',
					required: ['upper', 'lower'],
					description: 'Controls for a specific adjacent line pair.',
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
							description: 'Vertical gap between the two lines in px. Default: 120.'
						},
						showConnectors: {
							type: 'boolean',
							description: 'Draw connector lines between this pair. Default: true.'
						}
					}
				},
				AlignRequest: {
					type: 'object',
					required: ['lines'],
					properties: {
						lines: {
							type: 'array',
							items: { $ref: '#/components/schemas/LineInput' },
							minItems: 1,
							maxItems: 8,
							description:
								'Text lines to display, top to bottom. Each entry is a plain string or a LineInput object with per-line visual options. Words are split by whitespace; default split characters (. - |) also create word boundaries.'
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
								'Word-alignment pairs as [lineA, wordA, lineB, wordB]. Lines A and B must be adjacent. Indices are 0-based. Multiple pairs can share the same word (many-to-one or many-to-many) — they receive the same connection color automatically.'
						},
						settings: {
							$ref: '#/components/schemas/SettingsInput'
						},
						pairs: {
							type: 'array',
							items: { $ref: '#/components/schemas/PairInput' },
							description:
								'Per-pair controls: vertical gap or hiding connectors between specific adjacent line pairs.'
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
