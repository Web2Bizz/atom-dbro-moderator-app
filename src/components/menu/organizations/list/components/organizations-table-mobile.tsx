import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Table } from '@tanstack/react-table'
import {
	ChevronDown,
	ChevronRight,
	MapPin,
	MoreVertical,
	Trash2,
} from 'lucide-react'
import * as React from 'react'
import { type Organization } from '../../types'
import { OrganizationDetailsMobile } from './organization-details-mobile'
import { TablePagination } from './table-pagination'

interface OrganizationsTableMobileProps {
	table: Table<Organization>
	onDelete: (organization: Organization) => void
}

export function OrganizationsTableMobile({
	table,
	onDelete,
}: OrganizationsTableMobileProps) {
	const [mobileExpanded, setMobileExpanded] = React.useState<
		Record<number, boolean>
	>({})

	const filteredOrganizations = table
		.getFilteredRowModel()
		.rows.map(row => row.original)

	return (
		<div className='space-y-4'>
			<div className='space-y-3'>
				{filteredOrganizations.length > 0 ? (
					filteredOrganizations.map(organization => {
						const isExpanded = mobileExpanded[organization.id] || false

						return (
							<Card key={organization.id} className='overflow-hidden'>
								<CardContent className='p-0'>
									<div
										className='p-4 cursor-pointer active:bg-muted/50'
										onClick={() => {
											setMobileExpanded(prev => ({
												...prev,
												[organization.id]: !prev[organization.id],
											}))
										}}
										onKeyDown={e => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault()
												setMobileExpanded(prev => ({
													...prev,
													[organization.id]: !prev[organization.id],
												}))
											}
										}}
										tabIndex={0}
										role='button'
										aria-expanded={isExpanded}
									>
										<div className='flex items-start justify-between gap-3'>
											<div className='flex-1 space-y-2 min-w-0'>
												<div className='flex items-center gap-2'>
													<MapPin className='size-4 text-muted-foreground shrink-0' />
													<h3 className='font-semibold text-base truncate'>
														{organization.name}
													</h3>
												</div>
												<div className='space-y-1.5 text-sm'>
													<div className='flex items-center gap-2'>
														<span className='text-muted-foreground shrink-0'>
															Город:
														</span>
														<span className='truncate'>
															{organization.city.name}
														</span>
													</div>
													<div className='flex items-center gap-2'>
														<span className='text-muted-foreground shrink-0'>
															Адрес:
														</span>
														<span className='truncate'>
															{organization.address}
														</span>
													</div>
												</div>
											</div>
											<div className='flex items-center gap-1 shrink-0'>
												<Button
													variant='ghost'
													size='icon'
													className='size-8'
													onClick={e => {
														e.stopPropagation()
														setMobileExpanded(prev => ({
															...prev,
															[organization.id]: !prev[organization.id],
														}))
													}}
												>
													{isExpanded ? (
														<ChevronDown className='size-4' />
													) : (
														<ChevronRight className='size-4' />
													)}
												</Button>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant='ghost'
															className='data-[state=open]:bg-muted text-muted-foreground flex size-8'
															size='icon'
															onClick={e => e.stopPropagation()}
														>
															<MoreVertical className='size-4' />
															<span className='sr-only'>Открыть меню</span>
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align='end' className='w-40'>
														<DropdownMenuItem
															variant='destructive'
															onClick={e => {
																e.stopPropagation()
																onDelete(organization)
															}}
														>
															<Trash2 className='mr-2 size-4' />
															Удалить
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									</div>
									{isExpanded && (
										<OrganizationDetailsMobile organization={organization} />
									)}
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

			<TablePagination table={table} className='flex-1' />
		</div>
	)
}
