export interface OrganizationType {
	id: number
	name: string
	recordStatus?: string
	createdAt?: string
	updatedAt?: string
}

export type OrganizationTypeFormData = Omit<
	OrganizationType,
	'id' | 'recordStatus' | 'createdAt' | 'updatedAt'
>

