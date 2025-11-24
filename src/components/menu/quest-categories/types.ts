export interface QuestCategory {
	id: number
	name: string
	recordStatus?: string
	createdAt?: string
	updatedAt?: string
}

export type QuestCategoryFormData = Omit<
	QuestCategory,
	'id' | 'recordStatus' | 'createdAt' | 'updatedAt'
>

