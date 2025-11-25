'use client'

import * as React from 'react'
import { toast } from 'sonner'

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer'
import {
	useDeleteAchievementMutation,
	useGetAchievementsQuery,
	useUpdateAchievementMutation,
	type Achievement as ApiAchievement,
} from '@/store/entities'
import { AchievementForm } from './achievement-form'
import { AchievementsTable } from './achievements-table'
import { DeleteAchievementDialog } from './delete-achievement-dialog'
import { type Achievement, type AchievementFormData } from './types'

// Преобразуем достижение из API в формат компонента
const mapApiAchievementToComponentAchievement = (
	apiAchievement: ApiAchievement
): Achievement => {
	return {
		id: apiAchievement.id,
		title: apiAchievement.title,
		description: apiAchievement.description || '',
		icon: apiAchievement.icon || '',
		rarity: apiAchievement.rarity,
		questId: null, // API не возвращает questId напрямую
		recordStatus: 'CREATED',
		createdAt: apiAchievement.createdAt,
		updatedAt: apiAchievement.updatedAt,
	}
}

export function AchievementsPageContent() {
	const {
		data: achievementsData,
		isLoading: isLoadingAchievements,
		error: achievementsError,
	} = useGetAchievementsQuery()

	const [updateAchievement] = useUpdateAchievementMutation()
	const [deleteAchievement] = useDeleteAchievementMutation()

	const achievements = React.useMemo(() => {
		if (!achievementsData) return []
		return achievementsData.map(mapApiAchievementToComponentAchievement)
	}, [achievementsData])

	React.useEffect(() => {
		if (achievementsError) {
			toast.error('Ошибка при загрузке достижений')
		}
	}, [achievementsError])
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingAchievement, setEditingAchievement] = React.useState<
		Achievement | undefined
	>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [achievementToDelete, setAchievementToDelete] =
		React.useState<Achievement | null>(null)

	const handleEdit = (achievement: Achievement) => {
		setEditingAchievement(achievement)
		setIsDrawerOpen(true)
	}

	const handleDeleteClick = (achievement: Achievement) => {
		setAchievementToDelete(achievement)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!achievementToDelete) return

		setIsLoading(true)
		try {
			await deleteAchievement(achievementToDelete.id).unwrap()
			toast.success('Достижение успешно удалено')
			setDeleteDialogOpen(false)
			setAchievementToDelete(null)
		} catch {
			toast.error('Ошибка при удалении достижения')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (data: AchievementFormData) => {
		if (!editingAchievement) return

		setIsLoading(true)
		try {
			// Обновление существующего достижения
			await updateAchievement({
				id: editingAchievement.id,
				data: {
					title: data.title,
					description: data.description || undefined,
					icon: data.icon || undefined,
					rarity: data.rarity as ApiAchievement['rarity'],
				},
			}).unwrap()
			toast.success('Достижение успешно обновлено')

			setIsDrawerOpen(false)
			setEditingAchievement(undefined)
		} catch {
			toast.error('Ошибка при обновлении достижения')
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setIsDrawerOpen(false)
		setEditingAchievement(undefined)
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<div>
				<h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
					Достижения
				</h1>
				<p className='text-sm text-muted-foreground sm:text-base'>
					Управление достижениями
				</p>
			</div>

			<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
				<DrawerContent>
					<div className='mx-auto w-full max-w-full md:max-w-[calc(100vw-var(--sidebar-width,16rem)-2rem)] lg:max-w-2xl px-4 sm:px-6'>
						<DrawerHeader>
							<DrawerTitle>Редактировать достижение</DrawerTitle>
							<DrawerDescription>
								Внесите изменения в информацию о достижении
							</DrawerDescription>
						</DrawerHeader>
						<div className='pb-4'>
							{editingAchievement && (
								<AchievementForm
									achievement={editingAchievement}
									onSubmit={handleSubmit}
									onCancel={handleCancel}
									isLoading={isLoading}
								/>
							)}
						</div>
					</div>
				</DrawerContent>
			</Drawer>

			<div className='rounded-lg border bg-card p-4 shadow-sm sm:p-6'>
				{(() => {
					if (isLoadingAchievements) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-muted-foreground'>
									Загрузка достижений...
								</p>
							</div>
						)
					}
					if (achievementsError) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-destructive'>
									Ошибка при загрузке достижений
								</p>
							</div>
						)
					}
					return (
						<AchievementsTable
							achievements={achievements}
							onEdit={handleEdit}
							onDelete={handleDeleteClick}
						/>
					)
				})()}
			</div>

			<DeleteAchievementDialog
				achievement={achievementToDelete}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={isLoading}
			/>
		</div>
	)
}
