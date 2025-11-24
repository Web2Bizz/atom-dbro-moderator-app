'use client'

import { DeleteDialog } from '../shared/delete-dialog'
import { type Region } from './types'

interface DeleteRegionDialogProps {
	readonly region: Region | null
	readonly open: boolean
	readonly onOpenChange: (open: boolean) => void
	readonly onConfirm: () => void
	readonly isLoading?: boolean
}

export function DeleteRegionDialog(props: DeleteRegionDialogProps) {
	return <DeleteDialog {...props} item={props.region} itemType='регион' />
}
