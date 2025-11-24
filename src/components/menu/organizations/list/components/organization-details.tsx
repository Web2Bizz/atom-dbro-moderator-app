import { Badge } from '@/components/ui/badge'
import { type Organization } from '../../types'

interface OrganizationDetailsProps {
	organization: Organization
}

export function OrganizationDetails({ organization }: OrganizationDetailsProps) {
	return (
		<div className='space-y-4 w-full overflow-hidden'>
			<div>
				<h4 className='font-semibold mb-2'>Краткое описание</h4>
				<p className='text-sm text-muted-foreground break-words'>
					{organization.summary}
				</p>
			</div>
			<div>
				<h4 className='font-semibold mb-2'>Миссия</h4>
				<p className='text-sm text-muted-foreground break-words'>
					{organization.mission}
				</p>
			</div>
			{organization.description && (
				<div>
					<h4 className='font-semibold mb-2'>Описание</h4>
					<p className='text-sm text-muted-foreground break-words'>
						{organization.description}
					</p>
				</div>
			)}
			{organization.goals && organization.goals.length > 0 && (
				<div>
					<h4 className='font-semibold mb-2'>Цели</h4>
					<ul className='list-disc list-inside space-y-1 text-sm text-muted-foreground'>
						{organization.goals.map((goal, idx) => (
							<li key={idx}>{goal}</li>
						))}
					</ul>
				</div>
			)}
			{organization.needs && organization.needs.length > 0 && (
				<div>
					<h4 className='font-semibold mb-2'>Потребности</h4>
					<ul className='list-disc list-inside space-y-1 text-sm text-muted-foreground'>
						{organization.needs.map((need, idx) => (
							<li key={idx}>{need}</li>
						))}
					</ul>
				</div>
			)}
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				{organization.helpTypes && organization.helpTypes.length > 0 && (
					<div>
						<h4 className='font-semibold mb-2'>Виды помощи</h4>
						<div className='flex flex-wrap gap-1'>
							{organization.helpTypes.map(ht => (
								<Badge key={ht.id} variant='outline' className='text-xs'>
									{ht.name}
								</Badge>
							))}
						</div>
					</div>
				)}
				{organization.contacts && organization.contacts.length > 0 && (
					<div>
						<h4 className='font-semibold mb-2'>Контакты</h4>
						<div className='space-y-1 text-sm'>
							{organization.contacts.map((contact, idx) => (
								<div key={idx}>
									<span className='font-medium'>{contact.name}:</span>{' '}
									<a
										href={contact.value}
										target='_blank'
										rel='noopener noreferrer'
										className='text-primary hover:underline break-all'
										onClick={e => e.stopPropagation()}
									>
										{contact.value}
									</a>
								</div>
							))}
						</div>
					</div>
				)}
			</div>
			{organization.gallery && organization.gallery.length > 0 && (
				<div>
					<h4 className='font-semibold mb-2'>Галерея</h4>
					<div className='grid grid-cols-2 gap-2 md:grid-cols-4'>
						{organization.gallery.map((url, idx) => (
							<img
								key={idx}
								src={url}
								alt={`Изображение ${idx + 1}`}
								className='rounded-md object-cover w-full h-24'
								onClick={e => e.stopPropagation()}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

