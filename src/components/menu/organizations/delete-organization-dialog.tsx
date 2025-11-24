'use client'

import { DeleteDialog } from '../shared/delete-dialog'
import { type Organization } from './types'

interface DeleteOrganizationDialogProps {
	readonly organization: Organization | null
	readonly open: boolean
	readonly onOpenChange: (open: boolean) => void
	readonly onConfirm: () => void
	readonly isLoading?: boolean
}

export function DeleteOrganizationDialog(props: DeleteOrganizationDialogProps) {
	// Создаем объект с name для общего диалога
	const item = props.organization
		? {
				name: props.organization.name,
			}
		: null

	return <DeleteDialog {...props} item={item} itemType='организацию' />
}

