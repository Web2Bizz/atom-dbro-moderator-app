export interface HelpType {
	id: number
	name: string
	recordStatus?: string
	createdAt?: string
	updatedAt?: string
}

export type HelpTypeFormData = Omit<HelpType, 'id' | 'recordStatus' | 'createdAt' | 'updatedAt'>

