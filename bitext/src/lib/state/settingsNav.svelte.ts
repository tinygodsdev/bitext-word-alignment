/** Jump to Text → Word splitting from elsewhere (line editor hint icon). */
class SettingsNavStore {
	tokensFocusGeneration = $state(0);

	focusTokensTab() {
		this.tokensFocusGeneration++;
	}
}

export const settingsNavStore = new SettingsNavStore();
