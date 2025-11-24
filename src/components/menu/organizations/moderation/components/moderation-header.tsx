interface ModerationHeaderProps {
	filteredCount: number
	totalCount: number
	hasActiveFilters: boolean
}

export function ModerationHeader({
	filteredCount,
	totalCount,
	hasActiveFilters,
}: ModerationHeaderProps) {
	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
				<div className='flex-1 min-w-0'>
					<h1 className='text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl'>
						Модерация организаций
					</h1>
					<p className='text-xs text-muted-foreground sm:text-sm lg:text-base'>
						Проверка и одобрение новых организаций
					</p>
				</div>
				<div className='flex items-center gap-2 sm:gap-4'>
					<div className='flex items-center gap-2 rounded-lg border bg-card px-3 py-2 sm:px-4'>
						<span className='text-muted-foreground text-sm font-medium'>
							Ожидают
						</span>
						<div className='flex flex-col min-w-0 text-right'>
							<span className='text-base font-semibold sm:text-lg'>
								{filteredCount}
								{hasActiveFilters && (
									<span className='text-muted-foreground font-normal'>
										{' '}
										/ {totalCount}
									</span>
								)}
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

