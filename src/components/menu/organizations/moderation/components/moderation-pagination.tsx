import { Button } from '@/components/ui/button'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
} from '@/components/ui/pagination'

interface ModerationPaginationProps {
	readonly currentPage: number
	readonly totalPages: number
	readonly onPageChange: (page: number) => void
	readonly className?: string
}

export function ModerationPagination({
	currentPage,
	totalPages,
	onPageChange,
	className,
}: ModerationPaginationProps) {
	// Всегда показываем пагинацию, если есть хотя бы одна страница
	if (!totalPages || totalPages < 1) return null

	// Показываем максимум 7 страниц вокруг текущей
	const getVisiblePages = (): number[] => {
		const maxVisible = 7
		if (totalPages <= maxVisible) {
			return Array.from({ length: totalPages }, (_, i) => i + 1)
		}

		const start = Math.max(1, currentPage - 3)
		const end = Math.min(totalPages, start + maxVisible - 1)

		return Array.from({ length: end - start + 1 }, (_, i) => start + i)
	}

	const visiblePages = getVisiblePages()

	return (
		<div
			className={`flex flex-col gap-2 mt-4 sm:flex-row sm:items-center sm:justify-between ${
				className || ''
			}`}
		>
			<div className='text-sm text-muted-foreground text-center sm:text-left'>
				Страница {currentPage} из {totalPages}
			</div>
			<div className='flex items-center justify-center gap-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Назад
				</Button>
				<Pagination>
					<PaginationContent>
						{visiblePages.map(page => (
							<PaginationItem key={`page-${page}`}>
								<PaginationLink
									href='#'
									onClick={e => {
										e.preventDefault()
										onPageChange(page)
									}}
									isActive={currentPage === page}
									className='cursor-pointer'
								>
									{page}
								</PaginationLink>
							</PaginationItem>
						))}
					</PaginationContent>
				</Pagination>
				<Button
					variant='outline'
					size='sm'
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Вперед
				</Button>
			</div>
		</div>
	)
}
