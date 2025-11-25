import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	AddHelpTypeRequest,
	AddOwnerRequest,
	CreateOrganizationRequest,
	Organization,
	OrganizationListResponse,
	OrganizationResponse,
	UpdateOrganizationRequest,
} from './type'

export const organizationService = createApi({
	reducerPath: 'organizationApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Organization'],
	endpoints: builder => ({
		// GET /v1/organizations - Получить все организации
		getOrganizations: builder.query<Organization[], void>({
			query: () => ({
				url: '/v1/organizations',
				method: 'GET',
			}),
			transformResponse: (response: OrganizationListResponse | Organization[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: ['Organization'],
		}),

		// GET /v1/organizations/{id} - Получить организацию по ID
		getOrganizationById: builder.query<Organization, number>({
			query: id => ({
				url: `/v1/organizations/${id}`,
				method: 'GET',
			}),
			transformResponse: (response: OrganizationResponse | Organization) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (result, error, id) => [{ type: 'Organization', id }],
		}),

		// POST /v1/organizations - Создать организацию
		createOrganization: builder.mutation<
			Organization,
			CreateOrganizationRequest
		>({
			query: data => ({
				url: '/v1/organizations',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: OrganizationResponse | Organization) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: ['Organization'],
		}),

		// PATCH /v1/organizations/{id} - Обновить организацию
		updateOrganization: builder.mutation<
			Organization,
			{ id: number; data: UpdateOrganizationRequest }
		>({
			query: ({ id, data }) => ({
				url: `/v1/organizations/${id}`,
				method: 'PATCH',
				body: data,
			}),
			transformResponse: (response: OrganizationResponse | Organization) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Organization', id },
				'Organization',
			],
		}),

		// DELETE /v1/organizations/{id} - Удалить организацию
		deleteOrganization: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/organizations/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'Organization', id },
				'Organization',
			],
		}),

		// PATCH /v1/organizations/{id}/approve - Подтвердить организацию
		approveOrganization: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/organizations/${id}/approve`,
				method: 'PATCH',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'Organization', id },
				'Organization',
			],
		}),

		// PATCH /v1/organizations/{id}/disapprove - Отменить подтверждение организации
		disapproveOrganization: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/organizations/${id}/disapprove`,
				method: 'PATCH',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'Organization', id },
				'Organization',
			],
		}),

		// POST /v1/organizations/{id}/owners - Добавить владельца организации
		addOwner: builder.mutation<void, { id: number; data: AddOwnerRequest }>({
			query: ({ id, data }) => ({
				url: `/v1/organizations/${id}/owners`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Organization', id },
				'Organization',
			],
		}),

		// DELETE /v1/organizations/{id}/owners/{userId} - Удалить владельца организации
		removeOwner: builder.mutation<void, { id: number; userId: number }>({
			query: ({ id, userId }) => ({
				url: `/v1/organizations/${id}/owners/${userId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Organization', id },
				'Organization',
			],
		}),

		// POST /v1/organizations/{id}/help-types - Добавить вид помощи организации
		addHelpType: builder.mutation<
			void,
			{ id: number; data: AddHelpTypeRequest }
		>({
			query: ({ id, data }) => ({
				url: `/v1/organizations/${id}/help-types`,
				method: 'POST',
				body: data,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Organization', id },
				'Organization',
			],
		}),

		// DELETE /v1/organizations/{id}/help-types/{helpTypeId} - Удалить вид помощи организации
		removeHelpType: builder.mutation<
			void,
			{ id: number; helpTypeId: number }
		>({
			query: ({ id, helpTypeId }) => ({
				url: `/v1/organizations/${id}/help-types/${helpTypeId}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Organization', id },
				'Organization',
			],
		}),

		// POST /v1/organizations/{id}/gallery - Загрузить изображения в галерею организации
		uploadOrganizationImages: builder.mutation<
			void,
			{ id: number; images: File[] }
		>({
			query: ({ id, images }) => {
				const formData = new FormData()
				images.forEach(image => {
					formData.append('images', image)
				})
				return {
					url: `/v1/organizations/${id}/gallery`,
					method: 'POST',
					body: formData,
				}
			},
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Organization', id },
				'Organization',
			],
		}),

		// POST /api/v2/organizations - Массовое добавление организаций (v2)
		createManyOrganizations: builder.mutation<
			Organization[],
			CreateOrganizationRequest[]
		>({
			query: data => ({
				url: '/v2/organizations',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: OrganizationListResponse | Organization[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			invalidatesTags: ['Organization'],
		}),
	}),
})

export const {
	useGetOrganizationsQuery,
	useGetOrganizationByIdQuery,
	useCreateOrganizationMutation,
	useUpdateOrganizationMutation,
	useDeleteOrganizationMutation,
	useApproveOrganizationMutation,
	useDisapproveOrganizationMutation,
	useAddOwnerMutation,
	useRemoveOwnerMutation,
	useAddHelpTypeMutation,
	useRemoveHelpTypeMutation,
	useUploadOrganizationImagesMutation,
	useCreateManyOrganizationsMutation,
} = organizationService

