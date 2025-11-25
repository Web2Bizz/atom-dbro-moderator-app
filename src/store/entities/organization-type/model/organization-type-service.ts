import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	CreateOrganizationTypeRequest,
	OrganizationType,
	OrganizationTypeListResponse,
	OrganizationTypeResponse,
	UpdateOrganizationTypeRequest,
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
			transformResponse: (
				response: OrganizationTypeResponse | OrganizationType
			) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (result, error, id) => [{ type: 'OrganizationType', id }],
		}),

		// POST /v1/organization-types - Создать тип организации
		createOrganizationType: builder.mutation<
			OrganizationType,
			CreateOrganizationTypeRequest
		>({
			query: data => ({
				url: '/v1/organization-types',
				method: 'POST',
				body: data,
			}),
			transformResponse: (
				response: OrganizationTypeResponse | OrganizationType
			) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: ['OrganizationType'],
		}),

		// PATCH /v1/organization-types/{id} - Обновить тип организации
		updateOrganizationType: builder.mutation<
			OrganizationType,
			{ id: number; data: UpdateOrganizationTypeRequest }
		>({
			query: ({ id, data }) => ({
				url: `/v1/organization-types/${id}`,
				method: 'PATCH',
				body: data,
			}),
			transformResponse: (
				response: OrganizationTypeResponse | OrganizationType
			) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: (result, error, { id }) => [
				{ type: 'OrganizationType', id },
				'OrganizationType',
			],
		}),

		// DELETE /v1/organization-types/{id} - Удалить тип организации
		deleteOrganizationType: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/organization-types/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'OrganizationType', id },
				'OrganizationType',
			],
		}),
	}),
})

export const {
	useGetOrganizationTypesQuery,
	useGetOrganizationTypeByIdQuery,
	useCreateOrganizationTypeMutation,
	useUpdateOrganizationTypeMutation,
	useDeleteOrganizationTypeMutation,
} = organizationTypeService
