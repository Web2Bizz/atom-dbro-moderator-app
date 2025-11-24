import * as React from 'react'

import { Filter, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

interface FiltersBarProps {
	searchQuery: string
	onSearchChange: (value: string) => void
	selectedCity: string
	onCityChange: (value: string) => void
	selectedType: string
	onTypeChange: (value: string) => void
	sortBy: 'date' | 'name'
	onSortChange: (value: 'date' | 'name') => void
	cities: string[]
	organizationTypes: string[]
	hasActiveFilters: boolean
	onClearFilters: () => void
}

export function FiltersBar({
	searchQuery,
	onSearchChange,
	selectedCity,
	onCityChange,
	selectedType,
	onTypeChange,
	sortBy,
	onSortChange,
	cities,
	organizationTypes,
	hasActiveFilters,
	onClearFilters,
}: FiltersBarProps) {
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

	const filterCounter = [
		searchQuery && 1,
		selectedCity !== 'all' && 1,
		selectedType !== 'all' && 1,
	].filter(Boolean).length

	return (
		<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4'>
			{/* Поиск */}
			<div className='relative flex-1 min-w-0 xl:flex-1'>
				<Input
					placeholder='Поиск по названию, описанию, городу...'
					value={searchQuery}
					onChange={e => onSearchChange(e.target.value)}
					className='pl-9 pr-9'
				/>
				{searchQuery && (
					<button
						onClick={() => onSearchChange('')}
						className='absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:bg-muted'
					>
						<X className='size-4' />
					</button>
				)}
			</div>

			{/* Фильтры на мобильных и средних экранах */}
			<Drawer
				open={isDrawerOpen}
				onOpenChange={setIsDrawerOpen}
				direction='bottom'
			>
				<DrawerTrigger asChild>
					<Button
						variant='outline'
						className='xl:hidden shrink-0 whitespace-nowrap'
						size='sm'
					>
						<Filter className='mr-2 size-4' />
						Фильтры
						{hasActiveFilters && (
							<span className='ml-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground'>
								{filterCounter}
							</span>
						)}
					</Button>
				</DrawerTrigger>
				<DrawerContent className='max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
					<div className='mx-auto w-full max-w-md px-4 sm:px-6'>
						<DrawerHeader className='text-center'>
							<DrawerTitle>Фильтры</DrawerTitle>
							<DrawerDescription>
								Настройте параметры поиска организаций
							</DrawerDescription>
						</DrawerHeader>
						<div className='mt-6 space-y-4 pb-6'>
							<div className='space-y-2'>
								<Label>Город</Label>
								<Select value={selectedCity} onValueChange={onCityChange}>
									<SelectTrigger>
										<SelectValue placeholder='Все города' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>Все города</SelectItem>
										{cities.map(city => (
											<SelectItem key={city} value={city}>
												{city}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<Label>Тип организации</Label>
								<Select value={selectedType} onValueChange={onTypeChange}>
									<SelectTrigger>
										<SelectValue placeholder='Все типы' />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='all'>Все типы</SelectItem>
										{organizationTypes.map(type => (
											<SelectItem key={type} value={type}>
												{type}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className='space-y-2'>
								<Label>Сортировка</Label>
								<Select
									value={sortBy}
									onValueChange={value =>
										onSortChange(value as 'date' | 'name')
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value='date'>По дате создания</SelectItem>
										<SelectItem value='name'>По названию</SelectItem>
									</SelectContent>
								</Select>
							</div>

							{hasActiveFilters && (
								<Button
									variant='outline'
									onClick={() => {
										onClearFilters()
										setIsDrawerOpen(false)
									}}
									className='w-full'
								>
									<X className='mr-2 size-4' />
									Сбросить фильтры
								</Button>
							)}
						</div>
					</div>
				</DrawerContent>
			</Drawer>

			{/* Фильтры на больших экранах */}
			<div className='hidden items-center gap-2 xl:flex shrink-0'>
				<Select value={selectedCity} onValueChange={onCityChange}>
					<SelectTrigger className='w-[160px]'>
						<SelectValue placeholder='Все города' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Все города</SelectItem>
						{cities.map(city => (
							<SelectItem key={city} value={city}>
								{city}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={selectedType} onValueChange={onTypeChange}>
					<SelectTrigger className='w-[180px]'>
						<SelectValue placeholder='Все типы' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>Все типы</SelectItem>
						{organizationTypes.map(type => (
							<SelectItem key={type} value={type}>
								{type}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={sortBy}
					onValueChange={value => onSortChange(value as 'date' | 'name')}
				>
					<SelectTrigger className='w-[160px]'>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='date'>По дате</SelectItem>
						<SelectItem value='name'>По названию</SelectItem>
					</SelectContent>
				</Select>

				{hasActiveFilters && (
					<Button
						variant='ghost'
						size='icon'
						onClick={onClearFilters}
						title='Сбросить фильтры'
						className='shrink-0'
					>
						<X className='size-4' />
					</Button>
				)}
			</div>
		</div>
	)
}
