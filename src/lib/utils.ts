// Core utility functions
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import type { ChangeEvent, FormEvent } from 'react'

// Create a client-safe absoluteUrl function
export function absoluteUrl(path: string): string {
  // Use validated site URL in production, dynamic host in development
  const siteUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_VERCEL_URL ||
        'https://richardwhudsonjr.com'

  return `${siteUrl}${path}`
}

// Testable version that accepts window object for testing
export function absoluteUrlTestable(path: string, windowObj?: typeof window): string {
  const siteUrl =
    windowObj && typeof windowObj !== 'undefined'
      ? windowObj.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.NEXT_PUBLIC_VERCEL_URL ||
        'https://richardwhudsonjr.com'

  return `${siteUrl}${path}`
}

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs))
}

export function formatProjectName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const isServer = typeof window === 'undefined'
export const isClient = !isServer

export function truncate(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : text.substring(0, maxLength) + '...'
}

export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second')
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) return rtf.format(-diffInMinutes, 'minute')
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return rtf.format(-diffInHours, 'hour')
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) return rtf.format(-diffInDays, 'day')
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) return rtf.format(-diffInMonths, 'month')
  return rtf.format(-Math.floor(diffInMonths / 12), 'year')
}

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export function getCurrentBreakpoint(): Breakpoint {
  if (isServer) return 'md'

  const width = window.innerWidth
  if (width < 640) return 'xs'
  if (width < 768) return 'sm'
  if (width < 1024) return 'md'
  if (width < 1280) return 'lg'
  if (width < 1536) return 'xl'
  return '2xl'
}

// Testable version that accepts window object for testing
export function getCurrentBreakpointTestable(windowObj?: typeof window): Breakpoint {
  if (!windowObj || typeof windowObj === 'undefined') return 'md'

  const width = windowObj.innerWidth
  if (width < 640) return 'xs'
  if (width < 768) return 'sm'
  if (width < 1024) return 'md'
  if (width < 1280) return 'lg'
  if (width < 1536) return 'xl'
  return '2xl'
}

export function generateId(length = 8): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('')
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

export function parseParam<T>(value: string | string[] | undefined, defaultValue: T): T {
  if (value === undefined) return defaultValue

  if (typeof defaultValue === 'number') {
    const parsed = Number(Array.isArray(value) ? value[0] : value)
    return (isNaN(parsed) ? defaultValue : parsed) as T
  }

  if (typeof defaultValue === 'boolean') {
    const stringValue = Array.isArray(value) ? value[0] : value
    if (stringValue === 'true') return true as T
    if (stringValue === 'false') return false as T
    return defaultValue
  }

  return (Array.isArray(value) ? value[0] : value) as T
}

/**
 * Safely parse JSON with runtime type validation using Zod schema
 * @param json - JSON string to parse
 * @param schema - Zod schema for runtime validation
 * @param fallback - Fallback value if parsing or validation fails
 * @returns Validated parsed value or fallback
 */
export function safeJsonParse<T>(json: string, schema: z.ZodSchema<T>, fallback: T): T {
  try {
    const parsed = JSON.parse(json)
    return schema.parse(parsed)
  } catch {
    return fallback
  }
}

export function isInViewport(element: HTMLElement, offset = 0): boolean {
  if (isServer) return false

  const rect = element.getBoundingClientRect()
  return (
    rect.top <= window.innerHeight + offset &&
    rect.bottom >= -offset &&
    rect.left <= window.innerWidth + offset &&
    rect.right >= -offset
  )
}

// Testable version that accepts window object for testing
export function isInViewportTestable(
  element: HTMLElement,
  offset = 0,
  windowObj?: typeof window
): boolean {
  if (!windowObj || typeof windowObj === 'undefined') return false

  const rect = element.getBoundingClientRect()
  return (
    rect.top <= windowObj.innerHeight + offset &&
    rect.bottom >= -offset &&
    rect.left <= windowObj.innerWidth + offset &&
    rect.right >= -offset
  )
}

export function createUrl(
  pathname: string,
  params: Record<string, string | number | boolean | undefined>
): string {
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) searchParams.set(key, String(value))
  })
  return `${pathname}${searchParams.toString() ? `?${searchParams}` : ''}`
}

// React event types
export type InputChangeEvent = ChangeEvent<HTMLInputElement>
export type TextAreaChangeEvent = ChangeEvent<HTMLTextAreaElement>
export type SelectChangeEvent = ChangeEvent<HTMLSelectElement>
export type FormSubmitEvent = FormEvent<HTMLFormElement>

// Generic data formatter with proper typing
export interface FormattedData<T> {
  formatted: T
  timestamp: string
}

export function formatData<T>(data: T): FormattedData<T> {
  return {
    formatted: data,
    timestamp: new Date().toISOString(),
  }
}

/**
 * Smart merge two records intelligently
 * Strategy: prefer non-empty values, merge arrays, last-write-wins for conflicts
 */
export function smartMerge<T extends Record<string, unknown>>(local: T, remote: T): T {
  const merged: Record<string, unknown> = { ...local }

  Object.entries(remote).forEach(([key, remoteValue]) => {
    const localValue = local[key]

    // If local value is empty/null and remote has content, use remote
    if (
      (localValue === '' || localValue === null || localValue === undefined) &&
      remoteValue !== '' &&
      remoteValue !== null &&
      remoteValue !== undefined
    ) {
      merged[key] = remoteValue
    }
    // For arrays, merge them (deduplicate)
    else if (Array.isArray(localValue) && Array.isArray(remoteValue)) {
      merged[key] = [...new Set([...localValue, ...remoteValue])]
    }
    // For other cases, keep local value (last-write-wins for conflicts)
  })

  return merged as T
}
