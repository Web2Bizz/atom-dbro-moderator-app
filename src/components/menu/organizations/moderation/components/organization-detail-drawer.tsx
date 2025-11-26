import {
	AlertCircle,
	Building2,
	CheckCircle2,
	Clock,
	FileText,
	Globe,
	Heart,
	Image as ImageIcon,
	Mail,
	MapPin,
	Phone,
	Target,
	Users,
	XCircle,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type Organization } from '@/components/menu/organizations/types'

interface OrganizationDetailDrawerProps {
	organization: Organization | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onApprove: (organization: Organization) => void
	onReject: (organization: Organization) => void
	isLoading: boolean
}

export function OrganizationDetailDrawer({
	organization,
	open,
	onOpenChange,
	onApprove,
	onReject,
	isLoading,
}: OrganizationDetailDrawerProps) {
	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerContent className='max-h-[96vh] flex flex-col [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
				{organization && (
					<div className='mx-auto w-full max-w-full md:max-w-[calc(100vw-var(--sidebar-width,16rem)-2rem)] lg:max-w-4xl flex flex-col flex-1 min-h-0'>
						<DrawerHeader className='flex-shrink-0 px-4 sm:px-6'>
							<div className='flex items-start justify-between gap-4'>
								<div className='flex-1 min-w-0'>
									<DrawerTitle className='text-xl sm:text-2xl break-words'>
										{organization.name}
									</DrawerTitle>
									<DrawerDescription className='mt-2'>
										Проверьте информацию об организации перед одобрением
									</DrawerDescription>
								</div>
								<Badge variant='outline' className='shrink-0 ml-2'>
									<Clock className='mr-1 size-3' />
									<span className='hidden sm:inline'>На проверке</span>
									<span className='sm:hidden'>Проверка</span>
								</Badge>
							</div>
						</DrawerHeader>

						<div className='flex-1 overflow-y-auto min-h-0 pb-4 px-4 sm:px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
							<Tabs defaultValue='info' className='mt-4'>
								<TabsList className='flex w-full gap-2 overflow-x-auto px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0'>
									<TabsTrigger value='info' className='text-xs sm:text-sm'>
										Информация
									</TabsTrigger>
									<TabsTrigger value='details' className='text-xs sm:text-sm'>
										Детали
									</TabsTrigger>
									<TabsTrigger value='contacts' className='text-xs sm:text-sm'>
										Контакты
									</TabsTrigger>
									<TabsTrigger value='gallery' className='text-xs sm:text-sm'>
										Галерея
									</TabsTrigger>
								</TabsList>

								<TabsContent value='info' className='space-y-4 mt-4'>
									<div className='grid gap-4 md:grid-cols-2'>
										{organization.type && (
											<Card>
												<CardHeader className='pb-3'>
													<div className='flex items-center gap-2'>
														<Building2 className='size-4 text-muted-foreground' />
														<h4 className='font-semibold'>Тип организации</h4>
													</div>
												</CardHeader>
												<CardContent>
													<Badge variant='outline'>{organization.type.name}</Badge>
												</CardContent>
											</Card>
										)}

										<Card>
											<CardHeader className='pb-3'>
												<div className='flex items-center gap-2'>
													<MapPin className='size-4 text-muted-foreground' />
													<h4 className='font-semibold'>Местоположение</h4>
												</div>
											</CardHeader>
											<CardContent className='space-y-1'>
												<p className='font-medium'>{organization.city.name}</p>
												<p className='text-sm text-muted-foreground'>{organization.address}</p>
												<p className='text-xs text-muted-foreground'>
													Координаты: {organization.latitude.toFixed(4)}, {organization.longitude.toFixed(4)}
												</p>
											</CardContent>
										</Card>
									</div>

									<Card>
										<CardHeader className='pb-3'>
											<div className='flex items-center gap-2'>
												<FileText className='size-4 text-muted-foreground' />
												<h4 className='font-semibold'>Краткое описание</h4>
											</div>
										</CardHeader>
										<CardContent>
											<p className='text-sm'>{organization.summary}</p>
										</CardContent>
									</Card>

									<Card>
										<CardHeader className='pb-3'>
											<div className='flex items-center gap-2'>
												<Heart className='size-4 text-muted-foreground' />
												<h4 className='font-semibold'>Миссия</h4>
											</div>
										</CardHeader>
										<CardContent>
											<p className='text-sm'>{organization.mission}</p>
										</CardContent>
									</Card>

									{organization.helpTypes && organization.helpTypes.length > 0 && (
										<Card>
											<CardHeader className='pb-3'>
												<div className='flex items-center gap-2'>
													<Users className='size-4 text-muted-foreground' />
													<h4 className='font-semibold'>Виды помощи</h4>
												</div>
											</CardHeader>
											<CardContent>
												<div className='flex flex-wrap gap-2'>
													{organization.helpTypes.map(helpType => (
														<Badge key={helpType.id} variant='secondary'>
															{helpType.name}
														</Badge>
													))}
												</div>
											</CardContent>
										</Card>
									)}
								</TabsContent>

								<TabsContent value='details' className='space-y-4 mt-4'>
									<Card>
										<CardHeader className='pb-3'>
											<div className='flex items-center gap-2'>
												<FileText className='size-4 text-muted-foreground' />
												<h4 className='font-semibold'>Полное описание</h4>
											</div>
										</CardHeader>
										<CardContent>
											<p className='text-sm whitespace-pre-wrap'>{organization.description}</p>
										</CardContent>
									</Card>

									<Card>
										<CardHeader className='pb-3'>
											<div className='flex items-center gap-2'>
												<Target className='size-4 text-muted-foreground' />
												<h4 className='font-semibold'>Цели</h4>
											</div>
										</CardHeader>
										<CardContent>
											<ul className='space-y-2'>
												{organization.goals.map(goal => (
													<li key={goal} className='flex items-start gap-2 text-sm'>
														<span className='mt-1.5 size-1.5 shrink-0 rounded-full bg-primary' />
														<span>{goal}</span>
													</li>
												))}
											</ul>
										</CardContent>
									</Card>

									{organization.needs && organization.needs.length > 0 && (
										<Card>
											<CardHeader className='pb-3'>
												<div className='flex items-center gap-2'>
													<AlertCircle className='size-4 text-muted-foreground' />
													<h4 className='font-semibold'>Потребности</h4>
												</div>
											</CardHeader>
											<CardContent>
												<ul className='space-y-2'>
													{organization.needs.map(need => (
														<li key={need} className='flex items-start gap-2 text-sm'>
															<span className='mt-1.5 size-1.5 shrink-0 rounded-full bg-primary' />
															<span>{need}</span>
														</li>
													))}
												</ul>
											</CardContent>
										</Card>
									)}
								</TabsContent>

								<TabsContent value='contacts' className='space-y-4 mt-4'>
									<Card>
										<CardHeader className='pb-3'>
											<h4 className='font-semibold'>Контактная информация</h4>
										</CardHeader>
										<CardContent>
											<div className='space-y-3'>
												{organization.contacts.map(contact => (
													<div key={`${contact.name}-${contact.value}`} className='flex items-center gap-3 rounded-lg border p-3'>
														{contact.name.toLowerCase().includes('email') ? (
															<Mail className='size-5 text-muted-foreground' />
														) : contact.name.toLowerCase().includes('телефон') ||
														  contact.name.toLowerCase().includes('phone') ? (
															<Phone className='size-5 text-muted-foreground' />
														) : contact.value.startsWith('http') ? (
															<Globe className='size-5 text-muted-foreground' />
														) : (
															<FileText className='size-5 text-muted-foreground' />
														)}
														<div className='flex-1 min-w-0'>
															<p className='text-xs font-medium text-muted-foreground'>
																{contact.name}
															</p>
															{contact.value.startsWith('http') ? (
																<a
																	href={contact.value}
																	target='_blank'
																	rel='noopener noreferrer'
																	className='text-sm text-primary hover:underline break-all'
																>
																	{contact.value}
																</a>
															) : (
																<p className='text-sm break-all'>{contact.value}</p>
															)}
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								</TabsContent>

								<TabsContent value='gallery' className='space-y-4 mt-4'>
									{organization.gallery && organization.gallery.length > 0 ? (
										<div className='grid gap-4 md:grid-cols-2'>
											{organization.gallery.map(url => (
												<div key={url} className='group relative overflow-hidden rounded-lg border'>
													<img
														src={url}
														alt='Фотография организации'
														className='h-64 w-full object-cover transition-transform group-hover:scale-105'
													/>
												</div>
											))}
										</div>
									) : (
										<Card>
											<CardContent className='flex flex-col items-center justify-center py-12'>
												<ImageIcon className='mb-4 size-12 text-muted-foreground' />
												<p className='text-sm text-muted-foreground'>Галерея пуста</p>
											</CardContent>
										</Card>
									)}
								</TabsContent>
							</Tabs>
						</div>

						<DrawerFooter className='flex-shrink-0 border-t px-4 sm:px-6'>
							<div className='flex flex-col gap-2 w-full sm:flex-row sm:justify-end'>
								<Button
									variant='outline'
									onClick={() => onOpenChange(false)}
									className='w-full order-3 sm:order-1 sm:w-auto'
								>
									Закрыть
								</Button>
								<div className='flex w-full gap-2 order-1 sm:order-2 sm:w-auto'>
									<Button
										variant='destructive'
										onClick={() => {
											onOpenChange(false)
											onReject(organization)
										}}
										disabled={isLoading}
										className='flex-1 text-xs sm:text-sm sm:flex-initial'
									>
										<XCircle className='mr-2 size-3 sm:size-4' />
										Отклонить
									</Button>
									<Button
										onClick={() => {
											onOpenChange(false)
											onApprove(organization)
										}}
										disabled={isLoading}
										className='flex-1 text-xs sm:text-sm sm:flex-initial'
									>
										<CheckCircle2 className='mr-2 size-3 sm:size-4' />
										Одобрить
									</Button>
								</div>
							</div>
						</DrawerFooter>
					</div>
				)}
			</DrawerContent>
		</Drawer>
	)
}

