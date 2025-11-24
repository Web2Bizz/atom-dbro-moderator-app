import * as React from 'react'
import { flexRender, type Table } from '@tanstack/react-table'
import {
	Table as UITable,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { type Organization } from '../../types'
import { OrganizationDetails } from './organization-details'

interface OrganizationsTableDesktopProps {
	table: Table<Organization>
	columns: any[]
}

export function OrganizationsTableDesktop({
	table,
	columns,
}: OrganizationsTableDesktopProps) {
	return (
		<div className='rounded-md border w-full max-w-full overflow-hidden'>
			<UITable className='w-full'>
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
						table.getRowModel().rows.map(row => {
							const organization = row.original
							return (
								<React.Fragment key={row.id}>
									<TableRow
										data-state={row.getIsSelected() && 'selected'}
										className='cursor-pointer hover:bg-muted/50'
										onClick={e => {
											// Не раскрываем если клик был на кнопке действий, чекбоксе или кнопке раскрытия
											if (
												(e.target as HTMLElement).closest('button') ||
												(e.target as HTMLElement).closest(
													'input[type="checkbox"]'
												)
											) {
												return
											}
											row.toggleExpanded()
										}}
										onKeyDown={e => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault()
												row.toggleExpanded()
											}
										}}
										tabIndex={0}
										role='button'
										aria-expanded={row.getIsExpanded()}
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
									{row.getIsExpanded() && (
										<TableRow>
											<TableCell
												colSpan={columns.length}
												className='bg-muted/30 p-4 max-w-0'
											>
												<OrganizationDetails organization={organization} />
											</TableCell>
										</TableRow>
									)}
								</React.Fragment>
							)
						})
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
			</UITable>
		</div>
	)
}

