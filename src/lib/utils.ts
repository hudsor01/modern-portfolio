// Core utility functions
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(...inputs))
}

/**
 * Escape regex metacharacters in a string so it can be embedded literally
 * in a `new RegExp(...)` source. Required whenever the source is built from
 * user input — otherwise an unescaped `(`, `[`, `\`, etc. throws SyntaxError.
 */
export function escapeRegExp(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
