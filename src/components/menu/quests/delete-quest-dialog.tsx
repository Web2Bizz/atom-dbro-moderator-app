'use client'

import { DeleteDialog } from '../shared/delete-dialog'
import { type Quest } from './types'

interface DeleteQuestDialogProps {
	readonly quest: Quest | null
	readonly open: boolean
	readonly onOpenChange: (open: boolean) => void
	readonly onConfirm: () => void
	readonly isLoading?: boolean
}

export function DeleteQuestDialog(props: DeleteQuestDialogProps) {
	// Создаем объект с name для общего диалога
	const item = props.quest
		? {
				name: props.quest.title,
			}
		: null

	return <DeleteDialog {...props} item={item} itemType='квест' />
}

