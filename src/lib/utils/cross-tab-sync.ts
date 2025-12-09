/**
 * Cross-Tab Synchronization Utility
 * Synchronizes form data across browser tabs using localStorage events
 */

export interface CrossTabMessage {
  type: 'form-update' | 'form-clear' | 'form-restore'
  formId: string
  data?: Record<string, unknown>
  timestamp: number
  tabId: string
}

// Generate unique tab ID
const TAB_ID = crypto.randomUUID()

class CrossTabSync {
  private listeners = new Map<string, Set<(data: unknown) => void>>()
  private lastUpdate = new Map<string, number>()

  constructor() {
    // Listen for storage events from other tabs
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', this.handleStorageEvent.bind(this))
      
      // Cleanup on beforeunload
      window.addEventListener('beforeunload', () => {
        this.cleanup()
      })
    }
  }

  /**
   * Register a listener for cross-tab updates
   */
  subscribe(formId: string, callback: (data: unknown) => void) {
    if (!this.listeners.has(formId)) {
      this.listeners.set(formId, new Set())
    }
    this.listeners.get(formId)!.add(callback)

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
  broadcastUpdate(formId: string, data: Record<string, unknown>) {
    const message: CrossTabMessage = {
      type: 'form-update',
      formId,
      data,
      timestamp: Date.now(),
      tabId: TAB_ID
    }

    try {
      localStorage.setItem(`cross-tab-sync-${formId}`, JSON.stringify(message))
      this.lastUpdate.set(formId, message.timestamp)
    } catch (error) {
      console.warn('Failed to broadcast cross-tab update:', error)
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
      tabId: TAB_ID
    }

    try {
      localStorage.setItem(`cross-tab-sync-${formId}`, JSON.stringify(message))
      localStorage.removeItem(`form-auto-save-${formId}`)
      this.lastUpdate.delete(formId)
    } catch (error) {
      console.warn('Failed to broadcast cross-tab clear:', error)
    }
  }

  /**
   * Get latest form data from storage
   */
  getLatestData(formId: string): Record<string, unknown> | null {
    try {
      const stored = localStorage.getItem(`form-auto-save-${formId}`)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.warn('Failed to get latest form data:', error)
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
      const message: CrossTabMessage = JSON.parse(event.newValue || '{}')
      
      // Ignore messages from the same tab
      if (message.tabId === TAB_ID) return

      // Ignore old messages
      const lastTimestamp = this.lastUpdate.get(formId) || 0
      if (message.timestamp <= lastTimestamp) return

      // Handle different message types
      switch (message.type) {
        case 'form-update': {
          if (message.data) {
            // Only update if the data is newer
            listeners.forEach(callback => {
              callback({
                type: 'update',
                data: message.data,
                timestamp: message.timestamp
              })
            })
            this.lastUpdate.set(formId, message.timestamp)
          }
          break
        }

        case 'form-clear': {
          listeners.forEach(callback => {
            callback({
              type: 'clear',
              timestamp: message.timestamp
            })
          })
          this.lastUpdate.delete(formId)
          break
        }

        case 'form-restore': {
          // Handle restoration requests
          const latestData = this.getLatestData(formId)
          if (latestData) {
            listeners.forEach(callback => {
              callback({
                type: 'restore',
                data: latestData,
                timestamp: message.timestamp
              })
            })
          }
          break
        }
      }
    } catch (error) {
      console.warn('Failed to handle cross-tab message:', error)
    }
  }

  /**
   * Check for conflicts and resolve them
   */
  resolveConflicts(formId: string, localData: Record<string, unknown>, remoteData: Record<string, unknown>) {
    // Simple last-write-wins strategy
    // In a more sophisticated implementation, you might:
    // - Show a conflict resolution dialog
    // - Merge non-conflicting fields
    // - Use field-level timestamps
    
    const localTimestamp = this.lastUpdate.get(formId) || 0
    const remoteTimestamp = Date.now() // Assume remote is newer for simplicity
    
    return remoteTimestamp > localTimestamp ? remoteData : localData
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    this.listeners.clear()
    this.lastUpdate.clear()
  }

  /**
   * Get tab ID
   */
  getTabId() {
    return TAB_ID
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
    broadcast: (data: Record<string, unknown>) => crossTabSync.broadcastUpdate(formId, data),
    clear: () => crossTabSync.broadcastClear(formId),
    getLatest: () => crossTabSync.getLatestData(formId),
    unsubscribe,
    tabId: crossTabSync.getTabId()
  }
}