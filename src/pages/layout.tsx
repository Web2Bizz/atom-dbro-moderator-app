import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { setupStore } from '@/store/store'
import { ThemeProvider } from 'next-themes'
import { useMemo } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

interface LayoutProps {
	readonly children: React.ReactNode
}

// Создаем store один раз вне компонента (singleton pattern)
let storeInstance: ReturnType<typeof setupStore> | null = null

function getStore() {
	storeInstance ??= setupStore()
	return storeInstance
}

export default function Layout({ children }: LayoutProps) {
	// Используем useMemo для гарантии, что store создается только один раз
	const { store, persistor } = useMemo(() => getStore(), [])

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AuthProvider>
					<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
						<div>
							<main>{children}</main>
							<Toaster />
						</div>
					</ThemeProvider>
				</AuthProvider>
			</PersistGate>
		</Provider>
	)
}
