import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { type Organization } from '../../types'

interface TablePaginationProps {
	table: Table<Organization>
	className?: string
}

export function TablePagination({ table, className }: TablePaginationProps) {
	return (
		<div className={`flex flex-col gap-2 ${className || ''}`}>
			<div className='text-sm text-muted-foreground text-center sm:text-left'>
				Страница {table.getState().pagination.pageIndex + 1} из{' '}
				{table.getPageCount()}
			</div>
			<div className='flex items-center justify-center gap-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
					className={className?.includes('flex-1') ? 'flex-1' : ''}
				>
					Назад
				</Button>
				<Button
					variant='outline'
					size='sm'
					onClick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
					className={className?.includes('flex-1') ? 'flex-1' : ''}
				>
					Вперед
				</Button>
			</div>
		</div>
	)
}

