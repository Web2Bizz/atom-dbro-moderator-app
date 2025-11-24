'use client'

import { DeleteDialog } from '../shared/delete-dialog'
import { type City } from './types'

interface DeleteCityDialogProps {
	readonly city: City | null
	readonly open: boolean
	readonly onOpenChange: (open: boolean) => void
	readonly onConfirm: () => void
	readonly isLoading?: boolean
}

export function DeleteCityDialog(props: DeleteCityDialogProps) {
	return <DeleteDialog {...props} item={props.city} itemType='город' />
}
