// Утилиты для работы с авторизацией

/**
 * Сохраняет access token в localStorage
 */
export function saveToken(token: string): void {
	if (globalThis.window !== undefined) {
		localStorage.setItem('authToken', token)
	}
}

/**
 * Сохраняет refresh token в localStorage
 */
export function saveRefreshToken(token: string): void {
	if (globalThis.window !== undefined) {
		localStorage.setItem('refreshToken', token)
	}
}

/**
 * Удаляет токены из localStorage
 */
export function removeToken(): void {
	if (globalThis.window !== undefined) {
		localStorage.removeItem('authToken')
		localStorage.removeItem('refreshToken')
	}
}

/**
 * Получает access token из localStorage
 */
export function getToken(): string | null {
	if (globalThis.window !== undefined) {
		return localStorage.getItem('authToken')
	}
	return null
}

/**
 * Получает refresh token из localStorage
 */
export function getRefreshToken(): string | null {
	if (globalThis.window !== undefined) {
		return localStorage.getItem('refreshToken')
	}
	return null
}

