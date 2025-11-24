export interface Region {
	id: number
	name: string
	createdAt: string
	updatedAt: string
}

export type RegionFormData = Omit<Region, 'id' | 'createdAt' | 'updatedAt'>

