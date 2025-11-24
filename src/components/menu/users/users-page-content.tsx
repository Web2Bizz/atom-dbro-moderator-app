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
import { DeleteUserDialog } from './delete-user-dialog'
import { type User } from './types'
import { UserForm } from './user-form'
import { UsersTable } from './users-table'

// Моковые данные для демонстрации
const mockUsers: User[] = [
	{
		id: 1,
		firstName: 'Дениска',
		lastName: 'Мясников',
		middleName: 'Сергеевич',
		email: 'qwerty@yandex.ru',
		avatarUrls: {
			'9': 'http://82.202.140.37:12745/api/v1/3c69184c-336f-404d-bbaa-7bc1e3355f76?size=9',
		},
		role: 'пользователь',
		level: 1,
		experience: 50,
		questId: null,
		organisationId: null,
		createdAt: '2025-11-16T17:27:20.462Z',
		updatedAt: '2025-11-16T17:27:52.730Z',
	},
	{
		id: 2,
		firstName: 'Иван',
		lastName: 'Иванов',
		middleName: 'Иванович',
		email: 'ivan@example.com',
		avatarUrls: {},
		role: 'модератор',
		level: 5,
		experience: 250,
		questId: 1,
		organisationId: 1,
		createdAt: '2025-11-15T10:00:00.000Z',
		updatedAt: '2025-11-15T10:00:00.000Z',
	},
]

export function UsersPageContent() {
	const [users, setUsers] = React.useState<User[]>(mockUsers)
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingUser, setEditingUser] = React.useState<User | undefined>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [userToDelete, setUserToDelete] = React.useState<User | null>(null)

	const handleEdit = (user: User) => {
		setEditingUser(user)
		setIsDrawerOpen(true)
	}

	const handleDeleteClick = (user: User) => {
		setUserToDelete(user)
		setDeleteDialogOpen(true)
	}

	const handleDeleteConfirm = async () => {
		if (!userToDelete) return

		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 500))
			setUsers(prev => prev.filter(user => user.id !== userToDelete.id))
			toast.success('Пользователь успешно удален')
			setDeleteDialogOpen(false)
			setUserToDelete(null)
		} catch {
			toast.error('Ошибка при удалении пользователя')
		} finally {
			setIsLoading(false)
		}
	}

	const handleSubmit = async (data: {
		firstName: string
		lastName: string
		middleName?: string
		email: string
		avatarUrl?: string
		role: string
		level: number
		experience: number
		questId: number | null
		organisationId: number | null
	}) => {
		setIsLoading(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 1000))

			// Преобразуем avatarUrl обратно в avatarUrls объект
			const avatarUrls: Record<string, string> = data.avatarUrl
				? { '9': data.avatarUrl }
				: {}

			// Обновление существующего пользователя
			if (!editingUser) return

			const now = new Date().toISOString()
			setUsers(prev =>
				prev.map(user =>
					user.id === editingUser.id
						? {
								...data,
								middleName: data.middleName || '',
								id: editingUser.id,
								avatarUrls,
								createdAt: user.createdAt,
								updatedAt: now,
						  }
						: user
				)
			)
			toast.success('Пользователь успешно обновлен')

			setIsDrawerOpen(false)
			setEditingUser(undefined)
		} catch {
			toast.error('Ошибка при обновлении пользователя')
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setIsDrawerOpen(false)
		setEditingUser(undefined)
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>
			<div>
				<h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
					Пользователи
				</h1>
				<p className='text-sm text-muted-foreground sm:text-base'>
					Управление пользователями системы
				</p>
			</div>

			<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
				<DrawerContent>
					<div className='mx-auto w-full max-w-2xl px-4'>
						<DrawerHeader>
							<DrawerTitle>Редактировать пользователя</DrawerTitle>
							<DrawerDescription>
								Внесите изменения в информацию о пользователе
							</DrawerDescription>
						</DrawerHeader>
						<div className='pb-4'>
							{editingUser && (
								<UserForm
									user={editingUser}
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
				<UsersTable
					users={users}
					onEdit={handleEdit}
					onDelete={handleDeleteClick}
				/>
			</div>

			<DeleteUserDialog
				user={userToDelete}
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				onConfirm={handleDeleteConfirm}
				isLoading={isLoading}
			/>
		</div>
	)
}
