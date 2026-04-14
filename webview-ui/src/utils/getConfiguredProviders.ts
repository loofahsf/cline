import { type ApiConfiguration, type ApiProvider, isSupportedApiProvider } from "@shared/api"
import PROVIDERS from "@shared/providers/providers.json"
import type { RemoteConfigFields } from "@shared/storage/state-keys"

/**
 * Returns a list of API providers that are configured (have required credentials/settings)
 * Based on validation logic from validate.ts
 */
export function getConfiguredProviders(
	remoteConfig: Partial<RemoteConfigFields> | undefined,
	apiConfiguration: ApiConfiguration | undefined,
): ApiProvider[] {
	if (remoteConfig?.remoteConfiguredProviders?.length) {
		return remoteConfig.remoteConfiguredProviders.filter(isSupportedApiProvider) as ApiProvider[]
	}

	const configured: ApiProvider[] = []

	if (!apiConfiguration) {
		return configured
	}

	// Anthropic - requires API key
	if (apiConfiguration.apiKey) {
		configured.push("anthropic")
	}

	// Gemini - requires API key
	if (apiConfiguration.geminiApiKey) {
		configured.push("gemini")
	}

	// Minimax - requires API key
	if (apiConfiguration.minimaxApiKey) {
		configured.push("minimax")
	}

	// OpenAI Compatible - requires base URL and API key, OR has model configured
	if (
		(apiConfiguration.openAiBaseUrl && apiConfiguration.openAiApiKey) ||
		apiConfiguration.planModeOpenAiModelId ||
		apiConfiguration.actModeOpenAiModelId
	) {
		configured.push("openai")
	}

	return configured
}

/**
 * Get provider display label from provider value
 * Uses the canonical providers.json as source of truth
 */
export function getProviderLabel(provider: ApiProvider): string {
	const providerEntry = PROVIDERS.list.find((p) => p.value === provider)
	return providerEntry?.label || provider
}
