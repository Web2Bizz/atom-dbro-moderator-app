import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	OrganizationType,
	OrganizationTypeListResponse,
	OrganizationTypeResponse,
} from './type'

export const organizationTypeService = createApi({
	reducerPath: 'organizationTypeApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['OrganizationType'],
	endpoints: builder => ({
		// GET /v1/organization-types - Получить все типы организаций
		getOrganizationTypes: builder.query<OrganizationType[], void>({
			query: () => ({
				url: '/v1/organization-types',
				method: 'GET',
			}),
			transformResponse: (
				response: OrganizationTypeListResponse | OrganizationType[]
			) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: ['OrganizationType'],
		}),

		// GET /v1/organization-types/{id} - Получить тип организации по ID
		getOrganizationTypeById: builder.query<OrganizationType, number>({
			query: id => ({
				url: `/v1/organization-types/${id}`,
				method: 'GET',
			}),
			transformResponse: (response: OrganizationTypeResponse | OrganizationType) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (result, error, id) => [{ type: 'OrganizationType', id }],
		}),
	}),
})

export const {
	useGetOrganizationTypesQuery,
	useGetOrganizationTypeByIdQuery,
} = organizationTypeService

