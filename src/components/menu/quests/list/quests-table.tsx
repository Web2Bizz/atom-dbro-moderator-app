'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import {
	type ExpandedState,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from '@tanstack/react-table'
import * as React from 'react'
import { type Quest } from '../types'
import { QuestsTableDesktop } from './components/quests-table-desktop'
import { QuestsTableMobile } from './components/quests-table-mobile'
import { createColumns } from './components/table-columns'
import { TablePagination } from './components/table-pagination'
import { TableSearch } from './components/table-search'

interface QuestsTableProps {
	quests: Quest[]
	onEdit: (quest: Quest) => void
	onDelete: (quest: Quest) => void
}

export function QuestsTable({ quests, onEdit, onDelete }: QuestsTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [rowSelection, setRowSelection] = React.useState({})
	const [expanded, setExpanded] = React.useState<ExpandedState>({})
	const [globalFilter, setGlobalFilter] = React.useState('')
	const isMobile = useIsMobile()

	const columns = React.useMemo(
		() => createColumns({ onEdit, onDelete }),
		[onEdit, onDelete]
	)

	const table = useReactTable({
		data: quests,
		columns,
		onSortingChange: setSorting,
		onRowSelectionChange: setRowSelection,
		onExpandedChange: setExpanded,
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getExpandedRowModel: getExpandedRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		globalFilterFn: 'includesString',
		state: {
			sorting,
			rowSelection,
			expanded,
			globalFilter,
		},
		initialState: {
			pagination: {
				pageSize: 10,
			},
		},
		autoResetPageIndex: false,
	})

	if (isMobile) {
		return (
			<div className='space-y-4'>
				<TableSearch
					value={globalFilter ?? ''}
					onChange={setGlobalFilter}
					className='w-full'
				/>
				<QuestsTableMobile table={table} onEdit={onEdit} onDelete={onDelete} />
			</div>
		)
	}

	return (
		<div className='space-y-4 w-full overflow-hidden'>
			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<TableSearch
					value={globalFilter ?? ''}
					onChange={setGlobalFilter}
					className='w-full sm:max-w-sm'
				/>
				<div className='text-sm text-muted-foreground hidden sm:block'>
					{table.getFilteredSelectedRowModel().rows.length} из{' '}
					{table.getFilteredRowModel().rows.length} выбрано
				</div>
			</div>

			<QuestsTableDesktop table={table} columns={columns} />

			<TablePagination
				table={table}
				className='sm:flex-row sm:items-center sm:justify-between'
			/>
		</div>
	)
}
