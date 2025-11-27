'use client'

import { DashboardStats } from './dashboard-stats'
import { useGetStatisticsQuery } from '@/store/entities'

export function DashboardPageContent() {
	const { data: stats, isLoading, isError } = useGetStatisticsQuery()

	const regionsCount = stats?.regionsCount ?? 0
	const citiesCount = stats?.citiesCount ?? 0
	const usersCount = stats?.usersCount ?? 0
	const questsCount = stats?.totalQuests ?? 0
	const organizationsCount = stats?.organizationsCount ?? 0
	const activeQuestsCount = stats?.activeQuests ?? 0
	const completedQuestsCount = stats?.completedQuests ?? 0

	return (
		<div className='flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6'>
			<div className='space-y-1'>
				<h1 className='text-3xl font-bold tracking-tight'>
					Панель управления
				</h1>
				<p className='text-muted-foreground'>
					Общая статистика и аналитика системы
				</p>
				{isLoading && (
					<p className='text-sm text-muted-foreground'>
						Загружаем актуальную статистику...
					</p>
				)}
				{isError && (
					<p className='text-sm text-red-500'>
						Не удалось загрузить статистику. Показаны значения по умолчанию.
					</p>
				)}
			</div>

			<DashboardStats
				regionsCount={regionsCount}
				citiesCount={citiesCount}
				usersCount={usersCount}
				questsCount={questsCount}
				organizationsCount={organizationsCount}
				activeQuestsCount={activeQuestsCount}
				completedQuestsCount={completedQuestsCount}
			/>
		</div>
	)
}

