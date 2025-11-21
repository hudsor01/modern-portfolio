'use client'

import React from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ShadcnContactForm } from '@/app/contact/components/shadcn-contact-form'
import { ContactFormData } from '@/types/shared-api'

interface QueryAwareContactFormProps {
  // Form behavior
  enableOptimisticSubmission?: boolean
  enableCrossTabAutoSave?: boolean
  enableRateLimitCheck?: boolean
  
  // TanStack Query options
  retryFailedSubmissions?: boolean
  cacheSubmissionHistory?: boolean
  syncFormDataAcrossTabs?: boolean
  
  // Event handlers
  onSubmissionSuccess?: (data: ContactFormData) => void
  onSubmissionError?: (error: Error) => void
  onAutoSaveSuccess?: () => void
  onAutoSaveError?: (error: Error) => void
  
  // Pass-through to ShadcnContactForm
  [key: string]: unknown
}

export function QueryAwareContactForm({
  _enableOptimisticSubmission = true,
  enableCrossTabAutoSave = true,
  enableRateLimitCheck = true,
  _retryFailedSubmissions = true,
  cacheSubmissionHistory = true,
  _syncFormDataAcrossTabs = true,
  onSubmissionSuccess,
  onSubmissionError,
  onAutoSaveSuccess,
  onAutoSaveError,
  ...formProps
}: QueryAwareContactFormProps) {
  const queryClient = useQueryClient()
  
  // Enhanced success callback
  const handleSuccess = React.useCallback((data: ContactFormData) => {
    // Update submission history cache
    if (cacheSubmissionHistory) {
      queryClient.setQueryData(['contact-submissions', 'history'], (old: ContactFormData[]) => [
        ...(old || []),
        { ...data, timestamp: Date.now(), status: 'completed' }
      ])
    }
    
    // Update rate limit cache
    if (enableRateLimitCheck) {
      queryClient.setQueryData(['contact-rate-limit'], (old: { remaining?: number } | undefined) => ({
        ...old,
        remaining: Math.max(0, (old?.remaining || 1) - 1)
      }))
    }
    
    onSubmissionSuccess?.(data)
  }, [cacheSubmissionHistory, enableRateLimitCheck, queryClient, onSubmissionSuccess])
  
  // Enhanced error callback
  const handleError = React.useCallback((error: Error) => {
    onSubmissionError?.(error)
  }, [onSubmissionError])
  
  return (
    <ShadcnContactForm
      enableAutoSave={enableCrossTabAutoSave}
      enableRateLimit={enableRateLimitCheck}
      onSuccess={() => handleSuccess({ name: '', email: '', subject: '', message: '' })}
      onError={handleError}
      {...formProps}
    />
  )
}