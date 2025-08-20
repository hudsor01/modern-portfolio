/**
 * Auto-Save Status Indicator
 * Provides subtle visual feedback for form auto-save state
 */

'use client'

import React from 'react'
import { m as motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, AlertCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAutoSaveStatus } from '@/hooks/use-form-auto-save'

interface AutoSaveIndicatorProps {
  /**
   * Show indicator for a specific form's state
   */
  isDirty?: boolean
  isSaving?: boolean
  lastSaved?: Date | null
  error?: string | null
  /**
   * Visual variant
   */
  variant?: 'minimal' | 'detailed' | 'badge'
  /**
   * Position of the indicator
   */
  position?: 'inline' | 'floating'
  /**
   * Custom className
   */
  className?: string
  /**
   * Test ID for testing
   */
  'data-testid'?: string
}

export function AutoSaveIndicator({
  isDirty,
  isSaving,
  lastSaved,
  error,
  variant = 'minimal',
  position = 'inline',
  className,
  'data-testid': testId
}: AutoSaveIndicatorProps) {
  // Use global status if no specific state provided
  const globalStatus = useAutoSaveStatus()
  
  const actualIsDirty = isDirty ?? globalStatus.hasUnsaved
  const actualIsSaving = isSaving ?? globalStatus.isSaving
  const actualHasErrors = error != null || globalStatus.hasErrors

  // Determine current state
  const getState = () => {
    if (actualIsSaving) return 'saving'
    if (actualHasErrors) return 'error'
    if (actualIsDirty) return 'dirty'
    if (lastSaved) return 'saved'
    return 'idle'
  }

  const state = getState()

  // Don't show indicator if idle
  if (state === 'idle') return null

  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    
    if (diffSeconds < 10) return 'just now'
    if (diffSeconds < 60) return `${diffSeconds}s ago`
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    return date.toLocaleTimeString()
  }

  const getIcon = () => {
    switch (state) {
      case 'saving':
        return <Loader2 className="h-3 w-3 animate-spin" />
      case 'error':
        return <AlertCircle className="h-3 w-3" />
      case 'dirty':
        return <Clock className="h-3 w-3" />
      case 'saved':
        return <Check className="h-3 w-3" />
      default:
        return null
    }
  }

  const getMessage = () => {
    switch (state) {
      case 'saving':
        return 'Saving...'
      case 'error':
        return error || 'Save failed'
      case 'dirty':
        return 'Unsaved changes'
      case 'saved':
        return lastSaved ? `Saved ${formatLastSaved(lastSaved)}` : 'Saved'
      default:
        return ''
    }
  }

  const getColors = () => {
    switch (state) {
      case 'saving':
        return 'text-blue-400 bg-blue-500/10 border-blue-400/20'
      case 'error':
        return 'text-red-400 bg-red-500/10 border-red-400/20'
      case 'dirty':
        return 'text-yellow-400 bg-yellow-500/10 border-yellow-400/20'
      case 'saved':
        return 'text-green-400 bg-green-500/10 border-green-400/20'
      default:
        return 'text-gray-400 bg-gray-500/10 border-gray-400/20'
    }
  }

  const baseClasses = cn(
    'inline-flex items-center gap-1.5 text-xs font-medium transition-all duration-300',
    getColors(),
    position === 'floating' && 'fixed bottom-4 right-4 z-50 shadow-lg shadow-black/10',
    className
  )

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        baseClasses,
        variant === 'minimal' && 'px-2 py-1',
        variant === 'detailed' && 'px-3 py-1.5 rounded-full border backdrop-blur',
        variant === 'badge' && 'px-2 py-0.5 rounded-md border backdrop-blur'
      )}
      data-testid={testId}
    >
      <motion.div
        animate={state === 'saving' ? { rotate: 360 } : { rotate: 0 }}
        transition={state === 'saving' ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
      >
        {getIcon()}
      </motion.div>
      
      {variant !== 'minimal' && (
        <span className="whitespace-nowrap">
          {getMessage()}
        </span>
      )}
    </motion.div>
  )

  return (
    <AnimatePresence mode="wait">
      {content}
    </AnimatePresence>
  )
}

/**
 * Global Auto-Save Status Badge
 * Shows overall auto-save status for all forms
 */
export function GlobalAutoSaveStatus({ 
  className, 
  'data-testid': testId 
}: { 
  className?: string
  'data-testid'?: string 
}) {
  const status = useAutoSaveStatus()
  
  if (status.count === 0) return null

  return (
    <AutoSaveIndicator
      variant="badge"
      position="floating"
      className={className}
      data-testid={testId}
    />
  )
}

/**
 * Form Auto-Save Status
 * Shows auto-save status for a specific form
 */
interface FormAutoSaveStatusProps {
  isDirty: boolean
  isSaving: boolean
  lastSaved?: Date | null
  error?: string | null
  variant?: 'minimal' | 'detailed' | 'badge'
  className?: string
  'data-testid'?: string
}

export function FormAutoSaveStatus({
  isDirty,
  isSaving,
  lastSaved,
  error,
  variant = 'detailed',
  className,
  'data-testid': testId
}: FormAutoSaveStatusProps) {
  return (
    <AutoSaveIndicator
      isDirty={isDirty}
      isSaving={isSaving}
      lastSaved={lastSaved}
      error={error}
      variant={variant}
      position="inline"
      className={className}
      data-testid={testId}
    />
  )
}