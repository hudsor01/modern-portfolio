'use client'



export function StrategicImpact() {
  return (
    <div
      className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 backdrop-blur-xs border border-violet-500/20 rounded-xl p-8"
    >
      <h2 className="typography-h3 mb-6 text-violet-400">Revenue Operations Excellence & Strategic Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 text-center">
          <div className="typography-h2 border-none pb-0 text-2xl text-violet-400 mb-2">96.8%</div>
          <div className="typography-small text-muted-foreground">Revenue Forecast Accuracy (Industry: 75-85%)</div>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <div className="typography-h2 border-none pb-0 text-2xl text-purple-400 mb-2">+34.2%</div>
          <div className="typography-small text-muted-foreground">YoY Revenue Growth (Target: 25%)</div>
        </div>
        <div className="glass rounded-2xl p-6 text-center">
          <div className="typography-h2 border-none pb-0 text-2xl text-secondary mb-2">89.7%</div>
          <div className="typography-small text-muted-foreground">Operational Efficiency Score</div>
        </div>
      </div>
    </div>
  )
}
