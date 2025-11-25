import { AppSidebar } from '@/components/app-sidebar'
import { DashboardPageContent } from '@/components/dashboard-page-content'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ProtectedRoute } from '@/provider/ProtectedRoute'

export default function Page() {
	return (
		<ProtectedRoute>
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
					<DashboardPageContent />
				</SidebarInset>
			</SidebarProvider>
		</ProtectedRoute>
	)
}
