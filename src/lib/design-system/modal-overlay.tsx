/**
 * Standardized Modal and Overlay Components
 *
 * Provides consistent modal, drawer, and overlay patterns with standardized
 * animations, positioning, and interaction behaviors.
 */

'use client'

import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createModalClasses } from './interactive-elements'
import { Button } from '@/components/ui/button'

// ============================================================================
// STANDARDIZED MODAL COMPONENT
// ============================================================================

interface StandardModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title?: string
  description?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  position?: 'center' | 'top' | 'bottom'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
}

export function StandardModal({
  open,
  onOpenChange,
  title,
  description,
  size = 'md',
  position = 'center',
  showCloseButton = true,
  closeOnOverlayClick = true,
  children,
  footer,
  className,
}: StandardModalProps) {
  const modalClasses = createModalClasses({
    content: { size, position, animation: 'scale' },
  })

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={modalClasses.overlay}
          onClick={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
        />
        <DialogPrimitive.Content
          className={cn(modalClasses.content, className)}
          onPointerDownOutside={closeOnOverlayClick ? undefined : (e) => e.preventDefault()}
        >
          {/* Header */}
          {(title || description || showCloseButton) && (
            <div className="flex flex-col space-y-2 text-center sm:text-left">
              <div className="flex items-center justify-between">
                {title && (
                  <DialogPrimitive.Title className="text-lg font-semibold leading-none tracking-tight">
                    {title}
                  </DialogPrimitive.Title>
                )}
                {showCloseButton && (
                  <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                )}
              </div>
              {description && (
                <DialogPrimitive.Description className="text-sm text-muted-foreground">
                  {description}
                </DialogPrimitive.Description>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1">{children}</div>

          {/* Footer */}
          {footer && (
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              {footer}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

// ============================================================================
// CONFIRMATION MODAL COMPONENT
// ============================================================================

interface ConfirmationModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  variant?: 'default' | 'destructive' | 'warning'
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  onCancel?: () => void
  loading?: boolean
  className?: string
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  variant = 'default',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  className,
}: ConfirmationModalProps) {
  const [isLoading, setIsLoading] = React.useState(false)

  const handleConfirm = React.useCallback(async () => {
    if (loading || isLoading) return

    setIsLoading(true)
    try {
      await onConfirm()
      onOpenChange?.(false)
    } finally {
      setIsLoading(false)
    }
  }, [onConfirm, onOpenChange, loading, isLoading])

  const handleCancel = React.useCallback(() => {
    if (loading || isLoading) return
    onCancel?.()
    onOpenChange?.(false)
  }, [onCancel, onOpenChange, loading, isLoading])

  const icons = {
    default: Info,
    destructive: AlertTriangle,
    warning: AlertCircle,
  }

  const Icon = icons[variant]

  const iconColors = {
    default: 'text-blue-500',
    destructive: 'text-red-500',
    warning: 'text-yellow-500',
  }

  const confirmVariants = {
    default: 'default' as const,
    destructive: 'destructive' as const,
    warning: 'default' as const,
  }

  return (
    <StandardModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      className={className}
      closeOnOverlayClick={!loading && !isLoading}
      showCloseButton={false}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            variant === 'default' && 'bg-blue-100 dark:bg-blue-900/20',
            variant === 'destructive' && 'bg-red-100 dark:bg-red-900/20',
            variant === 'warning' && 'bg-yellow-100 dark:bg-yellow-900/20'
          )}
        >
          <Icon className={cn('w-6 h-6', iconColors[variant])} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={loading || isLoading}
            className="flex-1"
          >
            {cancelLabel}
          </Button>
          <Button
            variant={confirmVariants[variant]}
            onClick={handleConfirm}
            disabled={loading || isLoading}
            className="flex-1"
          >
            {loading || isLoading ? 'Loading...' : confirmLabel}
          </Button>
        </div>
      </div>
    </StandardModal>
  )
}

// ============================================================================
// NOTIFICATION MODAL COMPONENT
// ============================================================================

interface NotificationModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description?: string
  variant?: 'success' | 'error' | 'warning' | 'info'
  actionLabel?: string
  onAction?: () => void
  autoClose?: boolean
  autoCloseDelay?: number
  className?: string
}

export function NotificationModal({
  open,
  onOpenChange,
  title,
  description,
  variant = 'info',
  actionLabel = 'OK',
  onAction,
  autoClose = false,
  autoCloseDelay = 3000,
  className,
}: NotificationModalProps) {
  React.useEffect(() => {
    if (open && autoClose) {
      const timer = setTimeout(() => {
        onOpenChange?.(false)
      }, autoCloseDelay)

      return () => clearTimeout(timer)
    }
    return undefined
  }, [open, autoClose, autoCloseDelay, onOpenChange])

  const handleAction = React.useCallback(() => {
    onAction?.()
    onOpenChange?.(false)
  }, [onAction, onOpenChange])

  const icons = {
    success: CheckCircle,
    error: AlertTriangle,
    warning: AlertCircle,
    info: Info,
  }

  const Icon = icons[variant]

  const iconColors = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500',
  }

  const backgroundColors = {
    success: 'bg-green-100 dark:bg-green-900/20',
    error: 'bg-red-100 dark:bg-red-900/20',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20',
    info: 'bg-blue-100 dark:bg-blue-900/20',
  }

  return (
    <StandardModal
      open={open}
      onOpenChange={onOpenChange}
      size="sm"
      className={className}
      showCloseButton={false}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            backgroundColors[variant]
          )}
        >
          <Icon className={cn('w-6 h-6', iconColors[variant])} />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        <Button onClick={handleAction} className="w-full">
          {actionLabel}
        </Button>
      </div>
    </StandardModal>
  )
}

// ============================================================================
// LOADING MODAL COMPONENT
// ============================================================================

interface LoadingModalProps {
  open?: boolean
  title?: string
  description?: string
  progress?: number
  className?: string
}

export function LoadingModal({
  open,
  title = 'Loading...',
  description,
  progress,
  className,
}: LoadingModalProps) {
  return (
    <StandardModal
      open={open}
      size="sm"
      className={className}
      showCloseButton={false}
      closeOnOverlayClick={false}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>

        {typeof progress === 'number' && (
          <div className="w-full space-y-2">
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
          </div>
        )}
      </div>
    </StandardModal>
  )
}
