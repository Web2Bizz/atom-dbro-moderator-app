'use client'

import { Plus } from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import {
	useCreateCategoryMutation,
	useDeleteCategoryMutation,
	useGetCategoriesQuery,
	useUpdateCategoryMutation,
	type Category as ApiCategory,
} from '@/store/entities'
import { DeleteQuestCategoryDialog } from './delete-quest-category-dialog'
import { QuestCategoriesTable } from './quest-categories-table'
import { QuestCategoryForm } from './quest-category-form'
import { type QuestCategory, type QuestCategoryFormData } from './types'

// Преобразуем категорию из API в формат компонента
const mapApiCategoryToComponentQuestCategory = (
	apiCategory: ApiCategory
): QuestCategory => {
	return {
		id: apiCategory.id,
		name: apiCategory.name,
		recordStatus: 'CREATED',
		createdAt: apiCategory.createdAt,
		updatedAt: apiCategory.updatedAt,
	}
}

export function QuestCategoriesPageContent() {
	const {
		data: categoriesData,
		isLoading: isLoadingCategories,
		error: categoriesError,
	} = useGetCategoriesQuery()

	const [createCategory] = useCreateCategoryMutation()
	const [updateCategory] = useUpdateCategoryMutation()
	const [deleteCategory] = useDeleteCategoryMutation()

	const questCategories = React.useMemo(() => {
		if (!categoriesData) return []
		return categoriesData.map(mapApiCategoryToComponentQuestCategory)
	}, [categoriesData])

	React.useEffect(() => {
		if (categoriesError) {
			toast.error('Ошибка при загрузке категорий квестов')
		}
	}, [categoriesError])
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingQuestCategory, setEditingQuestCategory] = React.useState<
		QuestCategory | undefined
	>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [questCategoryToDelete, setQuestCategoryToDelete] =
		React.useState<QuestCategory | null>(null)

	const handleCreate = () => {
		setEditingQuestCategory(undefined)
		setIsDrawerOpen(true)
	}

	const handleEdit = (questCategory: QuestCategory) => {
		setEditingQuestCategory(questCategory)
		setIsDrawerOpen(true)
	}

	const handleDeleteClick = (questCategory: QuestCategory) => {
		setQuestCategoryToDelete(questCategory)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!questCategoryToDelete) return

		setIsLoading(true)
		try {
			await deleteCategory(questCategoryToDelete.id).unwrap()
			toast.success('Категория квеста успешно удалена')
			setDeleteDialogOpen(false)
			setQuestCategoryToDelete(null)
		} catch {
			toast.error('Ошибка при удалении категории квеста')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (data: QuestCategoryFormData) => {
		setIsLoading(true)
		try {
			if (editingQuestCategory) {
				// Обновление существующей категории квеста
				await updateCategory({
					id: editingQuestCategory.id,
					data: {
						name: data.name,
					},
				}).unwrap()
				toast.success('Категория квеста успешно обновлена')
			} else {
				// Создание новой категории квеста
				await createCategory({
					name: data.name,
				}).unwrap()
				toast.success('Категория квеста успешно создана')
			}

			setIsDrawerOpen(false)
			setEditingQuestCategory(undefined)
		} catch {
			toast.error(
				`Ошибка при ${
					editingQuestCategory ? 'обновлении' : 'создании'
				} категории квеста`
			)
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setIsDrawerOpen(false)
		setEditingQuestCategory(undefined)
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
						Категории квестов
					</h1>
					<p className='text-sm text-muted-foreground sm:text-base'>
						Управление категориями квестов
					</p>
				</div>
				<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
					<DrawerTrigger asChild>
						<Button onClick={handleCreate} className='w-full sm:w-auto'>
							<Plus className='mr-2 size-4' />
							Добавить категорию квеста
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div className='mx-auto w-full max-w-full md:max-w-[calc(100vw-var(--sidebar-width,16rem)-2rem)] lg:max-w-2xl px-4 sm:px-6'>
							<DrawerHeader>
								<DrawerTitle>
									{editingQuestCategory
										? 'Редактировать категорию квеста'
										: 'Создать категорию квеста'}
								</DrawerTitle>
								<DrawerDescription>
									{editingQuestCategory
										? 'Внесите изменения в информацию о категории квеста'
										: 'Заполните форму для добавления новой категории квеста'}
								</DrawerDescription>
							</DrawerHeader>
							<div className='pb-4'>
								<QuestCategoryForm
									questCategory={editingQuestCategory}
									onSubmit={handleSubmit}
									onCancel={handleCancel}
									isLoading={isLoading}
								/>
							</div>
						</div>
					</DrawerContent>
				</Drawer>
			</div>

			<div className='rounded-lg border bg-card p-4 shadow-sm sm:p-6'>
				{(() => {
					if (isLoadingCategories) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-muted-foreground'>
									Загрузка категорий квестов...
								</p>
							</div>
						)
					}
					if (categoriesError) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-destructive'>
									Ошибка при загрузке категорий квестов
								</p>
							</div>
						)
					}
					return (
						<QuestCategoriesTable
							questCategories={questCategories}
							onEdit={handleEdit}
							onDelete={handleDeleteClick}
						/>
					)
				})()}
			</div>

			<DeleteQuestCategoryDialog
				questCategory={questCategoryToDelete}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={isLoading}
			/>
		</div>
	)
}
