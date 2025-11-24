import {
	ChevronDown,
	ChevronRight,
	MoreVertical,
	Pencil,
	Trash2,
} from 'lucide-react'
import { type ColumnDef } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Quest } from '../../types'

interface CreateColumnsParams {
	onEdit: (quest: Quest) => void
	onDelete: (quest: Quest) => void
}

export function createColumns({
	onEdit,
	onDelete,
}: CreateColumnsParams): ColumnDef<Quest>[] {
	return [
		{
			id: 'expander',
			header: () => null,
			cell: ({ row }) => {
				return (
					<Button
						variant='ghost'
						size='icon'
						className='size-8'
						onClick={e => {
							e.stopPropagation()
							row.toggleExpanded()
						}}
					>
						{row.getIsExpanded() ? (
							<ChevronDown className='size-4' />
						) : (
							<ChevronRight className='size-4' />
						)}
						<span className='sr-only'>Раскрыть</span>
					</Button>
				)
			},
			enableSorting: false,
			enableHiding: false,
		},
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
					aria-label='Выбрать все'
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={value => row.toggleSelected(!!value)}
					aria-label='Выбрать строку'
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},
		{
			accessorKey: 'title',
			header: 'Название',
			cell: ({ row }) => (
				<div
					className='font-medium truncate'
					title={row.getValue('title') as string}
				>
					{row.getValue('title')}
				</div>
			),
		},
		{
			accessorKey: 'city',
			header: 'Город',
			cell: ({ row }) => {
				const city = row.original.city
				return (
					<div className='text-muted-foreground truncate max-w-[120px]'>
						{city?.name || '—'}
					</div>
				)
			},
		},
		{
			accessorKey: 'categories',
			header: 'Категории',
			cell: ({ row }) => {
				const categories = row.original.categories
				if (!categories || categories.length === 0) {
					return <span className='text-muted-foreground'>—</span>
				}
				return (
					<div className='text-muted-foreground truncate max-w-[150px]'>
						{categories.map(c => c.name).join(', ')}
					</div>
				)
			},
		},
		{
			accessorKey: 'status',
			header: 'Статус',
			cell: ({ row }) => {
				const status = row.getValue('status') as string | undefined
				if (!status) return <span className='text-muted-foreground'>—</span>
				return (
					<div className='text-muted-foreground text-sm truncate max-w-[100px]'>
						{status}
					</div>
				)
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const quest = row.original

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='ghost'
								className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
								size='icon'
							>
								<MoreVertical className='size-4' />
								<span className='sr-only'>Открыть меню</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end' className='w-40'>
							<DropdownMenuItem onClick={() => onEdit(quest)}>
								<Pencil className='mr-2 size-4' />
								Редактировать
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								variant='destructive'
								onClick={() => onDelete(quest)}
							>
								<Trash2 className='mr-2 size-4' />
								Удалить
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
		},
	]
}

