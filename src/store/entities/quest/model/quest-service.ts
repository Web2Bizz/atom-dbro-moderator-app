import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	CreateQuestRequest,
	FilterQuestsParams,
	GetQuestsParams,
	Quest,
	QuestListResponse,
	QuestResponse,
	UpdateQuestRequest,
	UpdateRequirementRequest,
} from './type'

export const questService = createApi({
	reducerPath: 'questApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Quest'],
	endpoints: builder => ({
		// GET /v1/quests - Получить все квесты
		getQuests: builder.query<Quest[], GetQuestsParams | void>({
			query: params => ({
				url: '/v1/quests',
				method: 'GET',
				params: params || {},
			}),
			transformResponse: (response: QuestListResponse | Quest[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: ['Quest'],
		}),

		// GET /v1/quests/filter - Получить квесты с фильтрацией
		filterQuests: builder.query<Quest[], FilterQuestsParams>({
			query: params => ({
				url: '/v1/quests/filter',
				method: 'GET',
				params,
			}),
			transformResponse: (response: QuestListResponse | Quest[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: ['Quest'],
		}),

		// GET /v1/quests/{id} - Получить квест по ID
		getQuestById: builder.query<Quest, number>({
			query: id => ({
				url: `/v1/quests/${id}`,
				method: 'GET',
			}),
			transformResponse: (response: QuestResponse | Quest) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (_result, _error, id) => [{ type: 'Quest', id }],
		}),

		// GET /api/v2/quests/{id} - Получить квест по ID с информацией об участии (v2)
		getQuestByIdV2: builder.query<
			Quest & { isParticipating?: boolean },
			number
		>({
			query: id => ({
				url: `/v2/quests/${id}`,
				method: 'GET',
			}),
			transformResponse: (response: QuestResponse | Quest) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (_result, _error, id) => [{ type: 'Quest', id }],
		}),

		// POST /v1/quests - Создать квест
		createQuest: builder.mutation<Quest, CreateQuestRequest>({
			query: data => ({
				url: '/v1/quests',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: QuestResponse | Quest) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: ['Quest'],
		}),

		// PATCH /v1/quests/{id} - Обновить квест
		updateQuest: builder.mutation<
			Quest,
			{ id: number; data: UpdateQuestRequest }
		>({
			query: ({ id, data }) => ({
				url: `/v1/quests/${id}`,
				method: 'PATCH',
				body: data,
			}),
			transformResponse: (response: QuestResponse | Quest) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'Quest', id },
				'Quest',
			],
		}),

		// DELETE /v1/quests/{id} - Удалить квест
		deleteQuest: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/quests/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, _error, id) => [{ type: 'Quest', id }, 'Quest'],
		}),

		// POST /v1/quests/{id}/join/{userId} - Присоединиться к квесту
		joinQuest: builder.mutation<void, { id: number; userId: number }>({
			query: ({ id, userId }) => ({
				url: `/v1/quests/${id}/join/${userId}`,
				method: 'POST',
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'Quest', id },
				'Quest',
			],
		}),

		// POST /v1/quests/{id}/leave/{userId} - Покинуть квест
		leaveQuest: builder.mutation<void, { id: number; userId: number }>({
			query: ({ id, userId }) => ({
				url: `/v1/quests/${id}/leave/${userId}`,
				method: 'POST',
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'Quest', id },
				'Quest',
			],
		}),

		// POST /v1/quests/{id}/complete - Завершить квест
		completeQuest: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/quests/${id}/complete`,
				method: 'POST',
			}),
			invalidatesTags: (_result, _error, id) => [{ type: 'Quest', id }, 'Quest'],
		}),

		// PATCH /v1/quests/{id}/archive - Архивировать квест
		archiveQuest: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/quests/${id}/archive`,
				method: 'PATCH',
			}),
			invalidatesTags: (_result, _error, id) => [{ type: 'Quest', id }, 'Quest'],
		}),

		// PATCH /v1/quests/{id}/unarchive - Разархивировать квест
		unarchiveQuest: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/quests/${id}/unarchive`,
				method: 'PATCH',
			}),
			invalidatesTags: (_result, _error, id) => [{ type: 'Quest', id }, 'Quest'],
		}),

		// GET /v1/quests/user/{userId} - Получить квесты пользователя
		getUserQuests: builder.query<Quest[], number>({
			query: userId => ({
				url: `/v1/quests/user/${userId}`,
				method: 'GET',
			}),
			transformResponse: (response: QuestListResponse | Quest[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: (_result, _error, userId) => [
				{ type: 'Quest', id: `user-${userId}` },
			],
		}),

		// GET /v1/quests/available/{userId} - Получить доступные квесты для пользователя
		getAvailableQuests: builder.query<Quest[], number>({
			query: userId => ({
				url: `/v1/quests/available/${userId}`,
				method: 'GET',
			}),
			transformResponse: (response: QuestListResponse | Quest[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: (_result, _error, userId) => [
				{ type: 'Quest', id: `available-${userId}` },
			],
		}),

		// GET /v1/quests/{id}/users - Получить всех пользователей квеста
		getQuestUsers: builder.query<Array<{ id: number; name: string }>, number>({
			query: id => ({
				url: `/v1/quests/${id}/users`,
				method: 'GET',
			}),
			providesTags: (_result, _error, id) => [{ type: 'Quest', id }],
		}),

		// PATCH /v1/quests/{id}/steps/{stepIndex}/requirement - Обновить требование этапа
		updateQuestRequirement: builder.mutation<
			void,
			{ id: number; stepIndex: number; data: UpdateRequirementRequest }
		>({
			query: ({ id, stepIndex, data }) => ({
				url: `/v1/quests/${id}/steps/${stepIndex}/requirement`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: 'Quest', id },
				'Quest',
			],
		}),
	}),
})

export const {
	useGetQuestsQuery,
	useFilterQuestsQuery,
	useGetQuestByIdQuery,
	useGetQuestByIdV2Query,
	useCreateQuestMutation,
	useUpdateQuestMutation,
	useDeleteQuestMutation,
	useJoinQuestMutation,
	useLeaveQuestMutation,
	useCompleteQuestMutation,
	useArchiveQuestMutation,
	useUnarchiveQuestMutation,
	useGetUserQuestsQuery,
	useGetAvailableQuestsQuery,
	useGetQuestUsersQuery,
	useUpdateQuestRequirementMutation,
} = questService
