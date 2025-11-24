import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { HeaderUser } from './header-user'
import { ThemeToggle } from './theme-toggle'

const userData = {
	name: 'shadcn',
	email: 'm@example.com',
	avatar: '/avatars/shadcn.jpg',
}

export function SiteHeader() {
	return (
		<header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
			<div className='flex w-full items-center justify-between gap-1 px-4 lg:gap-2 lg:px-6'>
				<div className='flex items-center gap-1 lg:gap-2'>
					<SidebarTrigger className='-ml-1' />
					<Separator
						orientation='vertical'
						className='mx-2 data-[orientation=vertical]:h-4'
					/>
					<h1 className='text-base font-medium'></h1>
				</div>
				<div className='flex items-center gap-2'>
					<ThemeToggle />
					<HeaderUser user={userData} />
				</div>
			</div>
		</header>
	)
}
