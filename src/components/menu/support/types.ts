export type TicketStatus = 'new' | 'in_progress' | 'resolved' | 'closed'

export type Message = {
	id: number
	ticketId: number
	userId: number
	userName: string
	userAvatar?: string
	content: string
	createdAt: string
	isFromAdmin: boolean
}

export type SupportTicket = {
	id: number
	userId: number
	userName: string
	userEmail: string
	userAvatar?: string
	subject: string
	status: TicketStatus
	priority: 'low' | 'medium' | 'high'
	unreadCount: number
	lastMessage: string
	lastMessageAt: string
	createdAt: string
	messages: Message[]
}

