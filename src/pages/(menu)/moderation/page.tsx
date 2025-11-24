import { AppSidebar } from '@/components/app-sidebar'
import { ModerationPageContent } from '@/components/menu/organizations/moderation/moderation-page-content'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function ModerationPage() {
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
				<ModerationPageContent />
			</SidebarInset>
		</SidebarProvider>
	)
}

