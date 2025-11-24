import { AppSidebar } from '@/components/app-sidebar'
import { SupportPageContent } from '@/components/menu/support/support-page-content'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function SupportPage() {
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
				<SupportPageContent />
			</SidebarInset>
		</SidebarProvider>
	)
}
