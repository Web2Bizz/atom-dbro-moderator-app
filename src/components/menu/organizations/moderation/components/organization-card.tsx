import { Calendar, CheckCircle2, Clock, Eye, MapPin, XCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { type Organization } from '@/components/menu/organizations/types'

interface OrganizationCardProps {
	organization: Organization
	onView: (organization: Organization) => void
	onApprove: (organization: Organization) => void
	onReject: (organization: Organization) => void
	isLoading: boolean
	formatDate: (date: string) => string
}

export function OrganizationCard({
	organization,
	onView,
	onApprove,
	onReject,
	isLoading,
	formatDate,
}: OrganizationCardProps) {
	return (
		<Card className='flex flex-col transition-shadow hover:shadow-md'>
			<CardHeader className='pb-3'>
				<div className='space-y-2'>
					<Badge variant='outline' className='w-fit text-xs sm:text-sm'>
						<Clock className='mr-1 size-3' />
						<span className='hidden sm:inline'>На проверке</span>
						<span className='sm:hidden'>Проверка</span>
					</Badge>
					<div className='flex-1 min-w-0'>
						<h3 className='font-semibold text-base leading-tight line-clamp-2 sm:text-lg'>
							{organization.name}
						</h3>
						<div className='mt-2 flex items-center gap-2 text-xs text-muted-foreground sm:text-sm'>
							<MapPin className='size-3 shrink-0 sm:size-4' />
							<span className='truncate'>{organization.city.name}</span>
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className='flex flex-1 flex-col gap-3 sm:gap-4'>
				<div className='space-y-2 text-xs sm:text-sm'>
					<p className='line-clamp-2 text-muted-foreground'>{organization.summary}</p>
					<div className='flex flex-wrap gap-1'>
						{organization.helpTypes.slice(0, 2).map(helpType => (
							<Badge key={helpType.id} variant='secondary' className='text-[10px] sm:text-xs'>
								{helpType.name}
							</Badge>
						))}
						{organization.helpTypes.length > 2 && (
							<Badge variant='secondary' className='text-[10px] sm:text-xs'>
								+{organization.helpTypes.length - 2}
							</Badge>
						)}
					</div>
					<div className='flex items-center gap-2 text-[10px] text-muted-foreground sm:text-xs'>
						<Calendar className='size-3' />
						<span className='truncate'>{formatDate(organization.createdAt)}</span>
					</div>
				</div>

				<Separator className='my-1 sm:my-0' />

				<div className='flex flex-col gap-2'>
					<Button
						variant='outline'
						size='sm'
						className='w-full text-xs sm:text-sm'
						onClick={() => onView(organization)}
					>
						<Eye className='mr-2 size-3 sm:size-4' />
						<span className='hidden sm:inline'>Просмотреть детали</span>
						<span className='sm:hidden'>Детали</span>
					</Button>
					<div className='grid grid-cols-2 gap-2'>
						<Button
							variant='default'
							size='sm'
							className='w-full text-xs sm:text-sm'
							onClick={() => onApprove(organization)}
							disabled={isLoading}
						>
							<CheckCircle2 className='mr-1 size-3 sm:mr-2 sm:size-4' />
							<span className='hidden sm:inline'>Одобрить</span>
							<span className='sm:hidden'>ОК</span>
						</Button>
						<Button
							variant='destructive'
							size='sm'
							className='w-full text-xs sm:text-sm'
							onClick={() => onReject(organization)}
							disabled={isLoading}
						>
							<XCircle className='mr-1 size-3 sm:mr-2 sm:size-4' />
							<span className='hidden sm:inline'>Отклонить</span>
							<span className='sm:hidden'>Нет</span>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

