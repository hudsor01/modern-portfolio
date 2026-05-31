'use client'

import { useId, useMemo, useState } from 'react'
import { computeCoverage, COVERAGE_PRESETS } from '@/lib/pipeline-coverage'

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
  const n = Number(v)
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
        <h2 className="text-lg font-semibold text-foreground mb-6">Your numbers</h2>

        <div className="space-y-5">
          <Field id={ids.target} label="Revenue target (this period)" prefix="$">
            <input
              id={ids.target}
              type="number"
              min="0"
              inputMode="numeric"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className={`${inputClass} pl-8`}
              placeholder="1,000,000"
            />
          </Field>

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

          <Field id={ids.deal} label="Average deal size (optional)" prefix="$">
            <input
              id={ids.deal}
              type="number"
              min="0"
              inputMode="numeric"
              value={avgDeal}
              onChange={(e) => setAvgDeal(e.target.value)}
              className={`${inputClass} pl-8`}
              placeholder="50,000"
            />
          </Field>

          <Field id={ids.pipe} label="Open pipeline today (optional)" prefix="$">
            <input
              id={ids.pipe}
              type="number"
              min="0"
              inputMode="numeric"
              value={currentPipe}
              onChange={(e) => setCurrentPipe(e.target.value)}
              className={`${inputClass} pl-8`}
              placeholder="3,000,000"
            />
          </Field>

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
          <p className="text-xs text-muted-foreground">
            “% truly qualified” strips stalled/zombie deals from your current pipeline so the gap
            reflects what can actually close.
          </p>
        </div>
      </div>

      {/* Results */}
      <div
        className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm"
        aria-live="polite"
      >
        {!result.valid ? (
          <div className="h-full flex items-center justify-center text-center">
            <p className="text-muted-foreground">{result.error}</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-wider text-muted-foreground">
                Required coverage
              </p>
              <p className="text-5xl font-bold text-primary tracking-tight">
                {mult(result.requiredCoverage)}
              </p>
              <p className="mt-1 text-foreground">
                ≈ <strong>{money(result.requiredPipeline)}</strong> in qualified pipeline to hit{' '}
                {money(parse(target) ?? 0)}.
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-4 text-sm">
              <p className="text-foreground">
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
                <p className="text-sm text-muted-foreground">
                  You have {mult(result.currentCoverage)} coverage today
                  {result.effectiveCurrentPipeline !== undefined &&
                    ` (${money(result.effectiveCurrentPipeline)} qualified)`}
                  .
                </p>
                <p className="mt-1 font-semibold">
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

function Field({
  id,
  label,
  prefix,
  suffix,
  children,
}: {
  id: string
  label: string
  prefix?: string
  suffix?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-foreground mb-1.5">
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
    </div>
  )
}
