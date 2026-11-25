'use client'

import { useId, useMemo, useState } from 'react'
import {
  PILLARS,
  QUESTIONS,
  scoreMaturity,
  TIERS,
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

const SCALE_KEY = SCALE.map((o) => `${o.value} ${o.label}`).join(' · ')

/** Upper bounds of the Emerging and Defined tiers: below them a pillar reads red, then amber. */
const LOW_BAND = TIERS[1]!.max
const MID_BAND = TIERS[2]!.max

/** Pillar score (1–5) → bar fill class. Weakest pillars read warmer. */
function barColor(score: number): string {
  if (score < LOW_BAND) return 'bg-destructive'
  if (score < MID_BAND) return 'bg-warning'
  return 'bg-success'
}

/** The weaker of data and process (the overbuy foundation), or both when they tie. */
function foundationLabel(scores: Record<PillarId, number>): string {
  if (Math.abs(scores.data - scores.process) < 1e-9) return 'data and process'
  return scores.data < scores.process ? 'data' : 'process'
}

/** "weakest" badge text class, in the same band as its bar; neutral from the Managed band up. */
function badgeColor(score: number): string {
  if (score < LOW_BAND) return 'text-destructive'
  if (score < MID_BAND) return 'text-warning-text'
  return 'text-muted-foreground'
}

export function RevOpsMaturityScorecard() {
  const groupName = useId()
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const result = useMemo(() => scoreMaturity(answers), [answers])
  const tier = tierForScore(result.overallScore)

  const setAnswer = (id: string, value: number) => setAnswers((prev) => ({ ...prev, [id]: value }))

  const reset = () => setAnswers({})

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      {/* Questions */}
      <div className="lg:col-span-3 space-y-8">
        {PILLARS.map((pillar) => (
          <fieldset
            key={pillar.id}
            className="bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm"
          >
            <legend className="float-left w-full p-0">
              <span className="block font-display text-xl font-semibold text-foreground">
                {pillar.label}
              </span>
              <span className="block text-sm text-muted-foreground mt-0.5">{pillar.blurb}</span>
            </legend>

            <div className="clear-both pt-6 space-y-6">
              <p className="text-xs text-muted-foreground sm:hidden">{SCALE_KEY}</p>
              {QUESTIONS.filter((q) => q.pillar === pillar.id).map((q) => (
                <div key={q.id}>
                  <p id={`${groupName}-${q.id}-label`} className="mb-2.5">
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
                          className={`flex flex-col items-center justify-center rounded-lg border px-1 py-2 cursor-pointer text-center transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-background ${
                            selected
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`${groupName}-${q.id}`}
                            value={opt.value}
                            aria-label={`${opt.value} ${opt.label}`}
                            checked={selected}
                            onChange={() => setAnswer(q.id, opt.value)}
                            className="sr-only"
                          />
                          <span className="text-base font-semibold leading-none">{opt.value}</span>
                          <span className="mt-1 hidden text-xs leading-tight sm:block">
                            {opt.label}
                          </span>
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
          Reset answers
        </button>
      </div>

      {/* Results */}
      <div className="lg:col-span-2">
        {/* Only the level is a live region: it changes when the result does, while the
            answered count and scores change on every click and are read on demand. */}
        <div
          role="region"
          aria-label="Your result"
          className="lg:sticky lg:top-28 bg-card rounded-2xl p-6 sm:p-8 border border-border shadow-sm"
        >
          <p className="text-sm text-muted-foreground">
            {result.answered} of {result.total} answered
          </p>
          <div aria-live="polite" aria-atomic="true">
            <p className="mt-3 uppercase tracking-wider">Your maturity level</p>
            {result.everyPillarAnswered ? (
              <p className="mt-1 flex items-baseline gap-2">
                <span className="text-5xl font-bold text-primary tracking-tight">
                  {result.level}
                </span>{' '}
                <span className="text-2xl font-semibold text-foreground">{result.tier}</span>
              </p>
            ) : (
              <p className="mt-3">Answer at least one question in each area to see your level.</p>
            )}
          </div>
          {result.everyPillarAnswered && (
            <>
              <p className="mt-1">Overall score {result.overallScore.toFixed(1)} / 5</p>
              {tier && <p className="mt-3">{tier.blurb}</p>}
            </>
          )}

          {/* Per-pillar bars */}
          <div className="mt-6 space-y-3">
            {PILLARS.map((pillar) => {
              const score = result.pillarScores[pillar.id as PillarId]
              const isWeakest = result.everyPillarAnswered && result.weakestPillar === pillar.id
              const unanswered = result.answeredByPillar[pillar.id as PillarId] === 0
              return (
                <div key={pillar.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={isWeakest ? 'font-semibold text-foreground' : 'text-foreground'}
                    >
                      {pillar.label}
                      {isWeakest && (
                        <span
                          className={`ml-2 text-xs uppercase tracking-wide ${badgeColor(score)}`}
                        >
                          weakest
                        </span>
                      )}
                    </span>
                    <span className="tabular-nums text-muted-foreground">
                      {unanswered ? 'Not answered' : score.toFixed(1)}
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-muted overflow-hidden">
                    {!unanswered && (
                      <div
                        className={`h-full rounded-full transition-all ${barColor(score)}`}
                        style={{ width: `${(Math.min(5, Math.max(0, score)) / 5) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Advice: its own live region, announced when the next move or the warning changes. */}
          <div aria-live="polite" aria-atomic="true">
            {result.everyPillarAnswered && result.nextMove && (
              <div className="mt-6 rounded-xl bg-muted/50 p-4">
                <p className="uppercase tracking-wider mb-1">Your next move</p>
                <p>{result.nextMove}</p>
              </div>
            )}

            {/* Tech-overbuy anti-pattern */}
            {result.everyPillarAnswered && result.techOverbuy && (
              <div className="mt-4 rounded-xl border border-destructive/40 bg-destructive/5 p-4">
                <p>
                  <strong className="text-destructive">Watch out:</strong> your tooling maturity is
                  running a full level ahead of your {foundationLabel(result.pillarScores)} maturity
                  — the classic <em>buying tools you can’t feed</em> trap. Fix the foundation before
                  adding more stack, or the new tools inherit the same messy inputs.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
