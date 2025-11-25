import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	ChangePasswordRequest,
	ChangePasswordResponse,
	CreateUserRequest,
	UpdateUserRequest,
	UpdateUserV2Request,
	User,
	UserListResponse,
	UserResponse,
} from './type'

export const userService = createApi({
	reducerPath: 'userApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['User'],
	endpoints: builder => ({
		// GET /v1/users - Получить всех пользователей
		getUsers: builder.query<User[], void>({
			query: () => ({
				url: '/v1/users',
				method: 'GET',
			}),
			transformResponse: (response: UserListResponse | User[]) => {
				// API может вернуть массив напрямую или объект с data
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: ['User'],
		}),

		// GET /v1/users/{id} - Получить пользователя по ID
		getUserById: builder.query<User, number>({
			query: id => ({
				url: `/v1/users/${id}`,
				method: 'GET',
			}),
			transformResponse: (response: UserResponse | User) => {
				// API может вернуть объект напрямую или объект с data
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (result, error, id) => [{ type: 'User', id }],
		}),

		// POST /v1/users - Создать пользователя
		createUser: builder.mutation<User, CreateUserRequest>({
			query: data => ({
				url: '/v1/users',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: UserResponse | User) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: ['User'],
		}),

		// PATCH /v1/users/{id} - Обновить пользователя (v1)
		updateUser: builder.mutation<User, { id: number; data: UpdateUserRequest }>(
			{
				query: ({ id, data }) => ({
					url: `/v1/users/${id}`,
					method: 'PATCH',
					body: data,
				}),
				transformResponse: (response: UserResponse | User) => {
					// API может вернуть объект напрямую или объект с data
					if ('data' in response) {
						return response.data
					}
					return response
				},
				invalidatesTags: (result, error, { id }) => [
					{ type: 'User', id },
					'User',
				],
			}
		),

		// PATCH /v2/users/{id} - Обновить пользователя (v2)
		updateUserV2: builder.mutation<
			User,
			{ id: number; data: UpdateUserV2Request }
		>({
			query: ({ id, data }) => ({
				url: `/v2/users/${id}`,
				method: 'PATCH',
				body: data,
			}),
			transformResponse: (response: UserResponse | User) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: (result, error, { id }) => [
				{ type: 'User', id },
				'User',
			],
		}),

		// DELETE /v1/users/{id} - Удалить пользователя
		deleteUser: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/users/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{ type: 'User', id }, 'User'],
		}),

		// PATCH /v1/users/change-password - Изменить пароль
		changePassword: builder.mutation<
			ChangePasswordResponse,
			ChangePasswordRequest
		>({
			query: data => ({
				url: '/v1/users/change-password',
				method: 'PATCH',
				body: data,
			}),
		}),
	}),
})

export const {
	useGetUsersQuery,
	useGetUserByIdQuery,
	useCreateUserMutation,
	useUpdateUserMutation,
	useUpdateUserV2Mutation,
	useDeleteUserMutation,
	useChangePasswordMutation,
} = userService
