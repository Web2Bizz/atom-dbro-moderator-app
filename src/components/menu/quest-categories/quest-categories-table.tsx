'use client'

import { MoreVertical, Pencil, Trash2, Target } from 'lucide-react'
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useIsMobile } from '@/hooks/use-mobile'
import { type QuestCategory } from './types'

interface QuestCategoriesTableProps {
	questCategories: QuestCategory[]
	onEdit: (questCategory: QuestCategory) => void
	onDelete: (questCategory: QuestCategory) => void
}

export function QuestCategoriesTable({
	questCategories,
	onEdit,
	onDelete,
}: QuestCategoriesTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [rowSelection, setRowSelection] = React.useState({})
	const [globalFilter, setGlobalFilter] = React.useState('')
	const isMobile = useIsMobile()

	const columns: ColumnDef<QuestCategory>[] = React.useMemo(
		() => [
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
					<div className='font-medium'>{row.getValue('name')}</div>
				),
			},
			{
				id: 'actions',
				cell: ({ row }) => {
					const questCategory = row.original

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
								<DropdownMenuItem onClick={() => onEdit(questCategory)}>
									<Pencil className='mr-2 size-4' />
									Редактировать
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									variant='destructive'
									onClick={() => onDelete(questCategory)}
								>
									<Trash2 className='mr-2 size-4' />
									Удалить
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)
				},
			},
		],
		[onEdit, onDelete]
	)

	const table = useReactTable({
		data: questCategories,
		columns,
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: 'includesString',
		state: {
			sorting,
			rowSelection,
			globalFilter,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
	})

	const filteredQuestCategories = table
		.getFilteredRowModel()
		.rows.map(row => row.original)

	if (isMobile) {
		return (
			<div className='space-y-4'>
				<Input
					placeholder='Поиск по названию...'
					value={globalFilter ?? ''}
					onChange={e => setGlobalFilter(e.target.value)}
					className='w-full'
				/>

				<div className='space-y-3'>
					{filteredQuestCategories.length > 0 ? (
						filteredQuestCategories.map(questCategory => (
							<Card key={questCategory.id} className='overflow-hidden'>
								<CardContent className='p-4'>
									<div className='flex items-start justify-between'>
										<div className='flex-1 space-y-2'>
											<div className='flex items-center gap-2'>
												<Target className='size-4 text-muted-foreground' />
												<h3 className='font-semibold text-base'>
													{questCategory.name}
												</h3>
											</div>
										</div>
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
													onClick={() => onEdit(questCategory)}
												>
													<Pencil className='mr-2 size-4' />
													Редактировать
												</DropdownMenuItem>
												<DropdownMenuSeparator />
												<DropdownMenuItem
													variant='destructive'
													onClick={() => onDelete(questCategory)}
												>
													<Trash2 className='mr-2 size-4' />
													Удалить
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<div className='text-center py-8 text-muted-foreground'>
							Нет результатов.
						</div>
					)}
				</div>

				<div className='flex flex-col gap-2'>
					<div className='text-sm text-muted-foreground text-center'>
						Страница {table.getState().pagination.pageIndex + 1} из{' '}
						{table.getPageCount()}
					</div>
					<div className='flex items-center justify-center gap-2'>
						<Button
							variant='outline'
							size='sm'
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
							className='flex-1'
						>
							Назад
						</Button>
						<Button
							variant='outline'
							size='sm'
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
							className='flex-1'
						>
							Вперед
						</Button>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-4'>
			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<Input
					placeholder='Поиск по названию...'
					value={globalFilter ?? ''}
					onChange={e => setGlobalFilter(e.target.value)}
					className='w-full sm:max-w-sm'
				/>
				<div className='text-sm text-muted-foreground hidden sm:block'>
					{table.getFilteredSelectedRowModel().rows.length} из{' '}
					{table.getFilteredRowModel().rows.length} выбрано
				</div>
			</div>

			<div className='rounded-md border overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map(cell => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									Нет результатов.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
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
					>
						Назад
					</Button>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Вперед
					</Button>
				</div>
			</div>
		</div>
	)
}

