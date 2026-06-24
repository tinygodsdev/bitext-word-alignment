import {
	ALIGNER_SITE_URL,
	SITE_AUTHOR_NAME,
	SITE_AUTHOR_URL,
	SITE_CONTACT_EMAIL
} from '$lib/brand.js';
import { SITE_LASTMOD } from '$lib/seo/metadata.js';

const author = {
	'@type': 'Person',
	name: SITE_AUTHOR_NAME,
	url: SITE_AUTHOR_URL
};

/** Standalone Person entity for the creator (used on /about for authorship/E-E-A-T). */
export function personCreator(): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		name: SITE_AUTHOR_NAME,
		url: SITE_AUTHOR_URL,
		email: SITE_CONTACT_EMAIL,
		description:
			'Fantasy author, creator of the constructed language Lemu Teloku, and maker of tools for conlangers and linguists. Psychologist and linguist by training, self-taught software developer.',
		knowsAbout: [
			'Constructed languages',
			'Interlinear glossing',
			'Leipzig Glossing Rules',
			'Word alignment',
			'Linguistics',
			'Software development'
		],
		sameAs: [SITE_AUTHOR_URL]
	};
}

/** Absolute URL on the production origin (safe for prerendered pages). */
export function absoluteUrl(path: string): string {
	return ALIGNER_SITE_URL + (path.startsWith('/') ? path : `/${path}`);
}

export interface Crumb {
	name: string;
	path: string;
}

export function breadcrumbList(crumbs: Crumb[]): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: crumbs.map((crumb, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: crumb.name,
			item: absoluteUrl(crumb.path)
		}))
	};
}

export interface TechArticleInput {
	headline: string;
	description: string;
	path: string;
	image: { url: string; width: number; height: number; alt: string };
}

/**
 * TechArticle for an example page. `datePublished`/`dateModified` use the site-wide content date
 * (SITE_LASTMOD) — we have no per-example dates, and a single honest date is enough to qualify for
 * Article rich results while staying truthful.
 */
export function techArticle(input: TechArticleInput): object {
	return {
		'@context': 'https://schema.org',
		'@type': 'TechArticle',
		headline: input.headline,
		description: input.description,
		url: absoluteUrl(input.path),
		mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(input.path) },
		image: {
			'@type': 'ImageObject',
			url: input.image.url,
			width: input.image.width,
			height: input.image.height,
			caption: input.image.alt
		},
		author,
		publisher: author,
		datePublished: SITE_LASTMOD,
		dateModified: SITE_LASTMOD,
		inLanguage: 'en'
	};
}
