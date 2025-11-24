'use client'

import { DeleteDialog } from '../shared/delete-dialog'
import { type HelpType } from './types'

interface DeleteHelpTypeDialogProps {
	readonly helpType: HelpType | null
	readonly open: boolean
	readonly onOpenChange: (open: boolean) => void
	readonly onConfirm: () => void
	readonly isLoading?: boolean
}

export function DeleteHelpTypeDialog(props: DeleteHelpTypeDialogProps) {
	return (
		<DeleteDialog {...props} item={props.helpType} itemType='вид помощи' />
	)
}

