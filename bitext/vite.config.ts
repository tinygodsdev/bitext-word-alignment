import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	css: {
		devSourcemap: true
	},
	test: {
		environment: 'node',
		include: ['src/**/*.test.ts']
	}
});
