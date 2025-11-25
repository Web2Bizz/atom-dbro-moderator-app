import { useAuth } from '@/contexts/AuthContext'
import { useEffect, type ReactNode } from 'react'

interface ProtectedRouteProps {
	readonly children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
	const { isAuthenticated, isLoading } = useAuth()

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
