import React from 'react'

/**
 * Common types used throughout the application
 */

// General interfaces
export interface MenuItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  isExternal?: boolean
}

export interface MetaData {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  canonical?: string
}

export interface SiteConfig {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    github: string
    linkedin: string
    twitter: string
  }
  author: {
    name: string
    email: string
  }
}

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

// Pagination types
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Filter types
export interface BaseFilter extends PaginationParams {
  search?: string
}

// Jotai and state management types
export type AtomValue = string | number | boolean | object | null | undefined
export type AtomInitialValues = Record<string, AtomValue>

// Error boundary types
export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error }>
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
