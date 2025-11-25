import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	CreateHelpTypeRequest,
	HelpType,
	HelpTypeListResponse,
	HelpTypeResponse,
	UpdateHelpTypeRequest,
} from './type'

export const helpTypeService = createApi({
	reducerPath: 'helpTypeApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['HelpType'],
	endpoints: builder => ({
		// GET /v1/help-types - Получить все виды помощи
		getHelpTypes: builder.query<HelpType[], void>({
			query: () => ({
				url: '/v1/help-types',
				method: 'GET',
			}),
			transformResponse: (response: HelpTypeListResponse | HelpType[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: ['HelpType'],
		}),

		// GET /v1/help-types/{id} - Получить вид помощи по ID
		getHelpTypeById: builder.query<HelpType, number>({
			query: id => ({
				url: `/v1/help-types/${id}`,
				method: 'GET',
			}),
			transformResponse: (response: HelpTypeResponse | HelpType) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (result, error, id) => [{ type: 'HelpType', id }],
		}),

		// POST /v1/help-types - Создать вид помощи
		createHelpType: builder.mutation<HelpType, CreateHelpTypeRequest>({
			query: data => ({
				url: '/v1/help-types',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: HelpTypeResponse | HelpType) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: ['HelpType'],
		}),

		// PATCH /v1/help-types/{id} - Обновить вид помощи
		updateHelpType: builder.mutation<
			HelpType,
			{ id: number; data: UpdateHelpTypeRequest }
		>({
			query: ({ id, data }) => ({
				url: `/v1/help-types/${id}`,
				method: 'PATCH',
				body: data,
			}),
			transformResponse: (response: HelpTypeResponse | HelpType) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: (result, error, { id }) => [
				{ type: 'HelpType', id },
				'HelpType',
			],
		}),

		// DELETE /v1/help-types/{id} - Удалить вид помощи
		deleteHelpType: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/help-types/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'HelpType', id },
				'HelpType',
			],
		}),
	}),
})

export const {
	useGetHelpTypesQuery,
	useGetHelpTypeByIdQuery,
	useCreateHelpTypeMutation,
	useUpdateHelpTypeMutation,
	useDeleteHelpTypeMutation,
} = helpTypeService

