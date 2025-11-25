// Типы для регионов

export interface Region {
	id: number
	name: string
	createdAt?: string
	updatedAt?: string
}

// Типы для запросов
export interface CreateRegionRequest {
	name: string
}

export interface UpdateRegionRequest {
	name?: string
}

// Типы для ответов API
export interface RegionListResponse {
	data: Region[]
	total?: number
}

export interface RegionResponse {
	data: Region
}
