'use client'

import React from 'react'
import { ModernCard, ModernCardContent } from '@/components/ui/modern-card'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className={`animate-spin ${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full rounded-full border-2 border-gray-600 border-t-cyan-400"></div>
    </div>
  )
}

interface GlobalLoadingProps {
  message?: string
  showCard?: boolean
}

export function GlobalLoading({ 
  message = 'Loading...', 
  showCard = true 
}: GlobalLoadingProps) {
  if (showCard) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ModernCard variant="highlight" className="max-w-md">
          <ModernCardContent className="text-center space-y-4">
            <LoadingSpinner size="lg" className="mx-auto" />
            <h2 className="text-xl font-bold text-white">{message}</h2>
            <p className="text-gray-300">
              Please wait while we prepare your content...
            </p>
          </ModernCardContent>
        </ModernCard>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center space-y-3">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-gray-300">{message}</p>
      </div>
    </div>
  )
}

interface PageLoadingProps {
  title?: string
  description?: string
}

export function PageLoading({ 
  title = 'Loading Page', 
  description = 'Setting up your experience...' 
}: PageLoadingProps) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="space-y-3">
          <LoadingSpinner size="lg" className="mx-auto" />
          <h1 className="text-3xl font-bold text-white">{title}</h1>
          <p className="text-gray-300 max-w-md">{description}</p>
        </div>
        
        {/* Skeleton Content */}
        <div className="space-y-4 max-w-md mx-auto">
          <div className="h-4 bg-gray-800/50 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-800/50 rounded animate-pulse w-3/4"></div>
          <div className="h-4 bg-gray-800/50 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    </div>
  )
}

interface ComponentLoadingProps {
  height?: string
  className?: string
}

export function ComponentLoading({ 
  height = 'h-48', 
  className = '' 
}: ComponentLoadingProps) {
  return (
    <div className={`${height} ${className} flex items-center justify-center bg-gray-800/20 rounded-xl border border-gray-700/50`}>
      <div className="text-center space-y-3">
        <LoadingSpinner className="mx-auto" />
        <p className="text-sm text-gray-400">Loading component...</p>
      </div>
    </div>
  )
}