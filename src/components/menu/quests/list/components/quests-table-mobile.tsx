import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Table } from '@tanstack/react-table'
import {
	ChevronDown,
	ChevronRight,
	MoreVertical,
	Pencil,
	Target,
	Trash2,
} from 'lucide-react'
import * as React from 'react'
import { type Quest } from '../../types'
import { QuestDetailsMobile } from './quest-details-mobile'
import { TablePagination } from './table-pagination'

interface QuestsTableMobileProps {
	table: Table<Quest>
	onEdit: (quest: Quest) => void
	onDelete: (quest: Quest) => void
}

export function QuestsTableMobile({
	table,
	onEdit,
	onDelete,
}: QuestsTableMobileProps) {
	const [mobileExpanded, setMobileExpanded] = React.useState<
		Record<number, boolean>
	>({})

	// Используем getRowModel() вместо getFilteredRowModel() для получения только строк текущей страницы
	const paginatedQuests = table.getRowModel().rows.map(row => row.original)

	return (
		<div className='space-y-4'>
			<div className='space-y-3'>
				{paginatedQuests.length > 0 ? (
					paginatedQuests.map(quest => {
						const isExpanded = mobileExpanded[quest.id] || false

						return (
							<Card key={quest.id} className='overflow-hidden'>
								<CardContent className='p-4'>
									<div className='flex items-start justify-between gap-4'>
										<div className='flex-1 space-y-2 min-w-0'>
											<div className='flex items-center gap-2'>
												<Target className='size-4 text-muted-foreground shrink-0' />
												<h3 className='font-semibold text-base truncate'>
													{quest.title}
												</h3>
											</div>
											<div className='flex items-center gap-2 flex-wrap'>
												{quest.categories &&
													quest.categories.length > 0 &&
													quest.categories.map(category => (
														<Badge
															key={category.id}
															variant='outline'
															className='text-xs'
														>
															{category.name}
														</Badge>
													))}
												{quest.status && (
													<Badge variant='secondary' className='text-xs'>
														{quest.status}
													</Badge>
												)}
												{quest.city && (
													<span className='text-xs text-muted-foreground'>
														{quest.city.name}
													</span>
												)}
											</div>
											{isExpanded && <QuestDetailsMobile quest={quest} />}
										</div>
										<div className='flex items-start gap-2 shrink-0'>
											<Button
												variant='ghost'
												size='icon'
												className='size-8'
												onClick={() =>
													setMobileExpanded(prev => ({
														...prev,
														[quest.id]: !prev[quest.id],
													}))
												}
											>
												{isExpanded ? (
													<ChevronDown className='size-4' />
												) : (
													<ChevronRight className='size-4' />
												)}
												<span className='sr-only'>Раскрыть</span>
											</Button>
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
										</div>
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
			<TablePagination table={table} className='flex-1' />
		</div>
	)
}
