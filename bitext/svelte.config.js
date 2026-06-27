import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter(),
		/** Canonical / og:url on prerendered routes (examples, privacy). Without this, build bakes `http://sveltekit-prerender/...`. */
		prerender: {
			origin: 'https://aligner.tinygods.dev'
		}
	}
};

export default config;
