import { useAuth } from '@/hooks/use-auth'
import { useEffect, type ReactNode } from 'react'

interface ProtectedRouteProps {
	readonly children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	// useAuth теперь возвращает null вместо ошибки при HMR
	const auth = useAuth()

	// Если контекст еще не готов (например, при HMR), не рендерим ничего
	if (!auth) {
		return null
	}

	const { isAuthenticated, isLoading } = auth

	useEffect(() => {
		// Не делаем редирект пока идет проверка токена
		if (!isLoading && !isAuthenticated) {
			globalThis.location.href = '/admin-panel/login'
		}
	}, [isAuthenticated, isLoading])

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
