export interface Achievement {
	id: number
	title: string
	description: string
	icon: string
	rarity: string
	questId: number | null
	recordStatus?: string
	createdAt?: string
	updatedAt?: string
}

export type AchievementFormData = Omit<
	Achievement,
	'id' | 'recordStatus' | 'createdAt' | 'updatedAt'
>

