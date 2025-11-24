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
import { type Quest } from '../../types'
import { QuestDetails } from './quest-details'

interface QuestsTableDesktopProps {
	table: Table<Quest>
	columns: any[]
}

export function QuestsTableDesktop({
	table,
	columns,
}: QuestsTableDesktopProps) {
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
							const quest = row.original
							return (
								<React.Fragment key={row.id}>
									<TableRow
										data-state={row.getIsSelected() && 'selected'}
										className='cursor-pointer hover:bg-muted/50'
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
												className='p-0 bg-muted/30'
											>
												<QuestDetails quest={quest} />
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

