import { getToken, removeToken } from '@/utils/auth'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface AuthContextType {
	isAuthenticated: boolean
	setIsAuthenticated: (value: boolean) => void
	user: { email: string; id: string } | null
	setUser: (user: { email: string; id: string } | null) => void
	isLoading: boolean
	logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { readonly children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [user, setUser] = useState<{ email: string; id: string } | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	// Проверяем наличие токена при загрузке
	useEffect(() => {
		const token = getToken()
		if (token) {
			setIsAuthenticated(true)
		}
		setIsLoading(false)
	}, [])

	const logout = () => {
		// Удаляем токены
		removeToken()
		// Сбрасываем состояние
		setIsAuthenticated(false)
		setUser(null)
		// Перенаправляем на страницу входа
		globalThis.location.href = '/admin-panel/login'
	}

	const value = useMemo(
		() => ({
			isAuthenticated,
			setIsAuthenticated,
			user,
			setUser,
			isLoading,
			logout,
		}),
		[isAuthenticated, user, isLoading]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const context = useContext(AuthContext)
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider')
	}
	return context
}
