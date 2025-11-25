// Типы для пользователей

export interface User {
	id: number
	firstName: string
	lastName: string
	middleName?: string
	email: string
	avatar?: string
	avatarUrls?: Record<string, string>
	organisationId?: number | null
	level?: number
	experience?: number
	createdAt?: string
	updatedAt?: string
}

// Типы для запросов
export interface UpdateUserRequest {
	firstName?: string
	lastName?: string
	middleName?: string
	email?: string
	avatarUrls?: Record<string, string>
	organisationId?: number | null
}

export interface ChangePasswordRequest {
	oldPassword: string
	newPassword: string
}

// Типы для ответов API
export interface UserListResponse {
	data: User[]
	total?: number
}

export interface UserResponse {
	data: User
}

export interface ChangePasswordResponse {
	message: string
}

