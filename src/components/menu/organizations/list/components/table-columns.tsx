import { type ColumnDef } from '@tanstack/react-table'
import { ChevronDown, ChevronRight, MoreVertical, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Organization } from '../../types'

interface CreateColumnsParams {
	onDelete: (organization: Organization) => void
}

export function createColumns({
	onDelete,
}: CreateColumnsParams): ColumnDef<Organization>[] {
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
			accessorKey: 'name',
			header: 'Название',
			cell: ({ row }) => (
				<div
					className='font-medium truncate'
					title={row.getValue('name') as string}
				>
					{row.getValue('name')}
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
						{city.name}
					</div>
				)
			},
		},
		{
			accessorKey: 'address',
			header: 'Адрес',
			cell: ({ row }) => {
				const address = row.getValue('address') as string
				return (
					<div
						className='text-muted-foreground text-sm truncate max-w-[200px]'
						title={address}
					>
						{address}
					</div>
				)
			},
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				const organization = row.original

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
							<DropdownMenuItem
								variant='destructive'
								onClick={() => onDelete(organization)}
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
