/**
 * Lazily initializes harfbuzzjs. In the browser, wasm must be resolved via Vite `?url`;
 * under Node (vitest) hb.js loads hb.wasm from disk relative to the package.
 */
let hbPromise: Promise<HarfbuzzModule> | null = null;

/** Minimal typing for the object returned by hbjs(instance). */
export type HarfbuzzModule = {
	createBlob: (data: ArrayBuffer) => { ptr: number; destroy: () => void };
	createFace: (
		blob: ReturnType<HarfbuzzModule['createBlob']>,
		index: number
	) => {
		ptr: number;
		upem: number;
		destroy: () => void;
	};
	createFont: (face: ReturnType<HarfbuzzModule['createFace']>, ptr?: number) => HarfbuzzFont;
	createBuffer: () => HarfbuzzBuffer;
	shape: (font: HarfbuzzFont, buffer: HarfbuzzBuffer, features?: string) => void;
};

export type HarfbuzzFont = {
	ptr: number;
	setScale: (x: number, y: number) => void;
	destroy: () => void;
};

export type HarfbuzzBuffer = {
	ptr: number;
	addText: (text: string) => void;
	guessSegmentProperties: () => void;
	json: () => HbGlyphJson[];
	destroy: () => void;
};

export type HbGlyphJson = { g: number; cl: number; dx: number; dy: number; ax: number; ay: number };

export function getHarfBuzz(): Promise<HarfbuzzModule> {
	if (!hbPromise) hbPromise = loadHarfBuzzInner();
	return hbPromise;
}

async function loadHarfBuzzInner(): Promise<HarfbuzzModule> {
	const [{ default: createHb }, { default: wrapHbjs }] = await Promise.all([
		import('harfbuzzjs/hb.js'),
		import('harfbuzzjs/hbjs.js')
	]);

	const isBrowser = typeof window !== 'undefined';

	if (isBrowser) {
		const { default: wasmUrl } = await import('harfbuzzjs/hb.wasm?url');
		const instance = await createHb({
			locateFile: (path: string) => (path.endsWith('.wasm') ? wasmUrl : path)
		});
		return wrapHbjs(instance) as HarfbuzzModule;
	}

	const instance = await createHb();
	return wrapHbjs(instance) as HarfbuzzModule;
}
