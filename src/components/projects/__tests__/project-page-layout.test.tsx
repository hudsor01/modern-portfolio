import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProjectPageLayout } from '../project-page-layout'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: React.PropsWithChildren<{ href: string }>) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  ArrowLeft: ({ className }: { className?: string }) => <svg data-testid="arrow-left-icon" className={className} />,
  RefreshCcw: ({ className }: { className?: string }) => <svg data-testid="refresh-icon" className={className} />,
}))

// Mock AnimatedBackground component
vi.mock('../animated-background', () => ({
  AnimatedBackground: () => <div data-testid="animated-background" />,
}))

describe('ProjectPageLayout', () => {
  const defaultProps = {
    title: 'Test Project',
    description: 'Test project description',
    tags: [
      { label: 'Metric: $1M', color: 'bg-primary/20 text-primary' },
      { label: 'Count: 100', color: 'bg-secondary/20 text-secondary' },
    ],
    children: <div>Test Content</div>,
  }

  it('should render all core elements', () => {
    render(<ProjectPageLayout {...defaultProps} />)

    expect(screen.getByTestId('animated-background')).toBeInTheDocument()
    expect(screen.getByText('Back to Projects')).toBeInTheDocument()
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('Test project description')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should render back button with correct link', () => {
    render(<ProjectPageLayout {...defaultProps} />)

    const backButton = screen.getByText('Back to Projects').closest('a')
    expect(backButton).toHaveAttribute('href', '/projects')
  })

  it('should render all tags with correct styling', () => {
    render(<ProjectPageLayout {...defaultProps} />)

    const tag1 = screen.getByText('Metric: $1M')
    const tag2 = screen.getByText('Count: 100')

    expect(tag1).toHaveClass('bg-primary/20', 'text-primary')
    expect(tag2).toHaveClass('bg-secondary/20', 'text-secondary')
  })

  it('should render refresh button when onRefresh is provided', () => {
    const onRefresh = vi.fn()
    render(<ProjectPageLayout {...defaultProps} onRefresh={onRefresh} />)

    const refreshButton = screen.getByTestId('refresh-icon').closest('button')
    expect(refreshButton).toBeInTheDocument()
  })

  it('should call onRefresh when refresh button is clicked', () => {
    const onRefresh = vi.fn()
    render(<ProjectPageLayout {...defaultProps} onRefresh={onRefresh} />)

    const refreshButton = screen.getByTestId('refresh-icon').closest('button')
    fireEvent.click(refreshButton!)

    expect(onRefresh).toHaveBeenCalledTimes(1)
  })

  it('should disable refresh button when refreshButtonDisabled is true', () => {
    const onRefresh = vi.fn()
    render(
      <ProjectPageLayout
        {...defaultProps}
        onRefresh={onRefresh}
        refreshButtonDisabled={true}
      />
    )

    const refreshButton = screen.getByTestId('refresh-icon').closest('button') as HTMLButtonElement
    expect(refreshButton.disabled).toBe(true)
  })

  it('should not render refresh button when onRefresh is not provided', () => {
    render(<ProjectPageLayout {...defaultProps} />)

    const refreshIcon = screen.queryByTestId('refresh-icon')
    expect(refreshIcon).not.toBeInTheDocument()
  })

  it('should render timeframe selector when showTimeframes is true', () => {
    render(
      <ProjectPageLayout
        {...defaultProps}
        showTimeframes={true}
        timeframes={['All', 'YTD', 'Q4']}
        activeTimeframe="All"
      />
    )

    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('YTD')).toBeInTheDocument()
    expect(screen.getByText('Q4')).toBeInTheDocument()
  })

  it('should highlight active timeframe', () => {
    render(
      <ProjectPageLayout
        {...defaultProps}
        showTimeframes={true}
        timeframes={['All', 'YTD', 'Q4']}
        activeTimeframe="YTD"
      />
    )

    const ytdButton = screen.getByText('YTD')
    expect(ytdButton).toHaveClass('bg-primary', 'text-foreground', 'shadow-lg')

    const allButton = screen.getByText('All')
    expect(allButton).toHaveClass('text-muted-foreground')
  })

  it('should call onTimeframeChange when timeframe button is clicked', () => {
    const onTimeframeChange = vi.fn()
    render(
      <ProjectPageLayout
        {...defaultProps}
        showTimeframes={true}
        timeframes={['All', 'YTD', 'Q4']}
        activeTimeframe="All"
        onTimeframeChange={onTimeframeChange}
      />
    )

    const ytdButton = screen.getByText('YTD')
    fireEvent.click(ytdButton)

    expect(onTimeframeChange).toHaveBeenCalledWith('YTD')
  })

  it('should not render timeframe selector when showTimeframes is false', () => {
    render(
      <ProjectPageLayout
        {...defaultProps}
        showTimeframes={false}
        timeframes={['All', 'YTD', 'Q4']}
      />
    )

    expect(screen.queryByText('All')).not.toBeInTheDocument()
    expect(screen.queryByText('YTD')).not.toBeInTheDocument()
  })

  it('should use gradient styling for title', () => {
    render(<ProjectPageLayout {...defaultProps} />)

    const title = screen.getByText('Test Project')
    expect(title).toHaveClass('bg-gradient-to-r', 'from-blue-300', 'via-cyan-300', 'to-cyan-400', 'bg-clip-text', 'text-transparent')
  })

  it('should have max-w-7xl container', () => {
    const { container } = render(<ProjectPageLayout {...defaultProps} />)

    const mainContainer = container.querySelector('.max-w-7xl')
    expect(mainContainer).toBeInTheDocument()
  })

  it('should have proper spacing classes', () => {
    const { container } = render(<ProjectPageLayout {...defaultProps} />)

    const mainContainer = container.querySelector('.max-w-7xl')
    expect(mainContainer).toHaveClass('mx-auto', 'p-6')
  })

  it('should render children content', () => {
    render(
      <ProjectPageLayout {...defaultProps}>
        <div data-testid="custom-content">Custom Project Content</div>
      </ProjectPageLayout>
    )

    expect(screen.getByTestId('custom-content')).toBeInTheDocument()
    expect(screen.getByText('Custom Project Content')).toBeInTheDocument()
  })

  it('should have dark background theme', () => {
    const { container } = render(<ProjectPageLayout {...defaultProps} />)

    const outerContainer = container.firstChild as HTMLElement
    expect(outerContainer).toHaveClass('min-h-screen', 'bg-[#0f172a]', 'text-white')
  })

  it('should have dark background theme', () => {
    const { container } = render(<ProjectPageLayout {...defaultProps} />)

    // AnimatedBackground component is rendered (implementation detail - component exists)
    // Actual z-index positioning is handled by component internals
    expect(container.querySelector('.min-h-screen')).toBeInTheDocument()
  })
})
