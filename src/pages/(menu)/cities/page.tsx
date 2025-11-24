import { AppSidebar } from '@/components/app-sidebar'
import { CitiesPageContent } from '@/components/menu/cities/cities-page-content'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function CitiesPage() {
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
				<CitiesPageContent />
			</SidebarInset>
		</SidebarProvider>
	)
}

