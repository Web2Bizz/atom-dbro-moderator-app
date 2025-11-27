import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type { Statistics, StatisticsResponse } from './type'

export const statisticsService = createApi({
	reducerPath: 'statisticsApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Statistics'],
	endpoints: builder => ({
		// GET /v1/statistics - Получить агрегированную статистику для дашборда
		getStatistics: builder.query<Statistics, void>({
			query: () => ({
				url: '/v1/statistics',
				method: 'GET',
			}),
			transformResponse: (response: Statistics | StatisticsResponse) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: ['Statistics'],
		}),
	}),
})

export const { useGetStatisticsQuery } = statisticsService


