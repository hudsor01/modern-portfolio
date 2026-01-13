'use client'



export function StrategicImpact() {
  return (
    <div
      className="bg-primary/10 border border-primary/20 rounded-xl p-8"
    >
      <h2 className="typography-h3 mb-6 text-primary">Revenue Operations Excellence & Strategic Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <div className="typography-h2 border-none pb-0 text-2xl text-primary mb-2">96.8%</div>
          <div className="typography-small text-muted-foreground">Revenue Forecast Accuracy (Industry: 75-85%)</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <div className="typography-h2 border-none pb-0 text-2xl text-secondary mb-2">+34.2%</div>
          <div className="typography-small text-muted-foreground">YoY Revenue Growth (Target: 25%)</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6 text-center">
          <div className="typography-h2 border-none pb-0 text-2xl text-accent mb-2">89.7%</div>
          <div className="typography-small text-muted-foreground">Operational Efficiency Score</div>
        </div>
      </div>
    </div>
  )
}
