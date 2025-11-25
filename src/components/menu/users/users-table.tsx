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
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'
import * as React from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { type User } from './types'

interface UsersTableProps {
	users: User[]
	onEdit: (user: User) => void
	onDelete: (user: User) => void
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [rowSelection, setRowSelection] = React.useState({})
	const [globalFilter, setGlobalFilter] = React.useState('')
	const isMobile = useIsMobile()

	// Функция для получения URL аватара
	const getAvatarUrl = (avatarUrls: Record<string, string> | undefined) => {
		if (!avatarUrls) return undefined
		const sizes = Object.keys(avatarUrls)
			.map(Number)
			.sort((a, b) => b - a)
		return sizes.length > 0 ? avatarUrls[String(sizes[0])] : undefined
	}

	// Функция для получения инициалов
	const getInitials = (user: User) => {
		const first = user.firstName?.[0] || ''
		const last = user.lastName?.[0] || ''
		return `${first}${last}`.toUpperCase()
	}

	const columns: ColumnDef<User>[] = React.useMemo(
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
				header: 'Пользователь',
				cell: ({ row }) => {
					const user = row.original
					const fullName = `${user.lastName} ${user.firstName} ${
						user.middleName || ''
					}`.trim()
					const avatarUrl = getAvatarUrl(user.avatarUrls)

					return (
						<div className='flex items-center gap-3'>
							<Avatar className='size-10'>
								<AvatarImage src={avatarUrl} alt={fullName} />
								<AvatarFallback>{getInitials(user)}</AvatarFallback>
							</Avatar>
							<div>
								<div className='font-medium'>{fullName}</div>
								<div className='text-muted-foreground text-sm'>
									{user.email}
								</div>
							</div>
						</div>
					)
				},
			},
			{
				accessorKey: 'role',
				header: 'Роль',
				cell: ({ row }) => {
					const role = row.getValue('role') as string
					return (
						<Badge variant='outline' className='capitalize'>
							{role}
						</Badge>
					)
				},
			},
			{
				accessorKey: 'level',
				header: 'Уровень',
				cell: ({ row }) => {
					const level = row.getValue('level') as number
					return <div className='font-medium'>{level}</div>
				},
			},
			{
				accessorKey: 'experience',
				header: 'Опыт',
				cell: ({ row }) => {
					const experience = row.getValue('experience') as number
					return <div className='text-muted-foreground'>{experience}</div>
				},
			},
			{
				id: 'actions',
				cell: ({ row }) => {
					const user = row.original

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
								<DropdownMenuItem onClick={() => onEdit(user)}>
									<Pencil className='mr-2 size-4' />
									Редактировать
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									variant='destructive'
									onClick={() => onDelete(user)}
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
		data: users,
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

	const filteredUsers = table
		.getFilteredRowModel()
		.rows.map(row => row.original)

	if (isMobile) {
		return (
			<div className='space-y-4'>
				<Input
					placeholder='Поиск по имени или email...'
					value={globalFilter ?? ''}
					onChange={e => setGlobalFilter(e.target.value)}
					className='w-full'
				/>

				<div className='space-y-3'>
					{filteredUsers.length > 0 ? (
						filteredUsers.map(user => {
							const fullName = `${user.lastName} ${user.firstName} ${
								user.middleName || ''
							}`.trim()
							const avatarUrl = getAvatarUrl(user.avatarUrls)
							const createdAt = new Date(user.createdAt)

							return (
								<Card key={user.id} className='overflow-hidden'>
									<CardContent className='p-4'>
										<div className='flex items-start justify-between'>
											<div className='flex-1 space-y-2'>
												<div className='flex items-center gap-3'>
													<Avatar className='size-12'>
														<AvatarImage src={avatarUrl} alt={fullName} />
														<AvatarFallback>{getInitials(user)}</AvatarFallback>
													</Avatar>
													<div>
														<h3 className='font-semibold text-base'>
															{fullName}
														</h3>
														<p className='text-muted-foreground text-sm'>
															{user.email}
														</p>
													</div>
												</div>
												<div className='space-y-1 text-sm'>
													<div className='flex items-center gap-2'>
														<span className='text-muted-foreground'>Роль:</span>
														<Badge variant='outline' className='capitalize'>
															{user.role}
														</Badge>
													</div>
													<div className='flex items-center gap-2'>
														<span className='text-muted-foreground'>
															Уровень:
														</span>
														<span className='font-medium'>{user.level}</span>
													</div>
													<div className='flex items-center gap-2'>
														<span className='text-muted-foreground'>Опыт:</span>
														<span>{user.experience}</span>
													</div>
													<div className='flex items-center gap-2'>
														<span className='text-muted-foreground'>
															Создан:
														</span>
														<span>{createdAt.toLocaleDateString('ru-RU')}</span>
													</div>
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
													<DropdownMenuItem onClick={() => onEdit(user)}>
														<Pencil className='mr-2 size-4' />
														Редактировать
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														variant='destructive'
														onClick={() => onDelete(user)}
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
					placeholder='Поиск по имени или email...'
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
