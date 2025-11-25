import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import type { City } from '@/store/entities/city/model/type'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	CreateRegionRequest,
	Region,
	RegionListResponse,
	RegionResponse,
	UpdateRegionRequest,
} from './type'

export const regionService = createApi({
	reducerPath: 'regionApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Region'],
	endpoints: builder => ({
		// GET /v1/regions - Получить все регионы
		getRegions: builder.query<Region[], void>({
			query: () => ({
				url: '/v1/regions',
				method: 'GET',
			}),
			transformResponse: (response: RegionListResponse | Region[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: ['Region'],
		}),

		// GET /v1/regions/{id} - Получить регион по ID
		getRegionById: builder.query<Region, number>({
			query: id => ({
				url: `/v1/regions/${id}`,
				method: 'GET',
			}),
			transformResponse: (response: RegionResponse | Region) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (result, error, id) => [{ type: 'Region', id }],
		}),

		// POST /v1/regions - Создать регион
		createRegion: builder.mutation<Region, CreateRegionRequest>({
			query: data => ({
				url: '/v1/regions',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: RegionResponse | Region) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: ['Region'],
		}),

		// PATCH /v1/regions/{id} - Обновить регион
		updateRegion: builder.mutation<
			Region,
			{ id: number; data: UpdateRegionRequest }
		>({
			query: ({ id, data }) => ({
				url: `/v1/regions/${id}`,
				method: 'PATCH',
				body: data,
			}),
			transformResponse: (response: RegionResponse | Region) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Region', id },
				'Region',
			],
		}),

		// DELETE /v1/regions/{id} - Удалить регион
		deleteRegion: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/regions/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'Region', id },
				'Region',
			],
		}),

		// GET /v1/regions/{id}/cities - Получить все города региона
		getCitiesByRegion: builder.query<City[], number>({
			query: id => ({
				url: `/v1/regions/${id}/cities`,
				method: 'GET',
			}),
			transformResponse: (response: { data: City[] } | City[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: (result, error, id) => [{ type: 'Region', id }, 'Region'],
		}),
	}),
})

export const {
	useGetRegionsQuery,
	useGetRegionByIdQuery,
	useCreateRegionMutation,
	useUpdateRegionMutation,
	useDeleteRegionMutation,
	useGetCitiesByRegionQuery,
} = regionService
