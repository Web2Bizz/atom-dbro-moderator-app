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
import { mockRegions } from '../shared/mock-data'
import { DeleteRegionDialog } from './delete-region-dialog'
import { RegionForm } from './region-form'
import { RegionsTable } from './regions-table'
import { type Region, type RegionFormData } from './types'

export function RegionsPageContent() {
	const [regions, setRegions] = React.useState<Region[]>(mockRegions)
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingRegion, setEditingRegion] = React.useState<Region | undefined>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [regionToDelete, setRegionToDelete] = React.useState<Region | null>(
		null
	)

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
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 500))
			setRegions(prev => prev.filter(region => region.id !== regionToDelete.id))
			toast.success('Регион успешно удален')
			setDeleteDialogOpen(false)
			setRegionToDelete(null)
		} catch {
			toast.error('Ошибка при удалении региона')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (data: RegionFormData) => {
		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 1000))

			if (editingRegion) {
				// Обновление существующего региона
				const now = new Date().toISOString()
				setRegions(prev =>
					prev.map(region =>
						region.id === editingRegion.id
							? {
									...data,
									id: editingRegion.id,
									createdAt: region.createdAt,
									updatedAt: now,
							  }
							: region
					)
				)
				toast.success('Регион успешно обновлен')
			} else {
				// Создание нового региона
				const now = new Date().toISOString()
				const newRegion: Region = {
					...data,
					id: Math.max(...regions.map(r => r.id), 0) + 1,
					createdAt: now,
					updatedAt: now,
				}
				setRegions(prev => [...prev, newRegion])
				toast.success('Регион успешно создан')
			}

			setIsDrawerOpen(false)
			setEditingRegion(undefined)
		} catch {
			toast.error(
				`Ошибка при ${editingRegion ? 'обновлении' : 'создании'} региона`
			)
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
				<RegionsTable
					regions={regions}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
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
