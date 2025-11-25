import { useAuth } from '@/hooks/use-auth'
import { useEffect, type ReactNode } from 'react'

interface ProtectedRouteProps {
	readonly children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	// useAuth теперь возвращает null вместо ошибки при HMR
	const auth = useAuth()

	// Извлекаем значения с дефолтными значениями для случая, когда auth === null
	const isAuthenticated = auth?.isAuthenticated ?? false
	const isLoading = auth?.isLoading ?? true

	// ВСЕ хуки должны вызываться ДО любых условных возвратов
	useEffect(() => {
		// Если контекст еще не готов (например, при HMR), ничего не делаем
		if (!auth) {
			return
		}

		// Не делаем редирект пока идет проверка токена
		if (!isLoading && !isAuthenticated) {
			globalThis.location.href = '/admin-panel/login'
		}
	}, [auth, isAuthenticated, isLoading])

	// Если контекст еще не готов (например, при HMR), не рендерим ничего
	if (!auth) {
		return null
	}

	// Пока идет проверка, не показываем ничего
	if (isLoading) {
		return null
	}

	// Если не авторизован, не показываем контент (редирект произойдет в useEffect)
	if (!isAuthenticated) {
		return null
	}

	return <>{children}</>
}
