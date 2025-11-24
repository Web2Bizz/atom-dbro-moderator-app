import { ThemeProvider } from 'next-themes'

interface LayoutProps {
	readonly children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
	return (
		<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
			<div>
				<main>{children}</main>
			</div>
		</ThemeProvider>
	)
}
