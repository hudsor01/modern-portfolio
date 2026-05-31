// Core utility functions
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { z } from 'zod'
import type { ChangeEvent, FormEvent } from 'react'

// Client-safe absolute-URL builder. Accepts an injectable window for testing;
// production/server callers omit it and fall back to the validated site URL.
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

export const isServer = typeof window === 'undefined'
export const isClient = !isServer

export function truncate(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : `${text.substring(0, maxLength)}...`
}

export function generateId(length = 8): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 36).toString(36)).join('')
}

export function parseParam<T>(value: string | string[] | undefined, defaultValue: T): T {
  if (value === undefined) return defaultValue

  if (typeof defaultValue === 'number') {
    const parsed = Number(Array.isArray(value) ? value[0] : value)
    return (Number.isNaN(parsed) ? defaultValue : parsed) as T
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
    // Silent by contract — caller chose `fallback` precisely because they
    // expect malformed input. Logging here would just create noise.
    return fallback
  }
}

/**
 * Escape regex metacharacters in a string so it can be embedded literally
 * in a `new RegExp(...)` source. Required whenever the source is built from
 * user input — otherwise an unescaped `(`, `[`, `\`, etc. throws SyntaxError.
 */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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
