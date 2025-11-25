import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	AuthResponse,
	LoginRequest,
	RefreshTokenResponse,
} from './type'

export const authService = createApi({
	reducerPath: 'authApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Auth'],
	endpoints: builder => ({
		// POST /v1/auth/login - Вход в систему
		login: builder.mutation<AuthResponse, LoginRequest>({
			query: credentials => ({
				url: '/v1/auth/login',
				method: 'POST',
				body: credentials,
			}),
			invalidatesTags: ['Auth'],
		}),

		// POST /v1/auth/refresh - Обновление токена
		refreshToken: builder.mutation<
			RefreshTokenResponse,
			{ refresh_token: string }
		>({
			query: data => ({
				url: '/v1/auth/refresh',
				method: 'POST',
				body: data,
			}),
		}),

		// POST /v1/auth/validate - Валидация токена
		validateToken: builder.mutation<{ valid: boolean }, void>({
			query: () => ({
				url: '/v1/auth/validate',
				method: 'POST',
			}),
		}),
	}),
})

export const {
	useLoginMutation,
	useRefreshTokenMutation,
	useValidateTokenMutation,
} = authService

