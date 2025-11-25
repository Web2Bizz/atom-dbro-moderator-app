import { API_BASE_URL } from '@/constants'
import {
	getRefreshToken,
	getToken,
	removeToken,
	saveRefreshToken,
	saveToken,
} from '@/utils/auth'
import type { FetchArgs } from '@reduxjs/toolkit/query'
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface RefreshTokenResponse {
	access_token: string
	refresh_token?: string
}

// Базовый запрос с автоматическим обновлением токена
const baseQuery = fetchBaseQuery({
	baseUrl: API_BASE_URL,
	prepareHeaders: headers => {
		const token = getToken()
		if (token) {
			headers.set('authorization', `Bearer ${token}`)
		}
		return headers
	},
})

// Интерсептор для автоматического обновления токена при 401
export const baseQueryWithReauth = async (
	args: string | FetchArgs,
	api: Parameters<typeof baseQuery>[1],
	extraOptions: Parameters<typeof baseQuery>[2]
) => {
	const url = typeof args === 'string' ? args : args.url

	let result = await baseQuery(args, api, extraOptions)

	// Если получили 401 (Unauthorized), пытаемся обновить токен
	const error = result?.error
	let is401Error = false

	if (error && typeof error === 'object') {
		// Стандартный формат RTK Query: { status: 401, data: ... }
		if ('status' in error && error.status === 401) {
			is401Error = true
		}
		// Альтернативный формат: { data: { statusCode: 401 } }
		else if (
			'data' in error &&
			error.data &&
			typeof error.data === 'object' &&
			'statusCode' in error.data &&
			error.data.statusCode === 401
		) {
			is401Error = true
		}
	}

	if (is401Error) {
		const refreshToken = getRefreshToken()

		if (refreshToken) {
			// Пытаемся обновить токен
			const refreshResult = await baseQuery(
				{
					url: '/v1/auth/refresh',
					method: 'POST',
					body: { refresh_token: refreshToken },
				},
				api,
				extraOptions
			)

			if (refreshResult.data) {
				const refreshData = refreshResult.data as RefreshTokenResponse

				// Сохраняем новые токены
				if (refreshData.access_token) {
					saveToken(refreshData.access_token)
				}
				if (refreshData.refresh_token) {
					saveRefreshToken(refreshData.refresh_token)
				}

				// Повторяем оригинальный запрос с новым токеном
				result = await baseQuery(args, api, extraOptions)
			} else {
				// Если refresh не удался, очищаем токены
				removeToken()
			}
		} else {
			// Если нет refresh token, очищаем токены
			removeToken()
		}
	}

	return result
}

