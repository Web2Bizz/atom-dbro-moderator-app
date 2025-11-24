import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface RejectDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	organizationName?: string
	reason: string
	onReasonChange: (value: string) => void
	onConfirm: () => void
	isLoading: boolean
}

export function RejectDialog({
	open,
	onOpenChange,
	organizationName,
	reason,
	onReasonChange,
	onConfirm,
	isLoading,
}: RejectDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Отклонить организацию</DialogTitle>
					<p className='text-sm text-muted-foreground'>
						Укажите причину отклонения
						{organizationName && <span className='font-semibold'> «{organizationName}»</span>}
					</p>
				</DialogHeader>
				<div className='space-y-4 py-4'>
					<div className='space-y-2'>
						<Label htmlFor='reject-reason'>
							Причина отклонения <span className='text-destructive'>*</span>
						</Label>
						<Textarea
							id='reject-reason'
							placeholder='Например: Недостаточно информации, нарушение правил, несоответствие требованиям...'
							value={reason}
							onChange={e => onReasonChange(e.target.value)}
							rows={5}
							className='resize-none'
						/>
						<p className='text-xs text-muted-foreground'>
							Причина будет отправлена создателю организации
						</p>
					</div>
				</div>
				<DialogFooter>
					<Button
						variant='outline'
						onClick={() => {
							onReasonChange('')
							onOpenChange(false)
						}}
						disabled={isLoading}
					>
						Отмена
					</Button>
					<Button variant='destructive' onClick={onConfirm} disabled={isLoading || !reason.trim()}>
						{isLoading ? 'Отклонение...' : 'Отклонить организацию'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

