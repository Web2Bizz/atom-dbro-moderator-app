import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	Achievement,
	AchievementListResponse,
	AchievementResponse,
	CreateAchievementRequest,
	UpdateAchievementRequest,
} from './type'

export const achievementService = createApi({
	reducerPath: 'achievementApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Achievement'],
	endpoints: builder => ({
		// GET /v1/achievements - Получить все достижения
		getAchievements: builder.query<Achievement[], void>({
			query: () => ({
				url: '/v1/achievements',
				method: 'GET',
			}),
			transformResponse: (response: AchievementListResponse | Achievement[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: ['Achievement'],
		}),

		// GET /v1/achievements/{id} - Получить достижение по ID
		getAchievementById: builder.query<Achievement, number>({
			query: id => ({
				url: `/v1/achievements/${id}`,
				method: 'GET',
			}),
			transformResponse: (response: AchievementResponse | Achievement) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (_result, _error, id) => [{ type: 'Achievement', id }],
		}),

		// POST /v1/achievements - Создать достижение
		createAchievement: builder.mutation<
			Achievement,
			CreateAchievementRequest
		>({
			query: data => ({
				url: '/v1/achievements',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: AchievementResponse | Achievement) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: ['Achievement'],
		}),

		// PATCH /v1/achievements/{id} - Обновить достижение
		updateAchievement: builder.mutation<
			Achievement,
			{ id: number; data: UpdateAchievementRequest }
		>({
			query: ({ id, data }) => ({
				url: `/v1/achievements/${id}`,
				method: 'PATCH',
				body: data,
			}),
			transformResponse: (response: AchievementResponse | Achievement) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'Achievement', id },
				'Achievement',
			],
		}),

		// DELETE /v1/achievements/{id} - Удалить достижение
		deleteAchievement: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/achievements/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, _error, id) => [
				{ type: 'Achievement', id },
				'Achievement',
			],
		}),

		// POST /v1/achievements/{id}/assign/{userId} - Присвоить достижение пользователю
		assignAchievementToUser: builder.mutation<
			void,
			{ id: number; userId: number }
		>({
			query: ({ id, userId }) => ({
				url: `/v1/achievements/${id}/assign/${userId}`,
				method: 'POST',
			}),
			invalidatesTags: ['Achievement'],
		}),

		// GET /v1/achievements/user/{userId} - Получить достижения пользователя
		getUserAchievements: builder.query<Achievement[], number>({
			query: userId => ({
				url: `/v1/achievements/user/${userId}`,
				method: 'GET',
			}),
			transformResponse: (response: AchievementListResponse | Achievement[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: (_result, _error, userId) => [
				{ type: 'Achievement', id: `user-${userId}` },
			],
		}),
	}),
})

export const {
	useGetAchievementsQuery,
	useGetAchievementByIdQuery,
	useCreateAchievementMutation,
	useUpdateAchievementMutation,
	useDeleteAchievementMutation,
	useAssignAchievementToUserMutation,
	useGetUserAchievementsQuery,
} = achievementService

