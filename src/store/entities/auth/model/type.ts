// Типы для запросов
export interface LoginRequest {
	email: string
	password: string
}

// Типы для ответов API
export interface AuthResponse {
	access_token: string
	refresh_token?: string
	user: UserShortData
}

export interface RefreshTokenResponse {
	access_token: string
	refresh_token?: string
}

export type UserShortData = {
	id: string
	firstName: string
	lastName: string
	middleName: string
	email: string
	avatar?: string
	avatarUrls?: Record<string, string>
}

export interface LoginErrorResponse {
	message: string
	statusCode: number
}

