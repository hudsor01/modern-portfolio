'use client'


import { attributionModels } from '../data/constants'
import { formatCurrency, formatPercent } from '../utils'

export function ModelsTab() {
  return (
    <div
      className="glass rounded-2xl p-6 hover:bg-white/[0.07] transition-all duration-300 ease-out mb-8"
    >
      <div className="mb-4">
        <h2 className="typography-h4 mb-1">Attribution Model Performance & ROI Comparison</h2>
        <p className="typography-small text-muted-foreground">Comprehensive analysis of attribution methodologies from traditional to machine learning approaches</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 font-semibold">Attribution Model</th>
              <th className="text-left py-3 px-4 font-semibold">Accuracy</th>
              <th className="text-left py-3 px-4 font-semibold">Conversions</th>
              <th className="text-left py-3 px-4 font-semibold">Attributed ROI</th>
            </tr>
          </thead>
          <tbody>
            {attributionModels.map((model, index) => (
              <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4 font-medium">{model.model}</td>
                <td className="py-4 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    model.accuracy >= 90 ? 'bg-success/20 text-success' :
                    model.accuracy >= 80 ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {formatPercent(model.accuracy)}
                  </span>
                </td>
                <td className="py-4 px-4">{model.conversions.toLocaleString()}</td>
                <td className="py-4 px-4">{formatCurrency(model.roi)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
