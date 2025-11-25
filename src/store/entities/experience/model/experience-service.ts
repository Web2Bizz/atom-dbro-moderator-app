import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type { AddExperienceRequest, AddExperienceResponse } from './type'

export const experienceService = createApi({
	reducerPath: 'experienceApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Experience'],
	endpoints: builder => ({
		// PATCH /v1/experience/{userId} - Добавить опыт пользователю
		addExperience: builder.mutation<
			AddExperienceResponse,
			{ userId: number; data: AddExperienceRequest }
		>({
			query: ({ userId, data }) => ({
				url: `/v1/experience/${userId}`,
				method: 'PATCH',
				body: data,
			}),
			invalidatesTags: ['Experience'],
		}),
	}),
})

export const { useAddExperienceMutation } = experienceService

