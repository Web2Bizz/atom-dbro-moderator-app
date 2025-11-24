'use client'

import { DeleteDialog } from '../shared/delete-dialog'
import { type User } from './types'

interface DeleteUserDialogProps {
	readonly user: User | null
	readonly open: boolean
	readonly onOpenChange: (open: boolean) => void
	readonly onConfirm: () => void
	readonly isLoading?: boolean
}

export function DeleteUserDialog(props: DeleteUserDialogProps) {
	// Создаем объект с name для общего диалога
	const item = props.user
		? {
				name: `${props.user.lastName} ${props.user.firstName} ${props.user.middleName || ''}`.trim(),
			}
		: null

	return <DeleteDialog {...props} item={item} itemType='пользователя' />
}

