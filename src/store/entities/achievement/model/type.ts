// Типы для достижений

export type AchievementRarity =
	| 'common'
	| 'epic'
	| 'rare'
	| 'legendary'
	| 'private'

export interface Achievement {
	id: number
	title: string
	description?: string
	icon?: string
	rarity: AchievementRarity
	createdAt?: string
	updatedAt?: string
}

// Типы для запросов
export interface CreateAchievementRequest {
	title: string
	description?: string
	icon?: string
	rarity: AchievementRarity
}

export interface UpdateAchievementRequest {
	title?: string
	description?: string
	icon?: string
	rarity?: AchievementRarity
}

// Типы для ответов API
export interface AchievementListResponse {
	data: Achievement[]
	total?: number
}

export interface AchievementResponse {
	data: Achievement
}

