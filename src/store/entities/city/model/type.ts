// Типы для городов

export interface Region {
	id: number
	name: string
}

export interface City {
	id: number
	name: string
	regionId?: number
	region?: Region
	latitude?: number | string
	longitude?: number | string
	createdAt?: string
	updatedAt?: string
	recordStatus?: string
}

// Типы для запросов
export interface GetCitiesParams {
	regionId?: number
}

export interface CreateCityRequest {
	name: string
	latitude: number
	longitude: number
	regionId: number
}

export interface UpdateCityRequest {
	name?: string
	latitude?: number
	longitude?: number
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
