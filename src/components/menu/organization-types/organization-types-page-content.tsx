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
	useCreateOrganizationTypeMutation,
	useDeleteOrganizationTypeMutation,
	useGetOrganizationTypesQuery,
	useUpdateOrganizationTypeMutation,
	type OrganizationType as ApiOrganizationType,
} from '@/store/entities'
import { DeleteOrganizationTypeDialog } from './delete-organization-type-dialog'
import { OrganizationTypeForm } from './organization-type-form'
import { OrganizationTypesTable } from './organization-types-table'
import { type OrganizationType, type OrganizationTypeFormData } from './types'

// Преобразуем тип организации из API в формат компонента
const mapApiOrganizationTypeToComponentOrganizationType = (
	apiOrganizationType: ApiOrganizationType
): OrganizationType => {
	return {
		id: apiOrganizationType.id,
		name: apiOrganizationType.name,
		recordStatus: 'CREATED',
		createdAt: apiOrganizationType.createdAt,
		updatedAt: apiOrganizationType.updatedAt,
	}
}

export function OrganizationTypesPageContent() {
	const {
		data: organizationTypesData,
		isLoading: isLoadingOrganizationTypes,
		error: organizationTypesError,
	} = useGetOrganizationTypesQuery()

	const [createOrganizationType] = useCreateOrganizationTypeMutation()
	const [updateOrganizationType] = useUpdateOrganizationTypeMutation()
	const [deleteOrganizationType] = useDeleteOrganizationTypeMutation()

	const organizationTypes = React.useMemo(() => {
		if (!organizationTypesData) return []
		return organizationTypesData.map(
			mapApiOrganizationTypeToComponentOrganizationType
		)
	}, [organizationTypesData])

	React.useEffect(() => {
		if (organizationTypesError) {
			toast.error('Ошибка при загрузке типов организаций')
		}
	}, [organizationTypesError])
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingOrganizationType, setEditingOrganizationType] = React.useState<
		OrganizationType | undefined
	>()
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
			await deleteOrganizationType(organizationTypeToDelete.id).unwrap()
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
			if (editingOrganizationType) {
				// Обновление существующего типа организации
				await updateOrganizationType({
					id: editingOrganizationType.id,
					data: {
						name: data.name,
					},
				}).unwrap()
				toast.success('Тип организации успешно обновлен')
			} else {
				// Создание нового типа организации
				await createOrganizationType({
					name: data.name,
				}).unwrap()
				toast.success('Тип организации успешно создан')
			}

			setIsDrawerOpen(false)
			setEditingOrganizationType(undefined)
		} catch {
			toast.error(
				`Ошибка при ${
					editingOrganizationType ? 'обновлении' : 'создании'
				} типа организации`
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
				{(() => {
					if (isLoadingOrganizationTypes) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-muted-foreground'>
									Загрузка типов организаций...
								</p>
							</div>
						)
					}
					if (organizationTypesError) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-destructive'>
									Ошибка при загрузке типов организаций
								</p>
							</div>
						)
					}
					return (
						<OrganizationTypesTable
							organizationTypes={organizationTypes}
							onEdit={handleEdit}
							onDelete={handleDeleteClick}
						/>
					)
				})()}
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
