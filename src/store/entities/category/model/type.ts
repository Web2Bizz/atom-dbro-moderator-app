// Типы для категорий

export interface Category {
	id: number
	name: string
	createdAt?: string
	updatedAt?: string
}

// Типы для запросов
export interface CreateCategoryRequest {
	name: string
}

export interface UpdateCategoryRequest {
	name?: string
}

// Типы для ответов API
export interface CategoryListResponse {
	data: Category[]
	total?: number
}

export interface CategoryResponse {
	data: Category
}

