import { CheckCircle2, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface EmptyStateProps {
	hasActiveFilters: boolean
	onClearFilters: () => void
}

export function EmptyState({ hasActiveFilters, onClearFilters }: EmptyStateProps) {
	return (
		<div className='flex flex-1 items-center justify-center'>
			<div className='rounded-lg border bg-card px-8 py-16 text-center shadow-sm'>
				{hasActiveFilters ? (
					<>
						<Search className='mx-auto mb-4 size-12 text-muted-foreground' />
						<p className='mb-2 text-base font-semibold sm:text-lg'>Ничего не найдено</p>
						<p className='text-sm text-muted-foreground'>
							Попробуйте изменить параметры поиска или фильтры
						</p>
						<Button variant='outline' size='sm' onClick={onClearFilters} className='mt-4'>
							Сбросить фильтры
						</Button>
					</>
				) : (
					<>
						<CheckCircle2 className='mx-auto mb-4 size-12 text-muted-foreground' />
						<p className='mb-2 text-base font-semibold sm:text-lg'>
							Нет организаций на модерации
						</p>
						<p className='text-sm text-muted-foreground'>
							Все организации проверены и обработаны
						</p>
					</>
				)}
			</div>
		</div>
	)
}

