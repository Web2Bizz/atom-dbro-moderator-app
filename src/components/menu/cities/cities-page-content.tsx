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
import { type Region } from '../regions/types'
import { mockRegions } from '../shared/mock-data'
import { CitiesTable } from './cities-table'
import { CityForm } from './city-form'
import { DeleteCityDialog } from './delete-city-dialog'
import { type City, type CityFormData } from './types'

// Моковые данные для демонстрации
const mockCities: City[] = [
	{
		id: 1,
		name: 'Москва',
		latitude: 55.7558,
		longitude: 37.6173,
		regionId: 1,
	},
	{
		id: 2,
		name: 'Санкт-Петербург',
		latitude: 59.9343,
		longitude: 30.3351,
		regionId: 2,
	},
	{
		id: 3,
		name: 'Новосибирск',
		latitude: 55.0084,
		longitude: 82.9357,
		regionId: 3,
	},
]

export function CitiesPageContent() {
	const [cities, setCities] = React.useState<City[]>(mockCities)
	const [regions] = React.useState<Region[]>(mockRegions)
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingCity, setEditingCity] = React.useState<City | undefined>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [cityToDelete, setCityToDelete] = React.useState<City | null>(null)

	const handleCreate = () => {
		setEditingCity(undefined)
		setIsDrawerOpen(true)
	}

	const handleEdit = (city: City) => {
		setEditingCity(city)
		setIsDrawerOpen(true)
	}

	const handleDeleteClick = (city: City) => {
		setCityToDelete(city)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!cityToDelete) return

		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 500))
			setCities(prev => prev.filter(city => city.id !== cityToDelete.id))
			toast.success('Город успешно удален')
			setDeleteDialogOpen(false)
			setCityToDelete(null)
		} catch {
			toast.error('Ошибка при удалении города')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (data: CityFormData) => {
		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 1000))

			if (editingCity) {
				// Обновление существующего города
				setCities(prev =>
					prev.map(city =>
						city.id === editingCity.id ? { ...data, id: editingCity.id } : city
					)
				)
				toast.success('Город успешно обновлен')
			} else {
				// Создание нового города
				const newCity: City = {
					...data,
					id: Math.max(...cities.map(c => c.id), 0) + 1,
				}
				setCities(prev => [...prev, newCity])
				toast.success('Город успешно создан')
			}

			setIsDrawerOpen(false)
			setEditingCity(undefined)
		} catch {
			toast.error(
				`Ошибка при ${editingCity ? 'обновлении' : 'создании'} города`
			)
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setIsDrawerOpen(false)
		setEditingCity(undefined)
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
						Города
					</h1>
					<p className='text-sm text-muted-foreground sm:text-base'>
						Управление городами и их координатами
					</p>
				</div>
				<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
					<DrawerTrigger asChild>
						<Button onClick={handleCreate} className='w-full sm:w-auto'>
							<Plus className='mr-2 size-4' />
							Добавить город
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div className='mx-auto w-full max-w-full md:max-w-[calc(100vw-var(--sidebar-width,16rem)-2rem)] lg:max-w-2xl px-4 sm:px-6'>
							<DrawerHeader>
								<DrawerTitle>
									{editingCity ? 'Редактировать город' : 'Создать город'}
								</DrawerTitle>
								<DrawerDescription>
									{editingCity
										? 'Внесите изменения в информацию о городе'
										: 'Заполните форму для добавления нового города'}
								</DrawerDescription>
							</DrawerHeader>
							<div className='pb-4'>
								<CityForm
									city={editingCity}
									regions={regions}
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
				<CitiesTable
					cities={cities}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
			</div>

			<DeleteCityDialog
				city={cityToDelete}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={isLoading}
			/>
		</div>
	)
}
