/**
 * Common types used throughout the application
 */

// Media related types
export interface MediaFile {
  id: string
  filename: string
  url: string
  size: number
  type: string
  width?: number
  height?: number
  uploadedAt: Date
  updatedAt: Date
}

// Performance measurement types
export type RenderFunction = () => unknown

// Storage event types
export interface StorageEventData {
  key: string
  value: unknown
}

// Debug logging types
export type LogValue = string | number | boolean | object | null | undefined

// ============================================================================
// INTERACTION ENUMS
// ============================================================================

export enum InteractionType {
  LIKE = 'LIKE',
  SHARE = 'SHARE',
  COMMENT = 'COMMENT',
  BOOKMARK = 'BOOKMARK',
  SUBSCRIBE = 'SUBSCRIBE',
  DOWNLOAD = 'DOWNLOAD',
}
