/**
 * Public CDN base for gallery example PNG previews (DigitalOcean Spaces).
 *
 * Set after first upload — see `bitext/scripts/README.md` and `make examples-upload`.
 * No trailing slash. Object keys are `{slug}.png` under this prefix.
 *
 * @example https://aligner.fra1.cdn.digitaloceanspaces.com/examples
 */
export const EXAMPLE_PREVIEWS_CDN_BASE =
	'https://aligner.fra1.cdn.digitaloceanspaces.com/examples';

export function galleryPreviewImageUrl(slug: string): string {
	return `${EXAMPLE_PREVIEWS_CDN_BASE}/${slug}.png`;
}
