import { baseQueryWithReauth } from '@/store/baseQueryWithReauth'
import { createApi } from '@reduxjs/toolkit/query/react'
import type { UploadedImage, UploadImagesResponse } from './type'

export const uploadService = createApi({
	reducerPath: 'uploadApi',
	baseQuery: baseQueryWithReauth,
	tagTypes: ['Upload'],
	endpoints: builder => ({
		// POST /v1/upload/images - Загрузить множество изображений на S3
		uploadImages: builder.mutation<UploadedImage[], File[]>({
			query: files => {
				const formData = new FormData()
				files.forEach(file => {
					formData.append('images', file)
				})
				return {
					url: '/v1/upload/images',
					method: 'POST',
					body: formData,
				}
			},
			transformResponse: (response: UploadImagesResponse | UploadedImage[]) => {
				if (Array.isArray(response)) {
					return response
				}
				return response.data || []
			},
		}),
	}),
})

export const { useUploadImagesMutation } = uploadService

