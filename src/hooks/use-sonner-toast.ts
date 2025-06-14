'use client'

import { toast } from 'sonner'
import type { MouseEvent } from 'react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastOptions {
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

function mapToastOptions(options?: ToastOptions) {
  if (!options) return undefined
  return {
    ...options,
    action: options.action
      ? {
          label: options.action.label,
          onClick: options.action.onClick,
        }
      : undefined,
    cancel:
      options.cancel && options.cancel.onClick
        ? {
            label: options.cancel.label,
            onClick: options.cancel.onClick,
          }
        : undefined,
  }
}

export function useToast() {
  const showToast = (message: string, type: ToastType = 'info', options?: ToastOptions) => {
    const mappedOptions = mapToastOptions(options)
    switch (type) {
      case 'success':
        return toast.success(message, mappedOptions)
      case 'error':
        return toast.error(message, mappedOptions)
      case 'warning':
        return toast.warning(message, mappedOptions)
      case 'info':
      default:
        return toast.info(message, mappedOptions)
    }
  }

  return {
    toast: showToast,
    success: (message: string, options?: ToastOptions) => showToast(message, 'success', options),
    error: (message: string, options?: ToastOptions) => showToast(message, 'error', options),
    warning: (message: string, options?: ToastOptions) => showToast(message, 'warning', options),
    info: (message: string, options?: ToastOptions) => showToast(message, 'info', options),
    loading: (message: string, options?: ToastOptions) => toast.loading(message, mapToastOptions(options)),
    dismiss: toast.dismiss,
    promise: toast.promise,
  }
}
