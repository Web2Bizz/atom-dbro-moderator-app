import { type QuestCategory } from '../quest-categories/types'
import { type City } from '../cities/types'
import { type OrganizationType } from '../organizations/types'
import { type Achievement } from '../achievements/types'

export interface QuestContact {
	name: string
	value: string
}

export interface QuestStep {
	title: string
	status: string
	progress: number
	description: string
}

export interface QuestOwner {
	id: number
	firstName: string
	lastName: string
	email: string
}

export interface Quest {
	id: number
	title: string
	description: string
	status: string
	experienceReward: number
	achievementId: number | null
	ownerId: number
	cityId: number
	organizationTypeId: number
	latitude: string
	longitude: string
	address: string
	contacts: QuestContact[]
	coverImage: string | null
	gallery: string[]
	steps: QuestStep[]
	createdAt: string
	updatedAt: string
	achievement?: Achievement | null
	owner?: QuestOwner
	city?: City
	organizationType?: OrganizationType
	categories?: QuestCategory[]
}

export type QuestFormData = Omit<
	Quest,
	| 'id'
	| 'achievement'
	| 'owner'
	| 'city'
	| 'organizationType'
	| 'categories'
	| 'createdAt'
	| 'updatedAt'
> & {
	categoryIds: number[]
}
