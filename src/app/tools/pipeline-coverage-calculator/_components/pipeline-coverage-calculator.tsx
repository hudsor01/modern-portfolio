'use client'

import { useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import {
  type AmountKind,
  amountInputError,
  caretAfterFormat,
  computeCoverage,
  COVERAGE_PRESETS,
  formatCount,
  formatGrouped,
  formatMoney,
  formatMultiple,
  percentFieldError,
  sanitizeAmount,
} from '@/lib/pipeline-coverage'

/** Empty string → undefined; otherwise the parsed number (NaN-safe via the lib). */
function parse(v: string, kind: AmountKind): number | undefined {
  if (v.trim() === '') return undefined
  if (amountInputError(v, kind) !== null) return Number.NaN
  const n = Number(sanitizeAmount(v))
  return Number.isFinite(n) ? n : Number.NaN
}

/**
 * A percent input's text plus whether the browser reported malformed text (its badInput flag).
 * The percent inputs read both on `onInput`, not `onChange`: a type="number" input reports
 * value '' whether it is empty or holds malformed text, and React drops an `onChange` whose
 * value did not change, so typing "e" into an empty field or clearing a flagged one would
 * never update the flag. The native input event fires on every edit.
 */
function parsePercent(p: { value: string; badInput: boolean }): number | undefined {
  if (p.badInput) return Number.NaN
  if (p.value.trim() === '') return undefined
  return Number(p.value)
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
  const [winRate, setWinRate] = useState({ value: '25', badInput: false })
  const [avgDeal, setAvgDeal] = useState('')
  const [currentPipe, setCurrentPipe] = useState('')
  const [qualified, setQualified] = useState({ value: '100', badInput: false })
  const [safety, setSafety] = useState({ value: '0', badInput: false })

  const winError = percentFieldError(winRate.value, winRate.badInput, 'win')
  const qualError = percentFieldError(qualified.value, qualified.badInput, 'qualified')
  const safetyError = percentFieldError(safety.value, safety.badInput, 'safety')
  // DOM order, so the panel names the first failing field the user would meet.
  const fields = [
    { id: ids.target, name: 'Revenue target', error: amountInputError(target, 'target') },
    { id: ids.win, name: 'Win rate', error: winError },
    { id: ids.deal, name: 'Average deal size', error: amountInputError(avgDeal, 'amount') },
    { id: ids.pipe, name: 'Open pipeline today', error: amountInputError(currentPipe, 'amount') },
    { id: ids.qual, name: '% truly qualified', error: qualError },
    { id: ids.safety, name: 'Safety margin', error: safetyError },
  ]
  const firstInvalid = fields.find((f) => f.error !== null)

  const result = useMemo(
    () =>
      computeCoverage({
        revenueTarget: parse(target, 'target') ?? Number.NaN,
        winRatePct: parsePercent(winRate) ?? Number.NaN,
        avgDealSize: parse(avgDeal, 'amount'),
        currentPipeline: parse(currentPipe, 'amount'),
        qualifiedRatePct: parsePercent(qualified),
        safetyMarginPct: parsePercent(safety),
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
            kind="target"
            placeholder="1,000,000"
          />

          <div>
            <Field
              id={ids.win}
              label="Win rate"
              suffix="%"
              error={winError}
              errorId={`${ids.win}-error`}
            >
              <input
                id={ids.win}
                type="number"
                min="0"
                max="100"
                inputMode="decimal"
                value={winRate.value}
                aria-invalid={winError !== null}
                aria-describedby={winError !== null ? `${ids.win}-error` : undefined}
                onInput={(e) =>
                  setWinRate({
                    value: e.currentTarget.value,
                    badInput: e.currentTarget.validity.badInput,
                  })
                }
                className={`${inputClass} pr-8${winError !== null ? ' border-destructive!' : ''}`}
                placeholder="25"
              />
            </Field>
            <div className="mt-2 flex flex-wrap gap-2">
              {COVERAGE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setWinRate({ value: String(p.winRatePct), badInput: false })}
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
            kind="amount"
            placeholder="50,000"
          />

          <MoneyField
            id={ids.pipe}
            label="Open pipeline today (optional)"
            value={currentPipe}
            onValueChange={setCurrentPipe}
            kind="amount"
            placeholder="3,000,000"
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              id={ids.qual}
              label="% truly qualified"
              suffix="%"
              error={qualError}
              errorId={`${ids.qual}-error`}
            >
              <input
                id={ids.qual}
                type="number"
                min="0"
                max="100"
                value={qualified.value}
                aria-invalid={qualError !== null}
                aria-describedby={qualError !== null ? `${ids.qual}-error` : undefined}
                onInput={(e) =>
                  setQualified({
                    value: e.currentTarget.value,
                    badInput: e.currentTarget.validity.badInput,
                  })
                }
                className={`${inputClass} pr-8${qualError !== null ? ' border-destructive!' : ''}`}
                placeholder="100"
              />
            </Field>
            <Field
              id={ids.safety}
              label="Safety margin"
              suffix="%"
              error={safetyError}
              errorId={`${ids.safety}-error`}
            >
              <input
                id={ids.safety}
                type="number"
                min="0"
                value={safety.value}
                aria-invalid={safetyError !== null}
                aria-describedby={safetyError !== null ? `${ids.safety}-error` : undefined}
                onInput={(e) =>
                  setSafety({
                    value: e.currentTarget.value,
                    badInput: e.currentTarget.validity.badInput,
                  })
                }
                className={`${inputClass} pr-8${safetyError !== null ? ' border-destructive!' : ''}`}
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
        {firstInvalid ? (
          <div className="h-full flex items-center justify-center text-center">
            <p>
              Fix “
              <button
                type="button"
                onClick={() => document.getElementById(firstInvalid.id)?.focus()}
                className="text-link cursor-pointer"
              >
                {firstInvalid.name}
              </button>
              ” to see your coverage.
            </p>
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
                {formatMultiple(result.requiredCoverage)}
              </p>
              <p className="mt-1">
                ≈ <strong>{formatMoney(result.requiredPipeline)}</strong> in qualified pipeline to
                hit {formatMoney(parse(target, 'target') ?? 0)}.
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 text-sm">
              <p>
                The generic <strong>3× rule</strong> would tell you to build{' '}
                {formatMoney(result.lazyThreeXPipeline)} —{' '}
                {result.vsLazyThreeX > 0 ? (
                  <span className="text-destructive font-medium">
                    {formatMoney(Math.abs(result.vsLazyThreeX))} too little
                  </span>
                ) : result.vsLazyThreeX < 0 ? (
                  <span className="text-success font-medium">
                    {formatMoney(Math.abs(result.vsLazyThreeX))} more than you need
                  </span>
                ) : (
                  <span className="font-medium">exactly right (rare)</span>
                )}{' '}
                at a {winRate.value}% win rate.
              </p>
            </div>

            {result.oppsNeeded !== undefined && result.dealsToWin !== undefined && (
              <div className="text-sm text-foreground">
                That’s ≈ <strong>{formatCount(result.oppsNeeded)}</strong> qualified opps in flight
                to win the <strong>{formatCount(result.dealsToWin)}</strong> deals you need.
              </div>
            )}

            {result.pipelineGap !== undefined && result.currentCoverage !== undefined && (
              <div className="rounded-xl border border-border p-4">
                <p>
                  You have {formatMultiple(result.currentCoverage)} coverage today
                  {result.effectiveCurrentPipeline !== undefined &&
                    ` (${formatMoney(result.effectiveCurrentPipeline)} qualified)`}
                  .
                </p>
                <p className="mt-1">
                  {result.pipelineGap > 0.5 ? (
                    <span className="text-destructive">
                      Shortfall: build {formatMoney(result.pipelineGap)} more pipeline.
                    </span>
                  ) : (
                    <span className="text-success">
                      Surplus: {formatMoney(Math.abs(result.pipelineGap))} above target coverage.
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
 * grouping comma is inserted, and flags a disallowed value (letters, a sign, a
 * repeated decimal point or an amount over $10B) instead of silently rewriting
 * it. Invalid text is kept as typed.
 */
function MoneyField({
  id,
  label,
  value,
  onValueChange,
  placeholder,
  kind,
}: {
  id: string
  label: string
  value: string
  onValueChange: (next: string) => void
  placeholder: string
  kind: AmountKind
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingCaret = useRef<number | null>(null)
  const error = amountInputError(value, kind)
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
          if (amountInputError(typed, kind) !== null) {
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
