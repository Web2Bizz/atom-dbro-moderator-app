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
	useCreateHelpTypeMutation,
	useDeleteHelpTypeMutation,
	useGetHelpTypesQuery,
	useUpdateHelpTypeMutation,
	type HelpType as ApiHelpType,
} from '@/store/entities'
import { DeleteHelpTypeDialog } from './delete-help-type-dialog'
import { HelpTypeForm } from './help-type-form'
import { HelpTypesTable } from './help-types-table'
import { type HelpType, type HelpTypeFormData } from './types'

// Преобразуем вид помощи из API в формат компонента
const mapApiHelpTypeToComponentHelpType = (
	apiHelpType: ApiHelpType
): HelpType => {
	return {
		id: apiHelpType.id,
		name: apiHelpType.name,
		recordStatus: 'CREATED',
		createdAt: apiHelpType.createdAt,
		updatedAt: apiHelpType.updatedAt,
	}
}

export function HelpTypesPageContent() {
	const {
		data: helpTypesData,
		isLoading: isLoadingHelpTypes,
		error: helpTypesError,
	} = useGetHelpTypesQuery()

	const [createHelpType] = useCreateHelpTypeMutation()
	const [updateHelpType] = useUpdateHelpTypeMutation()
	const [deleteHelpType] = useDeleteHelpTypeMutation()

	const helpTypes = React.useMemo(() => {
		if (!helpTypesData) return []
		return helpTypesData.map(mapApiHelpTypeToComponentHelpType)
	}, [helpTypesData])

	React.useEffect(() => {
		if (helpTypesError) {
			toast.error('Ошибка при загрузке видов помощи')
		}
	}, [helpTypesError])
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingHelpType, setEditingHelpType] = React.useState<
		HelpType | undefined
	>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [helpTypeToDelete, setHelpTypeToDelete] =
		React.useState<HelpType | null>(null)

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
			await deleteHelpType(helpTypeToDelete.id).unwrap()
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
			if (editingHelpType) {
				// Обновление существующего вида помощи
				await updateHelpType({
					id: editingHelpType.id,
					data: {
						name: data.name,
					},
				}).unwrap()
				toast.success('Вид помощи успешно обновлен')
			} else {
				// Создание нового вида помощи
				await createHelpType({
					name: data.name,
				}).unwrap()
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
				{(() => {
					if (isLoadingHelpTypes) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-muted-foreground'>
									Загрузка видов помощи...
								</p>
							</div>
						)
					}
					if (helpTypesError) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-destructive'>
									Ошибка при загрузке видов помощи
								</p>
							</div>
						)
					}
					return (
						<HelpTypesTable
							helpTypes={helpTypes}
							onEdit={handleEdit}
							onDelete={handleDeleteClick}
						/>
					)
				})()}
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
