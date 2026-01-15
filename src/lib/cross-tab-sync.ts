/**
 * Cross-Tab Synchronization Utility
 * Synchronizes form data across browser tabs using localStorage events
 */

import { z } from 'zod'
import { createContextLogger } from '@/lib/logger'

const syncLogger = createContextLogger('CrossTabSync')

export interface CrossTabMessage {
  type: 'form-update' | 'form-clear' | 'form-restore' | 'form-conflict'
  formId: string
  data?: Record<string, unknown>
  timestamp: number
  tabId: string
  version?: number // For optimistic concurrency control
  fieldPath?: string // For field-level updates
}

// Zod schema for runtime validation of CrossTabMessage
const CrossTabMessageSchema = z.object({
  type: z.enum(['form-update', 'form-clear', 'form-restore', 'form-conflict']),
  formId: z.string(),
  data: z.record(z.string(), z.unknown()).optional(),
  timestamp: z.number(),
  tabId: z.string(),
  version: z.number().optional(),
  fieldPath: z.string().optional(),
})

// Generate unique tab ID
const TAB_ID = crypto.randomUUID()

class CrossTabSync implements Disposable {
  private listeners = new Map<string, Set<(data: unknown) => void>>()
  private lastUpdate = new Map<string, number>()
  private lastKnownVersions = new Map<string, number>()
  private conflictResolvers = new Map<
    string,
    (local: Record<string, unknown>, remote: Record<string, unknown>) => Record<string, unknown>
  >()
  private boundStorageHandler: (event: StorageEvent) => void
  private boundBeforeUnloadHandler: () => void
  private isEnabled: boolean = true

  constructor() {
    // Bind handlers once for proper cleanup
    this.boundStorageHandler = this.handleStorageEvent.bind(this)
    this.boundBeforeUnloadHandler = () => this.cleanup()

    // Listen for storage events from other tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.boundStorageHandler)

      // Cleanup on beforeunload
      window.addEventListener('beforeunload', this.boundBeforeUnloadHandler)
    }
  }

  /**
   * Register a listener for cross-tab updates
   */
  subscribe(formId: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(formId)) {
      this.listeners.set(formId, new Set())
    }

    // Safe access without non-null assertion
    const listeners = this.listeners.get(formId)
    if (listeners) {
      listeners.add(callback)
    }

    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(formId)
      if (listeners) {
        listeners.delete(callback)
        if (listeners.size === 0) {
          this.listeners.delete(formId)
        }
      }
    }
  }

  /**
   * Broadcast form update to other tabs
   */
  broadcastUpdate(formId: string, data: Record<string, unknown>, fieldPath?: string) {
    if (!this.isEnabled) return

    const version = (this.lastKnownVersions.get(formId) || 0) + 1
    this.lastKnownVersions.set(formId, version)

    const message: CrossTabMessage = {
      type: 'form-update',
      formId,
      data,
      timestamp: Date.now(),
      tabId: TAB_ID,
      version,
      fieldPath,
    }

    try {
      localStorage.setItem(`cross-tab-sync-${formId}`, JSON.stringify(message))
      this.lastUpdate.set(formId, message.timestamp)
    } catch (error) {
      syncLogger.warn('Failed to broadcast cross-tab update', { error })
    }
  }

  /**
   * Broadcast form clear to other tabs
   */
  broadcastClear(formId: string) {
    const message: CrossTabMessage = {
      type: 'form-clear',
      formId,
      timestamp: Date.now(),
      tabId: TAB_ID,
    }

    try {
      localStorage.setItem(`cross-tab-sync-${formId}`, JSON.stringify(message))
      localStorage.removeItem(`form-auto-save-${formId}`)
      this.lastUpdate.delete(formId)
    } catch (error) {
      syncLogger.warn('Failed to broadcast cross-tab clear', { error })
    }
  }

  /**
   * Get latest form data from storage
   */
  getLatestData(formId: string): Record<string, unknown> | null {
    try {
      const stored = localStorage.getItem(`form-auto-save-${formId}`)
      if (stored) {
        const parsed = JSON.parse(stored)
        // Validate that it's at least a plain object
        const schema = z.record(z.string(), z.unknown())
        return schema.parse(parsed)
      }
    } catch (error) {
      syncLogger.warn('Failed to get latest form data', { error })
    }
    return null
  }

  /**
   * Handle storage events from other tabs
   */
  private handleStorageEvent(event: StorageEvent) {
    if (!event.key?.startsWith('cross-tab-sync-')) return

    const formId = event.key.replace('cross-tab-sync-', '')
    const listeners = this.listeners.get(formId)

    if (!listeners || listeners.size === 0) return

    try {
      const parsed = JSON.parse(event.newValue || '{}')
      const message = CrossTabMessageSchema.parse(parsed)

      // Ignore messages from the same tab
      if (message.tabId === TAB_ID) return

      // Handle different message types
      switch (message.type) {
        case 'form-update': {
          if (message.data) {
            // Check version for optimistic concurrency control
            const currentVersion = this.lastKnownVersions.get(formId) || 0
            if (message.version && message.version <= currentVersion) {
              // Outdated message, ignore
              return
            }

            if (message.fieldPath) {
              // Field-level update - can be safely merged
              listeners.forEach((callback) => {
                callback({
                  type: 'field-update',
                  data: message.data,
                  fieldPath: message.fieldPath,
                  timestamp: message.timestamp,
                  version: message.version,
                })
              })
            } else {
              // Full form update - check for conflicts
              listeners.forEach((callback) => {
                callback({
                  type: 'update',
                  data: message.data,
                  timestamp: message.timestamp,
                  version: message.version,
                })
              })
            }

            if (message.version) {
              this.lastKnownVersions.set(formId, message.version)
            }
            this.lastUpdate.set(formId, message.timestamp)
          }
          break
        }

        case 'form-clear': {
          listeners.forEach((callback) => {
            callback({
              type: 'clear',
              timestamp: message.timestamp,
            })
          })
          this.lastUpdate.delete(formId)
          this.lastKnownVersions.delete(formId)
          break
        }

        case 'form-restore': {
          // Handle restoration requests
          const latestData = this.getLatestData(formId)
          if (latestData) {
            listeners.forEach((callback) => {
              callback({
                type: 'restore',
                data: latestData,
                timestamp: message.timestamp,
              })
            })
          }
          break
        }

        case 'form-conflict': {
          // Handle conflict notifications
          if (
            message.data &&
            typeof message.data === 'object' &&
            'local' in message.data &&
            'remote' in message.data
          ) {
            listeners.forEach((callback) => {
              callback({
                type: 'conflict',
                localData: message.data!.local,
                remoteData: message.data!.remote,
                timestamp: message.timestamp,
              })
            })
          }
          break
        }
      }
    } catch (error) {
      syncLogger.warn('Failed to handle cross-tab message', { error })
    }
  }

  /**
   * Broadcast conflict notification to other tabs
   */
  broadcastConflict(
    formId: string,
    localData: Record<string, unknown>,
    remoteData: Record<string, unknown>
  ) {
    if (!this.isEnabled) return

    const message: CrossTabMessage = {
      type: 'form-conflict',
      formId,
      data: { local: localData, remote: remoteData },
      timestamp: Date.now(),
      tabId: TAB_ID,
    }

    try {
      localStorage.setItem(`cross-tab-sync-${formId}`, JSON.stringify(message))
    } catch (error) {
      syncLogger.warn('Failed to broadcast cross-tab conflict', { error })
    }
  }

  /**
   * Set a custom conflict resolver for a form
   */
  setConflictResolver(
    formId: string,
    resolver: (
      local: Record<string, unknown>,
      remote: Record<string, unknown>
    ) => Record<string, unknown>
  ) {
    this.conflictResolvers.set(formId, resolver)
  }

  /**
   * Get the conflict resolver for a form
   */
  getConflictResolver(formId: string) {
    return this.conflictResolvers.get(formId)
  }

  /**
   * Enable cross-tab synchronization
   */
  enable() {
    this.isEnabled = true
  }

  /**
   * Disable cross-tab synchronization
   */
  disable() {
    this.isEnabled = false
  }

  /**
   * Check if cross-tab sync is enabled
   */
  isActive(): boolean {
    return this.isEnabled
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // Clean up all localStorage items for this tab
    this.listeners.forEach((_, formId) => {
      try {
        localStorage.removeItem(`cross-tab-sync-${formId}`)
        localStorage.removeItem(`form-auto-save-${formId}`)
      } catch {
        // Ignore cleanup errors
      }
    })
    this.listeners.clear()
    this.lastUpdate.clear()
    this.lastKnownVersions.clear()
    this.conflictResolvers.clear()
  }

  /**
   * Get tab ID
   */
  getTabId() {
    return TAB_ID
  }

  /**
   * Node.js 24: Explicit Resource Management - called automatically with 'using' keyword
   */
  [Symbol.dispose](): void {
    // Remove event listeners
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.boundStorageHandler)
      window.removeEventListener('beforeunload', this.boundBeforeUnloadHandler)
    }
    this.cleanup()
  }
}

// Singleton instance
export const crossTabSync = new CrossTabSync()

/**
 * Hook for cross-tab synchronization
 */
export function useCrossTabSync(formId: string, onUpdate: (data: unknown) => void) {
  if (typeof window === 'undefined') return null

  const unsubscribe = crossTabSync.subscribe(formId, onUpdate)

  return {
    broadcast: (data: Record<string, unknown>, fieldPath?: string) =>
      crossTabSync.broadcastUpdate(formId, data, fieldPath),
    clear: () => crossTabSync.broadcastClear(formId),
    getLatest: () => crossTabSync.getLatestData(formId),
    setConflictResolver: (
      resolver: (
        local: Record<string, unknown>,
        remote: Record<string, unknown>
      ) => Record<string, unknown>
    ) => crossTabSync.setConflictResolver(formId, resolver),
    broadcastConflict: (localData: Record<string, unknown>, remoteData: Record<string, unknown>) =>
      crossTabSync.broadcastConflict(formId, localData, remoteData),
    enable: () => crossTabSync.enable(),
    disable: () => crossTabSync.disable(),
    isActive: () => crossTabSync.isActive(),
    unsubscribe,
    tabId: crossTabSync.getTabId(),
  }
}
