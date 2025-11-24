'use client'

import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer'
import { type Quest, type QuestFormData } from '../../types'
import { type QuestCategory } from '../../../quest-categories/types'
import { type City } from '../../../cities/types'
import { type OrganizationType } from '../../../organizations/types'
import { QuestForm } from './quest-form'

interface QuestEditDrawerProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	quest: Quest | undefined
	questCategories: QuestCategory[]
	cities?: City[]
	organizationTypes?: OrganizationType[]
	onSubmit: (data: QuestFormData) => Promise<void> | void
	onCancel: () => void
	isLoading?: boolean
}

export function QuestEditDrawer({
	open,
	onOpenChange,
	quest,
	questCategories,
	cities = [],
	organizationTypes = [],
	onSubmit,
	onCancel,
	isLoading = false,
}: QuestEditDrawerProps) {
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className='max-h-[96vh] flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
				<div className='mx-auto w-full max-w-full md:max-w-[calc(100vw-var(--sidebar-width,16rem)-2rem)] lg:max-w-4xl flex flex-col flex-1 min-h-0'>
					<DrawerHeader className='flex-shrink-0 px-4 sm:px-6'>
						<DrawerTitle className='text-xl sm:text-2xl'>
							{quest ? 'Редактировать квест' : 'Создать квест'}
						</DrawerTitle>
						<DrawerDescription>
							{quest
								? 'Внесите изменения в информацию о квесте'
								: 'Заполните форму для создания нового квеста'}
						</DrawerDescription>
					</DrawerHeader>
						<div className='flex-1 overflow-y-auto min-h-0 pb-4 px-4 sm:px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
						<QuestForm
							quest={quest}
							questCategories={questCategories}
							cities={cities}
							organizationTypes={organizationTypes}
							onSubmit={onSubmit}
							onCancel={onCancel}
							isLoading={isLoading}
						/>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	)
}

