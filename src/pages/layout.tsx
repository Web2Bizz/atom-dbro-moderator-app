import { ThemeProvider } from 'next-themes'
import { setupStore } from '@/store/store'
import { useMemo } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

interface LayoutProps {
	readonly children: React.ReactNode
}

// Создаем store один раз вне компонента (singleton pattern)
let storeInstance: ReturnType<typeof setupStore> | null = null

function getStore() {
	if (!storeInstance) {
		storeInstance = setupStore()
	}
	return storeInstance
}

export default function Layout({ children }: LayoutProps) {
	// Используем useMemo для гарантии, что store создается только один раз
	const { store, persistor } = useMemo(() => getStore(), [])

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ThemeProvider attribute='class' defaultTheme='system' enableSystem>
					<div>
						<main>{children}</main>
					</div>
				</ThemeProvider>
			</PersistGate>
		</Provider>
	)
}
