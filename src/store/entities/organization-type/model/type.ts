// Типы для типов организаций

export interface OrganizationType {
	id: number
	name: string
	createdAt?: string
	updatedAt?: string
}

// Типы для запросов
export interface CreateOrganizationTypeRequest {
	name: string
}

export interface UpdateOrganizationTypeRequest {
	name?: string
}

// Типы для ответов API
export interface OrganizationTypeListResponse {
	data: OrganizationType[]
	total?: number
}

export interface OrganizationTypeResponse {
	data: OrganizationType
}
