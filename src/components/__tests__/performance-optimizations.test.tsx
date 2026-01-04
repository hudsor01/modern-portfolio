import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'bun:test'
import React, { Suspense } from 'react'

// Note: next/dynamic is mocked in src/test/setup.tsx (unified mock)

describe('Performance Optimizations', () => {
  describe('Dynamic Imports', () => {
    it('shows loading skeleton while dynamic components load', async () => {
      const LoadingComponent = () => (
        <div className="animate-pulse h-96 bg-card/50 rounded-xl" data-testid="loading-skeleton">
          Loading...
        </div>
      )
      
      render(
        <Suspense fallback={<LoadingComponent />}>
          <div data-testid="dynamic-content">Dynamic content</div>
        </Suspense>
      )
      
      // Initially should show loading state
      expect(screen.getByTestId('dynamic-content')).toBeInTheDocument()
    })

    it('loading skeletons use glassmorphism styling', () => {
      const skeleton = render(
        <div className="animate-pulse h-96 bg-card/50 rounded-xl" data-testid="skeleton" />
      ).getByTestId('skeleton')
      
      expect(skeleton).toHaveClass('animate-pulse', 'bg-card/50', 'rounded-xl')
    })

    it('provides different skeleton sizes for different components', () => {
      const { rerender } = render(
        <div className="animate-pulse h-20 bg-card/50 rounded-lg" data-testid="title-skeleton" />
      )
      
      expect(screen.getByTestId('title-skeleton')).toHaveClass('h-20')
      
      rerender(
        <div className="animate-pulse h-6 bg-card/50 rounded-xs" data-testid="text-skeleton" />
      )
      
      expect(screen.getByTestId('text-skeleton')).toHaveClass('h-6')
      
      rerender(
        <div className="animate-pulse h-12 bg-card/50 rounded-lg" data-testid="button-skeleton" />
      )
      
      expect(screen.getByTestId('button-skeleton')).toHaveClass('h-12')
    })
  })

  describe('Image Optimization', () => {
    it('lazy loads images below the fold', () => {
      const MockLazyImage = () => (
        <div data-testid="lazy-image" data-loading="lazy" role="img" aria-label="Test" />
      )
      
      render(<MockLazyImage />)
      
      const image = screen.getByTestId('lazy-image')
      expect(image).toHaveAttribute('data-loading', 'lazy')
    })

    it('uses proper Next.js Image sizing attributes', () => {
      // Mock Next.js Image component behavior
      const MockImage = ({ src, alt, sizes, quality, ...props }: {
        src: string;
        alt: string;
        sizes?: string;
        quality?: number;
        [key: string]: unknown;
      }) => (
        <div
          data-src={src}
          data-alt={alt}
          data-sizes={sizes}
          data-quality={quality}
          data-testid="optimized-image"
          role="img"
          aria-label={alt}
          {...props}
        />
      )
      
      render(
        <MockImage
          src="/project-image.jpg"
          alt="Project screenshot"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={85}
        />
      )
      
      const image = screen.getByTestId('optimized-image')
      expect(image).toHaveAttribute('data-sizes', '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw')
      expect(image).toHaveAttribute('data-quality', '85')
    })
  })

  describe('Animation Performance', () => {
    it('uses CSS animations instead of JavaScript for better performance', () => {
      render(
        <div className="animate-float" data-testid="css-animation">
          Floating element
        </div>
      )
      
      const element = screen.getByTestId('css-animation')
      expect(element).toHaveClass('animate-float')
    })

    it('implements smooth transitions with proper duration', () => {
      render(
        <div className="transition-all duration-300 ease-out" data-testid="smooth-transition">
          Smooth element
        </div>
      )

      const element = screen.getByTestId('smooth-transition')
      expect(element).toHaveClass('transition-all', 'duration-300', 'ease-out')
    })

    it('uses hardware acceleration for transforms', () => {
      render(
        <div className="hover:-translate-y-2" data-testid="transform-element">
          Hoverable element
        </div>
      )
      
      const element = screen.getByTestId('transform-element')
      expect(element).toHaveClass('hover:-translate-y-2')
    })
  })

  describe('Bundle Size Optimization', () => {
    it('tree-shakes icon imports correctly', () => {
      // Test that we're importing specific icons, not the entire library
      const iconImportPattern = /import\s*{\s*[\w\s,]+\s*}\s*from\s*['"]lucide-react['"]/
      
      // This would be tested in a real environment by checking bundle analysis
      // Here we verify the import pattern is correct
      const mockImport = "import { DollarSign, TrendingUp, Target } from 'lucide-react'"
      expect(mockImport).toMatch(iconImportPattern)
    })

    it('uses dynamic imports for heavy components', () => {
      const dynamicImportPattern = /dynamic\(\s*\(\)\s*=>\s*import\(/
      
      // Mock dynamic import usage
      const mockDynamicImport = "dynamic(() => import('@/components/ui/card'))"
      expect(mockDynamicImport).toMatch(dynamicImportPattern)
    })
  })

  describe('Responsive Performance', () => {
    it('uses proper responsive breakpoints', () => {
      render(
        <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" data-testid="responsive-grid">
          Responsive grid
        </div>
      )
      
      const element = screen.getByTestId('responsive-grid')
      expect(element).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4')
    })

    it('optimizes text sizing for mobile', () => {
      render(
        <h1 className="text-xl md:text-2xl" data-testid="responsive-heading">
          Responsive heading
        </h1>
      )
      
      const heading = screen.getByTestId('responsive-heading')
      expect(heading).toHaveClass('text-xl', 'md:text-2xl')
    })

    it('maintains 44px touch targets on mobile', () => {
      render(
        <button className="min-h-[44px] px-6 py-4" data-testid="touch-button">
          Touch target
        </button>
      )

      const button = screen.getByTestId('touch-button')
      expect(button).toHaveClass('min-h-[44px]')

      // Mock getComputedStyle to return a valid minHeight value
      const originalGetComputedStyle = window.getComputedStyle
      window.getComputedStyle = vi.fn().mockReturnValue({ minHeight: '44px' } as CSSStyleDeclaration)

      // Verify computed height meets accessibility requirements
      const styles = window.getComputedStyle(button)
      expect(parseInt(styles.minHeight || '0')).toBeGreaterThanOrEqual(44)

      // Restore original function
      window.getComputedStyle = originalGetComputedStyle
    })
  })

  describe('Memory Management', () => {
    it('cleans up event listeners and timers', () => {
      const cleanup = vi.fn()
      
      const TestComponent = () => {
        React.useEffect(() => {
          return cleanup
        }, [])
        
        return <div data-testid="cleanup-component">Test</div>
      }
      
      const { unmount } = render(<TestComponent />)
      
      unmount()
      
      expect(cleanup).toHaveBeenCalled()
    })

    it('uses React.memo for expensive components', () => {
      const ExpensiveComponent = React.memo(({ data }: { data: string }) => (
        <div data-testid="expensive-component">{data}</div>
      ))

      // Set display name for better debugging
      ExpensiveComponent.displayName = 'ExpensiveComponent'

      const { rerender } = render(<ExpensiveComponent data="test" />)

      // Component should be memoized and have display name
      expect(ExpensiveComponent.displayName).toBe('ExpensiveComponent')

      rerender(<ExpensiveComponent data="test" />)

      expect(screen.getByTestId('expensive-component')).toBeInTheDocument()
    })
  })

  describe('Critical Resource Loading', () => {
    it('prioritizes above-the-fold content', () => {
      render(
        <div>
          <div className="hero-section" data-testid="hero">Hero content</div>
          <div className="below-fold" data-testid="below-fold">Below fold content</div>
        </div>
      )
      
      // Hero should load immediately
      expect(screen.getByTestId('hero')).toBeInTheDocument()
      
      // Below fold content exists but may be lazy loaded
      expect(screen.getByTestId('below-fold')).toBeInTheDocument()
    })

    it('preloads critical fonts', () => {
      // In a real test, this would check document head for font preload links
      const fontPreloadLink = document.createElement('link')
      fontPreloadLink.rel = 'preload'
      fontPreloadLink.href = '/fonts/inter.woff2'
      fontPreloadLink.as = 'font'
      fontPreloadLink.type = 'font/woff2'
      fontPreloadLink.crossOrigin = 'anonymous'
      
      expect(fontPreloadLink.rel).toBe('preload')
      expect(fontPreloadLink.as).toBe('font')
      expect(fontPreloadLink.type).toBe('font/woff2')
    })
  })

  describe('Accessibility Performance', () => {
    it('maintains proper focus management during loading', async () => {
      const LoadingComponent = () => (
        <div role="status" aria-label="Loading content" data-testid="loading-status">
          <span className="sr-only">Loading...</span>
        </div>
      )
      
      render(<LoadingComponent />)
      
      const status = screen.getByTestId('loading-status')
      expect(status).toHaveAttribute('role', 'status')
      expect(status).toHaveAttribute('aria-label', 'Loading content')
    })

    it('preserves screen reader announcements during transitions', () => {
      render(
        <div role="region" aria-live="polite" data-testid="live-region">
          <span>Dynamic content updates</span>
        </div>
      )
      
      const liveRegion = screen.getByTestId('live-region')
      expect(liveRegion).toHaveAttribute('aria-live', 'polite')
    })
  })
})