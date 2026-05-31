'use client'

import { useId, useMemo, useState } from 'react'
import {
  PILLARS,
  QUESTIONS,
  scoreMaturity,
  tierForScore,
  type PillarId,
} from '@/lib/revops-maturity'

const SCALE = [
  { value: 1, label: 'Not at all' },
  { value: 2, label: 'Rarely' },
  { value: 3, label: 'Somewhat' },
  { value: 4, label: 'Mostly' },
  { value: 5, label: 'Fully' },
] as const

const DEFAULT = 3

/** Pillar score (1–5) → bar fill class. Weakest pillars read warmer. */
function barColor(score: number): string {
  if (score < 2.6) return 'bg-destructive'
  if (score < 3.4) return 'bg-amber-500'
  return 'bg-success'
}

export function RevOpsMaturityScorecard() {
  const groupName = useId()
  const [answers, setAnswers] = useState<Record<string, number>>(() =>
    Object.fromEntries(QUESTIONS.map((q) => [q.id, DEFAULT]))
  )

  const result = useMemo(() => scoreMaturity(answers), [answers])
  const tier = tierForScore(result.overallScore)

  const setAnswer = (id: string, value: number) => setAnswers((prev) => ({ ...prev, [id]: value }))

  const reset = () => setAnswers(Object.fromEntries(QUESTIONS.map((q) => [q.id, DEFAULT])))

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Questions */}
      <div className="lg:col-span-3 space-y-8">
        {PILLARS.map((pillar) => (
          <fieldset
            key={pillar.id}
            className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm"
          >
            <legend className="px-1">
              <span className="block font-display text-xl font-semibold text-foreground">
                {pillar.label}
              </span>
              <span className="block text-sm text-muted-foreground mt-0.5">{pillar.blurb}</span>
            </legend>

            <div className="mt-6 space-y-6">
              {QUESTIONS.filter((q) => q.pillar === pillar.id).map((q) => (
                <div key={q.id}>
                  <p id={`${groupName}-${q.id}-label`} className="text-sm text-foreground mb-2.5">
                    {q.text}
                  </p>
                  <div
                    role="radiogroup"
                    aria-labelledby={`${groupName}-${q.id}-label`}
                    className="grid grid-cols-5 gap-1.5"
                  >
                    {SCALE.map((opt) => {
                      const selected = answers[q.id] === opt.value
                      return (
                        <label
                          key={opt.value}
                          className={`flex flex-col items-center justify-center rounded-lg border px-1 py-2 cursor-pointer text-center transition-colors ${
                            selected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`${groupName}-${q.id}`}
                            value={opt.value}
                            checked={selected}
                            onChange={() => setAnswer(q.id, opt.value)}
                            className="sr-only"
                          />
                          <span className="text-base font-semibold leading-none">{opt.value}</span>
                          <span className="mt-1 text-[10px] leading-tight">{opt.label}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </fieldset>
        ))}

        <button
          type="button"
          onClick={reset}
          className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Reset all to neutral
        </button>
      </div>

      {/* Results */}
      <div className="lg:col-span-2">
        <div
          className="lg:sticky lg:top-28 bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm"
          aria-live="polite"
        >
          <p className="text-sm uppercase tracking-wider text-muted-foreground">
            Your maturity level
          </p>
          <p className="mt-1 flex items-baseline gap-2">
            <span className="text-5xl font-bold text-primary tracking-tight">{result.level}</span>
            <span className="text-2xl font-semibold text-foreground">{result.tier}</span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Overall score {result.overallScore.toFixed(1)} / 5 · ~{result.percentile}th percentile
            of B2B teams
          </p>
          {tier && <p className="mt-3 text-sm text-foreground leading-relaxed">{tier.blurb}</p>}

          {/* Per-pillar bars */}
          <div className="mt-6 space-y-3">
            {PILLARS.map((pillar) => {
              const score = result.pillarScores[pillar.id as PillarId]
              const isWeakest = result.weakestPillar === pillar.id
              return (
                <div key={pillar.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={isWeakest ? 'font-semibold text-foreground' : 'text-foreground'}
                    >
                      {pillar.label}
                      {isWeakest && (
                        <span className="ml-2 text-[10px] uppercase tracking-wide text-destructive">
                          weakest
                        </span>
                      )}
                    </span>
                    <span className="tabular-nums text-muted-foreground">{score.toFixed(1)}</span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${barColor(score)}`}
                      style={{ width: `${(Math.min(5, Math.max(0, score)) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Highest-ROI next move */}
          {result.nextMove && (
            <div className="mt-6 rounded-xl bg-muted/50 p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
                Highest-ROI next move
              </p>
              <p className="text-sm text-foreground leading-relaxed">{result.nextMove}</p>
            </div>
          )}

          {/* Tech-overbuy anti-pattern */}
          {result.techOverbuy && (
            <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
              <p className="text-sm text-foreground leading-relaxed">
                <strong className="text-destructive">Watch out:</strong> your tooling maturity is
                running ahead of your data and process maturity — the classic{' '}
                <em>buying tools you can’t feed</em> trap. Fix the foundation before adding more
                stack, or the new tools inherit the same messy inputs.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
