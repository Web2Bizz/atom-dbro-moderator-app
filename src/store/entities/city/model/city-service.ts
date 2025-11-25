import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type { City, CityListResponse, CityResponse, GetCitiesParams } from './type'

export const cityService = createApi({
	reducerPath: 'cityApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['City'],
	endpoints: builder => ({
		// GET /v1/cities - Получить все города (опционально фильтр по региону)
		getCities: builder.query<City[], GetCitiesParams | void>({
			query: params => ({
				url: '/v1/cities',
				method: 'GET',
				params: params || {},
			}),
			transformResponse: (response: CityListResponse | City[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: ['City'],
		}),

		// GET /v1/cities/{id} - Получить город по ID
		getCityById: builder.query<City, number>({
			query: id => ({
				url: `/v1/cities/${id}`,
				method: 'GET',
			}),
			transformResponse: (response: CityResponse | City) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (result, error, id) => [{ type: 'City', id }],
		}),
	}),
})

export const { useGetCitiesQuery, useGetCityByIdQuery } = cityService

