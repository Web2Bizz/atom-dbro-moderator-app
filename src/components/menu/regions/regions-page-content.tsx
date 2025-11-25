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
import { useGetRegionsQuery } from '@/store/entities'
import { DeleteRegionDialog } from './delete-region-dialog'
import { RegionForm } from './region-form'
import { RegionsTable } from './regions-table'
import { type Region, type RegionFormData } from './types'

export function RegionsPageContent() {
	const {
		data: regionsData,
		isLoading: isLoadingRegions,
		error: regionsError,
	} = useGetRegionsQuery()

	const regions = React.useMemo(() => {
		if (!regionsData) return []
		return regionsData.map(region => ({
			id: region.id,
			name: region.name,
			createdAt: region.createdAt || new Date().toISOString(),
			updatedAt: region.updatedAt || new Date().toISOString(),
		}))
	}, [regionsData])

	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingRegion, setEditingRegion] = React.useState<Region | undefined>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [regionToDelete, setRegionToDelete] = React.useState<Region | null>(
		null
	)

	React.useEffect(() => {
		if (regionsError) {
			toast.error('Ошибка при загрузке регионов')
		}
	}, [regionsError])

	const handleCreate = () => {
		setEditingRegion(undefined)
		setIsDrawerOpen(true)
	}

	const handleEdit = (region: Region) => {
		setEditingRegion(region)
		setIsDrawerOpen(true)
	}

	const handleDeleteClick = (region: Region) => {
		setRegionToDelete(region)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!regionToDelete) return

		setIsLoading(true)
		try {
			// API не поддерживает удаление регионов
			toast.error('Удаление регионов через API не поддерживается')
			setDeleteDialogOpen(false)
			setRegionToDelete(null)
		} catch {
			toast.error('Ошибка при удалении региона')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (_data: RegionFormData) => {
		setIsLoading(true)
		try {
			// API не поддерживает создание/обновление регионов
			const action = editingRegion ? 'Обновление' : 'Создание'
			toast.error(`${action} регионов через API не поддерживается`)
			setIsDrawerOpen(false)
			setEditingRegion(undefined)
		} catch {
			const action = editingRegion ? 'обновлении' : 'создании'
			toast.error(`Ошибка при ${action} региона`)
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setIsDrawerOpen(false)
		setEditingRegion(undefined)
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
						Регионы
					</h1>
					<p className='text-sm text-muted-foreground sm:text-base'>
						Управление регионами
					</p>
				</div>
				<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
					<DrawerTrigger asChild>
						<Button onClick={handleCreate} className='w-full sm:w-auto'>
							<Plus className='mr-2 size-4' />
							Добавить регион
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div className='mx-auto w-full max-w-2xl px-4'>
							<DrawerHeader>
								<DrawerTitle>
									{editingRegion ? 'Редактировать регион' : 'Создать регион'}
								</DrawerTitle>
								<DrawerDescription>
									{editingRegion
										? 'Внесите изменения в информацию о регионе'
										: 'Заполните форму для добавления нового региона'}
								</DrawerDescription>
							</DrawerHeader>
							<div className='pb-4'>
								<RegionForm
									region={editingRegion}
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
					if (isLoadingRegions) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-muted-foreground'>
									Загрузка регионов...
								</p>
							</div>
						)
					}
					if (regionsError) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-destructive'>
									Ошибка при загрузке регионов
								</p>
							</div>
						)
					}
					return (
						<RegionsTable
							regions={regions}
							onEdit={handleEdit}
							onDelete={handleDeleteClick}
						/>
					)
				})()}
			</div>

			<DeleteRegionDialog
				region={regionToDelete}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={isLoading}
			/>
		</div>
	)
}
