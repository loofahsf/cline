import { ApiConfiguration, ModelInfo } from "@shared/api"
import { Mode } from "@shared/storage/types"
import { getModeSpecificFields } from "@/components/settings/utils/providerUtils"

function isValidOpenAiConfig(apiConfiguration: ApiConfiguration, openAiModelId: string | undefined): boolean {
	if (!apiConfiguration.openAiBaseUrl) {
		return false
	}
	if (!apiConfiguration.openAiApiKey && !apiConfiguration.azureIdentity) {
		return false
	}
	if (!openAiModelId) {
		return false
	}
	return true
}

export function validateApiConfiguration(currentMode: Mode, apiConfiguration?: ApiConfiguration): string | undefined {
	if (apiConfiguration) {
		const {
			apiProvider,
			openAiModelId,
		} = getModeSpecificFields(apiConfiguration, currentMode)

		if (apiProvider === "anthropic") {
			if (!apiConfiguration.apiKey) {
				return "You must provide a valid API key or choose a different provider."
			}
		} else if (apiProvider === "gemini") {
			if (!apiConfiguration.geminiApiKey) {
				return "You must provide a valid API key or choose a different provider."
			}
		} else if (apiProvider === "openai") {
			if (!isValidOpenAiConfig(apiConfiguration, openAiModelId)) {
				return "You must provide a valid base URL, API key, and model ID."
			}
		} else if (apiProvider === "minimax") {
			if (!apiConfiguration.minimaxApiKey) {
				return "You must provide a valid API key or choose a different provider."
			}
		} else if (apiProvider) {
			return "Only Anthropic, Gemini, OpenAI Compatible, and MiniMax are supported."
		}
	}
	return undefined
}

export function validateModelId(
	currentMode: Mode,
	apiConfiguration?: ApiConfiguration,
	openRouterModels?: Record<string, ModelInfo>,
	clineModels?: Record<string, ModelInfo>,
): string | undefined {
	if (apiConfiguration) {
		const { apiProvider } = getModeSpecificFields(apiConfiguration, currentMode)
		switch (apiProvider) {
			default:
				break
		}
	}
	return undefined
}
