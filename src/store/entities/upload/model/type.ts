// Типы для загрузки файлов

export interface UploadedImage {
	fileName: string
	url: string
}

// Типы для ответов API
export interface UploadImagesResponse {
	data: UploadedImage[]
}

