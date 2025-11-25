'use client'

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
import { MoreVertical, Pencil, Trash2, Trophy } from 'lucide-react'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
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
import { type Achievement } from './types'

interface AchievementsTableProps {
	achievements: Achievement[]
	quests: Array<{ id: number; name: string }>
	onEdit: (achievement: Achievement) => void
	onDelete: (achievement: Achievement) => void
}

const rarityConfig: Record<string, { label: string; className: string }> = {
	private: {
		label: 'Приватное',
		className:
			'bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400',
	},
	common: {
		label: 'Обычное',
		className:
			'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
	},
	rare: {
		label: 'Редкое',
		className:
			'bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400',
	},
	epic: {
		label: 'Эпическое',
		className:
			'bg-pink-500/10 text-pink-600 border-pink-500/20 dark:text-pink-400',
	},
	legendary: {
		label: 'Легендарное',
		className:
			'bg-orange-500/10 text-orange-600 border-orange-500/20 dark:text-orange-400',
	},
}

export function AchievementsTable({
	achievements,
	quests,
	onEdit,
	onDelete,
}: AchievementsTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [rowSelection, setRowSelection] = React.useState({})
	const [globalFilter, setGlobalFilter] = React.useState('')
	const isMobile = useIsMobile()

	const getRarityInfo = (rarity: string) => {
		return (
			rarityConfig[rarity] || {
				label: rarity,
				className: 'bg-muted text-muted-foreground',
			}
		)
	}

	const columns: ColumnDef<Achievement>[] = React.useMemo(
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
				accessorKey: 'icon',
				header: 'Иконка',
				cell: ({ row }) => (
					<div className='text-2xl'>{row.getValue('icon')}</div>
				),
			},
			{
				accessorKey: 'title',
				header: 'Название',
				cell: ({ row }) => (
					<div className='font-medium'>{row.getValue('title')}</div>
				),
			},
			{
				accessorKey: 'description',
				header: 'Описание',
				cell: ({ row }) => {
					const description = row.getValue('description') as string
					return (
						<div className='max-w-[300px] truncate text-muted-foreground'>
							{description}
						</div>
					)
				},
			},
			{
				accessorKey: 'rarity',
				header: 'Редкость',
				cell: ({ row }) => {
					const rarity = row.getValue('rarity') as string
					const rarityInfo = getRarityInfo(rarity)
					return (
						<Badge variant='outline' className={rarityInfo.className}>
							{rarityInfo.label}
						</Badge>
					)
				},
			},
			{
				id: 'actions',
				cell: ({ row }) => {
					const achievement = row.original

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
								<DropdownMenuItem onClick={() => onEdit(achievement)}>
									<Pencil className='mr-2 size-4' />
									Редактировать
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									variant='destructive'
									onClick={() => onDelete(achievement)}
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
		[onEdit, onDelete, quests]
	)

	const table = useReactTable({
		data: achievements,
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
		autoResetPageIndex: false,
	})

	const filteredAchievements = table
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
					{filteredAchievements.length > 0 ? (
						filteredAchievements.map(achievement => {
							const rarityInfo = getRarityInfo(achievement.rarity)
							return (
								<Card key={achievement.id} className='overflow-hidden'>
									<CardContent className='p-4'>
										<div className='flex items-start justify-between gap-4'>
											<div className='flex-1 space-y-2'>
												<div className='flex items-center gap-2'>
													<span className='text-2xl'>{achievement.icon}</span>
													<Trophy className='size-4 text-muted-foreground' />
													<h3 className='font-semibold text-base'>
														{achievement.title}
													</h3>
												</div>
												<p className='text-sm text-muted-foreground line-clamp-2'>
													{achievement.description}
												</p>
												<Badge
													variant='outline'
													className={rarityInfo.className}
												>
													{rarityInfo.label}
												</Badge>
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
													<DropdownMenuItem onClick={() => onEdit(achievement)}>
														<Pencil className='mr-2 size-4' />
														Редактировать
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														variant='destructive'
														onClick={() => onDelete(achievement)}
													>
														<Trash2 className='mr-2 size-4' />
														Удалить
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</div>
									</CardContent>
								</Card>
							)
						})
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
