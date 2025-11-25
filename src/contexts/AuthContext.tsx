import { useGetUserByIdQuery, useValidateTokenMutation } from '@/store/entities'
import type { User } from '@/store/entities/user/model/type'
import { getToken, removeToken } from '@/utils/auth'
import type { Context, ReactNode } from 'react'
import { createContext, useEffect, useMemo, useRef, useState } from 'react'

interface AuthContextType {
	isAuthenticated: boolean
	setIsAuthenticated: (value: boolean) => void
	user: User | null
	setUser: (user: User | null) => void
	isLoading: boolean
	logout: () => void
	setUserIdFromLogin: (id: number) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
) as Context<AuthContextType>

export function AuthProvider({ children }: { readonly children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [validateToken] = useValidateTokenMutation()
	const hasValidatedRef = useRef(false)
	const [userId, setUserId] = useState<number | null>(() => {
		// Получаем ID пользователя из localStorage (сохраняется при логине)
		if (globalThis.window !== undefined) {
			const saved = localStorage.getItem('userId')
			return saved ? Number.parseInt(saved, 10) : null
		}
		return null
	})

	// Загружаем полные данные пользователя из API
	const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(
		userId!,
		{
			skip: !userId || !isAuthenticated,
		}
	)

	// Обновляем пользователя при загрузке данных
	useEffect(() => {
		if (userData) {
			setUser(userData)
		}
	}, [userData])

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
					// ID пользователя должен быть сохранен в localStorage при логине
					// Если его нет, пользователь будет загружен после логина
				}
				// 400, 401 или другие ошибки - токен не валиден или нет доступа
				else if (result.error) {
					// Удаляем токены и данные пользователя при любой ошибке
					removeToken()
					if (globalThis.window !== undefined) {
						localStorage.removeItem('userId')
					}
					setIsAuthenticated(false)
					setUser(null)
					setUserId(null)
				}
			} catch (error) {
				// При ошибке сети или другой ошибке считаем токен невалидным
				console.error('Token validation error:', error)
				removeToken()
				if (globalThis.window !== undefined) {
					localStorage.removeItem('userId')
				}
				setIsAuthenticated(false)
				setUser(null)
				setUserId(null)
			} finally {
				setIsLoading(false)
			}
		}

		checkAuth()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// Обновляем isLoading с учетом загрузки пользователя
	useEffect(() => {
		if (isAuthenticated && userId && isLoadingUser) {
			setIsLoading(true)
		} else if (isAuthenticated && userId && !isLoadingUser) {
			setIsLoading(false)
		}
	}, [isAuthenticated, userId, isLoadingUser])

	const logout = () => {
		// Удаляем токены и ID пользователя
		removeToken()
		if (globalThis.window !== undefined) {
			localStorage.removeItem('userId')
		}
		// Сбрасываем состояние
		setIsAuthenticated(false)
		setUser(null)
		setUserId(null)
		// Перенаправляем на страницу входа
		globalThis.location.href = '/admin-panel/login'
	}

	// Функция для установки ID пользователя (вызывается после логина)
	const setUserIdFromLogin = (id: number) => {
		setUserId(id)
		if (globalThis.window !== undefined) {
			localStorage.setItem('userId', String(id))
		}
	}

	const value = useMemo(
		() => ({
			isAuthenticated,
			setIsAuthenticated,
			user,
			setUser,
			isLoading,
			logout,
			setUserIdFromLogin,
		}),
		[isAuthenticated, user, isLoading]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
