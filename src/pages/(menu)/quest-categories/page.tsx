import { AppSidebar } from '@/components/app-sidebar'
import { QuestCategoriesPageContent } from '@/components/menu/quest-categories/quest-categories-page-content'
import { SiteHeader } from '@/components/site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function QuestCategoriesPage() {
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
				<QuestCategoriesPageContent />
			</SidebarInset>
		</SidebarProvider>
	)
}

