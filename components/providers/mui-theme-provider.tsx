'use client'

import { ReactNode, useEffect, useState } from 'react'
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { useTheme } from 'next-themes'
import { getTheme } from '@/lib/mui/theme'

interface MUIThemeProviderProps {
  children: ReactNode
}

export function MUIThemeProvider({ children }: MUIThemeProviderProps) {
  const { resolvedTheme } = useTheme()
  const [currentTheme, setCurrentTheme] = useState(createTheme(getTheme('light')))
  const [mounted, setMounted] = useState(false)

  // Sync Material UI theme with next-themes
  useEffect(() => {
    setMounted(true)
    setCurrentTheme(createTheme(getTheme(resolvedTheme === 'dark' ? 'dark' : 'light')))
  }, [resolvedTheme])

  // Avoid rendering with the wrong theme on first load
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <MUIThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  )
}
