'use client'

import React, { useState, useMemo, memo } from 'react'
import { ContactModal } from '@/components/ui/contact-modal'
import { Navbar } from '@/components/layout/navbar'
import { ProjectCard } from '@/components/projects/project-card' 
import { ProjectStats } from '@/components/projects/project-stats'
import { ProjectCTASection } from '@/components/projects/project-cta-section'
import { ShadcnSkeletonWrapper } from '@/components/ui/shadcn-skeleton-wrapper'
import { ProjectErrorBoundary } from '@/components/error/project-error-boundary'
import {
  TrendingUp,
  Zap,
  Target,
  Award,
  DollarSign,
  Clock,
} from 'lucide-react'

import type { Project as ProjectType } from '@/types/project'

// Mock project interface
interface MockProject {
  id: string
  title: string
  description: string
  longDescription: string
  category: 'revenue-ops' | 'data-analytics' | 'business-intelligence' | 'process-optimization'
  technologies: string[]
  metrics: {
    label: string
    value: string
    icon: React.ElementType
  }[]
  featured: boolean
  year: number
  client: string
  duration: string
  impact: string[]
  results: {
    metric: string
    before: string
    after: string
    improvement: string
  }[]
  liveUrl?: string
  githubUrl?: string
  caseStudyUrl?: string
}

// Union type for projects
type Project = ProjectType | MockProject

// Type guard
function isMockProject(project: Project): project is MockProject {
  return 'year' in project && 'duration' in project && 'impact' in project && 'results' in project
}

// Mock data
const mockProjects: MockProject[] = [
  {
    id: 'revenue-kpi',
    title: 'Revenue Operations Dashboard',
    description: 'Real-time revenue tracking and forecasting platform with advanced analytics',
    longDescription: 'A comprehensive revenue operations dashboard that provides real-time insights into sales performance, pipeline health, and revenue forecasting.',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'D3.js', 'PostgreSQL', 'Salesforce API'],
    metrics: [
      { label: 'Revenue Increase', value: '$3.7M', icon: DollarSign },
      { label: 'Time Saved', value: '40%', icon: Clock },
      { label: 'Accuracy Improved', value: '95%', icon: Target },
    ],
    featured: true,
    year: 2024,
    client: 'TechCorp Inc.',
    duration: '6 months',
    impact: [
      'Increased revenue visibility by 300%',
      'Reduced manual reporting time by 40%',
      'Improved forecast accuracy to 95%',
    ],
    results: [
      { metric: 'Monthly Revenue Visibility', before: '2 weeks delay', after: 'Real-time', improvement: '100%' },
      { metric: 'Report Generation Time', before: '8 hours', after: '5 minutes', improvement: '96%' },
      { metric: 'Forecast Accuracy', before: '65%', after: '95%', improvement: '46%' },
    ],
    liveUrl: 'https://dashboard.example.com',
    caseStudyUrl: '/projects/revenue-kpi',
  },
  {
    id: 'churn-retention',
    title: 'Customer Churn Prediction Model',
    description: 'Machine learning model to predict and prevent customer churn',
    longDescription: 'Advanced analytics platform using machine learning to identify at-risk customers and recommend retention strategies.',
    category: 'data-analytics',
    technologies: ['Python', 'Scikit-learn', 'React', 'PostgreSQL', 'Docker'],
    metrics: [
      { label: 'Churn Reduced', value: '25%', icon: TrendingUp },
      { label: 'Model Accuracy', value: '92%', icon: Target },
      { label: 'Revenue Saved', value: '$800K', icon: DollarSign },
    ],
    featured: true,
    year: 2023,
    client: 'SaaS Growth Co.',
    duration: '4 months',
    impact: [
      'Reduced customer churn by 25%',
      'Increased customer lifetime value',
      'Improved retention strategies',
    ],
    results: [
      { metric: 'Customer Churn Rate', before: '8.5%', after: '6.4%', improvement: '25%' },
      { metric: 'Prediction Accuracy', before: 'N/A', after: '92%', improvement: '100%' },
      { metric: 'Retention Campaign ROI', before: '2.1x', after: '4.7x', improvement: '124%' },
    ],
    githubUrl: 'https://github.com/example/churn-model',
  },
  {
    id: 'deal-funnel',
    title: 'Sales Funnel Optimization',
    description: 'Interactive sales funnel analysis with conversion optimization insights',
    longDescription: 'Comprehensive sales funnel analysis platform providing deep insights into conversion rates, bottlenecks, and optimization opportunities.',
    category: 'business-intelligence',
    technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Chart.js', 'Stripe API'],
    metrics: [
      { label: 'Conversion Rate', value: '+35%', icon: TrendingUp },
      { label: 'Sales Velocity', value: '+60%', icon: Zap },
      { label: 'Deal Size', value: '+20%', icon: Award },
    ],
    featured: false,
    year: 2023,
    client: 'Enterprise Solutions',
    duration: '3 months',
    impact: [
      'Optimized sales process efficiency',
      'Identified conversion bottlenecks',
      'Increased average deal size',
    ],
    results: [
      { metric: 'Lead-to-Customer Rate', before: '12%', after: '16.2%', improvement: '35%' },
      { metric: 'Sales Cycle Time', before: '90 days', after: '56 days', improvement: '38%' },
      { metric: 'Average Deal Size', before: '$45K', after: '$54K', improvement: '20%' },
    ],
  },
  {
    id: 'lead-attribution',
    title: 'Marketing Attribution Platform',
    description: 'Multi-touch attribution model for marketing campaign optimization',
    longDescription: 'Advanced marketing attribution platform that tracks customer journeys across multiple touchpoints and provides insights for campaign optimization.',
    category: 'data-analytics',
    technologies: ['React', 'Python', 'BigQuery', 'Looker', 'Google Analytics API'],
    metrics: [
      { label: 'Attribution Accuracy', value: '88%', icon: Target },
      { label: 'ROAS Improvement', value: '+45%', icon: TrendingUp },
      { label: 'Campaign Efficiency', value: '+30%', icon: Zap },
    ],
    featured: true,
    year: 2024,
    client: 'Digital Marketing Agency',
    duration: '5 months',
    impact: [
      'Improved marketing ROI visibility',
      'Optimized budget allocation',
      'Enhanced campaign performance',
    ],
    results: [
      { metric: 'Marketing ROAS', before: '3.2x', after: '4.6x', improvement: '44%' },
      { metric: 'Attribution Confidence', before: '65%', after: '88%', improvement: '35%' },
      { metric: 'Campaign Optimization Speed', before: '2 weeks', after: '2 days', improvement: '86%' },
    ],
    liveUrl: 'https://attribution.example.com',
  },
]

interface ModernProjectsContentProps {
  projects?: ProjectType[]
  onPrefetch?: () => void
  isLoading?: boolean
}

export const ModernProjectsContent = memo<ModernProjectsContentProps>(({
  projects: externalProjects,
  onPrefetch: _onPrefetch,
  isLoading = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use external projects if provided, otherwise fall back to mock data
  const projectsData: Project[] = externalProjects || mockProjects

  // Memoized sorting to prevent expensive recalculations on every render
  const sortedProjects = useMemo(() => {
    // Ensure projectsData is an array before spreading
    const dataArray = Array.isArray(projectsData) ? projectsData : []
    return [...dataArray].sort((a, b) => {
      // Featured projects first
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1

      // Then by year (newest first)
      const aYear = isMockProject(a) ? a.year : new Date(a.createdAt || 0).getFullYear()
      const bYear = isMockProject(b) ? b.year : new Date(b.createdAt || 0).getFullYear()
      return bYear - aYear
    })
  }, [projectsData])

  return (
    <ProjectErrorBoundary>
      <>
        <Navbar />
        <section className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white overflow-hidden pt-20">
        {/* Modern Animated Background */}
        <div className="fixed inset-0 -z-10">
          {/* Floating Orbs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-400/3 rounded-full blur-3xl animate-pulse-glow"></div>
          
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 bg-[image:linear-gradient(rgba(34,211,238,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(34,211,238,0.03)_1px,transparent_1px)] bg-[length:50px_50px]"
            aria-hidden="true"
          ></div>
        </div>

        <div className="container relative z-10 px-6 mx-auto max-w-7xl py-24">
          {/* Hero Section */}
          <div className="text-center space-y-16 max-w-6xl mx-auto pt-12 mb-24">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 page-title-gradient glow-cyan break-words leading-tight py-2">
              Project Portfolio
            </h1>

            <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transforming data into actionable insights and driving measurable business results
              through innovative solutions.
            </p>

            {/* Stats Component */}
            <ProjectStats totalProjects={sortedProjects.length} isLoading={isLoading} />
          </div>

          {/* Projects Section Header */}
          <div className="text-center space-y-6 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight section-heading-gradient glow-blue">
              Featured Projects
            </h2>
            <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Explore my latest work in revenue operations and data analytics
            </p>
          </div>

          {/* Projects Grid */}
          <div className="space-y-16">
            {isLoading ? (
              <ShadcnSkeletonWrapper layout="card" count={6} variant="default" />
            ) : sortedProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2 text-white">No projects available</h3>
                <p className="text-gray-400">Projects are currently being updated</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 max-w-7xl mx-auto">
                {sortedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>

          {/* CTA Section */}
          <ProjectCTASection onContactClick={() => setIsModalOpen(true)} />
        </div>
      </section>

        {/* Contact Modal */}
        <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    </ProjectErrorBoundary>
  )
})

ModernProjectsContent.displayName = 'ModernProjectsContent'