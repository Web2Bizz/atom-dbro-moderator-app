import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type { City } from '../city/model/type'
import type { Region, RegionListResponse, RegionResponse } from './type'

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
			providesTags: (result, error, id) => [
				{ type: 'Region', id },
				'Region',
			],
		}),
	}),
})

export const {
	useGetRegionsQuery,
	useGetRegionByIdQuery,
	useGetCitiesByRegionQuery,
} = regionService

