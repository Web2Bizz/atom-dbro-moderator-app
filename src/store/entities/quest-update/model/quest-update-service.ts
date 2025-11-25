import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	CreateQuestUpdateRequest,
	GetQuestUpdatesParams,
	QuestUpdate,
	QuestUpdateListResponse,
	QuestUpdateResponse,
	UpdateQuestUpdateRequest,
} from './type'

export const questUpdateService = createApi({
	reducerPath: 'questUpdateApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['QuestUpdate'],
	endpoints: builder => ({
		// GET /v1/quest-updates - Получить все обновления квестов
		getQuestUpdates: builder.query<QuestUpdate[], GetQuestUpdatesParams | void>({
			query: params => ({
				url: '/v1/quest-updates',
				method: 'GET',
				params: params || {},
			}),
			transformResponse: (response: QuestUpdateListResponse | QuestUpdate[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: ['QuestUpdate'],
		}),

		// GET /v1/quest-updates/{id} - Получить обновление квеста по ID
		getQuestUpdateById: builder.query<QuestUpdate, number>({
			query: id => ({
				url: `/v1/quest-updates/${id}`,
				method: 'GET',
			}),
			transformResponse: (response: QuestUpdateResponse | QuestUpdate) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (result, error, id) => [{ type: 'QuestUpdate', id }],
		}),

		// POST /v1/quest-updates - Создать обновление квеста
		createQuestUpdate: builder.mutation<
			QuestUpdate,
			CreateQuestUpdateRequest
		>({
			query: data => ({
				url: '/v1/quest-updates',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: QuestUpdateResponse | QuestUpdate) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: ['QuestUpdate'],
		}),

		// PATCH /v1/quest-updates/{id} - Обновить обновление квеста
		updateQuestUpdate: builder.mutation<
			QuestUpdate,
			{ id: number; data: UpdateQuestUpdateRequest }
		>({
			query: ({ id, data }) => ({
				url: `/v1/quest-updates/${id}`,
				method: 'PATCH',
				body: data,
			}),
			transformResponse: (response: QuestUpdateResponse | QuestUpdate) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: (result, error, { id }) => [
				{ type: 'QuestUpdate', id },
				'QuestUpdate',
			],
		}),

		// DELETE /v1/quest-updates/{id} - Удалить обновление квеста
		deleteQuestUpdate: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/quest-updates/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'QuestUpdate', id },
				'QuestUpdate',
			],
		}),
	}),
})

export const {
	useGetQuestUpdatesQuery,
	useGetQuestUpdateByIdQuery,
	useCreateQuestUpdateMutation,
	useUpdateQuestUpdateMutation,
	useDeleteQuestUpdateMutation,
} = questUpdateService

