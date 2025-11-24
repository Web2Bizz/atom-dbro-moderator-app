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
import { QuestCategoriesTable } from './quest-categories-table'
import { QuestCategoryForm } from './quest-category-form'
import { DeleteQuestCategoryDialog } from './delete-quest-category-dialog'
import { type QuestCategory, type QuestCategoryFormData } from './types'

// Моковые данные для демонстрации
const mockQuestCategories: QuestCategory[] = [
	{
		id: 1,
		name: 'Экология',
		recordStatus: 'CREATED',
		createdAt: '2025-11-16T11:05:05.565Z',
		updatedAt: '2025-11-16T11:05:05.565Z',
	},
	{
		id: 2,
		name: 'Социальная помощь',
		recordStatus: 'CREATED',
		createdAt: '2025-11-16T11:05:05.565Z',
		updatedAt: '2025-11-16T11:05:05.565Z',
	},
	{
		id: 3,
		name: 'Образование',
		recordStatus: 'CREATED',
		createdAt: '2025-11-16T11:05:05.565Z',
		updatedAt: '2025-11-16T11:05:05.565Z',
	},
]

export function QuestCategoriesPageContent() {
	const [questCategories, setQuestCategories] = React.useState<QuestCategory[]>(
		mockQuestCategories
	)
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingQuestCategory, setEditingQuestCategory] =
		React.useState<QuestCategory | undefined>()
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
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 500))
			setQuestCategories(prev =>
				prev.filter(qc => qc.id !== questCategoryToDelete.id)
			)
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
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 1000))

			if (editingQuestCategory) {
				// Обновление существующей категории квеста
				setQuestCategories(prev =>
					prev.map(qc =>
						qc.id === editingQuestCategory.id
							? {
									...data,
									id: editingQuestCategory.id,
									recordStatus: qc.recordStatus,
									createdAt: qc.createdAt,
									updatedAt: new Date().toISOString(),
							  }
							: qc
					)
				)
				toast.success('Категория квеста успешно обновлена')
			} else {
				// Создание новой категории квеста
				const newQuestCategory: QuestCategory = {
					...data,
					id: Math.max(...questCategories.map(qc => qc.id), 0) + 1,
					recordStatus: 'CREATED',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				}
				setQuestCategories(prev => [...prev, newQuestCategory])
				toast.success('Категория квеста успешно создана')
			}

			setIsDrawerOpen(false)
			setEditingQuestCategory(undefined)
		} catch {
			toast.error(
				`Ошибка при ${editingQuestCategory ? 'обновлении' : 'создании'} категории квеста`
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
				<QuestCategoriesTable
					questCategories={questCategories}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
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

