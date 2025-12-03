'use client'

import { useEffect, useState } from 'react'
import { createContextLogger } from '@/lib/monitoring/logger'

const logger = createContextLogger('useCSRFToken')

/**
 * Hook to manage CSRF token fetching and management
 */
export function useCSRFToken() {
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const response = await fetch('/api/contact/csrf', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch CSRF token: ${response.status}`)
        }

        const data = await response.json()
        setToken(data.token)
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setError(error)
        logger.error('CSRF token fetch error', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCSRFToken()
  }, [])

  return { token, isLoading, error }
}

/**
 * Helper to add CSRF token to form submission headers
 */
export function addCSRFTokenToHeaders(
  token: string | null,
  headers: Record<string, string> = {}
): Record<string, string> {
  if (token) {
    return {
      ...headers,
      'x-csrf-token': token,
    }
  }
  return headers
}

/**
 * Helper to add CSRF token to form data
 */
export function addCSRFTokenToFormData(
  token: string | null,
  formData: FormData
): FormData {
  if (token) {
    formData.append('_csrf_token', token)
  }
  return formData
}
