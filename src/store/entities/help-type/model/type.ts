// Типы для видов помощи

export interface HelpType {
	id: number
	name: string
	createdAt?: string
	updatedAt?: string
}

// Типы для запросов
export interface CreateHelpTypeRequest {
	name: string
}

export interface UpdateHelpTypeRequest {
	name?: string
}

// Типы для ответов API
export interface HelpTypeListResponse {
	data: HelpType[]
	total?: number
}

export interface HelpTypeResponse {
	data: HelpType
}

