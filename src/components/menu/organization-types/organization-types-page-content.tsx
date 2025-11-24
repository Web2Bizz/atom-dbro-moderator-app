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
import { OrganizationTypesTable } from './organization-types-table'
import { OrganizationTypeForm } from './organization-type-form'
import { DeleteOrganizationTypeDialog } from './delete-organization-type-dialog'
import {
	type OrganizationType,
	type OrganizationTypeFormData,
} from './types'

// Моковые данные для демонстрации
const mockOrganizationTypes: OrganizationType[] = [
	{
		id: 1,
		name: 'Благотворительный фонд',
		recordStatus: 'CREATED',
		createdAt: '2025-11-15T18:13:09.530Z',
		updatedAt: '2025-11-15T18:13:09.530Z',
	},
	{
		id: 2,
		name: 'Некоммерческая организация',
		recordStatus: 'CREATED',
		createdAt: '2025-11-15T18:13:09.530Z',
		updatedAt: '2025-11-15T18:13:09.530Z',
	},
	{
		id: 3,
		name: 'Волонтерское объединение',
		recordStatus: 'CREATED',
		createdAt: '2025-11-15T18:13:09.530Z',
		updatedAt: '2025-11-15T18:13:09.530Z',
	},
]

export function OrganizationTypesPageContent() {
	const [organizationTypes, setOrganizationTypes] = React.useState<
		OrganizationType[]
	>(mockOrganizationTypes)
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingOrganizationType, setEditingOrganizationType] =
		React.useState<OrganizationType | undefined>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [organizationTypeToDelete, setOrganizationTypeToDelete] =
		React.useState<OrganizationType | null>(null)

	const handleCreate = () => {
		setEditingOrganizationType(undefined)
		setIsDrawerOpen(true)
	}

	const handleEdit = (organizationType: OrganizationType) => {
		setEditingOrganizationType(organizationType)
		setIsDrawerOpen(true)
	}

	const handleDeleteClick = (organizationType: OrganizationType) => {
		setOrganizationTypeToDelete(organizationType)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!organizationTypeToDelete) return

		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 500))
			setOrganizationTypes(prev =>
				prev.filter(ot => ot.id !== organizationTypeToDelete.id)
			)
			toast.success('Тип организации успешно удален')
			setDeleteDialogOpen(false)
			setOrganizationTypeToDelete(null)
		} catch {
			toast.error('Ошибка при удалении типа организации')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (data: OrganizationTypeFormData) => {
		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 1000))

			if (editingOrganizationType) {
				// Обновление существующего типа организации
				setOrganizationTypes(prev =>
					prev.map(ot =>
						ot.id === editingOrganizationType.id
							? {
									...data,
									id: editingOrganizationType.id,
									recordStatus: ot.recordStatus,
									createdAt: ot.createdAt,
									updatedAt: new Date().toISOString(),
							  }
							: ot
					)
				)
				toast.success('Тип организации успешно обновлен')
			} else {
				// Создание нового типа организации
				const newOrganizationType: OrganizationType = {
					...data,
					id: Math.max(...organizationTypes.map(ot => ot.id), 0) + 1,
					recordStatus: 'CREATED',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				}
				setOrganizationTypes(prev => [...prev, newOrganizationType])
				toast.success('Тип организации успешно создан')
			}

			setIsDrawerOpen(false)
			setEditingOrganizationType(undefined)
		} catch {
			toast.error(
				`Ошибка при ${editingOrganizationType ? 'обновлении' : 'создании'} типа организации`
			)
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setIsDrawerOpen(false)
		setEditingOrganizationType(undefined)
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
						Типы организаций
					</h1>
					<p className='text-sm text-muted-foreground sm:text-base'>
						Управление типами организаций
					</p>
				</div>
				<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
					<DrawerTrigger asChild>
						<Button onClick={handleCreate} className='w-full sm:w-auto'>
							<Plus className='mr-2 size-4' />
							Добавить тип организации
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div className='mx-auto w-full max-w-full md:max-w-[calc(100vw-var(--sidebar-width,16rem)-2rem)] lg:max-w-2xl px-4 sm:px-6'>
							<DrawerHeader>
								<DrawerTitle>
									{editingOrganizationType
										? 'Редактировать тип организации'
										: 'Создать тип организации'}
								</DrawerTitle>
								<DrawerDescription>
									{editingOrganizationType
										? 'Внесите изменения в информацию о типе организации'
										: 'Заполните форму для добавления нового типа организации'}
								</DrawerDescription>
							</DrawerHeader>
							<div className='pb-4'>
								<OrganizationTypeForm
									organizationType={editingOrganizationType}
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
				<OrganizationTypesTable
					organizationTypes={organizationTypes}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
			</div>

			<DeleteOrganizationTypeDialog
				organizationType={organizationTypeToDelete}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={isLoading}
			/>
		</div>
	)
}

