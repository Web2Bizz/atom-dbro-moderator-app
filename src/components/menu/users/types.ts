export interface User {
	id: number
	firstName: string
	lastName: string
	middleName: string
	email: string
	avatarUrls: Record<string, string>
	role: string
	level: number
	experience: number
	questId: number | null
	organisationId: number | null
	createdAt: string
	updatedAt: string
}

export type UserFormData = Omit<
	User,
	'id' | 'createdAt' | 'updatedAt' | 'avatarUrls' | 'middleName'
> & {
	middleName?: string
	avatarUrl?: string
}

