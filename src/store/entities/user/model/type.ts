// Типы для пользователей

export interface User {
	id: number
	firstName: string
	lastName: string
	middleName?: string
	email: string
	avatar?: string
	avatarUrls?: Record<string, string>
	role?: string // API может возвращать 'USER', 'ADMIN' или русские названия ('пользователь', 'администратор')
	organisationId?: number | null
	level?: number
	experience?: number
	createdAt?: string
	updatedAt?: string
}

// Типы для запросов
export interface CreateUserRequest {
	firstName: string
	lastName: string
	middleName?: string
	email: string
	password: string
	role?: 'USER' | 'ADMIN'
	organisationId?: number | null
}

export interface UpdateUserRequest {
	firstName?: string
	lastName?: string
	middleName?: string
	email?: string
	avatarUrls?: Record<string, string>
	role?: 'USER' | 'ADMIN'
	organisationId?: number | null
}

export interface UpdateUserV2Request {
	firstName?: string
	lastName?: string
	middleName?: string
	email?: string
	avatarUrl?: string
	role?: 'USER' | 'ADMIN'
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
