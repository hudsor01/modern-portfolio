/**
 * Startup Validation Component
 * Validates critical environment variables and security configuration
 */

'use client'

import { useEffect, useState } from 'react'

interface ValidationStatus {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

export function StartupValidation({ children }: { children: React.ReactNode }) {
  const [validation, setValidation] = useState<ValidationStatus>({
    isValid: true,
    errors: [],
    warnings: []
  })

  useEffect(() => {
    const errors: string[] = []
    const warnings: string[] = []

    // Validate security headers are present
    const testHeaders = async () => {
      try {
        const response = await fetch('/api/health-check', {
          method: 'HEAD',
        })
        
        const csp = response.headers.get('content-security-policy')
        const xss = response.headers.get('x-xss-protection')
        const frameOptions = response.headers.get('x-frame-options')
        
        if (!csp) {
          warnings.push('Content Security Policy header not found')
        } else if (csp.includes('unsafe-inline') || csp.includes('unsafe-eval')) {
          errors.push('CSP contains unsafe directives')
        }
        
        if (!xss) warnings.push('X-XSS-Protection header not found')
        if (!frameOptions) warnings.push('X-Frame-Options header not found')
        
      } catch {
        warnings.push('Could not validate security headers')
      }
    }

    // Validate CSP nonces are available
    const scriptNonceMeta = document.querySelector('meta[name="script-nonce"]')
    const styleNonceMeta = document.querySelector('meta[name="style-nonce"]')
    
    if (!scriptNonceMeta || !styleNonceMeta) {
      warnings.push('CSP nonces not available - inline scripts/styles may be blocked')
    }

    // Validate HTTPS in production
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      errors.push('Site is not served over HTTPS in production')
    }

    // Run header validation
    testHeaders()

    setValidation({
      isValid: errors.length === 0,
      errors,
      warnings
    })

    // Log validation results in development
    if (process.env.NODE_ENV === 'development') {
      if (errors.length > 0) {
        console.error('Security validation errors:', errors)
      }
      if (warnings.length > 0) {
        console.warn('Security validation warnings:', warnings)
      }
      if (errors.length === 0 && warnings.length === 0) {
        }
    }
  }, [])

  // In production, don't render anything if there are critical errors
  if (process.env.NODE_ENV === 'production' && !validation.isValid) {
    return (
      <div style={{ 
        padding: '20px', 
        background: '#fee', 
        color: '#c00', 
        fontFamily: 'monospace',
        border: '1px solid #c00'
      }}>
        <h1>Security Configuration Error</h1>
        <p>The application failed security validation and cannot start safely.</p>
        <ul>
          {validation.errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    )
  }

  return <>{children}</>
}

/**
 * Create a simple health check endpoint for header validation
 */
export function createHealthCheckAPI() {
  return new Response('OK', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-cache',
    },
  })
}