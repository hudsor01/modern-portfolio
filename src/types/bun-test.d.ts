/**
 * Bun Test Extensions
 * Type declarations for runtime extensions added in test setup
 */

// Reference the bun:test types
/// <reference types="bun-types" />

// Augment the bun:test module to add our custom vi methods
declare module 'bun:test' {
  interface Vi {
    /** Store original and set mock on globalThis */
    stubGlobal(name: string, value: unknown): void
    /** Restore all stubbed globals */
    unstubAllGlobals(): void
    /** No-op for Vitest compatibility - returns the mock */
    mocked<T>(item: T): T
    /** Vitest hoisted - executes function and returns result */
    hoisted<T>(fn: () => T): T
    /** Alias for vi.mock */
    doMock(path: string, factory?: () => unknown): void

    // =============================================================================
    // FAKE TIMER STUBS (NOT SUPPORTED IN BUN - these are no-ops)
    // =============================================================================

    /** Stub: Bun doesn't support timer mocking */
    advanceTimersByTime(ms: number): Vi
    /** Stub: Bun doesn't support timer mocking */
    runAllTimers(): Vi
    /** Stub: Bun doesn't support timer mocking */
    runAllTimersAsync(): Promise<Vi>
    /** Stub: Bun doesn't support timer mocking */
    runOnlyPendingTimers(): Vi
    /** Stub: Bun doesn't support timer mocking */
    runOnlyPendingTimersAsync(): Promise<Vi>
    /** Stub: Bun doesn't support timer mocking */
    advanceTimersToNextTimer(): Vi
    /** Stub: Bun doesn't support timer mocking */
    advanceTimersToNextTimerAsync(): Promise<Vi>
    /** Stub: Bun doesn't support timer mocking */
    getTimerCount(): number
  }

  // Extend expect matchers with jest-dom matchers
  interface Matchers {
    toBeInTheDocument(): void
    toBeVisible(): void
    toBeEmpty(): void
    toBeDisabled(): void
    toBeEnabled(): void
    toBeInvalid(): void
    toBeRequired(): void
    toBeValid(): void
    toContainElement(element: HTMLElement | null): void
    toContainHTML(html: string): void
    toHaveAccessibleDescription(description?: string | RegExp): void
    toHaveAccessibleName(name?: string | RegExp): void
    toHaveAttribute(attr: string, value?: string | RegExp): void
    toHaveClass(...classNames: string[]): void
    toHaveFocus(): void
    toHaveFormValues(values: Record<string, unknown>): void
    toHaveStyle(css: string | Record<string, unknown>): void
    toHaveTextContent(text: string | RegExp, options?: { normalizeWhitespace: boolean }): void
    toHaveValue(value?: string | string[] | number | null): void
    toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): void
    toBeChecked(): void
    toBePartiallyChecked(): void
    toHaveErrorMessage(text?: string | RegExp): void
  }
}
