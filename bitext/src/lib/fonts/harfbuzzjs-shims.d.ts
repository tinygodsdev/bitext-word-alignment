declare module 'harfbuzzjs/hb.js' {
	const createHarfBuzz: (module?: Record<string, unknown>) => Promise<unknown>;
	export default createHarfBuzz;
}

declare module 'harfbuzzjs/hbjs.js' {
	const hbjs: (module: unknown) => unknown;
	export default hbjs;
}

declare module 'harfbuzzjs/hb.wasm?url' {
	const url: string;
	export default url;
}
