/**
 * Security Provider Component
 * Handles nonce injection and security context for CSP
 */

'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { NonceContext } from '@/lib/security/nonce'

interface SecurityContextType {
  nonces: NonceContext | null
  isSecure: boolean
}

const SecurityContext = createContext<SecurityContextType>({
  nonces: null,
  isSecure: false,
})

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [nonces, setNonces] = useState<NonceContext | null>(null)
  const [isSecure, setIsSecure] = useState(false)

  useEffect(() => {
    // Get nonces from meta tags (set by middleware)
    const scriptNonceMeta = document.querySelector('meta[name="script-nonce"]')
    const styleNonceMeta = document.querySelector('meta[name="style-nonce"]')
    
    if (scriptNonceMeta && styleNonceMeta) {
      const scriptNonce = scriptNonceMeta.getAttribute('content') || ''
      const styleNonce = styleNonceMeta.getAttribute('content') || ''
      
      setNonces({ scriptNonce, styleNonce })
      setIsSecure(true)
    } else {
      // Fallback: try to get from headers
      const scriptNonce = document.documentElement.getAttribute('data-script-nonce') || ''
      const styleNonce = document.documentElement.getAttribute('data-style-nonce') || ''
      
      if (scriptNonce && styleNonce) {
        setNonces({ scriptNonce, styleNonce })
        setIsSecure(true)
      }
    }
  }, [])

  return (
    <SecurityContext.Provider value={{ nonces, isSecure }}>
      {children}
    </SecurityContext.Provider>
  )
}

export function useSecurityContext() {
  const context = useContext(SecurityContext)
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider')
  }
  return context
}

/**
 * Hook to safely execute inline scripts with nonce
 */
export function useSecureScript(script: string, dependencies: React.DependencyList = []) {
  const { nonces } = useSecurityContext()
  const scriptNonce = nonces?.scriptNonce
  
  useEffect(() => {
    if (!scriptNonce) return
    
    const scriptElement = document.createElement('script')
    scriptElement.setAttribute('nonce', scriptNonce)
    scriptElement.textContent = script
    document.head.appendChild(scriptElement)
    
    return () => {
      if (scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script, scriptNonce, ...dependencies])
}

/**
 * Hook to safely apply inline styles with nonce
 */
export function useSecureStyle(css: string, dependencies: React.DependencyList = []) {
  const { nonces } = useSecurityContext()
  const styleNonce = nonces?.styleNonce
  
  useEffect(() => {
    if (!styleNonce) return
    
    const styleElement = document.createElement('style')
    styleElement.setAttribute('nonce', styleNonce)
    styleElement.textContent = css
    document.head.appendChild(styleElement)
    
    return () => {
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [css, styleNonce, ...dependencies])
}