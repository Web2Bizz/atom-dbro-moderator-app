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
import { useGetCitiesQuery, useGetRegionsQuery } from '@/store/entities'
import { CitiesTable } from './cities-table'
import { CityForm } from './city-form'
import { DeleteCityDialog } from './delete-city-dialog'
import { type City, type CityFormData } from './types'

export function CitiesPageContent() {
	const {
		data: citiesData,
		isLoading: isLoadingCities,
		error: citiesError,
	} = useGetCitiesQuery()

	const { data: regionsData, error: regionsError } = useGetRegionsQuery()

	const cities = React.useMemo(() => {
		if (!citiesData) return []
		return citiesData.map(city => {
			const cityFromApi = city as typeof city & {
				latitude?: number | string
				longitude?: number | string
				region?: { id: number; name: string }
			}
			return {
				id: cityFromApi.id,
				name: cityFromApi.name,
				latitude: cityFromApi.latitude
					? Number.parseFloat(String(cityFromApi.latitude))
					: 0,
				longitude: cityFromApi.longitude
					? Number.parseFloat(String(cityFromApi.longitude))
					: 0,
				regionId: cityFromApi.regionId || cityFromApi.region?.id || 0,
			}
		})
	}, [citiesData])

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
	const [editingCity, setEditingCity] = React.useState<City | undefined>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [cityToDelete, setCityToDelete] = React.useState<City | null>(null)

	React.useEffect(() => {
		if (citiesError) {
			toast.error('Ошибка при загрузке городов')
		}
	}, [citiesError])

	React.useEffect(() => {
		if (regionsError) {
			toast.error('Ошибка при загрузке регионов')
		}
	}, [regionsError])

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
			// API не поддерживает удаление городов
			toast.error('Удаление городов через API не поддерживается')
			setDeleteDialogOpen(false)
			setCityToDelete(null)
		} catch {
			toast.error('Ошибка при удалении города')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (_data: CityFormData) => {
		setIsLoading(true)
		try {
			// API не поддерживает создание/обновление городов
			const action = editingCity ? 'Обновление' : 'Создание'
			toast.error(`${action} городов через API не поддерживается`)
			setIsDrawerOpen(false)
			setEditingCity(undefined)
		} catch {
			const action = editingCity ? 'обновлении' : 'создании'
			toast.error(`Ошибка при ${action} города`)
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
				{(() => {
					if (isLoadingCities) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-muted-foreground'>
									Загрузка городов...
								</p>
							</div>
						)
					}
					if (citiesError) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-destructive'>
									Ошибка при загрузке городов
								</p>
							</div>
						)
					}
					return (
						<CitiesTable
							cities={cities}
							onEdit={handleEdit}
							onDelete={handleDeleteClick}
						/>
					)
				})()}
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
