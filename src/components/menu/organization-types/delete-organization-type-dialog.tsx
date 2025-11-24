'use client'

import { DeleteDialog } from '../shared/delete-dialog'
import { type OrganizationType } from './types'

interface DeleteOrganizationTypeDialogProps {
	readonly organizationType: OrganizationType | null
	readonly open: boolean
	readonly onOpenChange: (open: boolean) => void
	readonly onConfirm: () => void
	readonly isLoading?: boolean
}

export function DeleteOrganizationTypeDialog(
	props: DeleteOrganizationTypeDialogProps
) {
	return (
		<DeleteDialog
			{...props}
			item={props.organizationType}
			itemType='тип организации'
		/>
	)
}

