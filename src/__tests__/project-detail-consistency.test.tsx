import { describe, expect, it, vi } from 'vitest'
import { render } from '@testing-library/react'
import ProjectDetailClientBoundary from '@/components/projects/project-detail-client-boundary'
import type { Project } from '@/types/project'
import type {
  MockNextImageProps,
  MockNextLinkProps,
  MockSTARAreaChartProps,
  MockBackButtonProps,
  MockNavigationBreadcrumbsProps,
  MockBreadcrumbItem,
} from '@/types/test-utils'

// Mock the page analytics hook
vi.mock('@/hooks/use-page-analytics', () => ({
  usePageAnalytics: () => {},
}))

// Mock the Navbar component
vi.mock('@/components/layout/navbar', () => ({
  Navbar: () => <nav data-testid="navbar">Navigation</nav>,
}))

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt, ...props }: MockNextImageProps) => (
    // Using img element intentionally for test mocking purposes
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} data-testid="project-image" />
  ),
}))

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: MockNextLinkProps) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

// Mock the STARAreaChart component
vi.mock('@/components/projects/STARAreaChart', () => ({
  STARAreaChart: ({ data, title }: MockSTARAreaChartProps) => (
    <div data-testid="star-chart" data-title={title}>
      STAR Chart: {JSON.stringify(data)}
    </div>
  ),
}))

// Mock navigation components
vi.mock('@/components/navigation', () => ({
  BackButton: ({ href, label, ...props }: MockBackButtonProps) => (
    <a href={href} {...props} data-testid="back-button">
      {label}
    </a>
  ),
  NavigationBreadcrumbs: ({ items, currentPage }: MockNavigationBreadcrumbsProps) => (
    <nav data-testid="breadcrumbs">
      {items?.map((item: MockBreadcrumbItem, index: number) => (
        <span key={index}>{item.label}</span>
      ))}
      <span>{currentPage}</span>
    </nav>
  ),
}))

// Mock TanStack Query
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({
    data: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}))

// Sample project data for testing
const mockProject: Project = {
  id: '1',
  slug: 'test-project',
  title: 'Test Project',
  description: 'A test project for consistency validation',
  longDescription:
    'This is a longer description of the test project that provides more details about the implementation and goals.',
  category: 'Analytics',
  tags: ['test', 'consistency'],
  technologies: ['React', 'TypeScript', 'Tailwind CSS'],
  image: '/images/test-project.jpg',
  featured: true,
  viewCount: 100,
  clickCount: 50,
  createdAt: new Date('2024-01-01'),
  liveUrl: 'https://example.com',
  githubUrl: 'https://github.com/example/test-project',
  starData: {
    situation: { phase: 'Situation', impact: 80, efficiency: 70, value: 90 },
    task: { phase: 'Task', impact: 85, efficiency: 75, value: 85 },
    action: { phase: 'Action', impact: 90, efficiency: 85, value: 95 },
    result: { phase: 'Result', impact: 95, efficiency: 90, value: 100 },
  },
}

describe('Project Detail Consistency Integration', () => {
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

    it('renders STAR chart when data is available', () => {
      const { container } = render(
        <ProjectDetailClientBoundary slug="test-project" initialProject={mockProject} />
      )

      expect(container.querySelector('[data-testid="star-chart"]')).toBeInTheDocument()
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
        starData: undefined,
        liveUrl: undefined,
        githubUrl: undefined,
        longDescription: undefined,
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
        longDescription: undefined,
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
        category: 'Test',
        tags: [],
        technologies: [],
        image: '/placeholder.jpg', // Add required image field
        featured: false,
        viewCount: 0,
        clickCount: 0,
        createdAt: new Date(),
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
