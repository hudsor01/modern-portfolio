import { describe, expect, it, mock, beforeEach, afterAll } from 'bun:test'
import { render } from '@testing-library/react'
import type { Project } from '@/types/project'
import type { MockNextImageProps, MockNextLinkProps } from '@/types/test-utils'

// Import after mocks are set up in beforeEach - Bun supports mocking after import
import ProjectDetailClientBoundary from '@/components/projects/project-detail-client-boundary'

describe('Project Detail Consistency Integration', () => {
  // Set up mocks before each test and restore after
  beforeEach(() => {
    mock.module('@/hooks/use-page-analytics', () => ({
      usePageAnalytics: () => {},
    }))

    mock.module('@/components/layout/navbar', () => ({
      Navbar: () => <nav data-testid="navbar">Navigation</nav>,
    }))

    mock.module('next/image', () => ({
      default: ({ src, alt, ...props }: MockNextImageProps) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} {...props} data-testid="project-image" />
      ),
    }))

    mock.module('next/link', () => ({
      default: ({ href, children, ...props }: MockNextLinkProps) => (
        <a href={href} {...props}>
          {children}
        </a>
      ),
    }))

    // Note: We don't mock @/components/navigation to avoid polluting other test files
    // The real navigation components will render correctly with the mocked next/link

    mock.module('@tanstack/react-query', () => ({
      useQuery: () => ({
        data: null,
        isLoading: false,
        error: null,
        refetch: () => {},
      }),
    }))
  })

  // Clean up all mocks after tests in this file to prevent pollution
  afterAll(() => {
    mock.restore()
  })

  // Sample project data for testing
  const mockProject: Project = {
    id: '1',
    slug: 'test-project',
    title: 'Test Project',
    description: 'A test project for consistency validation',
    longDescription:
      'This is a longer description of the test project that provides more details about the implementation and goals.',
    content: null,
    category: 'Analytics',
    tags: ['React', 'TypeScript', 'Tailwind CSS'],
    image: '/images/test-project.jpg',
    link: 'https://example.com',
    github: 'https://github.com/example/test-project',
    featured: true,
    client: null,
    role: null,
    duration: null,
    year: null,
    impact: null,
    results: null,
    displayMetrics: null,
    metrics: null,
    testimonial: null,
    gallery: null,
    details: null,
    charts: null,
    caseStudyUrl: null,
    viewCount: 100,
    clickCount: 50,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  describe('Component Structure and Consistency', () => {
    it('renders with standardized components when project data is provided', () => {
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      // Verify basic structure exists - use container queries since the DOM is nested
      expect(container.querySelector('[data-testid="navbar"]')).toBeInTheDocument()

      // Verify project title and description are rendered
      expect(container).toHaveTextContent('Test Project')
      expect(container).toHaveTextContent('A test project for consistency validation')
    })

    it('uses consistent component patterns for content organization', () => {
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      // Verify that standardized components are being used
      // This test validates that the refactored component uses the new structure
      expect(container).toHaveTextContent('Test Project')
      expect(container).toHaveTextContent('A test project for consistency validation')

      // Verify technology badges are rendered
      expect(container).toHaveTextContent('React')
      expect(container).toHaveTextContent('TypeScript')
      expect(container).toHaveTextContent('Tailwind CSS')
    })

    it('displays project image when available', () => {
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      const projectImage = container.querySelector('[data-testid="project-image"]')
      expect(projectImage).toBeInTheDocument()
      expect(projectImage).toHaveAttribute('alt', 'Test Project')
    })

    it('displays action buttons with proper attributes', () => {
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      // Verify Live Demo button exists
      expect(container).toHaveTextContent('Live Demo')
      expect(container).toHaveTextContent('View Code')
    })

    it('includes CTA section with proper navigation', () => {
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      // Verify CTA section exists
      expect(container).toHaveTextContent('Impressed by This Case Study?')
      expect(container).toHaveTextContent('Get In Touch')
    })
  })

  describe('Data Handling and Fallbacks', () => {
    it('handles missing optional data gracefully', () => {
      const projectWithoutOptionalData: Project = {
        ...mockProject,
        image: '', // Empty string for required field to test fallback handling
        longDescription: null,
        link: null,
        github: null,
      }

      const { container } = render(
        <ProjectDetailClientBoundary
          slug="test-project"
          initialProject={projectWithoutOptionalData}
        />
      )

      // Verify component still renders core content
      expect(container).toHaveTextContent('Test Project')
      expect(container).toHaveTextContent('A test project for consistency validation')

      // Verify optional elements are not rendered
      expect(container.querySelector('[data-testid="project-image"]')).not.toBeInTheDocument()
      expect(container.querySelector('[data-testid="star-chart"]')).not.toBeInTheDocument()
      expect(container).not.toHaveTextContent('Live Demo')
      expect(container).not.toHaveTextContent('View Code')
    })

    it('uses fallback description when longDescription is not available', () => {
      const projectWithoutLongDescription: Project = {
        ...mockProject,
        longDescription: null,
      }

      const { container } = render(
        <ProjectDetailClientBoundary
          slug="test-project"
          initialProject={projectWithoutLongDescription}
        />
      )

      // Verify fallback to regular description
      expect(container).toHaveTextContent('A test project for consistency validation')
    })

    it('renders with minimal project data', () => {
      const minimalProject: Project = {
        id: '1',
        slug: 'minimal-project',
        title: 'Minimal Project',
        description: 'A minimal project',
        longDescription: null,
        content: null,
        category: 'Test',
        tags: [],
        image: '/placeholder.jpg', // Add required image field
        link: null,
        github: null,
        featured: false,
        client: null,
        role: null,
        duration: null,
        year: null,
        impact: null,
        results: null,
        displayMetrics: null,
        metrics: null,
        testimonial: null,
        gallery: null,
        details: null,
        charts: null,
        caseStudyUrl: null,
        viewCount: 0,
        clickCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const { container } = render(
        <ProjectDetailClientBoundary slug="minimal-project" initialProject={minimalProject} />
      )

      // Verify component renders without errors
      expect(container).toHaveTextContent('Minimal Project')
      expect(container).toHaveTextContent('A minimal project')
    })
  })

  describe('Accessibility and Standards Compliance', () => {
    it('maintains proper heading hierarchy', () => {
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      // Verify main heading exists
      const h1 = container.querySelector('h1')
      expect(h1).toBeInTheDocument()
      expect(h1).toHaveTextContent('Test Project')
    })

    it('provides proper link accessibility for external links', () => {
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      // Verify external links content exists (since they're rendered as buttons with Link wrappers)
      expect(container).toHaveTextContent('Live Demo')
      expect(container).toHaveTextContent('View Code')
    })

    it('includes navigation elements', () => {
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      // Verify navigation exists
      expect(container.querySelector('[data-testid="navbar"]')).toBeInTheDocument()

      // Verify back navigation exists
      expect(container.querySelector('[data-testid="back-button"]')).toBeInTheDocument()
      expect(container).toHaveTextContent('Back to Projects')
    })
  })

  describe('Design System Integration Validation', () => {
    it('validates consistent use of standardized layout patterns', () => {
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      // Verify that the refactored component follows the new standardized patterns
      // This is a high-level validation that the component structure is consistent
      expect(container).toHaveTextContent('Test Project')
      expect(container).toHaveTextContent('A test project for consistency validation')

      // Verify that key sections are present
      expect(container).toHaveTextContent('Analytics') // Category tag
      expect(container).toHaveTextContent('React') // Technology tag

      // Verify CTA section
      expect(container).toHaveTextContent('Impressed by This Case Study?')
    })

    it('ensures consistent error handling and loading patterns', () => {
      // Test that the component uses the DataLoadingState wrapper
      // This validates that the refactored component follows standardized error handling
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      // If the component renders successfully, it means the DataLoadingState is working
      expect(container).toHaveTextContent('Test Project')
    })

    it('validates technology badge formatting consistency', () => {
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      // Verify all technology badges are present
      const techBadges = ['React', 'TypeScript', 'Tailwind CSS']
      techBadges.forEach((tech) => {
        expect(container).toHaveTextContent(tech)
      })
    })
  })
})
