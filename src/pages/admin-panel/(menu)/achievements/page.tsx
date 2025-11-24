import { AppSidebar } from '@/components/app-sidebar'
import { AchievementsPageContent } from '@/components/menu/achievements/achievements-page-content'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function AchievementsPage() {
	return (
		<SidebarProvider
			style={
				{
					'--sidebar-width': 'calc(var(--spacing) * 72)',
					'--header-height': 'calc(var(--spacing) * 12)',
				} as React.CSSProperties
			}
		>
			<AppSidebar variant='inset' />
			<SidebarInset>
				<SiteHeader />
				<AchievementsPageContent />
			</SidebarInset>
		</SidebarProvider>
	)
}

