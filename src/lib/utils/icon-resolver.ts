/**
 * Icon Resolver Utility
 * Maps string icon names to Lucide React components for runtime rendering.
 * This allows storing icon references as strings in the database.
 */

import {
  DollarSign,
  Clock,
  Target,
  TrendingUp,
  Zap,
  Award,
  BarChart3,
  Users,
  CheckCircle,
  AlertCircle,
  type LucideIcon,
} from 'lucide-react'

/**
 * Map of icon names to their Lucide React components.
 * Add new icons here as needed.
 */
const iconMap: Record<string, LucideIcon> = {
  'dollar-sign': DollarSign,
  clock: Clock,
  target: Target,
  'trending-up': TrendingUp,
  zap: Zap,
  award: Award,
  'bar-chart': BarChart3,
  users: Users,
  'check-circle': CheckCircle,
  'alert-circle': AlertCircle,
}

/**
 * Resolves an icon name string to its corresponding Lucide React component.
 * Returns undefined if the icon name is not found.
 *
 * @param iconName - The name of the icon (e.g., 'dollar-sign', 'trending-up')
 * @returns The Lucide icon component or undefined
 *
 * @example
 * ```tsx
 * const Icon = resolveIcon('dollar-sign')
 * if (Icon) {
 *   return <Icon className="h-4 w-4" />
 * }
 * ```
 */
export function resolveIcon(iconName: string): LucideIcon | undefined {
  return iconMap[iconName.toLowerCase()]
}

/**
 * Resolves an icon name string to its corresponding Lucide React component.
 * Returns a fallback icon if the icon name is not found.
 *
 * @param iconName - The name of the icon (e.g., 'dollar-sign', 'trending-up')
 * @param fallback - The fallback icon component (defaults to CheckCircle)
 * @returns The Lucide icon component
 *
 * @example
 * ```tsx
 * const Icon = resolveIconWithFallback('unknown-icon')
 * return <Icon className="h-4 w-4" /> // Renders CheckCircle
 * ```
 */
export function resolveIconWithFallback(
  iconName: string,
  fallback: LucideIcon = CheckCircle
): LucideIcon {
  return iconMap[iconName.toLowerCase()] ?? fallback
}

/**
 * Checks if an icon name is valid and can be resolved.
 *
 * @param iconName - The name of the icon to check
 * @returns true if the icon can be resolved, false otherwise
 */
export function isValidIconName(iconName: string): boolean {
  return iconName.toLowerCase() in iconMap
}

/**
 * Gets all available icon names.
 *
 * @returns Array of all valid icon names
 */
export function getAvailableIconNames(): string[] {
  return Object.keys(iconMap)
}
