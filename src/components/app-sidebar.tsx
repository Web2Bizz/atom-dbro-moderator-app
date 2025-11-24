import {
	Building,
	Database,
	FileText,
	HelpCircle,
	LayoutDashboard,
	Map,
	FileText as ReportIcon,
	Settings,
	Trophy,
	Users,
} from 'lucide-react'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { NavDocuments } from '@/components/nav-documents'
import { NavMain } from '@/components/nav-main'
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
	user: {
		name: 'shadcn',
		email: 'm@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	navMain: [
		{
			title: 'Панель управления',
			url: '/',
			icon: LayoutDashboard,
		},
		{
			title: 'Города и регионы',
			url: '/cities',
			icon: Map,
			isActive: true,
			items: [
				{
					title: 'Города',
					url: '/cities',
				},
				{
					title: 'Регионы',
					url: '/regions',
				},
			],
		},
		{
			title: 'Пользователи',
			url: '/users',
			icon: Users,
		},

		{
			title: 'Организации',
			url: '/organizations',
			icon: Building,
			isActive: true,
			items: [
				{
					title: 'Организации',
					url: '/organizations',
				},
				{
					title: 'Модерация',
					url: '/moderation',
				},
			],
		},
		{
			title: 'Квесты',
			url: '/quests',
			icon: Trophy,
			isActive: true,
			items: [
				{
					title: 'Квесты',
					url: '/quests',
				},
				{
					title: 'Достижения',
					url: '/achievements',
				},
			],
		},
		{
			title: 'Поддержка',
			url: '/support',
			icon: HelpCircle,
		},
		{
			title: 'Дополнительно',
			url: '/help-types',
			icon: Settings,
			isActive: true,
			items: [
				{
					title: 'Виды помощи',
					url: '/help-types',
				},
				{
					title: 'Категории квестов',
					url: '/quest-categories',
				},
				{
					title: 'Типы организаций',
					url: '/organization-types',
				},
			],
		},
	],

	documents: [
		{
			name: 'Data Library',
			url: '/data-library',
			icon: Database,
		},
		{
			name: 'Reports',
			url: '/reports',
			icon: ReportIcon,
		},
		{
			name: 'Word Assistant',
			url: '/word-assistant',
			icon: FileText,
		},
	],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible='offcanvas' {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className='data-[slot=sidebar-menu-button]:!p-1.5'
						>
							<Link to='/'>
								<img src='/logo.png' alt='АТОМ ДОБРО' className='size-8' />
								<span className='text-lg md:text-base font-semibold'>
									АТОМ ДОБРО
								</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavDocuments items={data.documents} />
			</SidebarContent>
		</Sidebar>
	)
}
