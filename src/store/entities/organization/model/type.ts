// Типы для организаций

import type { City } from '../../city/model/type'
import type { OrganizationType } from '../../organization-type/model/type'
import type { HelpType } from '../../help-type/model/type'

export interface Contact {
	name: string
	value: string
}

export interface Organization {
	id: number
	name: string
	cityId: number
	city?: City // API может возвращать объект city
	typeId?: number
	organizationTypeId?: number
	type?: OrganizationType // API может возвращать объект type
	helpTypeIds?: number[]
	helpTypes?: HelpType[] // API может возвращать массив объектов helpTypes
	latitude?: number
	longitude?: number
	summary?: string
	mission?: string
	description?: string
	goals?: string[]
	needs?: string[]
	address?: string
	contacts?: Contact[]
	gallery?: string[]
	createdAt?: string
	updatedAt?: string
}

// Типы для запросов
export interface CreateOrganizationRequest {
	name: string
	cityId: number
	typeId: number
	helpTypeIds: number[]
	latitude?: number
	longitude?: number
	summary?: string
	mission?: string
	description?: string
	goals?: string[]
	needs?: string[]
	address?: string
	contacts?: Contact[]
	gallery?: string[]
}

export interface UpdateOrganizationRequest {
	name?: string
	cityId?: number
	organizationTypeId?: number
	helpTypeIds?: number[]
	latitude?: number
	longitude?: number
	summary?: string
	mission?: string
	description?: string
	goals?: string[]
	needs?: string[]
	address?: string
	contacts?: Contact[]
	gallery?: string[]
}

export interface AddOwnerRequest {
	userId: number
}

export interface AddHelpTypeRequest {
	helpTypeId: number
}

// Типы для ответов API
export interface OrganizationListResponse {
	data: Organization[]
	total?: number
}

export interface OrganizationResponse {
	data: Organization
}

