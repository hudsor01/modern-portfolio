'use client'

import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  amountInputError,
  caretAfterFormat,
  computeCoverage,
  COVERAGE_PRESETS,
  formatGrouped,
  sanitizeAmount,
} from '@/lib/pipeline-coverage'

const usd0 = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})
const usdCompact = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})
function money(n: number): string {
  return Math.abs(n) >= 1_000_000 ? usdCompact.format(n) : usd0.format(n)
}
function mult(n: number): string {
  return `${n.toFixed(1)}×`
}
/** Empty string → undefined; otherwise the parsed number (NaN-safe via the lib). */
function parse(v: string): number | undefined {
  if (v.trim() === '') return undefined
  if (amountInputError(v) !== null) return Number.NaN
  const n = Number(sanitizeAmount(v))
  return Number.isFinite(n) ? n : Number.NaN
}

const inputClass =
  'w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-hidden focus:ring-[3px] focus:ring-primary/20 focus:border-primary transition-all'

export function PipelineCoverageCalculator() {
  const ids = {
    target: useId(),
    win: useId(),
    deal: useId(),
    pipe: useId(),
    qual: useId(),
    safety: useId(),
  }
  const [target, setTarget] = useState('1000000')
  const [winRate, setWinRate] = useState('25')
  const [avgDeal, setAvgDeal] = useState('')
  const [currentPipe, setCurrentPipe] = useState('')
  const [qualified, setQualified] = useState('100')
  const [safety, setSafety] = useState('0')

  const hasAmountError = [target, avgDeal, currentPipe].some((v) => amountInputError(v) !== null)

  const result = useMemo(
    () =>
      computeCoverage({
        revenueTarget: parse(target) ?? Number.NaN,
        winRatePct: parse(winRate) ?? Number.NaN,
        avgDealSize: parse(avgDeal),
        currentPipeline: parse(currentPipe),
        qualifiedRatePct: parse(qualified),
        safetyMarginPct: parse(safety),
      }),
    [target, winRate, avgDeal, currentPipe, qualified, safety]
  )

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Inputs */}
      <div className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm">
        <h2 className="mb-6">Your numbers</h2>

        <div className="space-y-5">
          <MoneyField
            id={ids.target}
            label="Revenue target (this period)"
            value={target}
            onValueChange={setTarget}
            placeholder="1,000,000"
          />

          <div>
            <Field id={ids.win} label="Win rate" suffix="%">
              <input
                id={ids.win}
                type="number"
                min="0"
                max="100"
                inputMode="decimal"
                value={winRate}
                onChange={(e) => setWinRate(e.target.value)}
                className={`${inputClass} pr-8`}
                placeholder="25"
              />
            </Field>
            <div className="mt-2 flex flex-wrap gap-2">
              {COVERAGE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setWinRate(String(p.winRatePct))}
                  className="text-xs px-3 py-1 rounded-full border border-border bg-background text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {p.label} ({p.winRatePct}%)
                </button>
              ))}
            </div>
          </div>

          <MoneyField
            id={ids.deal}
            label="Average deal size (optional)"
            value={avgDeal}
            onValueChange={setAvgDeal}
            placeholder="50,000"
          />

          <MoneyField
            id={ids.pipe}
            label="Open pipeline today (optional)"
            value={currentPipe}
            onValueChange={setCurrentPipe}
            placeholder="3,000,000"
          />

          <div className="grid grid-cols-2 gap-4">
            <Field id={ids.qual} label="% truly qualified" suffix="%">
              <input
                id={ids.qual}
                type="number"
                min="0"
                max="100"
                value={qualified}
                onChange={(e) => setQualified(e.target.value)}
                className={`${inputClass} pr-8`}
                placeholder="100"
              />
            </Field>
            <Field id={ids.safety} label="Safety margin" suffix="%">
              <input
                id={ids.safety}
                type="number"
                min="0"
                value={safety}
                onChange={(e) => setSafety(e.target.value)}
                className={`${inputClass} pr-8`}
                placeholder="0"
              />
            </Field>
          </div>
          <p>
            “% truly qualified” strips stalled/zombie deals from your current pipeline so the gap
            reflects what can actually close.
          </p>
        </div>
      </div>

      {/* Results */}
      <div
        className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm lg:self-start"
        aria-live="polite"
      >
        {hasAmountError ? (
          <div className="h-full flex items-center justify-center text-center">
            <p>Fix the highlighted amount to see your coverage.</p>
          </div>
        ) : !result.valid ? (
          <div className="h-full flex items-center justify-center text-center">
            <p>{result.error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="uppercase tracking-wider">Required coverage</p>
              <p className="mt-1 text-5xl font-bold text-primary tracking-tight">
                {mult(result.requiredCoverage)}
              </p>
              <p className="mt-1">
                ≈ <strong>{money(result.requiredPipeline)}</strong> in qualified pipeline to hit{' '}
                {money(parse(target) ?? 0)}.
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 text-sm">
              <p>
                The generic <strong>3× rule</strong> would tell you to build{' '}
                {money(result.lazyThreeXPipeline)} —{' '}
                {result.vsLazyThreeX > 0 ? (
                  <span className="text-destructive font-medium">
                    {money(Math.abs(result.vsLazyThreeX))} too little
                  </span>
                ) : result.vsLazyThreeX < 0 ? (
                  <span className="text-success font-medium">
                    {money(Math.abs(result.vsLazyThreeX))} more than you need
                  </span>
                ) : (
                  <span className="font-medium">exactly right (rare)</span>
                )}{' '}
                at a {winRate}% win rate.
              </p>
            </div>

            {result.oppsNeeded !== undefined && result.dealsToWin !== undefined && (
              <div className="text-sm text-foreground">
                That’s ≈ <strong>{Math.ceil(result.oppsNeeded).toLocaleString()}</strong> qualified
                opps in flight to win the{' '}
                <strong>{Math.ceil(result.dealsToWin).toLocaleString()}</strong> deals you need.
              </div>
            )}

            {result.pipelineGap !== undefined && result.currentCoverage !== undefined && (
              <div className="rounded-xl border border-border p-4">
                <p>
                  You have {mult(result.currentCoverage)} coverage today
                  {result.effectiveCurrentPipeline !== undefined &&
                    ` (${money(result.effectiveCurrentPipeline)} qualified)`}
                  .
                </p>
                <p className="mt-1">
                  {result.pipelineGap > 0.5 ? (
                    <span className="text-destructive">
                      Shortfall: build {money(result.pipelineGap)} more pipeline.
                    </span>
                  ) : (
                    <span className="text-success">
                      Surplus: {money(Math.abs(result.pipelineGap))} above target coverage.
                    </span>
                  )}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Money input that shows grouped digits, keeps the caret on the same digit when a
 * grouping comma is inserted, and flags a disallowed value (sign, exponent,
 * letters) instead of silently rewriting it. Invalid text is kept as typed.
 */
function MoneyField({
  id,
  label,
  value,
  onValueChange,
  placeholder,
}: {
  id: string
  label: string
  value: string
  onValueChange: (next: string) => void
  placeholder: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingCaret = useRef<number | null>(null)
  const error = amountInputError(value)
  const errorId = `${id}-error`
  const display = error === null ? formatGrouped(value) : value

  // No dependency list on purpose: restore the caret after every render that re-grouped the digits.
  useLayoutEffect(() => {
    const el = inputRef.current
    if (pendingCaret.current !== null && el && document.activeElement === el) {
      el.setSelectionRange(pendingCaret.current, pendingCaret.current)
    }
    pendingCaret.current = null
  })

  return (
    <Field id={id} label={label} prefix="$" error={error} errorId={errorId}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={display}
        aria-invalid={error !== null}
        aria-describedby={error !== null ? errorId : undefined}
        onChange={(e) => {
          const typed = e.target.value
          if (amountInputError(typed) !== null) {
            onValueChange(typed)
            return
          }
          const next = formatGrouped(typed)
          pendingCaret.current = caretAfterFormat(
            typed,
            e.target.selectionStart ?? typed.length,
            next
          )
          onValueChange(sanitizeAmount(typed))
        }}
        className={`${inputClass} pl-8${error !== null ? ' border-destructive!' : ''}`}
        placeholder={placeholder}
      />
    </Field>
  )
}

function Field({
  id,
  label,
  prefix,
  suffix,
  error,
  errorId,
  children,
}: {
  id: string
  label: string
  prefix?: string
  suffix?: string
  error?: string | null
  errorId?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block leading-[calc(1.25/0.875)] text-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {prefix}
          </span>
        )}
        {children}
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-1.5 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}
