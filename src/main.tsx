import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'w2b-vite-filebased-routing/react'
import { Spinner } from './components/ui/spinner'
import './index.css'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<RouterProvider preloader={<Spinner />} />
	</StrictMode>
)
