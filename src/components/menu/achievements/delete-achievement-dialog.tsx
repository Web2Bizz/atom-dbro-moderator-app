'use client'

import { DeleteDialog } from '../shared/delete-dialog'
import { type Achievement } from './types'

interface DeleteAchievementDialogProps {
	readonly achievement: Achievement | null
	readonly open: boolean
	readonly onOpenChange: (open: boolean) => void
	readonly onConfirm: () => void
	readonly isLoading?: boolean
}

export function DeleteAchievementDialog(props: DeleteAchievementDialogProps) {
	return (
		<DeleteDialog
			{...props}
			item={
				props.achievement
					? { name: props.achievement.title }
					: null
			}
			itemType='достижение'
		/>
	)
}

