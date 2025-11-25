import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	City,
	CityListResponse,
	CityResponse,
	CreateCityRequest,
	GetCitiesParams,
	UpdateCityRequest,
} from './type'

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

		// POST /v1/cities - Создать город
		createCity: builder.mutation<City, CreateCityRequest>({
			query: data => ({
				url: '/v1/cities',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: CityResponse | City) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: ['City'],
		}),

		// PATCH /v1/cities/{id} - Обновить город
		updateCity: builder.mutation<City, { id: number; data: UpdateCityRequest }>(
			{
				query: ({ id, data }) => ({
					url: `/v1/cities/${id}`,
					method: 'PATCH',
					body: data,
				}),
				transformResponse: (response: CityResponse | City) => {
					if ('data' in response) {
						return response.data
					}
					return response
				},
				invalidatesTags: (result, error, { id }) => [
					{ type: 'City', id },
					'City',
				],
			}
		),

		// DELETE /v1/cities/{id} - Удалить город
		deleteCity: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/cities/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [{ type: 'City', id }, 'City'],
		}),

		// POST /v2/cities - Массовое добавление городов (v2)
		createManyCities: builder.mutation<City[], CreateCityRequest[]>({
			query: data => ({
				url: '/v2/cities',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: CityListResponse | City[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			invalidatesTags: ['City'],
		}),
	}),
})

export const {
	useGetCitiesQuery,
	useGetCityByIdQuery,
	useCreateCityMutation,
	useUpdateCityMutation,
	useDeleteCityMutation,
	useCreateManyCitiesMutation,
} = cityService
