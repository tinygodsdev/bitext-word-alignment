import type { ExampleId } from '$lib/state/examples.js';

export interface GallerySourceAttribution {
	url: string;
	title: string;
}

/** One token of the source sentence with its gloss and a short plain-language note. */
export interface GlossRow {
	token: string;
	gloss: string;
	note: string;
}

export interface ExampleLink {
	href: string;
	label: string;
	/** Trailing prose rendered after the link, e.g. " — another one-to-many mapping." */
	text?: string;
}

/** Content blocks for an expanded example page. Plain prose, a gloss table, or a list of links. */
export type ExampleBlock =
	| { kind: 'paragraph'; text: string }
	| { kind: 'gloss'; lead?: string; rows: GlossRow[] }
	| { kind: 'links'; lead: string; items: ExampleLink[] };

export interface ExampleSection {
	/** Anchor id, also used as the React-style keyed-each key. */
	id: string;
	heading: string;
	blocks: ExampleBlock[];
}

export interface GalleryExampleEntry {
	slug: string;
	exampleId: ExampleId;
	title: string;
	description: string;
	/** Legacy short prose. Rendered only when `sections` is absent. */
	body: string;
	imageAlt: string;
	/**
	 * Expanded, phenomenon-specific content. When present it replaces `body` on the page; the
	 * generic glossing explanation lives on the guide hub, linked from here, not repeated per page.
	 */
	sections?: ExampleSection[];
	/** External source for adapted examples (e.g. Wikipedia). */
	sourceAttribution?: GallerySourceAttribution;
}
