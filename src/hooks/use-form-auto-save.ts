/**
 * Form Auto-Save Hook
 * Provides auto-save functionality using Jotai atoms with debouncing and persistence
 */

import { useEffect, useCallback, useRef } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { toast } from 'sonner'

// Auto-save configuration atom
const autoSaveConfigAtom = atom({
  debounceMs: 300,
  enabled: true,
  storageKey: 'form-auto-save',
  maxRetries: 3,
  showToasts: false, // Subtle, no toast spam
})

// Auto-save state atom for tracking all active forms
export interface AutoSaveState {
  formId: string
  data: Record<string, any>
  lastSaved: Date
  isDirty: boolean
  isSaving: boolean
  error: string | null
  retryCount: number
}

const autoSaveStatesAtom = atomWithStorage<Record<string, AutoSaveState>>(
  'form-auto-save-states',
  {}
)

// Auto-save status atom for UI feedback
export const autoSaveStatusAtom = atom((get) => {
  const states = get(autoSaveStatesAtom)
  const activeStates = Object.values(states).filter(state => state.isDirty || state.isSaving)
  
  return {
    hasUnsaved: activeStates.some(state => state.isDirty && !state.isSaving),
    isSaving: activeStates.some(state => state.isSaving),
    hasErrors: activeStates.some(state => state.error !== null),
    count: activeStates.length
  }
})

/**
 * Hook for form auto-save functionality
 */
export function useFormAutoSave<T extends Record<string, any>>(
  formId: string,
  formData: T,
  options: {
    enabled?: boolean
    debounceMs?: number
    onSave?: (data: T) => Promise<void>
    onError?: (error: Error) => void
    onRestore?: (data: T) => void
    validateBeforeSave?: (data: T) => boolean
  } = {}
) {
  const [autoSaveStates, setAutoSaveStates] = useAtom(autoSaveStatesAtom)
  const config = useAtomValue(autoSaveConfigAtom)
  const debounceTimeoutRef = useRef<NodeJS.Timeout>()
  const initialLoadRef = useRef(false)

  const currentState = autoSaveStates[formId]
  const isEnabled = options.enabled ?? config.enabled
  const debounceMs = options.debounceMs ?? config.debounceMs

  // Update state helper
  const updateState = useCallback(
    (updates: Partial<AutoSaveState>) => {
      setAutoSaveStates(prev => ({
        ...prev,
        [formId]: {
          formId,
          data: formData,
          lastSaved: new Date(),
          isDirty: false,
          isSaving: false,
          error: null,
          retryCount: 0,
          ...prev[formId],
          ...updates,
        }
      }))
    },
    [formId, formData, setAutoSaveStates]
  )

  // Auto-save function
  const performAutoSave = useCallback(async () => {
    if (!isEnabled || !options.onSave) return

    // Validate before saving if validator provided
    if (options.validateBeforeSave && !options.validateBeforeSave(formData)) {
      updateState({ isDirty: false, error: 'Validation failed' })
      return
    }

    updateState({ isSaving: true, error: null })

    try {
      await options.onSave(formData)
      updateState({ 
        isDirty: false, 
        isSaving: false, 
        lastSaved: new Date(),
        retryCount: 0,
        error: null
      })
      
      if (config.showToasts) {
        toast.success('Form saved automatically', { 
          id: `auto-save-${formId}`,
          duration: 2000 
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Auto-save failed'
      const newRetryCount = (currentState?.retryCount || 0) + 1
      
      updateState({ 
        isSaving: false, 
        error: errorMessage,
        retryCount: newRetryCount
      })

      if (options.onError) {
        options.onError(error instanceof Error ? error : new Error(errorMessage))
      }

      // Retry logic with exponential backoff
      if (newRetryCount < config.maxRetries) {
        const retryDelay = Math.pow(2, newRetryCount) * 1000 // 2s, 4s, 8s
        setTimeout(() => {
          performAutoSave()
        }, retryDelay)
      } else {
        toast.error('Failed to auto-save form data', {
          id: `auto-save-error-${formId}`,
          duration: 5000,
          action: {
            label: 'Retry',
            onClick: () => performAutoSave()
          }
        })
      }
    }
  }, [formData, isEnabled, options, config, formId, updateState, currentState?.retryCount])

  // Debounced auto-save
  const debouncedAutoSave = useCallback(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    debounceTimeoutRef.current = setTimeout(() => {
      performAutoSave()
    }, debounceMs)
  }, [performAutoSave, debounceMs])

  // Mark as dirty when form data changes
  useEffect(() => {
    if (!isEnabled) return

    // Skip initial load
    if (!initialLoadRef.current) {
      initialLoadRef.current = true
      return
    }

    // Check if data actually changed
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(currentState?.data)
    if (hasChanged) {
      updateState({ isDirty: true, data: formData })
      debouncedAutoSave()
    }
  }, [formData, isEnabled, currentState?.data, updateState, debouncedAutoSave])

  // Restore saved data on mount
  useEffect(() => {
    if (!isEnabled || !options.onRestore) return

    const savedState = autoSaveStates[formId]
    if (savedState && savedState.data && savedState.isDirty) {
      // Only restore if the saved data is different from current data
      const isSavedDataDifferent = JSON.stringify(savedState.data) !== JSON.stringify(formData)
      if (isSavedDataDifferent) {
        options.onRestore(savedState.data as T)
        toast.info('Restored unsaved form data', {
          id: `restore-${formId}`,
          duration: 4000,
          action: {
            label: 'Dismiss',
            onClick: () => clearSavedData()
          }
        })
      }
    }
  }, [formId, autoSaveStates, formData, options.onRestore, isEnabled])

  // Clear saved data
  const clearSavedData = useCallback(() => {
    setAutoSaveStates(prev => {
      const newState = { ...prev }
      delete newState[formId]
      return newState
    })
  }, [formId, setAutoSaveStates])

  // Manual save
  const manualSave = useCallback(async () => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }
    await performAutoSave()
  }, [performAutoSave])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return {
    // State
    isDirty: currentState?.isDirty || false,
    isSaving: currentState?.isSaving || false,
    lastSaved: currentState?.lastSaved || null,
    error: currentState?.error || null,
    retryCount: currentState?.retryCount || 0,
    
    // Actions
    manualSave,
    clearSavedData,
    
    // Utils
    hasUnsavedChanges: Boolean(currentState?.isDirty),
  }
}

/**
 * Hook for auto-save status across all forms
 */
export function useAutoSaveStatus() {
  return useAtomValue(autoSaveStatusAtom)
}

/**
 * Hook for managing auto-save configuration
 */
export function useAutoSaveConfig() {
  return useAtom(autoSaveConfigAtom)
}