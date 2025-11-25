// Типы для квестов

export type QuestStatus = 'active' | 'completed' | 'archived'

export interface Contact {
	name: string
	value: string
}

export interface QuestStep {
	title: string
	description?: string
	status: string
	progress: number
	requirement?: {
		currentValue: number
		targetValue: number
	}
	deadline?: string
}

export interface Quest {
	id: number
	title: string
	description?: string
	status: QuestStatus
	experienceReward: number
	cityId: number
	organizationTypeId?: number
	latitude?: number
	longitude?: number
	address?: string
	contacts?: Contact[]
	coverImage?: string
	gallery?: string[]
	steps?: QuestStep[]
	categoryIds?: number[]
	achievementId?: number
	createdAt?: string
	updatedAt?: string
}

// Типы для запросов
export interface GetQuestsParams {
	cityId?: number
	categoryId?: number
}

export interface FilterQuestsParams {
	status?: QuestStatus
	cityId?: number
	categoryId?: number
}

export interface CreateQuestRequest {
	title: string
	description?: string
	status?: QuestStatus
	experienceReward: number
	cityId: number
	organizationTypeId?: number
	latitude?: number
	longitude?: number
	address?: string
	contacts?: Contact[]
	coverImage?: string
	gallery?: string[]
	steps?: QuestStep[]
	categoryIds?: number[]
	achievement?: {
		title: string
		description?: string
		icon?: string
	}
}

export interface UpdateQuestRequest {
	title?: string
	description?: string
	status?: QuestStatus
	experienceReward?: number
	cityId?: number
	organizationTypeId?: number
	latitude?: number
	longitude?: number
	address?: string
	contacts?: Contact[]
	coverImage?: string
	gallery?: string[]
	steps?: string[]
	categoryIds?: number[]
	achievementId?: number
}

export interface UpdateRequirementRequest {
	currentValue: number
}

// Типы для ответов API
export interface QuestListResponse {
	data: Quest[]
	total?: number
}

export interface QuestResponse {
	data: Quest
}

