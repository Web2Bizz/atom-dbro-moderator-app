'use client'

import {
	ArrowLeft,
	CheckCircle2,
	Clock,
	MessageCircle,
	Search,
	Send,
	XCircle,
} from 'lucide-react'
import * as React from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useIsMobile } from '@/hooks/use-mobile'
import type { Message, SupportTicket, TicketStatus } from './types'

// Моковые данные для демонстрации
const mockTickets: SupportTicket[] = [
	{
		id: 1,
		userId: 1,
		userName: 'Иван Петров',
		userEmail: 'ivan@example.com',
		userAvatar: undefined,
		subject: 'Не могу войти в аккаунт',
		status: 'new',
		priority: 'high',
		unreadCount: 3,
		lastMessage: 'Проблема все еще не решена, помогите пожалуйста',
		lastMessageAt: '2025-01-16T10:30:00Z',
		createdAt: '2025-01-16T09:00:00Z',
		messages: [
			{
				id: 1,
				ticketId: 1,
				userId: 1,
				userName: 'Иван Петров',
				content:
					'Здравствуйте, не могу войти в свой аккаунт. Пароль не подходит.',
				createdAt: '2025-01-16T09:00:00Z',
				isFromAdmin: false,
			},
			{
				id: 2,
				ticketId: 1,
				userId: 1,
				userName: 'Иван Петров',
				content: 'Попробовал восстановить пароль, но письмо не приходит.',
				createdAt: '2025-01-16T09:15:00Z',
				isFromAdmin: false,
			},
			{
				id: 3,
				ticketId: 1,
				userId: 1,
				userName: 'Иван Петров',
				content: 'Проблема все еще не решена, помогите пожалуйста',
				createdAt: '2025-01-16T10:30:00Z',
				isFromAdmin: false,
			},
		],
	},
	{
		id: 2,
		userId: 2,
		userName: 'Мария Сидорова',
		userEmail: 'maria@example.com',
		userAvatar: undefined,
		subject: 'Вопрос о квестах',
		status: 'in_progress',
		priority: 'medium',
		unreadCount: 0,
		lastMessage: 'Спасибо за ответ! Все понятно.',
		lastMessageAt: '2025-01-16T11:00:00Z',
		createdAt: '2025-01-16T08:00:00Z',
		messages: [
			{
				id: 4,
				ticketId: 2,
				userId: 2,
				userName: 'Мария Сидорова',
				content: 'Как получить доступ к новым квестам?',
				createdAt: '2025-01-16T08:00:00Z',
				isFromAdmin: false,
			},
			{
				id: 5,
				ticketId: 2,
				userId: 2,
				userName: 'Администратор',
				content:
					'Новые квесты становятся доступны после выполнения предыдущих. Проверьте свой прогресс в профиле.',
				createdAt: '2025-01-16T10:00:00Z',
				isFromAdmin: true,
			},
			{
				id: 6,
				ticketId: 2,
				userId: 2,
				userName: 'Мария Сидорова',
				content: 'Спасибо за ответ! Все понятно.',
				createdAt: '2025-01-16T11:00:00Z',
				isFromAdmin: false,
			},
		],
	},
	{
		id: 3,
		userId: 3,
		userName: 'Алексей Смирнов',
		userEmail: 'alex@example.com',
		userAvatar: undefined,
		subject: 'Техническая проблема',
		status: 'resolved',
		priority: 'low',
		unreadCount: 0,
		lastMessage: 'Проблема решена, спасибо!',
		lastMessageAt: '2025-01-15T16:00:00Z',
		createdAt: '2025-01-15T14:00:00Z',
		messages: [
			{
				id: 7,
				ticketId: 3,
				userId: 3,
				userName: 'Алексей Смирнов',
				content: 'Приложение зависает при открытии профиля',
				createdAt: '2025-01-15T14:00:00Z',
				isFromAdmin: false,
			},
			{
				id: 8,
				ticketId: 3,
				userId: 3,
				userName: 'Администратор',
				content: 'Попробуйте очистить кэш приложения или переустановить его.',
				createdAt: '2025-01-15T15:00:00Z',
				isFromAdmin: true,
			},
			{
				id: 9,
				ticketId: 3,
				userId: 3,
				userName: 'Алексей Смирнов',
				content: 'Проблема решена, спасибо!',
				createdAt: '2025-01-15T16:00:00Z',
				isFromAdmin: false,
			},
		],
	},
]

const statusConfig: Record<
	TicketStatus,
	{
		label: string
		icon: React.ComponentType<{ className?: string }>
		variant: 'default' | 'secondary' | 'destructive' | 'outline'
	}
> = {
	new: { label: 'Новый', icon: Clock, variant: 'default' },
	in_progress: { label: 'В работе', icon: MessageCircle, variant: 'secondary' },
	resolved: { label: 'Решен', icon: CheckCircle2, variant: 'outline' },
	closed: { label: 'Закрыт', icon: XCircle, variant: 'outline' },
}

const priorityConfig: Record<string, { label: string; className: string }> = {
	high: {
		label: 'Высокий',
		className: 'bg-destructive/10 text-destructive border-destructive/20',
	},
	medium: {
		label: 'Средний',
		className:
			'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-500',
	},
	low: {
		label: 'Низкий',
		className:
			'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400',
	},
}

function formatDate(dateString: string): string {
	const date = new Date(dateString)
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	const minutes = Math.floor(diff / 60000)
	const hours = Math.floor(diff / 3600000)
	const days = Math.floor(diff / 86400000)

	if (minutes < 1) return 'Только что'
	if (minutes < 60) return `${minutes} мин назад`
	if (hours < 24) return `${hours} ч назад`
	if (days < 7) return `${days} дн назад`
	return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function formatMessageDate(dateString: string): string {
	const date = new Date(dateString)
	const now = new Date()
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
	const messageDate = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	)

	if (messageDate.getTime() === today.getTime()) {
		return date.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
		})
	}
	return date.toLocaleDateString('ru-RU', {
		day: 'numeric',
		month: 'short',
		hour: '2-digit',
		minute: '2-digit',
	})
}

export function SupportPageContent() {
	const isMobile = useIsMobile()
	const [tickets, setTickets] = React.useState<SupportTicket[]>(mockTickets)
	const [selectedTicket, setSelectedTicket] =
		React.useState<SupportTicket | null>(null)
	const [searchQuery, setSearchQuery] = React.useState('')
	const [statusFilter, setStatusFilter] = React.useState<TicketStatus | 'all'>(
		'all'
	)
	const [messageText, setMessageText] = React.useState('')
	const [isSending, setIsSending] = React.useState(false)
	const [showChat, setShowChat] = React.useState(false)
	const [useMobileLayout, setUseMobileLayout] = React.useState(false)

	// Определяем, нужно ли использовать мобильный layout (когда не хватает места)
	React.useEffect(() => {
		const checkLayout = () => {
			// Используем мобильный layout на мобильных устройствах или когда ширина меньше xl (1280px)
			const shouldUseMobile = isMobile || window.innerWidth < 1280
			setUseMobileLayout(shouldUseMobile)
		}

		checkLayout()
		window.addEventListener('resize', checkLayout)
		return () => window.removeEventListener('resize', checkLayout)
	}, [isMobile])

	// На мобильных устройствах показываем либо список, либо чат
	// На десктопе всегда показываем оба (если достаточно места)
	React.useEffect(() => {
		if (!useMobileLayout) {
			setShowChat(true)
		} else if (!selectedTicket) {
			// На мобильном layout, если нет выбранного тикета, показываем список
			setShowChat(false)
		}
	}, [useMobileLayout, selectedTicket])

	const handleTicketSelect = (ticket: SupportTicket) => {
		setSelectedTicket(ticket)
		if (useMobileLayout) {
			setShowChat(true)
		}
	}

	const handleBackToList = () => {
		if (useMobileLayout) {
			setShowChat(false)
			setSelectedTicket(null)
		}
	}

	const filteredTickets = React.useMemo(() => {
		return tickets.filter(ticket => {
			const matchesSearch =
				ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
				ticket.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
				ticket.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
			const matchesStatus =
				statusFilter === 'all' || ticket.status === statusFilter
			return matchesSearch && matchesStatus
		})
	}, [tickets, searchQuery, statusFilter])

	const handleSendMessage = async () => {
		if (!selectedTicket || !messageText.trim()) return

		setIsSending(true)
		try {
			// Здесь будет API вызов
			await new Promise(resolve => setTimeout(resolve, 500))

			const newMessage: Message = {
				id: Date.now(),
				ticketId: selectedTicket.id,
				userId: 0, // admin
				userName: 'Администратор',
				content: messageText.trim(),
				createdAt: new Date().toISOString(),
				isFromAdmin: true,
			}

			setTickets(prev =>
				prev.map(ticket =>
					ticket.id === selectedTicket.id
						? {
								...ticket,
								messages: [...ticket.messages, newMessage],
								lastMessage: newMessage.content,
								lastMessageAt: newMessage.createdAt,
								status: ticket.status === 'new' ? 'in_progress' : ticket.status,
						  }
						: ticket
				)
			)

			if (selectedTicket) {
				setSelectedTicket({
					...selectedTicket,
					messages: [...selectedTicket.messages, newMessage],
					lastMessage: newMessage.content,
					lastMessageAt: newMessage.createdAt,
					status:
						selectedTicket.status === 'new'
							? 'in_progress'
							: selectedTicket.status,
				})
			}

			setMessageText('')
			toast.success('Сообщение отправлено')
		} catch {
			toast.error('Ошибка при отправке сообщения')
		} finally {
			setIsSending(false)
		}
	}

	const handleStatusChange = async (
		ticketId: number,
		newStatus: TicketStatus
	) => {
		setTickets(prev =>
			prev.map(ticket =>
				ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
			)
		)

		if (selectedTicket?.id === ticketId) {
			setSelectedTicket({ ...selectedTicket, status: newStatus })
		}

		toast.success('Статус обновлен')
	}

	return (
		<div className='flex flex-1 flex-col gap-4 p-2 sm:p-4 lg:gap-6 lg:p-6'>
			<div className='px-2 sm:px-0'>
				<h1 className='text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
					Поддержка
				</h1>
				<p className='text-sm text-muted-foreground sm:text-base lg:text-lg'>
					Отвечайте на вопросы пользователей и управляйте тикетами
				</p>
			</div>

			<div className='flex flex-1 gap-2 sm:gap-4 overflow-hidden relative min-h-0'>
				{/* Список тикетов */}
				<Card
					className={`flex flex-col border p-0 shadow-sm transition-all duration-300 ${
						useMobileLayout
							? `absolute inset-0 z-10 ${
									showChat && selectedTicket
										? '-translate-x-full opacity-0 pointer-events-none'
										: 'translate-x-0 opacity-100'
							  }`
							: 'w-80 lg:w-96 shrink-0'
					}`}
				>
					<div className='border-b p-3 sm:p-4'>
						<div className='relative mb-3 sm:mb-4'>
							<Search className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground' />
							<Input
								placeholder='Поиск тикетов...'
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								className='pl-9 text-base'
							/>
						</div>
						<Tabs
							value={statusFilter}
							onValueChange={value =>
								setStatusFilter(value as TicketStatus | 'all')
							}
						>
							<TabsList className='grid w-full grid-cols-4 h-8 sm:h-9'>
								<TabsTrigger
									value='all'
									className='text-sm sm:text-base px-1 sm:px-2'
								>
									Все
								</TabsTrigger>
								<TabsTrigger
									value='new'
									className='text-sm sm:text-base px-1 sm:px-2'
								>
									Новые
								</TabsTrigger>
								<TabsTrigger
									value='in_progress'
									className='text-sm sm:text-base px-1 sm:px-2'
								>
									В работе
								</TabsTrigger>
								<TabsTrigger
									value='resolved'
									className='text-sm sm:text-base px-1 sm:px-2'
								>
									Решены
								</TabsTrigger>
							</TabsList>
						</Tabs>
					</div>

					<div className='flex-1 overflow-y-auto'>
						{filteredTickets.length === 0 ? (
							<div className='flex h-full items-center justify-center p-8 text-center'>
								<div className='text-muted-foreground'>
									<MessageCircle className='mx-auto mb-2 size-8 opacity-50' />
									<p className='text-sm'>Тикеты не найдены</p>
								</div>
							</div>
						) : (
							<div className='divide-y'>
								{filteredTickets.map(ticket => {
									const StatusIcon = statusConfig[ticket.status].icon
									const priority = priorityConfig[ticket.priority]

									return (
										<button
											key={ticket.id}
											onClick={() => handleTicketSelect(ticket)}
											className={`w-full text-left transition-colors hover:bg-accent active:bg-accent ${
												selectedTicket?.id === ticket.id ? 'bg-accent' : ''
											}`}
										>
											<div className='p-3 sm:p-4'>
												<div className='mb-2 flex items-start justify-between gap-2'>
													<div className='flex-1 min-w-0'>
														<p className='truncate font-medium text-base sm:text-lg'>
															{ticket.subject}
														</p>
														<p className='truncate text-sm text-muted-foreground sm:text-base'>
															{ticket.userName}
														</p>
													</div>
													{ticket.unreadCount > 0 && (
														<Badge variant='default' className='shrink-0'>
															{ticket.unreadCount}
														</Badge>
													)}
												</div>
												<div className='mb-2 flex items-center gap-1.5 sm:gap-2 flex-wrap'>
													<Badge
														variant={statusConfig[ticket.status].variant}
														className='text-xs sm:text-sm'
													>
														<StatusIcon className='mr-0.5 sm:mr-1 size-3 sm:size-4' />
														<span className='hidden sm:inline'>
															{statusConfig[ticket.status].label}
														</span>
														<span className='sm:hidden'>
															{statusConfig[ticket.status].label.split(' ')[0]}
														</span>
													</Badge>
													<Badge
														variant='outline'
														className={`text-xs sm:text-sm ${priority.className}`}
													>
														{priority.label}
													</Badge>
												</div>
												<p className='truncate text-sm text-muted-foreground mb-1 line-clamp-2'>
													{ticket.lastMessage}
												</p>
												<p className='text-xs sm:text-sm text-muted-foreground'>
													{formatDate(ticket.lastMessageAt)}
												</p>
											</div>
										</button>
									)
								})}
							</div>
						)}
					</div>
				</Card>

				{/* Область чата */}
				{selectedTicket && (useMobileLayout ? showChat : true) ? (
					<Card
						className={`flex flex-1 flex-col border p-0 shadow-sm transition-all duration-300 min-w-0 ${
							useMobileLayout
								? `absolute inset-0 z-10 ${
										showChat
											? 'translate-x-0 opacity-100'
											: 'translate-x-full opacity-0 pointer-events-none'
								  }`
								: ''
						}`}
					>
						{/* Заголовок чата */}
						<div className='border-b p-3 sm:p-4'>
							{useMobileLayout && (
								<Button
									variant='ghost'
									size='icon'
									onClick={handleBackToList}
									className='mb-3 -ml-2'
								>
									<ArrowLeft className='size-4' />
								</Button>
							)}
							<div className='flex items-start justify-between gap-2 sm:gap-4'>
								<div className='flex items-start gap-2 sm:gap-3 flex-1 min-w-0'>
									<Avatar className='size-8 sm:size-10 shrink-0'>
										<AvatarImage src={selectedTicket.userAvatar} />
										<AvatarFallback className='text-sm sm:text-base'>
											{selectedTicket.userName
												.split(' ')
												.map(n => n[0])
												.join('')
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									<div className='min-w-0 flex-1'>
										<h3 className='font-semibold text-base sm:text-lg truncate'>
											{selectedTicket.subject}
										</h3>
										<p className='text-sm sm:text-base text-muted-foreground truncate'>
											{selectedTicket.userName} • {selectedTicket.userEmail}
										</p>
									</div>
								</div>
								<div className='flex items-center gap-1.5 sm:gap-2 shrink-0'>
									<Badge
										variant={statusConfig[selectedTicket.status].variant}
										className='text-xs sm:text-sm'
									>
										{statusConfig[selectedTicket.status].label}
									</Badge>
									<Badge
										variant='outline'
										className={`text-xs sm:text-sm ${
											priorityConfig[selectedTicket.priority].className
										}`}
									>
										{priorityConfig[selectedTicket.priority].label}
									</Badge>
								</div>
							</div>
							<div className='mt-3 flex gap-2 flex-wrap'>
								{selectedTicket.status !== 'in_progress' && (
									<Button
										size='sm'
										variant='outline'
										onClick={() =>
											handleStatusChange(selectedTicket.id, 'in_progress')
										}
										className='text-sm sm:text-base'
									>
										Взять в работу
									</Button>
								)}
								{selectedTicket.status !== 'resolved' && (
									<Button
										size='sm'
										variant='outline'
										onClick={() =>
											handleStatusChange(selectedTicket.id, 'resolved')
										}
										className='text-sm sm:text-base'
									>
										Отметить решенным
									</Button>
								)}
								{selectedTicket.status !== 'closed' && (
									<Button
										size='sm'
										variant='outline'
										onClick={() =>
											handleStatusChange(selectedTicket.id, 'closed')
										}
										className='text-sm sm:text-base'
									>
										Закрыть
									</Button>
								)}
							</div>
						</div>

						{/* Сообщения */}
						<div className='flex-1 overflow-y-auto p-3 sm:p-4'>
							<div className='space-y-3 sm:space-y-4'>
								{selectedTicket.messages.map((message, index) => {
									const isAdmin = message.isFromAdmin
									const showAvatar =
										index === 0 ||
										selectedTicket.messages[index - 1].isFromAdmin !== isAdmin

									return (
										<div
											key={message.id}
											className={`flex gap-2 sm:gap-3 ${
												isAdmin ? 'flex-row-reverse' : ''
											}`}
										>
											{showAvatar ? (
												<Avatar className='size-7 sm:size-8 shrink-0'>
													<AvatarImage src={message.userAvatar} />
													<AvatarFallback className='text-sm'>
														{message.userName
															.split(' ')
															.map(n => n[0])
															.join('')
															.toUpperCase()}
													</AvatarFallback>
												</Avatar>
											) : (
												<div className='w-7 sm:w-8' />
											)}
											<div
												className={`flex flex-1 flex-col ${
													isAdmin ? 'items-end' : 'items-start'
												} min-w-0`}
											>
												{showAvatar && (
													<div className='mb-1 flex items-center gap-2 flex-wrap'>
														<span className='text-sm sm:text-base font-medium'>
															{message.userName}
														</span>
														<span className='text-xs sm:text-sm text-muted-foreground'>
															{formatMessageDate(message.createdAt)}
														</span>
													</div>
												)}
												<div
													className={`rounded-lg px-3 py-2 sm:px-4 max-w-[85%] sm:max-w-[80%] ${
														isAdmin
															? 'bg-primary text-primary-foreground'
															: 'bg-muted text-muted-foreground'
													}`}
												>
													<p className='text-sm sm:text-base whitespace-pre-wrap break-words'>
														{message.content}
													</p>
												</div>
												{!showAvatar && (
													<span className='mt-1 text-xs sm:text-sm text-muted-foreground'>
														{formatMessageDate(message.createdAt)}
													</span>
												)}
											</div>
										</div>
									)
								})}
							</div>
						</div>

						{/* Поле ввода */}
						<div className='border-t p-3 sm:p-4'>
							<div className='flex gap-2'>
								<Textarea
									placeholder='Введите ответ...'
									value={messageText}
									onChange={e => setMessageText(e.target.value)}
									onKeyDown={e => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault()
											handleSendMessage()
										}
									}}
									className='min-h-[60px] sm:min-h-[80px] resize-none text-base'
								/>
								<Button
									onClick={handleSendMessage}
									disabled={!messageText.trim() || isSending}
									size='icon'
									className='shrink-0 size-9 sm:size-10'
								>
									<Send className='size-4' />
								</Button>
							</div>
							<p className='mt-2 text-sm sm:text-base text-muted-foreground'>
								Нажмите Enter для отправки, Shift+Enter для новой строки
							</p>
						</div>
					</Card>
				) : (
					!useMobileLayout && (
						<Card className='flex flex-1 items-center justify-center border p-8 shadow-sm'>
							<div className='text-center text-muted-foreground'>
								<MessageCircle className='mx-auto mb-4 size-12 opacity-50' />
								<p className='text-lg font-medium'>
									Выберите тикет для просмотра
								</p>
								<p className='text-sm'>
									Выберите тикет из списка слева, чтобы начать общение
								</p>
							</div>
						</Card>
					)
				)}
			</div>
		</div>
	)
}
