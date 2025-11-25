// Типы для обновлений квестов

export interface QuestUpdate {
	id: number
	questId: number
	title: string
	text: string
	photos?: string[]
	createdAt?: string
	updatedAt?: string
}

// Типы для запросов
export interface GetQuestUpdatesParams {
	questId?: number
}

export interface CreateQuestUpdateRequest {
	questId: number
	title: string
	text: string
	photos?: string[]
}

export interface UpdateQuestUpdateRequest {
	questId?: number
	title?: string
	text?: string
	photos?: string[]
}

// Типы для ответов API
export interface QuestUpdateListResponse {
	data: QuestUpdate[]
	total?: number
}

export interface QuestUpdateResponse {
	data: QuestUpdate
}

