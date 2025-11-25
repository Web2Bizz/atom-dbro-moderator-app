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
import { type Organization } from '../types'
import { OrganizationsTableDesktop } from './components/organizations-table-desktop'
import { OrganizationsTableMobile } from './components/organizations-table-mobile'
import { createColumns } from './components/table-columns'
import { TablePagination } from './components/table-pagination'
import { TableSearch } from './components/table-search'

interface OrganizationsTableProps {
	organizations: Organization[]
	onDelete: (organization: Organization) => void
}

export function OrganizationsTable({
	organizations,
	onDelete,
}: OrganizationsTableProps) {
	const [sorting, setSorting] = React.useState<SortingState>([])
	const [rowSelection, setRowSelection] = React.useState({})
	const [expanded, setExpanded] = React.useState<ExpandedState>({})
	const [globalFilter, setGlobalFilter] = React.useState('')
	const isMobile = useIsMobile()

	const columns = React.useMemo(() => createColumns({ onDelete }), [onDelete])

	const table = useReactTable({
		data: organizations,
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
				<OrganizationsTableMobile table={table} onDelete={onDelete} />
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

			<OrganizationsTableDesktop table={table} columns={columns} />

			<TablePagination
				table={table}
				className='sm:flex-row sm:items-center sm:justify-between'
			/>
		</div>
	)
}
