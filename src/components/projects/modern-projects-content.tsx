'use client'

import React, { useState } from 'react'
import { ContactModal } from '@/components/ui/contact-modal'
import {
  TrendingUp,
  Zap,
  Target,
  Award,
  Users,
  DollarSign,
  Clock,
  ArrowRight,
  Mail,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import Link from 'next/link'
import Image from 'next/image'

import type { Project as ProjectType } from '@/types/project'

// Local interface for mock projects used in this component
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

// Union type for projects that can come from different sources
type Project = ProjectType | MockProject

// Type guard to check if project is MockProject
function isMockProject(project: Project): project is MockProject {
  return 'year' in project && 'duration' in project && 'impact' in project && 'results' in project
}

const mockProjects: MockProject[] = [
  {
    id: 'revenue-kpi',
    title: 'Revenue Operations Dashboard',
    description: 'Real-time revenue tracking and forecasting platform with advanced analytics',
    longDescription:
      'A comprehensive revenue operations dashboard that provides real-time insights into sales performance, pipeline health, and revenue forecasting. Built with modern web technologies and integrated with multiple CRM systems.',
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
      {
        metric: 'Monthly Revenue Visibility',
        before: '2 weeks delay',
        after: 'Real-time',
        improvement: '100%',
      },
      {
        metric: 'Report Generation Time',
        before: '8 hours',
        after: '5 minutes',
        improvement: '96%',
      },
      { metric: 'Forecast Accuracy', before: '65%', after: '95%', improvement: '46%' },
    ],
    liveUrl: 'https://dashboard.example.com',
    caseStudyUrl: '/projects/revenue-kpi',
  },
  {
    id: 'churn-retention',
    title: 'Customer Churn Prediction Model',
    description: 'Machine learning model to predict and prevent customer churn',
    longDescription:
      'Advanced analytics platform using machine learning to identify at-risk customers and recommend retention strategies.',
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
    longDescription:
      'Comprehensive sales funnel analysis platform providing deep insights into conversion rates, bottlenecks, and optimization opportunities.',
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
    longDescription:
      'Advanced marketing attribution platform that tracks customer journeys across multiple touchpoints and provides insights for campaign optimization.',
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
      {
        metric: 'Campaign Optimization Speed',
        before: '2 weeks',
        after: '2 days',
        improvement: '86%',
      },
    ],
    liveUrl: 'https://attribution.example.com',
  },
]

// Custom call-to-action messages for each project
const getCustomCTA = (projectId: string): string => {
  switch (projectId) {
    case 'churn-retention':
      return 'Come Find the Customer Churn!'
    case 'deal-funnel':
      return 'The Sales Pipeline is This Way!'
    case 'lead-attribution':
      return 'Track Those Leads Here!'
    case 'revenue-kpi':
      return 'See Revenue Magic Happen!'
    case 'partner-performance':
      return 'Meet Your Performance Partners!'
    case 'cac-unit-economics':
      return 'Calculate Your Customer Worth!'
    case 'revenue-operations-center':
      return 'Enter the Revenue Command Center!'
    case 'customer-lifetime-value':
      return 'Predict Your Customer Future!'
    case 'commission-optimization':
      return 'Optimize Those Sweet Commissions!'
    case 'multi-channel-attribution':
      return 'Follow the Attribution Trail!'
    default:
      return 'Explore This Project!'
  }
}

const ProjectCard = ({ project }: { project: Project }) => {
  const projectImage = isMockProject(project)
    ? '/images/projects/revenue-operations.jpg'
    : project.image

  const customCTA = getCustomCTA(project.id)

  return (
    <div className="group">
      <div className="relative bg-white/5 backdrop-blur border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 h-full flex flex-col hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25">
        <div className="p-8 flex-1 flex flex-col">
          {/* Inner Container for Content */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 mb-6 flex-1 flex flex-col">
            {/* Project Header */}
            <div className="mb-6">
              <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 bg-clip-text text-transparent mb-3 leading-tight">
                {project.title}
              </h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Enhanced Metrics */}
            {isMockProject(project) && (
              <div className="grid grid-cols-3 gap-4 mb-8">
                {project.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="text-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/10"
                  >
                    <div className="flex items-center justify-center mb-3">
                      <metric.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400 mb-1">
                      {metric.value}
                    </div>
                    <div className="text-sm text-gray-400">{metric.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Client Info */}
            {isMockProject(project) && (
              <div className="text-sm text-gray-300 mb-8 text-center p-4 bg-white/5 rounded-xl border border-white/10">
                <span className="font-semibold text-blue-400">{project.client}</span> •{' '}
                {project.duration}
              </div>
            )}

            {/* Spacer to push content in inner container */}
            <div className="flex-1"></div>
          </div>

          {/* Project Image - After Content Container */}
          {projectImage && (
            <div className="relative h-32 overflow-hidden rounded-xl mb-6">
              <Image
                src={projectImage}
                alt={project.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          )}

          {/* Centered CTA in remaining space */}
          <div className="flex-1 flex items-center justify-center min-h-[60px]">
            <Button
              size="lg"
              className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
              asChild
            >
              <Link
                href={`/projects/${isMockProject(project) ? project.id : project.slug || project.id}`}
              >
                <span className="relative z-10">{customCTA}</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 relative z-10" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ModernProjectsContentProps {
  projects?: ProjectType[]
  onPrefetch?: () => void
  isLoading?: boolean
}

export function ModernProjectsContent({
  projects: externalProjects,
  onPrefetch: _onPrefetch,
  isLoading: _externalLoading,
}: ModernProjectsContentProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use external projects if provided, otherwise fall back to mock data
  const projectsData: Project[] = externalProjects || mockProjects

  // Sort projects by featured first, then by year
  const sortedProjects = projectsData.sort((a, b) => {
    // Featured projects first
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1

    // Then by year (newest first)
    const aYear = isMockProject(a) ? a.year : new Date(a.createdAt).getFullYear()
    const bYear = isMockProject(b) ? b.year : new Date(b.createdAt).getFullYear()
    return bYear - aYear
  })

  return (
    <>
      <Navbar />
      <section className="relative min-h-screen bg-[#0f172a] text-white overflow-hidden pt-20">
        {/* Grid Background */}
        <div
          className="absolute inset-0 bg-[image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"
          aria-hidden="true"
        />

        {/* Enhanced Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="container relative z-10 px-6 mx-auto max-w-7xl py-24 space-y-32">
          {/* Hero Section */}
          <div className="text-center space-y-12 max-w-6xl mx-auto pt-12">
            <h1 className="font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight mb-6 page-title-gradient">
              Project Portfolio
            </h1>

            <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light">
              Transforming data into actionable insights and driving measurable business results
              through innovative solutions.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-16">
              {[
                { label: 'Projects Completed', value: '25+', icon: Award },
                { label: 'Revenue Generated', value: '$50M+', icon: DollarSign },
                { label: 'Clients Served', value: '15+', icon: Users },
                { label: 'Success Rate', value: '98%', icon: Target },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects Section Header */}
          <div className="text-center space-y-6">
            <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
              Featured Projects
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Explore my latest work in revenue operations and data analytics
            </p>
          </div>

          {/* Projects Grid - 2x2 Layout */}
          <div className="space-y-16">
            {sortedProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-2 text-white">No projects available</h3>
                <p className="text-gray-400">Projects are currently being updated</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
                {sortedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </div>

          {/* Premium Call to Action Section */}
          <div className="text-center space-y-8 max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
              {/* Subtle background gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 rounded-3xl" />

              <div className="relative z-10">
                {/* Enhanced Header */}
                <div className="flex items-center justify-center mb-8">
                  <h3 className="font-bold text-3xl md:text-4xl tracking-tight bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
                    Ready to Start Your Project?
                  </h3>
                </div>

                <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10 font-light">
                  Let's discuss how I can help optimize your revenue operations and drive measurable
                  business growth.
                </p>

                {/* Enhanced CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                  <Button
                    size="lg"
                    className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <span className="relative z-10 flex items-center">
                      <Mail className="mr-2" size={16} />
                      Start a Project
                      <ArrowRight
                        size={16}
                        className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </span>
                  </Button>

                  <Button
                    size="lg"
                    className="relative bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm font-medium px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 group border border-blue-400/20"
                    asChild
                  >
                    <Link href="/about">
                      <span className="relative z-10 flex items-center">
                        <Users className="mr-2" size={16} />
                        Learn More About Me
                        <ArrowRight
                          size={16}
                          className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </Link>
                  </Button>
                </div>

                {/* Enhanced Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/20">
                  <div className="group text-center">
                    <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-4 mx-auto w-fit hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Clock className="relative z-10 w-7 h-7 text-blue-400" />
                    </div>
                    <h4 className="font-bold text-white mb-2 text-xl">
                      Fast Delivery
                    </h4>
                    <p className="text-gray-300 text-base">2-6 month projects</p>
                  </div>

                  <div className="group text-center">
                    <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-4 mx-auto w-fit hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Target className="relative z-10 w-7 h-7 text-blue-400" />
                    </div>
                    <h4 className="font-bold text-white mb-2 text-xl">
                      Results Focused
                    </h4>
                    <p className="text-gray-300 text-base">Measurable outcomes</p>
                  </div>

                  <div className="group text-center">
                    <div className="relative bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-4 mx-auto w-fit hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Award className="relative z-10 w-7 h-7 text-blue-400" />
                    </div>
                    <h4 className="font-bold text-white mb-2 text-xl">
                      Proven Success
                    </h4>
                    <p className="text-gray-300 text-base">98% success rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
