import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer'
import { OrganizationForm } from '../../organization-form'
import { type Organization, type OrganizationFormData } from '../../types'
import { type City } from '../../../cities/types'
import { type OrganizationType, type HelpType } from '../../types'

interface OrganizationEditDrawerProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	organization: Organization | undefined
	cities: City[]
	organizationTypes: OrganizationType[]
	helpTypes: HelpType[]
	onSubmit: (data: OrganizationFormData) => Promise<void>
	onCancel: () => void
	isLoading: boolean
}

export function OrganizationEditDrawer({
	open,
	onOpenChange,
	organization,
	cities,
	organizationTypes,
	helpTypes,
	onSubmit,
	onCancel,
	isLoading,
}: OrganizationEditDrawerProps) {
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className='max-h-[96vh] flex flex-col'>
				<div className='mx-auto w-full max-w-full md:max-w-[calc(100vw-var(--sidebar-width,16rem)-2rem)] lg:max-w-4xl px-4 sm:px-6 flex flex-col flex-1 min-h-0'>
					<DrawerHeader className='flex-shrink-0'>
						<DrawerTitle>Редактировать организацию</DrawerTitle>
						<DrawerDescription>
							Внесите изменения в информацию об организации
						</DrawerDescription>
					</DrawerHeader>
					<div className='pb-4 flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
						{organization && (
							<OrganizationForm
								organization={organization}
								cities={cities}
								organizationTypes={organizationTypes}
								helpTypes={helpTypes}
								onSubmit={(data) => {
									const formData: OrganizationFormData = {
										...data,
										needs: data.needs ?? [],
										contacts: data.contacts ?? [],
										gallery: data.gallery ?? [],
										helpTypeIds: data.helpTypeIds ?? [],
									}
									return onSubmit(formData)
								}}
								onCancel={onCancel}
								isLoading={isLoading}
							/>
						)}
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	)
}

