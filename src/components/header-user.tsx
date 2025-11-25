import { useAuth } from '@/hooks/use-auth'
import { getAvatarUrl, getUserFullName, getUserInitials } from '@/utils/user'
import { LogOut } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function HeaderUser() {
	const auth = useAuth()

	// Если контекст еще не готов (например, при HMR), не рендерим ничего
	if (!auth) {
		return null
	}

	const { logout, user } = auth

	if (!user) {
		return null
	}

	const fullName = getUserFullName(user)
	const avatarUrl = getAvatarUrl(user.avatarUrls) || user.avatar
	const initials = getUserInitials(user)

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' className='relative h-9 w-9 rounded-full'>
					<Avatar className='h-9 w-9 cursor-pointer'>
						<AvatarImage src={avatarUrl} alt={fullName} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>
					<span className='sr-only'>{fullName}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-56 rounded-lg' align='end' forceMount>
				<DropdownMenuLabel className='p-0 font-normal'>
					<div className='flex items-center gap-2 px-2 py-1.5 text-left text-sm'>
						<Avatar className='h-8 w-8'>
							<AvatarImage src={avatarUrl} alt={fullName} />
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
						<div className='flex flex-col space-y-1'>
							<p className='text-sm font-medium leading-none'>{fullName}</p>
							<p className='text-xs leading-none text-muted-foreground'>
								{user.email}
							</p>
						</div>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={logout}>
					<LogOut className='mr-2 size-4' />
					<span>Выйти</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
