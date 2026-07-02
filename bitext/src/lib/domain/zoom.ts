/**
 * Pan/zoom math for the preview's interaction-only magnifier.
 *
 * Transform model: `translate(x, y) scale(z)` with `transform-origin: 0 0`. Coordinates are in the
 * wrapper's untransformed local space (screen coord minus the wrapper's untransformed origin).
 * This is purely a viewing transform — it never changes layout, so measured token positions (and
 * therefore the export) are unaffected.
 */

export const MIN_ZOOM = 1;
export const MAX_ZOOM = 6;

export interface ZoomState {
	z: number;
	x: number;
	y: number;
}

export const IDENTITY_ZOOM: ZoomState = { z: 1, x: 0, y: 0 };

export function clampZoom(z: number): number {
	return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, z));
}

/**
 * Zoom to `newZ` while keeping the content point under `focal` fixed on screen.
 * `focal` is in the wrapper's untransformed local space.
 */
export function zoomAt(state: ZoomState, newZ: number, focal: { x: number; y: number }): ZoomState {
	const z = clampZoom(newZ);
	const r = z / state.z;
	return {
		z,
		x: focal.x * (1 - r) + state.x * r,
		y: focal.y * (1 - r) + state.y * r
	};
}

/** Keep the (transformed) content covering the `w × h` viewport so it can't be dragged off-screen. */
export function clampPan(state: ZoomState, w: number, h: number): ZoomState {
	const minX = w * (1 - state.z);
	const minY = h * (1 - state.z);
	return {
		z: state.z,
		x: Math.max(minX, Math.min(0, state.x)),
		y: Math.max(minY, Math.min(0, state.y))
	};
}

/** Convert a wheel deltaY into a multiplicative zoom factor (trackpad/ctrl-wheel zoom). */
export function wheelZoomFactor(deltaY: number): number {
	return Math.exp(-deltaY * 0.0015);
}

export function isIdentity(state: ZoomState): boolean {
	return state.z === 1 && state.x === 0 && state.y === 0;
}
