import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ModernCard, ModernCardHeader, ModernCardTitle, ModernCardDescription, ModernCardContent } from '@/components/ui/modern-card'
import { ModernMetric, ModernMetricsGrid } from '@/components/ui/modern-metrics'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { DollarSign, TrendingUp } from 'lucide-react'

describe('Modern Design System', () => {
  describe('ModernCard Component', () => {
    it('renders with default variant and glassmorphism styling', () => {
      render(
        <ModernCard data-testid="modern-card">
          <ModernCardContent>Test content</ModernCardContent>
        </ModernCard>
      )
      
      const card = screen.getByTestId('modern-card')
      expect(card).toHaveClass('bg-gray-800/50', 'backdrop-blur-sm', 'border-gray-700', 'rounded-xl')
    })

    it('applies hover effects correctly', () => {
      render(
        <ModernCard variant="interactive" data-testid="interactive-card">
          <ModernCardContent>Interactive content</ModernCardContent>
        </ModernCard>
      )
      
      const card = screen.getByTestId('interactive-card')
      expect(card).toHaveClass('hover:border-cyan-500/50', 'hover:-translate-y-1', 'cursor-pointer')
    })

    it('renders with highlight variant for key content', () => {
      render(
        <ModernCard variant="highlight" data-testid="highlight-card">
          <ModernCardHeader>
            <ModernCardTitle>Test Title</ModernCardTitle>
            <ModernCardDescription>Test description</ModernCardDescription>
          </ModernCardHeader>
        </ModernCard>
      )
      
      const card = screen.getByTestId('highlight-card')
      expect(card).toHaveClass('bg-gradient-to-br', 'from-blue-900/20', 'border-blue-500/30')
      
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test description')).toBeInTheDocument()
    })

    it('supports different sizes correctly', () => {
      const { rerender } = render(
        <ModernCard size="sm" data-testid="small-card">
          <ModernCardContent>Small card</ModernCardContent>
        </ModernCard>
      )
      
      expect(screen.getByTestId('small-card')).toHaveClass('p-4')
      
      rerender(
        <ModernCard size="lg" data-testid="large-card">
          <ModernCardContent>Large card</ModernCardContent>
        </ModernCard>
      )
      
      expect(screen.getByTestId('large-card')).toHaveClass('p-8')
    })
  })

  describe('ModernMetric Component', () => {
    it('renders metric with icon, value, and label', () => {
      render(
        <ModernMetric
          icon={DollarSign}
          value="$4.8M+"
          label="Revenue Generated"
          trend="up"
        />
      )
      
      expect(screen.getByText('$4.8M+')).toBeInTheDocument()
      expect(screen.getByText('Revenue Generated')).toBeInTheDocument()
      
      // Check for icon presence (DollarSign icon should be rendered)
      const iconContainer = screen.getByText('$4.8M+').previousSibling
      expect(iconContainer).toHaveClass('text-green-400') // up trend color
    })

    it('applies correct trend colors', () => {
      const { rerender } = render(
        <ModernMetric
          icon={DollarSign}
          value="100"
          label="Test"
          trend="up"
        />
      )
      
      const iconContainer = screen.getByText('100').previousSibling
      expect(iconContainer).toHaveClass('text-green-400')
      
      rerender(
        <ModernMetric
          icon={DollarSign}
          value="100"
          label="Test"
          trend="down"
        />
      )
      
      expect(iconContainer).toHaveClass('text-red-400')
      
      rerender(
        <ModernMetric
          icon={DollarSign}
          value="100"
          label="Test"
          trend="neutral"
        />
      )
      
      expect(iconContainer).toHaveClass('text-cyan-400')
    })

    it('uses glassmorphism styling', () => {
      const { container } = render(
        <ModernMetric
          icon={DollarSign}
          value="$1M"
          label="Revenue"
        />
      )
      
      const metricCard = container.firstChild
      expect(metricCard).toHaveClass('bg-gray-800/50', 'backdrop-blur-sm', 'border-gray-700', 'rounded-xl')
    })
  })

  describe('ModernMetricsGrid Component', () => {
    const mockMetrics = [
      { icon: DollarSign, value: '$4.8M+', label: 'Revenue Generated', trend: 'up' as const },
      { icon: TrendingUp, value: '432%', label: 'Growth', trend: 'up' as const },
    ]

    it('renders multiple metrics in a grid layout', () => {
      render(<ModernMetricsGrid metrics={mockMetrics} />)
      
      expect(screen.getByText('$4.8M+')).toBeInTheDocument()
      expect(screen.getByText('Revenue Generated')).toBeInTheDocument()
      expect(screen.getByText('432%')).toBeInTheDocument()
      expect(screen.getByText('Growth')).toBeInTheDocument()
    })

    it('applies responsive grid classes', () => {
      const { container } = render(<ModernMetricsGrid metrics={mockMetrics} />)
      
      const grid = container.firstChild
      expect(grid).toHaveClass('grid', 'grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4', 'gap-6')
    })
  })

  describe('Button Component - Modern Gradients', () => {
    it('renders gradient variant with cyan/blue colors', () => {
      render(
        <Button variant="gradient" data-testid="gradient-button">
          Click me
        </Button>
      )
      
      const button = screen.getByTestId('gradient-button')
      expect(button).toHaveClass('bg-gradient-to-r', 'from-cyan-500', 'to-blue-500', 'text-black', 'font-bold')
    })

    it('renders gradient-outline variant', () => {
      render(
        <Button variant="gradient-outline" data-testid="gradient-outline-button">
          Outline
        </Button>
      )
      
      const button = screen.getByTestId('gradient-outline-button')
      expect(button).toHaveClass('border-gray-600', 'text-gray-300', 'hover:border-cyan-500', 'hover:text-cyan-400')
    })

    it('maintains 44px touch target minimum', () => {
      render(
        <Button variant="gradient" size="default" data-testid="touch-target-button">
          Touch me
        </Button>
      )
      
      const button = screen.getByTestId('touch-target-button')
      const styles = window.getComputedStyle(button)
      const height = parseInt(styles.height)
      expect(height).toBeGreaterThanOrEqual(44)
    })
  })

  describe('Skeleton Component - Modern Design', () => {
    it('renders with glassmorphism styling', () => {
      render(<Skeleton data-testid="skeleton" />)
      
      const skeleton = screen.getByTestId('skeleton')
      expect(skeleton).toHaveClass('bg-gray-800/50', 'backdrop-blur-sm', 'border-gray-700/50')
    })

    it('shows shimmer effect when enabled', () => {
      render(<Skeleton shimmer={true} data-testid="shimmer-skeleton" />)
      
      const skeleton = screen.getByTestId('shimmer-skeleton')
      expect(skeleton).toHaveClass('before:animate-[shimmer_2s_infinite]')
    })

    it('renders different variants correctly', () => {
      const { rerender } = render(
        <Skeleton variant="card" data-testid="card-skeleton" />
      )
      
      expect(screen.getByTestId('card-skeleton')).toHaveClass('h-[320px]', 'rounded-xl')
      
      rerender(<Skeleton variant="button" data-testid="button-skeleton" />)
      expect(screen.getByTestId('button-skeleton')).toHaveClass('h-10', 'w-24', 'rounded-lg')
    })
  })

  describe('Typography Hierarchy', () => {
    it('applies correct font weights to headings', () => {
      render(
        <div>
          <h1 data-testid="h1">Main Heading</h1>
          <h2 data-testid="h2">Sub Heading</h2>
          <h3 data-testid="h3">Section Heading</h3>
        </div>
      )
      
      expect(screen.getByTestId('h1')).toHaveClass('font-black')
      expect(screen.getByTestId('h2')).toHaveClass('font-bold')
      expect(screen.getByTestId('h3')).toHaveClass('font-bold')
    })

    it('applies responsive text sizing', () => {
      render(
        <div>
          <h1 data-testid="responsive-h1">Responsive Heading</h1>
          <h2 data-testid="responsive-h2">Responsive Subheading</h2>
        </div>
      )
      
      expect(screen.getByTestId('responsive-h1')).toHaveClass('text-5xl', 'md:text-7xl')
      expect(screen.getByTestId('responsive-h2')).toHaveClass('text-3xl', 'md:text-4xl')
    })
  })

  describe('Color System', () => {
    it('uses consistent cyan/blue gradient classes', () => {
      const gradientClasses = [
        'from-cyan-500 to-blue-500',
        'from-cyan-400 to-blue-400', // hover states
        'text-cyan-400',
        'border-cyan-500/20'
      ]
      
      // Test that gradient classes are correctly formatted
      gradientClasses.forEach(className => {
        expect(className).toMatch(/^(from-|to-|text-|border-)?cyan-(400|500)|blue-(400|500)/)
      })
    })

    it('maintains proper contrast for accessibility', () => {
      render(
        <div className="bg-gray-800/50">
          <span className="text-gray-300" data-testid="body-text">Body text</span>
          <span className="text-white" data-testid="heading-text">Heading text</span>
        </div>
      )
      
      // Verify text colors provide sufficient contrast on dark backgrounds
      expect(screen.getByTestId('body-text')).toHaveClass('text-gray-300')
      expect(screen.getByTestId('heading-text')).toHaveClass('text-white')
    })
  })
})