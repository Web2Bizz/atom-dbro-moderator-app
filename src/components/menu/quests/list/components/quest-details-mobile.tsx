import { Badge } from '@/components/ui/badge'
import { type Quest } from '../../types'

interface QuestDetailsMobileProps {
	quest: Quest
}

export function QuestDetailsMobile({ quest }: QuestDetailsMobileProps) {
	return (
		<div className='border-t bg-muted/30 p-4 space-y-4'>
			{quest.coverImage && (
				<div>
					<img
						src={quest.coverImage}
						alt={quest.title}
						className='w-full h-40 object-cover rounded-md'
					/>
				</div>
			)}
			<div>
				<h4 className='font-semibold mb-2 text-sm'>Описание</h4>
				<p className='text-sm text-muted-foreground break-words'>
					{quest.description}
				</p>
			</div>
			<div className='space-y-3'>
				{quest.city && (
					<div>
						<span className='text-muted-foreground text-sm'>Город:</span>
						<div className='font-medium mt-1'>{quest.city.name}</div>
					</div>
				)}
				{quest.organizationType && (
					<div>
						<span className='text-muted-foreground text-sm'>
							Тип организации:
						</span>
						<div className='font-medium mt-1'>{quest.organizationType.name}</div>
					</div>
				)}
				{quest.status && (
					<div>
						<span className='text-muted-foreground text-sm'>Статус:</span>
						<div className='font-medium mt-1'>{quest.status}</div>
					</div>
				)}
				{quest.experienceReward && (
					<div>
						<span className='text-muted-foreground text-sm'>
							Награда опытом:
						</span>
						<div className='font-medium mt-1'>{quest.experienceReward}</div>
					</div>
				)}
				{quest.address && (
					<div>
						<span className='text-muted-foreground text-sm'>Адрес:</span>
						<div className='font-medium mt-1 break-words'>{quest.address}</div>
					</div>
				)}
				{quest.owner && (
					<div>
						<span className='text-muted-foreground text-sm'>Владелец:</span>
						<div className='font-medium mt-1'>
							{quest.owner.firstName} {quest.owner.lastName}
						</div>
					</div>
				)}
			</div>
			{quest.categories && quest.categories.length > 0 && (
				<div>
					<h4 className='font-semibold mb-2 text-sm'>Категории</h4>
					<div className='flex flex-wrap gap-1'>
						{quest.categories.map(category => (
							<Badge key={category.id} variant='outline' className='text-xs'>
								{category.name}
							</Badge>
						))}
					</div>
				</div>
			)}
			{quest.contacts && quest.contacts.length > 0 && (
				<div>
					<h4 className='font-semibold mb-2 text-sm'>Контакты</h4>
					<div className='space-y-1 text-sm'>
						{quest.contacts.map((contact, idx) => (
							<div key={idx}>
								<span className='font-medium'>{contact.name}:</span>{' '}
								<a
									href={
										contact.value.startsWith('http') ||
										contact.value.startsWith('mailto:') ||
										contact.value.startsWith('tel:')
											? contact.value
											: contact.value.includes('@')
											? `mailto:${contact.value}`
											: contact.value.match(/^\+?\d/)
											? `tel:${contact.value}`
											: '#'
									}
									target={
										contact.value.startsWith('http') ? '_blank' : undefined
									}
									rel={
										contact.value.startsWith('http')
											? 'noopener noreferrer'
											: undefined
									}
									className='text-primary hover:underline break-all'
								>
									{contact.value}
								</a>
							</div>
						))}
					</div>
				</div>
			)}
			{quest.steps && quest.steps.length > 0 && (
				<div>
					<h4 className='font-semibold mb-2 text-sm'>Шаги квеста</h4>
					<div className='space-y-2'>
						{quest.steps.map((step, idx) => (
							<div key={idx} className='border rounded-md p-2'>
								<div className='flex items-center justify-between mb-1'>
									<h5 className='font-medium text-xs'>{step.title}</h5>
									<Badge variant='outline' className='text-xs'>
										{step.status}
									</Badge>
								</div>
								<p className='text-xs text-muted-foreground mb-2'>
									{step.description}
								</p>
								<div className='flex items-center gap-2'>
									<div className='flex-1 bg-muted rounded-full h-2'>
										<div
											className='bg-primary h-2 rounded-full transition-all'
											style={{ width: `${step.progress}%` }}
										/>
									</div>
									<span className='text-xs text-muted-foreground'>
										{step.progress}%
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
			{quest.gallery && quest.gallery.length > 0 && (
				<div>
					<h4 className='font-semibold mb-2 text-sm'>Галерея</h4>
					<div className='grid grid-cols-2 gap-2'>
						{quest.gallery.map((url, idx) => (
							<img
								key={idx}
								src={url}
								alt={`Изображение ${idx + 1}`}
								className='rounded-md object-cover w-full h-24'
							/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}
