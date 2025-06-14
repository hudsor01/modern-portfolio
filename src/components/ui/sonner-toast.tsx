'use client'

import { useTheme } from 'next-themes'
import { Toaster as SonnerToaster } from 'sonner'

export function SonnerToast() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  // NOTE: Sonner's Toaster prop `toastOptions` applies to all toasts.
  // It does not support setting default inline styles per toast type (e.g., success, error) directly.
  // Type-specific styling is typically done via `classNames` or by passing `style`
  // when calling `toast.success()`, `toast.error()`, etc.
  // The `styles` prop used previously is not a valid prop for SonnerToaster.
  // Removing the per-type inline styles from here to fix the TypeScript error.
  // The custom theming for different toast types will be lost unless implemented differently
  // (e.g., via CSS classes and the `classNames` prop, or by modifying the useToast hook).

  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { // This base style applies to all toasts
          background: isDark ? '#2a2a2a' : '#fff',
          color: isDark ? '#f5f5f5' : '#333',
          border: isDark ? '1px solid #3a3a3a' : '1px solid #e5e7eb',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '0.875rem',
        },
        // Per-type default inline styles are not supported here in toastOptions or via a 'styles' prop.
        // The following were removed:
        // success: { style: { ... } },
        // error: { style: { ... } },
        // info: { style: { ... } },
        // warning: { style: { ... } },
      }}
      // Consider using the `richColors` prop for default sonner styling,
      // or the `classNames` prop for custom CSS class based styling per type.
      // richColors
    />
  )
}
