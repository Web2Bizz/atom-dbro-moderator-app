import { useValidateTokenMutation } from '@/store/entities'
import { getToken, removeToken } from '@/utils/auth'
import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

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
	const [validateToken] = useValidateTokenMutation()
	const hasValidatedRef = useRef(false)

	// Проверяем валидность токена при загрузке
	useEffect(() => {
		// Защита от повторного вызова в StrictMode
		if (hasValidatedRef.current) {
			return
		}
		hasValidatedRef.current = true

		const checkAuth = async () => {
			const token = getToken()
			
			if (!token) {
				setIsLoading(false)
				return
			}

			try {
				const result = await validateToken()

				// 200 - Токен валиден
				if (result.data) {
					setIsAuthenticated(true)
				}
				// 400 - Доступ разрешен только администраторам
				else if (
					result.error &&
					('status' in result.error && result.error.status === 400)
				) {
					// Пользователь не является администратором
					removeToken()
					setIsAuthenticated(false)
				}
				// 401 - Токен не валиден
				else if (
					result.error &&
					('status' in result.error
						? result.error.status === 401
						: 'data' in result.error &&
						  result.error.data &&
						  typeof result.error.data === 'object' &&
						  'statusCode' in result.error.data &&
						  result.error.data.statusCode === 401)
				) {
					removeToken()
					setIsAuthenticated(false)
				}
				// Другие ошибки
				else if (result.error) {
					removeToken()
					setIsAuthenticated(false)
				}
			} catch (error) {
				// При ошибке сети или другой ошибке считаем токен невалидным
				console.error('Token validation error:', error)
				removeToken()
				setIsAuthenticated(false)
			} finally {
				setIsLoading(false)
			}
		}

		checkAuth()
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
