'use client'

import React, { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { 
  Search, 
  Grid3X3, 
  List, 
  ExternalLink, 
  Github, 
  TrendingUp,
  BarChart3,
  Database,
  Zap,
  Target,
  Award,
  Users,
  DollarSign,
  Clock,
  Star,
  ChevronRight,
  ArrowRight,
  Mail
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/navbar'
import Link from 'next/link'

import type { Project as ProjectType } from '@/types/project';

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
type Project = ProjectType | MockProject;

// Type guard to check if project is MockProject
function isMockProject(project: Project): project is MockProject {
  return 'year' in project && 'duration' in project && 'impact' in project && 'results' in project;
}

const mockProjects: MockProject[] = [
  {
    id: 'revenue-kpi',
    title: 'Revenue Operations Dashboard',
    description: 'Real-time revenue tracking and forecasting platform with advanced analytics',
    longDescription: 'A comprehensive revenue operations dashboard that provides real-time insights into sales performance, pipeline health, and revenue forecasting. Built with modern web technologies and integrated with multiple CRM systems.',
    category: 'revenue-ops',
    technologies: ['React', 'TypeScript', 'D3.js', 'PostgreSQL', 'Salesforce API'],
    metrics: [
      { label: 'Revenue Increase', value: '$1.2M', icon: DollarSign },
      { label: 'Time Saved', value: '40%', icon: Clock },
      { label: 'Accuracy Improved', value: '95%', icon: Target }
    ],
    featured: true,
    year: 2024,
    client: 'TechCorp Inc.',
    duration: '6 months',
    impact: [
      'Increased revenue visibility by 300%',
      'Reduced manual reporting time by 40%',
      'Improved forecast accuracy to 95%'
    ],
    results: [
      { metric: 'Monthly Revenue Visibility', before: '2 weeks delay', after: 'Real-time', improvement: '100%' },
      { metric: 'Report Generation Time', before: '8 hours', after: '5 minutes', improvement: '96%' },
      { metric: 'Forecast Accuracy', before: '65%', after: '95%', improvement: '46%' }
    ],
    liveUrl: 'https://dashboard.example.com',
    caseStudyUrl: '/projects/revenue-kpi'
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
      { label: 'Revenue Saved', value: '$800K', icon: DollarSign }
    ],
    featured: true,
    year: 2023,
    client: 'SaaS Growth Co.',
    duration: '4 months',
    impact: [
      'Reduced customer churn by 25%',
      'Increased customer lifetime value',
      'Improved retention strategies'
    ],
    results: [
      { metric: 'Customer Churn Rate', before: '8.5%', after: '6.4%', improvement: '25%' },
      { metric: 'Prediction Accuracy', before: 'N/A', after: '92%', improvement: '100%' },
      { metric: 'Retention Campaign ROI', before: '2.1x', after: '4.7x', improvement: '124%' }
    ],
    githubUrl: 'https://github.com/example/churn-model'
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
      { label: 'Deal Size', value: '+20%', icon: Award }
    ],
    featured: false,
    year: 2023,
    client: 'Enterprise Solutions',
    duration: '3 months',
    impact: [
      'Optimized sales process efficiency',
      'Identified conversion bottlenecks',
      'Increased average deal size'
    ],
    results: [
      { metric: 'Lead-to-Customer Rate', before: '12%', after: '16.2%', improvement: '35%' },
      { metric: 'Sales Cycle Time', before: '90 days', after: '56 days', improvement: '38%' },
      { metric: 'Average Deal Size', before: '$45K', after: '$54K', improvement: '20%' }
    ]
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
      { label: 'Campaign Efficiency', value: '+30%', icon: Zap }
    ],
    featured: true,
    year: 2024,
    client: 'Digital Marketing Agency',
    duration: '5 months',
    impact: [
      'Improved marketing ROI visibility',
      'Optimized budget allocation',
      'Enhanced campaign performance'
    ],
    results: [
      { metric: 'Marketing ROAS', before: '3.2x', after: '4.6x', improvement: '44%' },
      { metric: 'Attribution Confidence', before: '65%', after: '88%', improvement: '35%' },
      { metric: 'Campaign Optimization Speed', before: '2 weeks', after: '2 days', improvement: '86%' }
    ],
    liveUrl: 'https://attribution.example.com'
  }
]

const categories = [
  { id: 'all', label: 'All Projects', icon: Grid3X3 },
  { id: 'revenue-ops', label: 'Revenue Operations', icon: DollarSign },
  { id: 'data-analytics', label: 'Data Analytics', icon: BarChart3 },
  { id: 'business-intelligence', label: 'Business Intelligence', icon: Database },
  { id: 'process-optimization', label: 'Process Optimization', icon: Zap }
]

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const ProjectCard = ({ project, index, viewMode }: { project: Project; index: number; viewMode: 'grid' | 'list' }) => {

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`group ${viewMode === 'list' ? 'w-full' : ''}`}
    >
      <div className={`bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 h-full ${
        viewMode === 'list' ? 'flex flex-row gap-6' : 'flex flex-col'
      }`}>
        
        {/* Project Header */}
        <div className={`${viewMode === 'list' ? 'flex-1' : 'w-full'}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-br group-hover:from-blue-300 group-hover:via-sky-400 group-hover:to-indigo-400 transition-all">
                  {project.title}
                </h3>
                {project.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}
              </div>
              <p className="text-gray-300 mb-4 line-clamp-2">
                {project.description}
              </p>
            </div>
            
            <div className="ml-4 flex flex-col items-end gap-2">
              <Badge variant="secondary" className="bg-white/10 border border-white/20 text-gray-300">
                {isMockProject(project) ? project.year : new Date(project.createdAt).getFullYear()}
              </Badge>
              <Badge 
                variant="outline"
                className="border-blue-400 text-blue-300 text-xs"
              >
                {categories.find(cat => cat.id === project.category)?.label}
              </Badge>
            </div>
          </div>
          
          {/* Metrics */}
          {isMockProject(project) && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {project.metrics.map((metric, i) => (
                <div key={i} className="text-center p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center justify-center mb-2">
                    <metric.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-400">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Basic project info for non-mock projects */}
          {!isMockProject(project) && (
            <div className="mb-6 p-3 bg-white/5 rounded-lg">
              <div className="text-sm text-gray-400">
                {project.featured && <span className="text-blue-400">★ Featured Project • </span>}
                Created: {new Date(project.createdAt).toLocaleDateString()}
              </div>
            </div>
          )}
          
          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies.slice(0, 4).map((tech, i) => (
                <Badge key={i} variant="secondary" className="text-xs bg-white/10 border border-white/20 text-gray-300">
                  {tech}
                </Badge>
              ))}
              {project.technologies.length > 4 && (
                <Badge variant="secondary" className="text-xs bg-white/10 border border-white/20 text-gray-300">
                  +{project.technologies.length - 4} more
                </Badge>
              )}
            </div>
          )}
          
          {/* Client Info */}
          {isMockProject(project) && (
            <div className="text-sm text-gray-400 mb-6">
              <span className="font-medium">{project.client}</span> • {project.duration}
            </div>
          )}
          
          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              asChild
            >
              <Link href={`/projects/${isMockProject(project) ? project.id : project.slug || project.id}`}>
                Learn More
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            
            {(isMockProject(project) ? project.liveUrl : project.liveUrl) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 text-white"
                asChild
              >
                <a href={isMockProject(project) ? project.liveUrl! : project.liveUrl!} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
            
            {(isMockProject(project) ? project.githubUrl : project.githubUrl) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                asChild
              >
                <a href={isMockProject(project) ? project.githubUrl! : project.githubUrl!} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}


interface ModernProjectsContentProps {
  projects?: ProjectType[];
  onPrefetch?: () => void;
  isLoading?: boolean;
}

export function ModernProjectsContent({ 
  projects: externalProjects, 
  onPrefetch: _onPrefetch, 
  isLoading: _externalLoading 
}: ModernProjectsContentProps = {}) {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'year' | 'title' | 'featured'>('featured')
  
  const heroRef = useRef(null)
  const projectsRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })
  const isProjectsInView = useInView(projectsRef, { once: true })
  
  // Use external projects if provided, otherwise fall back to mock data
  const projectsData: Project[] = externalProjects || mockProjects;
  
  const filteredProjects = projectsData
    .filter(project => {
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory
      const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (project.technologies || []).some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'year':
          const aYear = isMockProject(a) ? a.year : new Date(a.createdAt).getFullYear()
          const bYear = isMockProject(b) ? b.year : new Date(b.createdAt).getFullYear()
          return bYear - aYear
        case 'title':
          return a.title.localeCompare(b.title)
        case 'featured':
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        default:
          return 0
      }
    })

  return (
    <>
      <Navbar />
      <section className="relative min-h-screen bg-[#0f172a] text-white overflow-hidden">
      {/* Grid Background */}
      <div
        className="absolute inset-0 bg-[image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]"
        aria-hidden="true"
      />

      {/* Animated Blobs */}
      <div
        className="absolute top-0 -left-4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"
        aria-hidden="true"
      />
      <div
        className="absolute top-0 -right-4 w-72 h-72 sm:w-96 sm:h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob [animation-delay:2s]"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-20 w-72 h-72 sm:w-96 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob [animation-delay:4s]"
        aria-hidden="true"
      />

      <div className="container relative z-10 px-4 mx-auto max-w-7xl py-16 space-y-16">
        
        {/* Hero Section */}
        <motion.div 
          ref={heroRef}
          variants={fadeInUp}
          initial="initial"
          animate={isHeroInView ? "animate" : "initial"}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center space-y-8 max-w-4xl mx-auto pt-16"
        >
          <motion.div
            variants={fadeInUp}
            initial="initial"
            animate={isHeroInView ? "animate" : "initial"}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <span className="inline-flex items-center rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-sm font-medium text-blue-400">
              Portfolio Showcase
            </span>
          </motion.div>

          <motion.h1 
            variants={fadeInUp}
            initial="initial"
            animate={isHeroInView ? "animate" : "initial"}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="font-bold text-5xl sm:text-6xl md:text-7xl tracking-tight mb-6 page-title-gradient"
          >
            Project Portfolio
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            initial="initial"
            animate={isHeroInView ? "animate" : "initial"}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-light"
          >
            Transforming data into actionable insights and driving measurable business results through innovative solutions.
          </motion.p>
          
          {/* Stats */}
          <motion.div 
            variants={fadeInUp}
            initial="initial"
            animate={isHeroInView ? "animate" : "initial"}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: 'Projects Completed', value: '25+', icon: Award },
              { label: 'Revenue Generated', value: '$50M+', icon: DollarSign },
              { label: 'Clients Served', value: '15+', icon: Users },
              { label: 'Success Rate', value: '98%', icon: Target }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-300 via-sky-400 to-indigo-400">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          ref={projectsRef}
          variants={fadeInUp}
          initial="initial"
          animate={isProjectsInView ? "animate" : "initial"}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects, technologies, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-lg"
              />
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-blue-300 via-sky-400 to-indigo-400 text-white shadow-lg'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <category.icon className="w-4 h-4" />
                {category.label}
              </button>
            ))}
          </div>

          {/* View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {filteredProjects.length} projects found
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'year' | 'title' | 'featured')}
                className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
              >
                <option value="featured">Featured First</option>
                <option value="year">Newest First</option>
                <option value="title">Alphabetical</option>
              </select>
              
              {/* View Mode Toggle */}
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div 
          variants={fadeInUp}
          initial="initial"
          animate={isProjectsInView ? "animate" : "initial"}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8"
        >
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2 text-white">No projects found</h3>
              <p className="text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                : 'space-y-8'
              }
            `}>
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  index={index}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate={isProjectsInView ? "animate" : "initial"}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center space-y-8 max-w-4xl mx-auto"
        >
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-8 md:p-12">
            <div className="flex items-center justify-center gap-4 mb-6">
              <TrendingUp className="w-8 h-8 text-blue-400" />
              <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl tracking-tight section-heading-gradient">
                Ready to Start Your Project?
              </h3>
            </div>
            
            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-light mb-8">
              Let's discuss how I can help optimize your revenue operations and drive measurable business growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="premium-button-gradient hover:premium-button-gradient-hover text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-110 transition-all duration-500 group border border-blue-400/20"
                asChild
              >
                <Link href="/contact">
                  <Mail className="mr-2" size={20} />
                  Start a Project
                  <ArrowRight size={18} className="ml-2 transition-transform duration-500 group-hover:translate-x-2" />
                </Link>
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 hover:cta-hover-gradient border-2 border-white/20 hover:border-blue-400/50 text-white hover:text-white px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-500 group backdrop-blur-sm"
                asChild
              >
                <Link href="/about">
                  <Users className="mr-2" size={20} />
                  Learn More About Me
                  <ArrowRight size={18} className="ml-2 transition-transform duration-500 group-hover:translate-x-2" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
              <div className="text-center">
                <Clock className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Fast Delivery</h4>
                <p className="text-blue-300 text-sm">2-6 month projects</p>
              </div>
              
              <div className="text-center">
                <Target className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Results Focused</h4>
                <p className="text-blue-300 text-sm">Measurable outcomes</p>
              </div>
              
              <div className="text-center">
                <Award className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-2">Proven Success</h4>
                <p className="text-blue-300 text-sm">98% success rate</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
    </>
  )
}
