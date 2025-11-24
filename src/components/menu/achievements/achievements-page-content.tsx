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
import { AchievementsTable } from './achievements-table'
import { AchievementForm } from './achievement-form'
import { DeleteAchievementDialog } from './delete-achievement-dialog'
import { type Achievement, type AchievementFormData } from './types'

// Моковые данные для демонстрации
const mockAchievements: Achievement[] = [
	{
		id: 7,
		title: '22324242342342232424234234',
		description: '22324242342342232424234234',
		icon: '🏆',
		rarity: 'private',
		questId: 3,
		recordStatus: 'CREATED',
		createdAt: '2025-11-16T11:13:25.814Z',
		updatedAt: '2025-11-16T11:13:25.814Z',
	},
	{
		id: 8,
		title: 'Первое достижение',
		description: 'Описание первого достижения',
		icon: '⭐',
		rarity: 'common',
		questId: 1,
		recordStatus: 'CREATED',
		createdAt: '2025-11-16T11:13:25.814Z',
		updatedAt: '2025-11-16T11:13:25.814Z',
	},
	{
		id: 9,
		title: 'Экологический герой',
		description: 'Помог природе',
		icon: '🌱',
		rarity: 'rare',
		questId: 2,
		recordStatus: 'CREATED',
		createdAt: '2025-11-16T11:13:25.814Z',
		updatedAt: '2025-11-16T11:13:25.814Z',
	},
]

// Моковые данные для квестов (для селекта)
const mockQuests = [
	{ id: 1, name: 'Квест 1' },
	{ id: 2, name: 'Квест 2' },
	{ id: 3, name: 'Квест 3' },
]

export function AchievementsPageContent() {
	const [achievements, setAchievements] = React.useState<Achievement[]>(
		mockAchievements
	)
	const [quests] = React.useState(mockQuests)
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingAchievement, setEditingAchievement] =
		React.useState<Achievement | undefined>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [achievementToDelete, setAchievementToDelete] =
		React.useState<Achievement | null>(null)

	const handleCreate = () => {
		setEditingAchievement(undefined)
		setIsDrawerOpen(true)
	}

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
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 500))
			setAchievements(prev =>
				prev.filter(a => a.id !== achievementToDelete.id)
			)
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
		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 1000))

			if (editingAchievement) {
				// Обновление существующего достижения
				setAchievements(prev =>
					prev.map(a =>
						a.id === editingAchievement.id
							? {
									...data,
									id: editingAchievement.id,
									recordStatus: a.recordStatus,
									createdAt: a.createdAt,
									updatedAt: new Date().toISOString(),
							  }
							: a
					)
				)
				toast.success('Достижение успешно обновлено')
			} else {
				// Создание нового достижения
				const newAchievement: Achievement = {
					...data,
					id: Math.max(...achievements.map(a => a.id), 0) + 1,
					recordStatus: 'CREATED',
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				}
				setAchievements(prev => [...prev, newAchievement])
				toast.success('Достижение успешно создано')
			}

			setIsDrawerOpen(false)
			setEditingAchievement(undefined)
		} catch {
			toast.error(
				`Ошибка при ${editingAchievement ? 'обновлении' : 'создании'} достижения`
			)
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
			<div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
				<div>
					<h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
						Достижения
					</h1>
					<p className='text-sm text-muted-foreground sm:text-base'>
						Управление достижениями
					</p>
				</div>
				<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
					<DrawerTrigger asChild>
						<Button onClick={handleCreate} className='w-full sm:w-auto'>
							<Plus className='mr-2 size-4' />
							Добавить достижение
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<div className='mx-auto w-full max-w-full md:max-w-[calc(100vw-var(--sidebar-width,16rem)-2rem)] lg:max-w-2xl px-4 sm:px-6'>
							<DrawerHeader>
								<DrawerTitle>
									{editingAchievement
										? 'Редактировать достижение'
										: 'Создать достижение'}
								</DrawerTitle>
								<DrawerDescription>
									{editingAchievement
										? 'Внесите изменения в информацию о достижении'
										: 'Заполните форму для добавления нового достижения'}
								</DrawerDescription>
							</DrawerHeader>
							<div className='pb-4'>
								<AchievementForm
									achievement={editingAchievement}
									quests={quests}
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
				<AchievementsTable
					achievements={achievements}
					quests={quests}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
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

