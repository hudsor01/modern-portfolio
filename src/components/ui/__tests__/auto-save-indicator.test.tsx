/**
 * Auto-Save Indicator Component Tests
 * Component tests for auto-save visual feedback
 */

import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AutoSaveIndicator, FormAutoSaveStatus, GlobalAutoSaveStatus } from '../auto-save-indicator'
import { useAutoSaveStatus } from '@/hooks/use-form-auto-save'

// Mock the auto-save hook
vi.mock('@/hooks/use-form-auto-save', () => ({
  useAutoSaveStatus: vi.fn()
}))

const mockUseAutoSaveStatus = useAutoSaveStatus as vi.MockedFunction<typeof useAutoSaveStatus>

describe('AutoSaveIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAutoSaveStatus.mockReturnValue({
      hasUnsaved: false,
      isSaving: false,
      hasErrors: false,
      count: 0
    })
  })

  it('should not render when idle', () => {
    const { container } = render(<AutoSaveIndicator />)
    expect(container.firstChild).toBeNull()
  })

  it('should show saving state', () => {
    render(
      <AutoSaveIndicator
        isSaving={true}
        variant="detailed"
      />
    )

    expect(screen.getByText('Saving...')).toBeInTheDocument()
    expect(screen.getByRole('img', { hidden: true })).toHaveClass('animate-spin')
  })

  it('should show dirty state', () => {
    render(
      <AutoSaveIndicator
        isDirty={true}
        variant="detailed"
      />
    )

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
  })

  it('should show saved state with timestamp', () => {
    const lastSaved = new Date(Date.now() - 30000) // 30 seconds ago

    render(
      <AutoSaveIndicator
        lastSaved={lastSaved}
        variant="detailed"
      />
    )

    expect(screen.getByText(/Saved .* ago/)).toBeInTheDocument()
  })

  it('should show error state', () => {
    render(
      <AutoSaveIndicator
        error="Network error"
        variant="detailed"
      />
    )

    expect(screen.getByText('Network error')).toBeInTheDocument()
  })

  it('should use global status when no props provided', () => {
    mockUseAutoSaveStatus.mockReturnValue({
      hasUnsaved: true,
      isSaving: false,
      hasErrors: false,
      count: 1
    })

    render(
      <AutoSaveIndicator variant="detailed" />
    )

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
  })

  it('should apply correct styling for different variants', () => {
    const { rerender } = render(
      <AutoSaveIndicator
        isDirty={true}
        variant="minimal"
        data-testid="indicator"
      />
    )

    let indicator = screen.getByTestId('indicator')
    expect(indicator).toHaveClass('px-2', 'py-1')

    rerender(
      <AutoSaveIndicator
        isDirty={true}
        variant="detailed"
        data-testid="indicator"
      />
    )

    indicator = screen.getByTestId('indicator')
    expect(indicator).toHaveClass('px-3', 'py-1.5', 'rounded-full', 'border', 'backdrop-blur')

    rerender(
      <AutoSaveIndicator
        isDirty={true}
        variant="badge"
        data-testid="indicator"
      />
    )

    indicator = screen.getByTestId('indicator')
    expect(indicator).toHaveClass('px-2', 'py-0.5', 'rounded-md', 'border', 'backdrop-blur')
  })

  it('should apply floating position styling', () => {
    render(
      <AutoSaveIndicator
        isDirty={true}
        position="floating"
        data-testid="indicator"
      />
    )

    const indicator = screen.getByTestId('indicator')
    expect(indicator).toHaveClass('fixed', 'bottom-4', 'right-4', 'z-50', 'shadow-lg')
  })

  it('should format timestamps correctly', () => {
    const testCases = [
      { offset: 5000, expected: 'just now' }, // 5 seconds ago
      { offset: 30000, expected: '30s ago' }, // 30 seconds ago
      { offset: 120000, expected: '2m ago' }, // 2 minutes ago
    ]

    testCases.forEach(({ offset, expected }) => {
      const lastSaved = new Date(Date.now() - offset)
      
      const { unmount } = render(
        <AutoSaveIndicator
          lastSaved={lastSaved}
          variant="detailed"
        />
      )

      expect(screen.getByText(new RegExp(`Saved ${expected}`))).toBeInTheDocument()
      unmount()
    })
  })
})

describe('FormAutoSaveStatus', () => {
  it('should pass props correctly to AutoSaveIndicator', () => {
    const props = {
      isDirty: true,
      isSaving: false,
      lastSaved: new Date(),
      error: null,
      variant: 'detailed' as const,
      className: 'test-class'
    }

    render(<FormAutoSaveStatus {...props} />)

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()
  })

  it('should use detailed variant by default', () => {
    render(
      <FormAutoSaveStatus
        isDirty={true}
        isSaving={false}
        data-testid="form-status"
      />
    )

    const indicator = screen.getByTestId('form-status')
    expect(indicator).toHaveClass('px-3', 'py-1.5')
  })
})

describe('GlobalAutoSaveStatus', () => {
  beforeEach(() => {
    mockUseAutoSaveStatus.mockReturnValue({
      hasUnsaved: false,
      isSaving: false,
      hasErrors: false,
      count: 0
    })
  })

  it('should not render when no forms are active', () => {
    const { container } = render(<GlobalAutoSaveStatus />)
    expect(container.firstChild).toBeNull()
  })

  it('should render when forms are active', () => {
    mockUseAutoSaveStatus.mockReturnValue({
      hasUnsaved: true,
      isSaving: false,
      hasErrors: false,
      count: 2
    })

    render(<GlobalAutoSaveStatus data-testid="global-status" />)

    const indicator = screen.getByTestId('global-status')
    expect(indicator).toBeInTheDocument()
    expect(indicator).toHaveClass('fixed', 'bottom-4', 'right-4')
  })

  it('should show saving state globally', () => {
    mockUseAutoSaveStatus.mockReturnValue({
      hasUnsaved: false,
      isSaving: true,
      hasErrors: false,
      count: 1
    })

    render(<GlobalAutoSaveStatus />)

    expect(screen.getByText('Saving...')).toBeInTheDocument()
  })

  it('should show error state globally', () => {
    mockUseAutoSaveStatus.mockReturnValue({
      hasUnsaved: false,
      isSaving: false,
      hasErrors: true,
      count: 1
    })

    render(<GlobalAutoSaveStatus />)

    // Should show some error indication
    const indicator = screen.getByRole('img', { hidden: true })
    expect(indicator).toBeInTheDocument()
  })
})

// Accessibility tests
describe('AutoSaveIndicator Accessibility', () => {
  it('should have proper ARIA attributes', () => {
    render(
      <AutoSaveIndicator
        isSaving={true}
        variant="detailed"
      />
    )

    const indicator = screen.getByText('Saving...')
    expect(indicator.closest('[role]')).toHaveAttribute('aria-live', 'polite')
  })

  it('should announce status changes to screen readers', () => {
    const { rerender } = render(
      <AutoSaveIndicator
        isDirty={true}
        variant="detailed"
      />
    )

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument()

    rerender(
      <AutoSaveIndicator
        isSaving={true}
        variant="detailed"
      />
    )

    expect(screen.getByText('Saving...')).toBeInTheDocument()

    rerender(
      <AutoSaveIndicator
        lastSaved={new Date()}
        variant="detailed"
      />
    )

    expect(screen.getByText(/Saved/)).toBeInTheDocument()
  })
})

// Animation and transition tests
describe('AutoSaveIndicator Animations', () => {
  it('should have transition classes for animations', () => {
    render(
      <AutoSaveIndicator
        isSaving={true}
        variant="detailed"
        data-testid="indicator"
      />
    )

    const indicator = screen.getByTestId('indicator')
    expect(indicator).toHaveClass('transition-all', 'duration-300')
  })

  it('should show spinning animation when saving', () => {
    render(
      <AutoSaveIndicator
        isSaving={true}
        variant="detailed"
      />
    )

    const spinner = screen.getByRole('img', { hidden: true })
    expect(spinner).toHaveClass('animate-spin')
  })
})