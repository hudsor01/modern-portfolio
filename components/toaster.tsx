'use client'

import { Toaster as HotToaster } from 'react-hot-toast'
import { useTheme } from 'next-themes'

export function Toaster() {
	const { theme } = useTheme()
	const isDark = theme === 'dark'

	return (
		<HotToaster
			position='top-right'
			toastOptions={{
				duration: 3000,
				style: {
					background: isDark ? '#2a2a2a' : '#fff',
					color: isDark ? '#f5f5f5' : '#333',
					border: isDark ? '1px solid #3a3a3a' : '1px solid #e5e7eb',
					boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
					padding: '12px 16px',
					borderRadius: '8px',
					fontSize: '0.875rem',
				},
				success: {
					iconTheme: {
						primary: '#10B981',
						secondary: 'white',
					},
				},
				error: {
					iconTheme: {
						primary: '#EF4444',
						secondary: 'white',
					},
				},
			}}
		/>
	)
}
