'use client'



export function StrategicImpact() {
  return (
    <div
      className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-success/20 rounded-3xl p-6"
    >
      <h2 className="typography-h4 mb-4 text-success">Proven Revenue Operations Impact & ROI Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 text-center">
          <div className="typography-h3 text-success mb-1">32%</div>
          <div className="typography-small text-muted-foreground">CAC Reduction Through Strategic Partner Channel Optimization</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="typography-h3 text-emerald-400 mb-1">3.6:1</div>
          <div className="typography-small text-muted-foreground">Industry-Leading LTV:CAC Efficiency Ratio (Benchmark: 3:1+)</div>
        </div>
        <div className="glass rounded-2xl p-4 text-center">
          <div className="typography-h3 text-primary mb-1">8.4 mo</div>
          <div className="typography-small text-muted-foreground">Optimized Customer Payback Period (Target: &lt;12mo)</div>
        </div>
      </div>
    </div>
  )
}
