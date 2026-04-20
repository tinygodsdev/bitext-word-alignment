import {
	defaultVisualSettings,
	normalizeVisualSettings,
	type VisualSettingsV1
} from '$lib/serialization/schema.js';

class SettingsStore {
	settings = $state<VisualSettingsV1>(defaultVisualSettings());

	patch(p: Partial<VisualSettingsV1>) {
		this.settings = { ...this.settings, ...p };
	}

	reset() {
		this.settings = defaultVisualSettings();
	}

	load(s: VisualSettingsV1) {
		this.settings = normalizeVisualSettings(s as unknown as Record<string, unknown>);
	}
}

export const settingsStore = new SettingsStore();
