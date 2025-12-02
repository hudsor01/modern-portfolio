import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ProjectCard } from '@/components/projects/project-card'
import { DollarSign, TrendingUp, Target } from 'lucide-react'

// Mock project data following the Challenge-Solution-Results format
const mockProject = {
  id: 'test-project',
  title: 'Revenue Operations Dashboard',
  description: 'Real-time revenue tracking and forecasting platform',
  longDescription: 'A comprehensive revenue operations dashboard that provides real-time insights into sales performance, pipeline health, and revenue forecasting.',
  category: 'revenue-ops' as const,
  technologies: ['React', 'TypeScript', 'D3.js', 'PostgreSQL', 'Salesforce API'],
  metrics: [
    { label: 'Revenue Increase', value: '$3.7M', icon: DollarSign },
    { label: 'Time Saved', value: '40%', icon: TrendingUp },
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
}

describe('ProjectCard - Challenge-Solution-Results Format', () => {
  it('renders the project title and description', () => {
    render(<ProjectCard project={mockProject} />)
    
    expect(screen.getByText('Revenue Operations Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Real-time revenue tracking and forecasting platform')).toBeInTheDocument()
  })

  it('displays client and duration information', () => {
    render(<ProjectCard project={mockProject} />)
    
    expect(screen.getByText('TechCorp Inc. • 6 months')).toBeInTheDocument()
  })

  it('renders Challenge section with proper styling', () => {
    render(<ProjectCard project={mockProject} />)
    
    const challengeSection = screen.getByText('🎯 CHALLENGE')
    expect(challengeSection).toBeInTheDocument()
    expect(challengeSection.closest('div')).toHaveClass('bg-destructive/20/20', 'border-destructive/30', 'rounded-lg')
    
    // Challenge content should display the long description
    expect(screen.getByText(/comprehensive revenue operations dashboard/)).toBeInTheDocument()
  })

  it('renders Solution section with technology stack', () => {
    render(<ProjectCard project={mockProject} />)
    
    const solutionSection = screen.getByText('⚡ SOLUTION')
    expect(solutionSection).toBeInTheDocument()
    expect(solutionSection.closest('div')).toHaveClass('bg-success/20/20', 'border-success/30', 'rounded-lg')
    
    // Technology badges should be displayed
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('D3.js')).toBeInTheDocument()
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument()
    
    // Technology badges should have proper styling
    const techBadge = screen.getByText('React')
    expect(techBadge).toHaveClass('bg-primary/10', 'text-primary', 'border-primary/20')
  })

  it('renders Results section with metrics grid', () => {
    render(<ProjectCard project={mockProject} />)
    
    const resultsSection = screen.getByText('📊 RESULTS')
    expect(resultsSection).toBeInTheDocument()
    expect(resultsSection.closest('div')).toHaveClass('bg-primary/20/20', 'border-primary/30', 'rounded-lg')
    
    // Metrics should be displayed
    expect(screen.getByText('$3.7M')).toBeInTheDocument()
    expect(screen.getByText('Revenue Increase')).toBeInTheDocument()
    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByText('Time Saved')).toBeInTheDocument()
    expect(screen.getByText('95%')).toBeInTheDocument()
    expect(screen.getByText('Accuracy Improved')).toBeInTheDocument()
  })

  it('displays metrics in responsive grid layout', () => {
    render(<ProjectCard project={mockProject} />)
    
    // Find the results section
    const resultsSection = screen.getByText('📊 RESULTS').closest('div')
    const metricsGrid = resultsSection?.querySelector('.grid')
    
    expect(metricsGrid).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'gap-3')
  })

  it('renders CTA button with modern gradient styling', () => {
    render(<ProjectCard project={mockProject} />)
    
    const ctaButton = screen.getByText('See Revenue Magic Happen!')
    expect(ctaButton).toBeInTheDocument()
    
    // Check modern gradient classes
    expect(ctaButton).toHaveClass(
      'bg-gradient-to-r',
      'from-cyan-500',
      'to-blue-500',
      'hover:from-cyan-400',
      'hover:to-blue-400',
      'text-black',
      'font-bold'
    )
    
    // Check accessibility (44px minimum touch target)
    expect(ctaButton).toHaveClass('min-h-[44px]')
  })

  it('applies glassmorphism styling to card container', () => {
    const { container } = render(<ProjectCard project={mockProject} />)
    
    const cardContainer = container.firstChild
    expect(cardContainer).toHaveClass(
      'bg-card/50',
      'backdrop-blur-sm',
      'border-border',
      'rounded-xl',
      'hover:border-primary/50',
      'transition-all',
      'duration-300',
      'hover:-translate-y-2'
    )
  })

  it('handles projects with limited technology stack', () => {
    const projectWithFewTechs = {
      ...mockProject,
      technologies: ['React', 'TypeScript']
    }
    
    render(<ProjectCard project={projectWithFewTechs} />)
    
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.queryByText('D3.js')).not.toBeInTheDocument()
  })

  it('generates custom CTA text based on project ID', () => {
    const churnProject = {
      ...mockProject,
      id: 'churn-retention',
      title: 'Customer Churn Prediction'
    }
    
    render(<ProjectCard project={churnProject} />)
    
    expect(screen.getByText('Come Find the Customer Churn!')).toBeInTheDocument()
  })

  it('maintains proper typography hierarchy', () => {
    render(<ProjectCard project={mockProject} />)
    
    // Main title should use proper heading class
    const title = screen.getByText('Revenue Operations Dashboard')
    expect(title).toHaveClass('text-xl', 'md:text-2xl', 'font-bold', 'text-white')
    
    // Client info should use proper styling
    const clientInfo = screen.getByText('TechCorp Inc. • 6 months')
    expect(clientInfo).toHaveClass('text-primary', 'text-sm', 'font-medium')
    
    // Description should use proper body text styling
    const description = screen.getByText('Real-time revenue tracking and forecasting platform')
    expect(description).toHaveClass('text-base', 'md:text-lg', 'text-muted-foreground', 'leading-relaxed')
  })

  it('ensures proper contrast for accessibility', () => {
    render(<ProjectCard project={mockProject} />)
    
    // Challenge section should have proper red contrast
    const challengeHeader = screen.getByText('🎯 CHALLENGE')
    expect(challengeHeader).toHaveClass('text-destructive')
    
    // Solution section should have proper green contrast
    const solutionHeader = screen.getByText('⚡ SOLUTION')
    expect(solutionHeader).toHaveClass('text-success')
    
    // Results section should have proper blue contrast
    const resultsHeader = screen.getByText('📊 RESULTS')
    expect(resultsHeader).toHaveClass('text-primary/70')
  })

  it('renders with proper semantic structure', () => {
    render(<ProjectCard project={mockProject} />)
    
    // Main title should be h3
    const title = screen.getByRole('heading', { level: 3 })
    expect(title).toHaveTextContent('Revenue Operations Dashboard')
    
    // Section headers should be h4
    const challengeHeader = screen.getByText('🎯 CHALLENGE')
    expect(challengeHeader.tagName).toBe('H4')
    
    const solutionHeader = screen.getByText('⚡ SOLUTION')
    expect(solutionHeader.tagName).toBe('H4')
    
    const resultsHeader = screen.getByText('📊 RESULTS')
    expect(resultsHeader.tagName).toBe('H4')
  })
})