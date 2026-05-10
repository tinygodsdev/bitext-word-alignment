// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

/** Some verification snippets use `value` instead of `content` on `<meta>`. */
declare module 'svelte/elements' {
	export interface HTMLMetaAttributes {
		value?: string | undefined | null;
	}
}

export {};
