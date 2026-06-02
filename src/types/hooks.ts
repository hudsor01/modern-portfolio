/**
 * Hook Types
 * Shared types for reusable hooks
 */

import type { MouseEvent } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastOptions {
  duration?: number
  id?: string | number
  description?: string
  action?: {
    label: string
    onClick: (event: MouseEvent<HTMLButtonElement>) => void
  }
  cancel?: {
    label: string
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  }
  onDismiss?: () => void
  onAutoClose?: () => void
}
