'use client'

import {
	Building2,
	MapPin,
	Users,
	Trophy,
	CheckCircle2,
	PlayCircle,
	Globe,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface DashboardStatsProps {
	regionsCount: number
	citiesCount: number
	usersCount: number
	questsCount: number
	organizationsCount: number
	activeQuestsCount: number
	completedQuestsCount: number
}

export function DashboardStats({
	regionsCount,
	citiesCount,
	usersCount,
	questsCount,
	organizationsCount,
	activeQuestsCount,
	completedQuestsCount,
}: DashboardStatsProps) {
	const mainStats = [
		{
			title: 'Регионы',
			value: regionsCount,
			icon: Globe,
		},
		{
			title: 'Города',
			value: citiesCount,
			icon: MapPin,
		},
		{
			title: 'Пользователи',
			value: usersCount,
			icon: Users,
		},
		{
			title: 'Организации',
			value: organizationsCount,
			icon: Building2,
		},
	]

	const questStats = [
		{
			title: 'Всего квестов',
			value: questsCount,
			icon: Trophy,
			percentage: undefined,
		},
		{
			title: 'Активные квесты',
			value: activeQuestsCount,
			icon: PlayCircle,
			percentage: questsCount > 0 ? Math.round((activeQuestsCount / questsCount) * 100) : 0,
		},
		{
			title: 'Завершенные квесты',
			value: completedQuestsCount,
			icon: CheckCircle2,
			percentage: questsCount > 0 ? Math.round((completedQuestsCount / questsCount) * 100) : 0,
		},
	]

	return (
		<div className='space-y-8'>
			{/* Основная статистика */}
			<div>
				<h2 className='text-lg font-semibold mb-4 text-foreground'>
					Основная статистика
				</h2>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
					{mainStats.map((stat, index) => {
						const Icon = stat.icon
						return (
							<Card
								key={index}
								className='transition-all hover:shadow-md hover:border-primary/20'
							>
								<CardContent className='p-6'>
									<div className='flex items-center justify-between'>
										<div className='space-y-1'>
											<p className='text-sm font-medium text-muted-foreground'>
												{stat.title}
											</p>
											<p className='text-3xl font-bold tracking-tight text-foreground'>
												{stat.value.toLocaleString('ru-RU')}
											</p>
										</div>
										<div className='rounded-full bg-muted p-3 text-muted-foreground'>
											<Icon className='size-6' />
										</div>
									</div>
								</CardContent>
							</Card>
						)
					})}
				</div>
			</div>

			{/* Статистика квестов */}
			<div>
				<h2 className='text-lg font-semibold mb-4 text-foreground'>
					Статистика квестов
				</h2>
				<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
					{questStats.map((stat, index) => {
						const Icon = stat.icon
						return (
							<Card
								key={index}
								className='transition-all hover:shadow-md hover:border-primary/20'
							>
								<CardContent className='p-6'>
									<div className='space-y-3'>
										<div className='flex items-center justify-between'>
											<p className='text-sm font-medium text-muted-foreground'>
												{stat.title}
											</p>
											<div className='rounded-full bg-muted p-2.5 text-muted-foreground'>
												<Icon className='size-5' />
											</div>
										</div>
										<div>
											<p className='text-3xl font-bold tracking-tight text-foreground'>
												{stat.value.toLocaleString('ru-RU')}
											</p>
											{stat.percentage !== undefined && (
												<p className='text-xs text-muted-foreground mt-1'>
													{stat.percentage}% от общего числа
												</p>
											)}
										</div>
									</div>
								</CardContent>
							</Card>
						)
					})}
				</div>
			</div>
		</div>
	)
}
