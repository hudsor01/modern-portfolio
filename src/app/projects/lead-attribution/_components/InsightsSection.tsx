'use client'



interface InsightsSectionProps {
  bestConversionRate: number
}

export function InsightsSection({ bestConversionRate }: InsightsSectionProps) {
  return (
    <div
      className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
        <h3 className="typography-large mb-2 text-primary">Key Insight</h3>
        <p className="text-muted-foreground text-sm">
          Email campaigns show the highest conversion rate at {bestConversionRate.toFixed(1)}%, despite lower volume.
        </p>
      </div>
      <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6">
        <h3 className="typography-large mb-2 text-secondary">Growth Opportunity</h3>
        <p className="text-muted-foreground text-sm">
          Social media traffic has room for improvement with only 9.4% conversion. Consider A/B testing landing pages.
        </p>
      </div>
      <div className="bg-accent/10 border border-accent/20 rounded-xl p-6">
        <h3 className="typography-large mb-2 text-accent">Seasonal Trend</h3>
        <p className="text-muted-foreground text-sm">
          Q4 shows strongest performance with 20% higher lead volume. Plan campaigns accordingly.
        </p>
      </div>
    </div>
  )
}
