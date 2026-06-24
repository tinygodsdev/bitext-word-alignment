export const prerender = true;

import { error } from '@sveltejs/kit';
import {
	findGalleryBySlug,
	galleryPreviewImageFor,
	GALLERY_EXAMPLES
} from '$lib/examples/catalog.js';
import { getExamplePagePartnerId } from '$lib/partners/home-rotation.js';
import type { PageLoad } from './$types';

export function entries() {
	return GALLERY_EXAMPLES.map((entry) => ({ slug: entry.slug }));
}

/** Up to 6 sibling examples (ring order) for the "More examples" cross-links. */
function relatedExamples(slug: string) {
	const start = GALLERY_EXAMPLES.findIndex((e) => e.slug === slug);
	const out: { slug: string; title: string; previewImageUrl: string; imageAlt: string }[] = [];
	for (let i = 1; i <= 6; i++) {
		const e = GALLERY_EXAMPLES[(start + i) % GALLERY_EXAMPLES.length];
		if (e.slug === slug) continue;
		out.push({
			slug: e.slug,
			title: e.title,
			previewImageUrl: galleryPreviewImageFor(e),
			imageAlt: e.imageAlt
		});
	}
	return out;
}

export const load: PageLoad = ({ params }) => {
	const entry = findGalleryBySlug(params.slug);
	if (!entry) error(404, 'Example not found');
	return {
		entry,
		previewImageUrl: galleryPreviewImageFor(entry),
		exampleSlug: entry.slug,
		partnerId: getExamplePagePartnerId(entry.slug),
		related: relatedExamples(entry.slug)
	};
};
