'use client'

import { DeleteDialog } from '../shared/delete-dialog'
import { type QuestCategory } from './types'

interface DeleteQuestCategoryDialogProps {
	readonly questCategory: QuestCategory | null
	readonly open: boolean
	readonly onOpenChange: (open: boolean) => void
	readonly onConfirm: () => void
	readonly isLoading?: boolean
}

export function DeleteQuestCategoryDialog(
	props: DeleteQuestCategoryDialogProps
) {
	return (
		<DeleteDialog
			{...props}
			item={props.questCategory}
			itemType='категорию квеста'
		/>
	)
}

