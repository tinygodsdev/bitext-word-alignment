import type { ThemeConfig } from 'flowbite-svelte';

/**
 * Flowbite Svelte slot overrides. Brand hues come from `app.css` (`--color-primary-*`, `--color-brand*`).
 * Card defaults in the library use rounded-lg + shadow; we centralize the app shell look here.
 */
export const flowbiteTheme: ThemeConfig = {
	card: {
		base: 'rounded-none shadow-none border-card-border bg-white dark:border-gray-700 dark:bg-gray-800'
	},
	button: {
		base: '!rounded-none'
	},
	gradientButton: {
		base: '!rounded-none',
		outlineWrapper: '!rounded-none'
	},
	input: {
		base: '!rounded-none',
		input: '!rounded-none',
		combo: '!rounded-none'
	},
	select: {
		base: '!rounded-none',
		select: '!rounded-none'
	},
	badge: {
		base: '!rounded-none'
	},
	modal: {
		base: '!rounded-none',
		form: '!rounded-none',
		header: '!rounded-none',
		footer: '!rounded-none'
	},
	buttonGroup: '!rounded-none',
	range: '!rounded-none',
	/** Icon-only settings tabs: equal columns across the tab bar width */
	tabs: {
		base: 'flex w-full min-w-0 flex-nowrap items-stretch gap-0',
		content: 'p-4 bg-gray-50 !rounded-none dark:bg-gray-800 mt-4',
		active: '!rounded-none',
		inactive: '!rounded-none'
	},
	tabItem: {
		base: 'min-w-0 flex-1',
		button:
			'flex h-full min-h-10 w-full items-center justify-center !p-0 py-2 [&:not(:focus-visible)]:outline-none'
	}
};
