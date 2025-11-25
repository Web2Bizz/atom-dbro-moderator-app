// Типы для городов

export interface City {
	id: number
	name: string
	regionId?: number
	createdAt?: string
	updatedAt?: string
}

// Типы для запросов
export interface GetCitiesParams {
	regionId?: number
}

// Типы для ответов API
export interface CityListResponse {
	data: City[]
	total?: number
}

export interface CityResponse {
	data: City
}

