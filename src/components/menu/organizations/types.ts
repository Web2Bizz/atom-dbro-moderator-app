export interface OrganizationContact {
	name: string
	value: string
}

export interface OrganizationCity {
	id: number
	name: string
	latitude: number
	longitude: number
}

export interface OrganizationType {
	id: number
	name: string
}

export interface HelpType {
	id: number
	name: string
}

export interface Organization {
	id: number
	name: string
	latitude: number
	longitude: number
	summary: string
	mission: string
	description: string
	goals: string[]
	needs: string[]
	address: string
	contacts: OrganizationContact[]
	gallery: string[]
	createdAt: string
	updatedAt: string
	city: OrganizationCity
	type: OrganizationType
	helpTypes: HelpType[]
}

export type OrganizationFormData = Omit<
	Organization,
	'id' | 'createdAt' | 'updatedAt' | 'city' | 'type' | 'helpTypes'
> & {
	cityId: number
	typeId: number
	helpTypeIds: number[]
	needs: string[]
	contacts: OrganizationContact[]
	gallery: string[]
}

