import { AuthContext } from '@/contexts/AuthContext'
import { useContext } from 'react'

export function useAuth() {
	const context = useContext(AuthContext)
	// При HMR контекст может быть временно undefined, поэтому возвращаем null вместо ошибки
	// Это позволит компонентам корректно обработать ситуацию
	if (context === undefined) {
		// В режиме разработки логируем предупреждение вместо ошибки
		if (process.env.NODE_ENV === 'development') {
			console.warn(
				'useAuth called outside AuthProvider. This may happen during HMR. Returning null.'
			)
		}
		// Возвращаем null вместо выбрасывания ошибки
		// Компоненты должны проверять результат на null
		return null as any
	}
	return context
}
