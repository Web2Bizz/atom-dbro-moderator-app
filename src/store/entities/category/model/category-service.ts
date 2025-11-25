import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type {
	Category,
	CategoryListResponse,
	CategoryResponse,
	CreateCategoryRequest,
	UpdateCategoryRequest,
} from './type'

export const categoryService = createApi({
	reducerPath: 'categoryApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Category'],
	endpoints: builder => ({
		// GET /v1/categories - Получить все категории
		getCategories: builder.query<Category[], void>({
			query: () => ({
				url: '/v1/categories',
				method: 'GET',
			}),
			transformResponse: (response: CategoryListResponse | Category[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			providesTags: ['Category'],
		}),

		// GET /v1/categories/{id} - Получить категорию по ID
		getCategoryById: builder.query<Category, number>({
			query: id => ({
				url: `/v1/categories/${id}`,
				method: 'GET',
			}),
			transformResponse: (response: CategoryResponse | Category) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			providesTags: (result, error, id) => [{ type: 'Category', id }],
		}),

		// POST /v1/categories - Создать категорию
		createCategory: builder.mutation<Category, CreateCategoryRequest>({
			query: data => ({
				url: '/v1/categories',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: CategoryResponse | Category) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: ['Category'],
		}),

		// PATCH /v1/categories/{id} - Обновить категорию
		updateCategory: builder.mutation<
			Category,
			{ id: number; data: UpdateCategoryRequest }
		>({
			query: ({ id, data }) => ({
				url: `/v1/categories/${id}`,
				method: 'PATCH',
				body: data,
			}),
			transformResponse: (response: CategoryResponse | Category) => {
				if ('data' in response) {
					return response.data
				}
				return response
			},
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Category', id },
				'Category',
			],
		}),

		// DELETE /v1/categories/{id} - Удалить категорию
		deleteCategory: builder.mutation<void, number>({
			query: id => ({
				url: `/v1/categories/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: (result, error, id) => [
				{ type: 'Category', id },
				'Category',
			],
		}),

		// POST /api/v2/categories - Массовое добавление категорий (v2)
		createManyCategories: builder.mutation<Category[], CreateCategoryRequest[]>({
			query: data => ({
				url: '/v2/categories',
				method: 'POST',
				body: data,
			}),
			transformResponse: (response: CategoryListResponse | Category[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
			invalidatesTags: ['Category'],
		}),
	}),
})

export const {
	useGetCategoriesQuery,
	useGetCategoryByIdQuery,
	useCreateCategoryMutation,
	useUpdateCategoryMutation,
	useDeleteCategoryMutation,
	useCreateManyCategoriesMutation,
} = categoryService

