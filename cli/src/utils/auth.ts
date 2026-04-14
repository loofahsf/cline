import { StateManager } from "@/core/storage/StateManager"

/**
 * Check if the user has completed onboarding (has any provider configured).
 *
 * Uses `welcomeViewCompleted` as the single source of truth, matching the VS Code extension's approach.
 * If `welcomeViewCompleted` is undefined (first run), checks if ANY provider has credentials
 * and sets the flag accordingly.
 */
export async function isAuthConfigured(): Promise<boolean> {
	const stateManager = StateManager.get()

	// Check welcomeViewCompleted first - this is the single source of truth
	const welcomeViewCompleted = stateManager.getGlobalStateKey("welcomeViewCompleted")
	if (welcomeViewCompleted !== undefined) {
		return welcomeViewCompleted
	}

	// welcomeViewCompleted is undefined - run migration logic to check if ANY provider has credentials
	// This mirrors the extension's migrateWelcomeViewCompleted behavior
	const hasAnyAuth = await checkAnyProviderConfigured()

	// Set welcomeViewCompleted based on what we found
	stateManager.setGlobalState("welcomeViewCompleted", hasAnyAuth)
	await stateManager.flushPendingState()

	return hasAnyAuth
}

/**
 * Check if ANY provider has valid credentials configured.
 * Used for migration when welcomeViewCompleted is undefined.
 */
export async function checkAnyProviderConfigured(): Promise<boolean> {
	const stateManager = StateManager.get()
	const config = stateManager.getApiConfiguration() as Record<string, unknown>

	if (config.apiKey) return true
	if (config.geminiApiKey) return true
	if (config.minimaxApiKey) return true
	if (config.openAiApiKey && config.openAiBaseUrl) return true

	return false
}
