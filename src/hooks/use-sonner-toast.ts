'use client'

import { toast } from 'sonner'
import type { ToastOptions, ToastType } from '@/types/hooks'

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

const TOAST_METHODS: Record<ToastType, typeof toast.success> = {
  success: toast.success,
  error: toast.error,
  warning: toast.warning,
  info: toast.info,
}

export function useToast() {
  const showToast = (message: string, type: ToastType = 'info', options?: ToastOptions) => {
    const mappedOptions = mapToastOptions(options)
    const toastMethod = TOAST_METHODS[type] || toast.info
    return toastMethod(message, mappedOptions)
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
