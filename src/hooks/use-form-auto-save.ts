/**
 * Form Auto-Save Hook
 * Provides auto-save functionality with debouncing and localStorage persistence
 */

import { useEffect, useCallback, useRef, useState } from 'react'

// Auto-save configuration
const AUTO_SAVE_CONFIG = {
  debounceMs: 300,
  storageKey: 'form-auto-save',
  maxRetries: 3,
}

export interface AutoSaveStatus {
  isSaving: boolean
  hasUnsaved: boolean
  hasErrors: boolean
  lastSaved: Date | null
  error: string | null
}

/**
 * Simple form auto-save hook without Jotai dependencies
 */
export function useFormAutoSave<T extends Record<string, unknown>>(
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
  const [status, setStatus] = useState<AutoSaveStatus>({
    isSaving: false,
    hasUnsaved: false,
    hasErrors: false,
    lastSaved: null,
    error: null,
  })

  const debounceTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const initialLoadRef = useRef(false)
  const isFirstRenderRef = useRef(true)
  const retryCountRef = useRef(0)

  const {
    enabled = true,
    debounceMs = AUTO_SAVE_CONFIG.debounceMs,
    onSave,
    onError,
    onRestore,
    validateBeforeSave,
  } = options

  // Save to localStorage
  const saveToLocalStorage = useCallback((data: T) => {
    try {
      const storageKey = `${AUTO_SAVE_CONFIG.storageKey}-${formId}`
      localStorage.setItem(storageKey, JSON.stringify({
        data,
        timestamp: new Date().toISOString(),
      }))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }, [formId])

  // Load from localStorage
  const loadFromLocalStorage = useCallback((): T | null => {
    try {
      const storageKey = `${AUTO_SAVE_CONFIG.storageKey}-${formId}`
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.data
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
    }
    return null
  }, [formId])

  // Clear localStorage
  const clearLocalStorage = useCallback(() => {
    try {
      const storageKey = `${AUTO_SAVE_CONFIG.storageKey}-${formId}`
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.warn('Failed to clear localStorage:', error)
    }
  }, [formId])

  // Perform save operation
  const performSave = useCallback(async (data: T) => {
    if (!enabled || (validateBeforeSave && !validateBeforeSave(data))) {
      return
    }

    setStatus(prev => ({ ...prev, isSaving: true, error: null }))

    try {
      if (onSave) {
        await onSave(data)
      }
      
      saveToLocalStorage(data)
      retryCountRef.current = 0
      
      setStatus(prev => ({
        ...prev,
        isSaving: false,
        hasUnsaved: false,
        hasErrors: false,
        lastSaved: new Date(),
        error: null,
      }))

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Auto-save failed'
      
      setStatus(prev => ({
        ...prev,
        isSaving: false,
        hasErrors: true,
        error: errorMessage,
      }))

      retryCountRef.current += 1
      
      if (onError) {
        onError(error instanceof Error ? error : new Error(errorMessage))
      }

      // Retry logic
      if (retryCountRef.current < AUTO_SAVE_CONFIG.maxRetries) {
        setTimeout(() => performSave(data), 1000 * retryCountRef.current)
      }
    }
  }, [enabled, validateBeforeSave, onSave, saveToLocalStorage, onError])

  // Debounced save
  const debouncedSave = useCallback((data: T) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current)
    }

    setStatus(prev => ({ ...prev, hasUnsaved: true }))

    debounceTimeoutRef.current = setTimeout(() => {
      performSave(data)
    }, debounceMs)
  }, [performSave, debounceMs])

  // Load saved data on mount
  useEffect(() => {
    if (!initialLoadRef.current) {
      const savedData = loadFromLocalStorage()
      if (savedData && onRestore) {
        onRestore(savedData)
      }
      initialLoadRef.current = true
    }
  }, [loadFromLocalStorage, onRestore])

  // Auto-save when form data changes
  useEffect(() => {
    // Skip on initial render - only save on subsequent changes
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      return
    }

    if (!enabled || !initialLoadRef.current) {
      return
    }

    debouncedSave(formData)
  }, [formData, enabled, debouncedSave])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return {
    status,
    clearSaved: clearLocalStorage,
    forceSave: () => performSave(formData),
  }
}

/**
 * Hook for monitoring overall auto-save status
 * Simplified version without Jotai
 */
export function useAutoSaveStatus() {
  // This is a simplified version - in a real app you might want
  // to track multiple forms, but for now we'll keep it simple
  return {
    hasUnsaved: false,
    isSaving: false,
    hasErrors: false,
    count: 0,
  }
}