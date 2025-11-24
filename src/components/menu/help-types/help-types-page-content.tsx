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
import { HelpTypesTable } from './help-types-table'
import { HelpTypeForm } from './help-type-form'
import { DeleteHelpTypeDialog } from './delete-help-type-dialog'
import { type HelpType, type HelpTypeFormData } from './types'

// Моковые данные для демонстрации
const mockHelpTypes: HelpType[] = [
	{
		id: 1,
		name: 'Материальная помощь',
		recordStatus: 'CREATED',
		createdAt: '2025-11-14T21:16:58.882Z',
		updatedAt: '2025-11-14T21:16:58.882Z',
	},
	{
		id: 2,
		name: 'Волонтеры',
		recordStatus: 'CREATED',
		createdAt: '2025-11-14T21:16:58.882Z',
		updatedAt: '2025-11-14T21:16:58.882Z',
	},
	{
		id: 3,
		name: 'Экология',
		recordStatus: 'CREATED',
		createdAt: '2025-11-14T21:16:58.882Z',
		updatedAt: '2025-11-14T21:16:58.882Z',
	},
]

export function HelpTypesPageContent() {
	const [helpTypes, setHelpTypes] = React.useState<HelpType[]>(mockHelpTypes)
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingHelpType, setEditingHelpType] = React.useState<HelpType | undefined>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [helpTypeToDelete, setHelpTypeToDelete] = React.useState<HelpType | null>(null)

	const handleCreate = () => {
		setEditingHelpType(undefined)
		setIsDrawerOpen(true)
	}

	const handleEdit = (helpType: HelpType) => {
		setEditingHelpType(helpType)
		setIsDrawerOpen(true)
	}

	const handleDeleteClick = (helpType: HelpType) => {
		setHelpTypeToDelete(helpType)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!helpTypeToDelete) return

		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 500))
			setHelpTypes(prev => prev.filter(ht => ht.id !== helpTypeToDelete.id))
			toast.success('Вид помощи успешно удален')
			setDeleteDialogOpen(false)
			setHelpTypeToDelete(null)
		} catch {
			toast.error('Ошибка при удалении вида помощи')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (data: HelpTypeFormData) => {
		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 1000))

			if (editingHelpType) {
				// Обновление существующего вида помощи
				setHelpTypes(prev =>
					prev.map(ht =>
						ht.id === editingHelpType.id
							? {
									...data,
									id: editingHelpType.id,
									recordStatus: ht.recordStatus,
									createdAt: ht.createdAt,
									updatedAt: new Date().toISOString(),
							  }
							: ht
					)
				)
				toast.success('Вид помощи успешно обновлен')
			} else {
				// Создание нового вида помощи
				const newHelpType: HelpType = {
					...data,
					id: Math.max(...helpTypes.map(ht => ht.id), 0) + 1,
					recordStatus: 'CREATED',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				}
				setHelpTypes(prev => [...prev, newHelpType])
				toast.success('Вид помощи успешно создан')
			}

			setIsDrawerOpen(false)
			setEditingHelpType(undefined)
		} catch {
			toast.error(
				`Ошибка при ${editingHelpType ? 'обновлении' : 'создании'} вида помощи`
			)
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setIsDrawerOpen(false)
		setEditingHelpType(undefined)
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
						Виды помощи
					</h1>
					<p className='text-sm text-muted-foreground sm:text-base'>
						Управление видами помощи
					</p>
				</div>
				<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
					<DrawerTrigger asChild>
						<Button onClick={handleCreate} className='w-full sm:w-auto'>
							<Plus className='mr-2 size-4' />
							Добавить вид помощи
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div className='mx-auto w-full max-w-full md:max-w-[calc(100vw-var(--sidebar-width,16rem)-2rem)] lg:max-w-2xl px-4 sm:px-6'>
							<DrawerHeader>
								<DrawerTitle>
									{editingHelpType
										? 'Редактировать вид помощи'
										: 'Создать вид помощи'}
								</DrawerTitle>
								<DrawerDescription>
									{editingHelpType
										? 'Внесите изменения в информацию о виде помощи'
										: 'Заполните форму для добавления нового вида помощи'}
								</DrawerDescription>
							</DrawerHeader>
							<div className='pb-4'>
								<HelpTypeForm
									helpType={editingHelpType}
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
				<HelpTypesTable
					helpTypes={helpTypes}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
			</div>

			<DeleteHelpTypeDialog
				helpType={helpTypeToDelete}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={isLoading}
			/>
		</div>
	)
}

