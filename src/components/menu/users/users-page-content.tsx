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
	useDeleteUserMutation,
	useGetUsersQuery,
	useUpdateUserV2Mutation,
	type User as ApiUser,
} from '@/store/entities'
import { DeleteUserDialog } from './delete-user-dialog'
import { type User } from './types'
import { UserForm } from './user-form'
import { UsersTable } from './users-table'

// Преобразуем пользователя из API в формат компонента
const mapApiUserToComponentUser = (
	apiUser: ApiUser & { role?: string }
): User => {
	// Преобразуем роль из API формата в читаемый формат
	// API может возвращать как "USER"/"ADMIN", так и "пользователь"/"администратор"
	const roleMap: Record<string, string> = {
		USER: 'пользователь',
		ADMIN: 'администратор',
		пользователь: 'пользователь',
		администратор: 'администратор',
	}

	// Определяем роль: если это английский формат - преобразуем, иначе используем как есть
	let role = 'пользователь'
	if (apiUser.role) {
		const normalizedRole = apiUser.role.toUpperCase()
		if (normalizedRole === 'USER' || normalizedRole === 'ADMIN') {
			// Английский формат - преобразуем
			role = roleMap[apiUser.role] || 'пользователь'
		} else {
			// Уже русский формат - используем как есть
			role = roleMap[apiUser.role] || apiUser.role || 'пользователь'
		}
	}

	return {
		id: apiUser.id,
		firstName: apiUser.firstName,
		lastName: apiUser.lastName,
		middleName: apiUser.middleName || '',
		email: apiUser.email,
		avatarUrls: apiUser.avatarUrls || {},
		role,
		level: apiUser.level || 1,
		experience: apiUser.experience || 0,
		questId: null, // API не возвращает questId
		organisationId: apiUser.organisationId || null,
		createdAt: apiUser.createdAt || new Date().toISOString(),
		updatedAt: apiUser.updatedAt || new Date().toISOString(),
	}
}

export function UsersPageContent() {
	const {
		data: usersData,
		isLoading: isLoadingUsers,
		error: usersError,
	} = useGetUsersQuery()

	const [updateUser] = useUpdateUserV2Mutation()
	const [deleteUser] = useDeleteUserMutation()

	const users = React.useMemo(() => {
		if (!usersData) return []
		return usersData.map(mapApiUserToComponentUser)
	}, [usersData])

	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
	const [editingUser, setEditingUser] = React.useState<User | undefined>()
	const [isLoading, setIsLoading] = React.useState(false)
	const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
	const [userToDelete, setUserToDelete] = React.useState<User | null>(null)

	React.useEffect(() => {
		if (usersError) {
			toast.error('Ошибка при загрузке пользователей')
		}
	}, [usersError])

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
			await deleteUser(userToDelete.id).unwrap()
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
		role: string
	}) => {
		if (!editingUser) return

		setIsLoading(true)
		try {
			// Преобразуем роль обратно в формат API
			const roleMap: Record<string, 'USER' | 'ADMIN'> = {
				пользователь: 'USER',
				администратор: 'ADMIN',
			}

			// Подготавливаем данные для обновления
			const updateData: {
				firstName: string
				lastName: string
				middleName?: string
				email: string
				role?: 'USER' | 'ADMIN'
			} = {
				firstName: data.firstName,
				lastName: data.lastName,
				middleName: data.middleName,
				email: data.email,
			}

			// Добавляем роль
			if (data.role) {
				updateData.role = roleMap[data.role] || 'USER'
			}

			await updateUser({
				id: editingUser.id,
				data: updateData,
			}).unwrap()

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
				{(() => {
					if (isLoadingUsers) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-muted-foreground'>
									Загрузка пользователей...
								</p>
							</div>
						)
					}
					if (usersError) {
						return (
							<div className='flex items-center justify-center py-8'>
								<p className='text-sm text-destructive'>
									Ошибка при загрузке пользователей
								</p>
							</div>
						)
					}
					return (
						<UsersTable
							users={users}
							onEdit={handleEdit}
							onDelete={handleDeleteClick}
						/>
					)
				})()}
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
