'use client'

import {
	useDeleteQuestMutation,
	useGetCategoriesQuery,
	useGetCitiesQuery,
	useGetOrganizationTypesQuery,
	useGetQuestsQuery,
	useUpdateQuestMutation,
	type City as ApiCity,
	type OrganizationType as ApiOrganizationType,
	type Quest as ApiQuest,
} from '@/store/entities'
import * as React from 'react'
import { toast } from 'sonner'
import { type QuestCategory } from '../../quest-categories/types'
import { DeleteQuestDialog } from '../delete-quest-dialog'
import { type Quest, type QuestFormData } from '../types'
import { QuestEditDrawer } from './components/quest-edit-drawer'
import { QuestsHeader } from './components/quests-header'
import { QuestsTable } from './quests-table'

// Преобразуем квест из API в формат компонента
const mapApiQuestToComponentQuest = (
	apiQuest: ApiQuest,
	citiesData: ApiCity[] = [],
	organizationTypesData: ApiOrganizationType[] = [],
	categoriesData: QuestCategory[] = []
): Quest => {
	const city = citiesData.find(c => c.id === apiQuest.cityId)
	const organizationType = organizationTypesData.find(
		ot => ot.id === apiQuest.organizationTypeId
	)
	const categories = apiQuest.categoryIds
		? categoriesData.filter(c => apiQuest.categoryIds?.includes(c.id))
		: []

	return {
		id: apiQuest.id,
		title: apiQuest.title,
		description: apiQuest.description || '',
		status: apiQuest.status || 'active',
		experienceReward: apiQuest.experienceReward,
		achievementId: apiQuest.achievementId || null,
		ownerId: (apiQuest as ApiQuest & { ownerId?: number }).ownerId ?? 0,
		cityId: apiQuest.cityId,
		organizationTypeId: apiQuest.organizationTypeId || 0,
		latitude:
			typeof apiQuest.latitude === 'number'
				? String(apiQuest.latitude)
				: apiQuest.latitude ?? '',
		longitude:
			typeof apiQuest.longitude === 'number'
				? String(apiQuest.longitude)
				: apiQuest.longitude ?? '',
		address: apiQuest.address || '',
		contacts: apiQuest.contacts || [],
		coverImage: apiQuest.coverImage || null,
		gallery: apiQuest.gallery || [],
		steps: (apiQuest.steps || []).map(step => ({
			title: step.title,
			status: step.status || 'pending',
			progress: step.progress || 0,
			description: step.description || '',
		})),
		createdAt: apiQuest.createdAt || new Date().toISOString(),
		updatedAt: apiQuest.updatedAt || new Date().toISOString(),
		city: (() => {
			if (!city) return undefined
			let lat = 0
			if (typeof city.latitude === 'string') {
				lat = Number.parseFloat(city.latitude)
			} else if (typeof city.latitude === 'number') {
				lat = city.latitude
			}
			let lng = 0
			if (typeof city.longitude === 'string') {
				lng = Number.parseFloat(city.longitude)
			} else if (typeof city.longitude === 'number') {
				lng = city.longitude
			}
			return {
				id: city.id,
				name: city.name,
				latitude: lat,
				longitude: lng,
				regionId: city.regionId ?? 0,
			}
		})(),
		organizationType: organizationType
			? {
					id: organizationType.id,
					name: organizationType.name,
			  }
			: undefined,
		categories: categories.map((cat: QuestCategory) => ({
			id: cat.id,
			name: cat.name,
			recordStatus: 'CREATED' as const,
			createdAt: cat.createdAt ?? new Date().toISOString(),
			updatedAt: cat.updatedAt ?? new Date().toISOString(),
		})),
	}
}

export function QuestsPageContent() {
	const {
		data: questsData,
		isLoading: isLoadingQuests,
		error: questsError,
	} = useGetQuestsQuery()

	const { data: categoriesData, isLoading: isLoadingCategories } =
		useGetCategoriesQuery()

	const { data: citiesData, isLoading: isLoadingCities } = useGetCitiesQuery()

	const { data: organizationTypesData, isLoading: isLoadingOrganizationTypes } =
		useGetOrganizationTypesQuery()

	const [updateQuest] = useUpdateQuestMutation()
	const [deleteQuest] = useDeleteQuestMutation()

	const quests = React.useMemo(() => {
		if (!questsData) return []
		return questsData.map(apiQuest =>
			mapApiQuestToComponentQuest(
				apiQuest,
				citiesData,
				organizationTypesData,
				categoriesData
			)
		)
	}, [questsData, citiesData, organizationTypesData, categoriesData])

	React.useEffect(() => {
		if (questsError) {
			toast.error('Ошибка при загрузке квестов')
		}
	}, [questsError])

	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingQuest, setEditingQuest] = React.useState<Quest | undefined>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [questToDelete, setQuestToDelete] = React.useState<Quest | null>(null)

	const handleEdit = (quest: Quest) => {
		setEditingQuest(quest)
		setIsDrawerOpen(true)
	}

	const handleDeleteClick = (quest: Quest) => {
		setQuestToDelete(quest)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!questToDelete) return

		setIsLoading(true)
		try {
			await deleteQuest(questToDelete.id).unwrap()
			toast.success('Квест успешно удален')
			setDeleteDialogOpen(false)
			setQuestToDelete(null)
		} catch {
			toast.error('Ошибка при удалении квеста')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (data: QuestFormData) => {
		if (!editingQuest) {
			toast.error('Ошибка: квест не найден')
			return
		}

		setIsLoading(true)
		try {
			await updateQuest({
				id: editingQuest.id,
				data: {
					title: data.title,
					description: data.description || undefined,
					status: data.status as ApiQuest['status'],
				},
			}).unwrap()

			toast.success('Квест успешно обновлен')

			setIsDrawerOpen(false)
			setEditingQuest(undefined)
		} catch {
			toast.error('Ошибка при обновлении квеста')
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setIsDrawerOpen(false)
		setEditingQuest(undefined)
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<QuestsHeader />

			<QuestEditDrawer
				open={isDrawerOpen}
				onOpenChange={setIsDrawerOpen}
				quest={editingQuest}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				isLoading={isLoading}
			/>

			<div className='rounded-lg border bg-card p-4 shadow-sm sm:p-6'>
				{(() => {
					if (
						isLoadingQuests ||
						isLoadingCategories ||
						isLoadingCities ||
						isLoadingOrganizationTypes
					) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-muted-foreground'>
									Загрузка квестов...
								</p>
							</div>
						)
					}
					if (questsError) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-destructive'>
									Ошибка при загрузке квестов
								</p>
							</div>
						)
					}
					return (
						<QuestsTable
							quests={quests}
							onEdit={handleEdit}
							onDelete={handleDeleteClick}
						/>
					)
				})()}
			</div>

			<DeleteQuestDialog
				quest={questToDelete}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={isLoading}
			/>
		</div>
	)
}
