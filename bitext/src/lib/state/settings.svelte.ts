import {
	defaultVisualSettingsV2,
	normalizeVisualSettingsV2,
	type VisualSettingsV2
} from '$lib/serialization/schema.js';

class SettingsStore {
	settings = $state<VisualSettingsV2>(defaultVisualSettingsV2());

	patch(p: Partial<VisualSettingsV2>) {
		this.settings = { ...this.settings, ...p };
	}

	reset() {
		this.settings = defaultVisualSettingsV2();
	}

	load(s: VisualSettingsV2) {
		this.settings = normalizeVisualSettingsV2(s as unknown as Record<string, unknown>);
	}
}

export const settingsStore = new SettingsStore();
