'use client'

import { DashboardStats } from './dashboard-stats'
import { mockQuests } from './menu/quests/list/mock-data'
import { mockOrganizations } from './menu/organizations/list/mock-data'
import { mockCities } from './menu/organizations/list/mock-data'
import { mockRegions } from './menu/shared/mock-data'

// Моковые данные для пользователей
const mockUsers = [
	{
		id: 1,
		firstName: 'Дениска',
		lastName: 'Мясников',
		middleName: 'Сергеевич',
		email: 'qwerty@yandex.ru',
		avatarUrls: {},
		role: 'пользователь',
		level: 1,
		experience: 0,
		questId: null,
		organisationId: null,
		createdAt: '2025-11-16T09:29:18.393Z',
		updatedAt: '2025-11-16T09:29:18.393Z',
	},
	{
		id: 2,
		firstName: 'Иван',
		lastName: 'Иванов',
		middleName: 'Петрович',
		email: 'ivan@example.com',
		avatarUrls: {},
		role: 'пользователь',
		level: 2,
		experience: 150,
		questId: null,
		organisationId: null,
		createdAt: '2025-11-16T09:29:18.393Z',
		updatedAt: '2025-11-16T09:29:18.393Z',
	},
	{
		id: 3,
		firstName: 'Мария',
		lastName: 'Сидорова',
		middleName: 'Александровна',
		email: 'maria@example.com',
		avatarUrls: {},
		role: 'пользователь',
		level: 1,
		experience: 50,
		questId: null,
		organisationId: null,
		createdAt: '2025-11-16T09:29:18.393Z',
		updatedAt: '2025-11-16T09:29:18.393Z',
	},
]

export function DashboardPageContent() {
	const regionsCount = mockRegions.length
	const citiesCount = mockCities.length
	const usersCount = mockUsers.length
	const questsCount = mockQuests.length
	const organizationsCount = mockOrganizations.length
	const activeQuestsCount = mockQuests.filter(q => q.status === 'active').length
	const completedQuestsCount = mockQuests.filter(
		q => q.status === 'completed'
	).length

	return (
		<div className='flex flex-1 flex-col gap-6 p-4 lg:gap-8 lg:p-6'>
			<div className='space-y-1'>
				<h1 className='text-3xl font-bold tracking-tight'>
					Панель управления
				</h1>
				<p className='text-muted-foreground'>
					Общая статистика и аналитика системы
				</p>
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

