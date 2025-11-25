// Утилиты для работы с авторизацией

import type { UserShortData } from '@/store/entities/auth/model/type'

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
 * Сохраняет данные пользователя в localStorage
 */
export function saveUser(user: UserShortData): void {
	if (globalThis.window !== undefined) {
		localStorage.setItem('user', JSON.stringify(user))
	}
}

/**
 * Удаляет токены и данные пользователя из localStorage
 */
export function removeToken(): void {
	if (globalThis.window !== undefined) {
		localStorage.removeItem('authToken')
		localStorage.removeItem('refreshToken')
		localStorage.removeItem('user')
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

/**
 * Получает данные пользователя из localStorage
 */
export function getUser(): UserShortData | null {
	if (globalThis.window !== undefined) {
		const userStr = localStorage.getItem('user')
		if (userStr) {
			try {
				return JSON.parse(userStr) as UserShortData
			} catch {
				return null
			}
		}
	}
	return null
}

