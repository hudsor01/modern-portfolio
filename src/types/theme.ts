export type Theme = 'light' | 'dark' | 'system'

export interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

export interface ThemeProviderState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export interface ExtendedThemeProviderProps extends Omit<ThemeProviderProps, 'attribute' | 'defaultTheme'> {
  /** Force color scheme for testing or preview purposes */
  forcedTheme?: string
  /** Enable smooth theme transitions */
  enableTransitions?: boolean
  /** Custom attribute name for theme */
  attribute?: string
  /** Default theme when first-time users visit the site */
  defaultTheme?: Theme
  /** Disable automatic theme detection and adjustment */
  disableTransitionOnChange?: boolean
}
