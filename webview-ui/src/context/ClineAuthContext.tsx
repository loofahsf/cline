import type React from "react"
import { createContext, useContext, useMemo, useState } from "react"
import { useExtensionState } from "./ExtensionStateContext"

export interface ClineUser {
	uid: string
	email?: string
	displayName?: string
	photoUrl?: string
	appBaseUrl?: string
}

export interface ClineAuthContextType {
	clineUser: ClineUser | null
	organizations: null
	activeOrganization: null
}

const DEFAULT_AUTH_CONTEXT: ClineAuthContextType = {
	clineUser: null,
	organizations: null,
	activeOrganization: null,
}

export const ClineAuthContext = createContext<ClineAuthContextType>(DEFAULT_AUTH_CONTEXT)

export const ClineAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const value = useMemo(() => DEFAULT_AUTH_CONTEXT, [])
	return <ClineAuthContext.Provider value={value}>{children}</ClineAuthContext.Provider>
}

export const useClineAuth = () => useContext(ClineAuthContext)

export const useClineSignIn = () => {
	const [isLoading] = useState(false)
	const { navigateToSettings } = useExtensionState()

	return {
		isLoginLoading: isLoading,
		handleSignIn: () => navigateToSettings("api-config"),
	}
}

export const handleSignOut = async () => {}
