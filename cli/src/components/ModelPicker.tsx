/**
 * Model picker component for model selection
 * Supports static model lists for the supported providers
 */

import React, { useMemo } from "react"
import {
	anthropicDefaultModelId,
	anthropicModels,
	geminiDefaultModelId,
	geminiModels,
	minimaxDefaultModelId,
	minimaxModels,
} from "@/shared/api"
import { SearchableList, SearchableListItem } from "./SearchableList"

// Special ID used to indicate the user wants to enter a custom model ID / ARN
export const CUSTOM_MODEL_ID = "__custom__"

// Map providers to their static model lists and defaults
export const providerModels: Record<string, { models: Record<string, unknown>; defaultId: string }> = {
	anthropic: { models: anthropicModels, defaultId: anthropicDefaultModelId },
	gemini: { models: geminiModels, defaultId: geminiDefaultModelId },
	minimax: { models: minimaxModels, defaultId: minimaxDefaultModelId },
}

export function hasStaticModels(provider: string): boolean {
	return provider in providerModels
}

export function hasModelPicker(provider: string): boolean {
	return hasStaticModels(provider)
}

export function getDefaultModelId(provider: string): string {
	return providerModels[provider]?.defaultId || ""
}

export function getModelList(provider: string): string[] {
	if (!hasStaticModels(provider)) return []
	return Object.keys(providerModels[provider].models)
}

interface ModelPickerProps {
	provider: string
	controller: any
	onChange: (modelId: string) => void
	onSubmit: (modelId: string) => void
	isActive?: boolean
}

export const ModelPicker: React.FC<ModelPickerProps> = (props) => {
	const { provider, onChange, onSubmit, isActive = true } = props
	const modelList = useMemo(() => getModelList(provider), [provider])

	const items: SearchableListItem[] = useMemo(() => {
		return modelList.map((modelId) => ({
			id: modelId,
			label: modelId,
		}))
	}, [modelList])

	// For providers without a model picker, render nothing
	if (!hasModelPicker(provider)) {
		return null
	}

	return (
		<SearchableList
			isActive={isActive}
			items={items}
			onSelect={(item) => {
				onChange(item.id)
				onSubmit(item.id)
			}}
		/>
	)
}
