'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { QuestsTable } from './quests-table'
import { QuestEditDrawer } from './components/quest-edit-drawer'
import { DeleteQuestDialog } from '../delete-quest-dialog'
import { QuestsHeader } from './components/quests-header'
import { type Quest, type QuestFormData } from '../types'
import { type QuestCategory } from '../../quest-categories/types'
import { type City } from '../../cities/types'
import { type OrganizationType } from '../../organizations/types'
import {
	mockQuests,
	mockQuestCategories,
	mockCities,
	mockOrganizationTypes,
} from './mock-data'

export function QuestsPageContent() {
	const [quests, setQuests] = React.useState<Quest[]>(mockQuests)
	const [questCategories] = React.useState<QuestCategory[]>(mockQuestCategories)
	const [cities] = React.useState<City[]>(mockCities)
	const [organizationTypes] = React.useState<OrganizationType[]>(
		mockOrganizationTypes
	)
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
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 500))
			setQuests(prev => prev.filter(q => q.id !== questToDelete.id))
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
		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 1000))

			const selectedCategories = questCategories.filter(c =>
				data.categoryIds?.includes(c.id)
			)
			const selectedCity = cities.find(c => c.id === data.cityId)
			const selectedOrganizationType = organizationTypes.find(
				t => t.id === data.organizationTypeId
			)

			if (!selectedCategories.length) {
				toast.error('Ошибка: не найдены категории')
				return
			}

			if (!editingQuest) {
				toast.error('Ошибка: квест не найден')
				return
			}

			// Обновление существующего квеста
			const now = new Date().toISOString()
			setQuests(prev =>
				prev.map(q =>
					q.id === editingQuest.id
						? {
								...data,
								id: editingQuest.id,
								categories: selectedCategories,
								city: selectedCity,
								organizationType: selectedOrganizationType,
								createdAt: q.createdAt,
								updatedAt: now,
						  }
						: q
				)
			)
			toast.success('Квест успешно обновлен')

			setIsDrawerOpen(false)
			setEditingQuest(undefined)
		} catch {
			toast.error(
				`Ошибка при ${editingQuest ? 'обновлении' : 'создании'} квеста`
			)
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
				questCategories={questCategories}
				cities={cities}
				organizationTypes={organizationTypes}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
				isLoading={isLoading}
			/>

			<div className='rounded-lg border bg-card p-4 shadow-sm sm:p-6'>
				<QuestsTable
					quests={quests}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
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

