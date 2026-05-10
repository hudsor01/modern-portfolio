// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { ErrorBoundary, withErrorBoundary } from '../error-boundary'

// Silence the React noisy "uncaught error" output that the test triggers
// intentionally — keeps test output readable.
beforeEach(() => {
  cleanup()
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

function Boom({ msg = 'kaboom' }: { msg?: string }): React.ReactElement {
  throw new Error(msg)
}

function Fine() {
  return <div data-testid="fine">healthy</div>
}

describe('ErrorBoundary', () => {
  it('renders its children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <Fine />
      </ErrorBoundary>
    )
    expect(screen.getByTestId('fine')).toBeTruthy()
  })

  it('catches a thrown error and renders the default fallback UI', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    )
    expect(screen.getByText('Something went wrong')).toBeTruthy()
  })

  it('renders a custom node fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<span data-testid="custom">custom-fallback</span>}>
        <Boom />
      </ErrorBoundary>
    )
    expect(screen.getByTestId('custom').textContent).toBe('custom-fallback')
  })

  it('passes the caught error and reset fn to a function fallback', () => {
    const fallback = vi.fn((err: Error, reset: () => void) => (
      <button type="button" data-testid="fn-fallback" onClick={reset}>
        {err.message}
      </button>
    ))
    render(
      <ErrorBoundary fallback={fallback}>
        <Boom msg="explicit-message" />
      </ErrorBoundary>
    )
    const node = screen.getByTestId('fn-fallback')
    expect(node.textContent).toBe('explicit-message')
    expect(fallback).toHaveBeenCalled()
    expect(fallback.mock.calls[0]?.[0]).toBeInstanceOf(Error)
    expect(typeof fallback.mock.calls[0]?.[1]).toBe('function')
  })

  it('renders the "Try again" reset button by default', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    )
    expect(screen.getByRole('button', { name: /try again/i })).toBeTruthy()
  })

  it('hides the reset button when showReset is false', () => {
    render(
      <ErrorBoundary showReset={false}>
        <Boom />
      </ErrorBoundary>
    )
    expect(screen.queryByRole('button', { name: /try again/i })).toBeNull()
  })

  it('invokes onError with the error and errorInfo', () => {
    const onError = vi.fn()
    render(
      <ErrorBoundary onError={onError}>
        <Boom msg="for-handler" />
      </ErrorBoundary>
    )
    expect(onError).toHaveBeenCalled()
    expect(onError.mock.calls[0]?.[0]).toBeInstanceOf(Error)
    expect((onError.mock.calls[0]?.[0] as Error).message).toBe('for-handler')
    // Second arg is React's ErrorInfo with `componentStack`
    expect(onError.mock.calls[0]?.[1]).toHaveProperty('componentStack')
  })

  it('reset button restores child rendering once cause is gone', () => {
    function Toggleable({ throwIt }: { throwIt: boolean }) {
      if (throwIt) throw new Error('toggleable')
      return <div data-testid="recovered">recovered</div>
    }

    function Harness() {
      const [throwIt, setThrowIt] = (require('react') as typeof import('react')).useState(true)
      return (
        <>
          <button type="button" data-testid="fix" onClick={() => setThrowIt(false)} />
          <ErrorBoundary>
            <Toggleable throwIt={throwIt} />
          </ErrorBoundary>
        </>
      )
    }

    render(<Harness />)
    expect(screen.getByText('Something went wrong')).toBeTruthy()
    // First, fix the underlying cause (so the child won't throw on re-render)
    fireEvent.click(screen.getByTestId('fix'))
    // Then click reset on the boundary
    fireEvent.click(screen.getByRole('button', { name: /try again/i }))
    expect(screen.getByTestId('recovered')).toBeTruthy()
  })
})

describe('withErrorBoundary HOC', () => {
  it('wraps the component and isolates errors', () => {
    const Wrapped = withErrorBoundary(Boom)
    render(<Wrapped />)
    expect(screen.getByText('Something went wrong')).toBeTruthy()
  })

  it('renders the wrapped component normally when it does not throw', () => {
    const Wrapped = withErrorBoundary(Fine)
    render(<Wrapped />)
    expect(screen.getByTestId('fine')).toBeTruthy()
  })

  it('sets a descriptive displayName', () => {
    const Wrapped = withErrorBoundary(Fine)
    expect(Wrapped.displayName).toBe('withErrorBoundary(Fine)')
  })
})
