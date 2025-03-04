'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Sun, Moon } from 'lucide-react'

export function ModeToggle() {
	const { theme, setTheme } = useTheme()

	return (
		<Button
			variant='outline'
			size='icon'
			className='rounded-full border border-slate-200 bg-white shadow-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50'
			onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
			aria-label='Toggle theme'>
			<Sun className='h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
			<Moon className='absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
		</Button>
	)
}
