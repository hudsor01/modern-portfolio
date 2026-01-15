/**
 * Hook Types
 * Shared types for reusable hooks
 */

import type { MouseEvent } from 'react'
import type { Project } from '@/types/project'

export interface PageAnalyticsOptions {
  type: 'blog' | 'project'
  slug: string
  trackReadingTime?: boolean
  trackScrollDepth?: boolean
}

export interface ViewTrackingData {
  type: string
  slug: string
  readingTime?: number
  scrollDepth?: number
  referrer?: string
}

export interface UseSwiperAutoplayOptions {
  delay?: number
  disableOnInteraction?: boolean
  pauseOnMouseEnter?: boolean
}

export interface UseQuickViewModalResult<T> {
  isOpen: boolean
  selectedItem: T | null
  open: (item: T) => void
  close: () => void
  setOpen: (isOpen: boolean) => void
}

export type ProjectsQueryOptions = {
  queryKey: readonly ['projects']
  queryFn: () => Promise<Project[]>
}

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
