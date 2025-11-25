import { useValidateTokenMutation } from '@/store/entities'
import type { UserShortData } from '@/store/entities/auth/model/type'
import { getToken, getUser, removeToken } from '@/utils/auth'
import type { Context, ReactNode } from 'react'
import { createContext, useEffect, useMemo, useRef, useState } from 'react'

interface AuthContextType {
	isAuthenticated: boolean
	setIsAuthenticated: (value: boolean) => void
	user: UserShortData | null
	setUser: (user: UserShortData | null) => void
	isLoading: boolean
	logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
) as Context<AuthContextType>

export function AuthProvider({ children }: { readonly children: ReactNode }) {
	// Загружаем пользователя из localStorage при инициализации
	const [user, setUser] = useState<UserShortData | null>(() => getUser())
	const [isAuthenticated, setIsAuthenticated] = useState(false)
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
			const savedUser = getUser()

			// Если есть сохраненный пользователь, загружаем его
			if (savedUser) {
				setUser(savedUser)
			}

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
				// 400, 401 или другие ошибки - токен не валиден или нет доступа
				else if (result.error) {
					// Удаляем токены и данные пользователя при любой ошибке
					removeToken()
					setIsAuthenticated(false)
					setUser(null)
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
