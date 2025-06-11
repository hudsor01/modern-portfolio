/**
 * Creates a CSS variable string for light and dark mode
 * Use this for creating complex theme-aware styles
 *
 * @example
 * ```tsx
 * import { themeVar } from '@/lib/utils/css-variable-utils';
 *
 * // Usage in styled component or CSS-in-JS
 * const backgroundColor = themeVar(
 *   'rgba(255, 255, 255, 0.9)', // Light mode value
 *   'rgba(30, 30, 30, 0.9)'     // Dark mode value
 * );
 *
 * // In component
 * <div style={{ backgroundColor }} />
 * ```
 */
export function themeVar(lightValue: string): string {
  return `var(--theme-value, ${lightValue})`
}

/**
 * Creates a CSS class string for conditional classes with theme awareness
 *
 * @param baseClasses - Base classes that always apply
 * @param lightClasses - Classes that only apply in light mode
 * @param darkClasses - Classes that only apply in dark mode
 * @returns CSS class string
 *
 * @example
 * ```tsx
 * import { themeClass } from '@/lib/utils/css-variable-utils';
 *
 * <div className={themeClass(
 *   'p-4 rounded', // Always applied
 *   'bg-white text-gray-900', // Light mode only
 *   'bg-gray-900 text-white'  // Dark mode only
 * )} />
 * ```
 */
export function themeClass(baseClasses: string, lightClasses: string, darkClasses: string): string {
  return `${baseClasses} ${lightClasses} dark:${darkClasses}`
}

/**
 * Creates an opacity-adjusted color string for Tailwind
 *
 * @param color - The base color name from the Tailwind palette
 * @param opacity - The opacity value (0-100)
 * @returns Tailwind color class with opacity
 *
 * @example
 * ```tsx
 * import { opacityColor } from '@/lib/utils/css-variable-utils';
 *
 * <div className={opacityColor('bg-blue', 50)} /> // Results in bg-blue-500/50
 * ```
 */
export function opacityColor(color: string, opacity: number): string {
  // Ensure opacity is between 0 and 100
  const safeOpacity = Math.max(0, Math.min(100, opacity))
  return `${color}/${safeOpacity}`
}

/**
 * Gets a variable with appropriate fallback for both light and dark modes
 *
 * @param name - The CSS variable name (without --)
 * @param lightFallback - Light mode fallback value
 * @param darkFallback - Dark mode fallback value
 * @returns CSS var() function with appropriate fallbacks
 */
export function getThemeVariable(
  name: string,
  lightFallback: string,
  darkFallback: string
): string {
  return `var(--${name}, var(--light-mode-${name}, ${lightFallback})) dark:var(--${name}, var(--dark-mode-${name}, ${darkFallback}))`
}
