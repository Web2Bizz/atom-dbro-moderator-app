// Утилиты для работы с пользователями

import type { User } from '@/store/entities/user/model/type'

/**
 * Получает URL аватара пользователя из avatarUrls
 * Возвращает URL самого большого размера
 */
export function getAvatarUrl(
	avatarUrls: Record<string, string> | undefined
): string | undefined {
	if (!avatarUrls) return undefined
	const sizes = Object.keys(avatarUrls)
		.map(Number)
		.sort((a, b) => b - a)
	return sizes.length > 0 ? avatarUrls[String(sizes[0])] : undefined
}

/**
 * Получает полное имя пользователя
 */
export function getUserFullName(user: User): string {
	const parts = [user.lastName, user.firstName]
	if (user.middleName) {
		parts.push(user.middleName)
	}
	return parts.join(' ')
}

/**
 * Получает инициалы пользователя
 */
export function getUserInitials(user: User): string {
	const first = user.firstName?.[0] || ''
	const last = user.lastName?.[0] || ''
	return `${first}${last}`.toUpperCase()
}

