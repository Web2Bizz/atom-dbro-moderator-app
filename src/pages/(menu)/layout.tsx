import { ProtectedRoute } from '@/provider/ProtectedRoute'
import type { ReactNode } from 'react'

interface MenuLayoutProps {
	readonly children: ReactNode
}

export default function MenuLayout({ children }: MenuLayoutProps) {
	return <ProtectedRoute>{children}</ProtectedRoute>
}

