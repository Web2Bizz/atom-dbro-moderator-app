'use client'

import { AlertTriangle } from 'lucide-react'

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DeleteDialogProps {
	item: { name: string } | null
	itemType: string
	open: boolean
	onOpenChange: (open: boolean) => void
	onConfirm: () => void
	isLoading?: boolean
}

export function DeleteDialog({
	item,
	itemType,
	open,
	onOpenChange,
	onConfirm,
	isLoading = false,
}: DeleteDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<div className='flex items-center gap-3'>
						<div className='flex size-10 items-center justify-center rounded-full bg-destructive/10'>
							<AlertTriangle className='size-5 text-destructive' />
						</div>
						<div className='flex-1'>
							<AlertDialogTitle>Удалить {itemType}?</AlertDialogTitle>
							<AlertDialogDescription className='mt-2'>
								Вы уверены, что хотите удалить {itemType}{' '}
								<span className='font-semibold text-foreground'>
									"{item?.name}"
								</span>
								? Это действие нельзя отменить.
							</AlertDialogDescription>
						</div>
					</div>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						disabled={isLoading}
						onClick={() => onOpenChange(false)}
					>
						Отмена
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isLoading}
						variant='destructive'
						className='bg-destructive/90 text-white hover:bg-destructive/80 dark:bg-destructive/80 dark:hover:bg-destructive/70'
					>
						{isLoading ? 'Удаление...' : 'Удалить'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

