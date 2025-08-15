'use client'

import React from 'react'

interface ProjectStatsProps {
  totalProjects: number
  isLoading?: boolean
}

export const ProjectStats: React.FC<ProjectStatsProps> = ({ totalProjects, isLoading }) => {
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto text-center mb-16">
        <div className="animate-pulse">
          <div className="h-8 bg-white/5 rounded w-64 mx-auto mb-4"></div>
          <div className="h-6 bg-white/5 rounded w-48 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto text-center mb-16">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white">
        Revenue Operations Portfolio
      </h2>
      <p className="text-xl md:text-2xl text-gray-300 mb-8">
        <span className="font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent">
          {totalProjects}
        </span>{' '}
        Data-Driven Projects • $4.8M+ Revenue Optimized
      </p>
      <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Transforming revenue operations through analytics, automation, and strategic insights.
        Each project delivers measurable business impact.
      </p>
    </div>
  )
}