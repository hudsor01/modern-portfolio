'use client'


import { productTierEconomics } from '../data/constants'
import { formatCurrency } from '../utils'

export function ProductsTab() {
  return (
    <div
      className="glass rounded-3xl p-6 hover:bg-white/[0.07] transition-all duration-300 mb-8"
    >
      <div className="mb-4">
        <h2 className="typography-h4 mb-1">SaaS Product Tier Unit Economics & Profitability</h2>
        <p className="typography-small text-muted-foreground">Multi-tier pricing strategy analysis showing $349 Enterprise Pro achieving 83.2% gross margin with 6.2-month payback optimization</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {productTierEconomics.map((product, index) => (
          <div key={index} className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <h3 className="text-base font-semibold mb-3">{product.tier}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="typography-muted">CAC:</span>
                <span className="font-medium">{formatCurrency(product.cac)}</span>
              </div>
              <div className="flex justify-between">
                <span className="typography-muted">LTV:</span>
                <span className="font-medium">{formatCurrency(product.ltv)}</span>
              </div>
              <div className="flex justify-between">
                <span className="typography-muted">Margin:</span>
                <span className="font-medium">{product.margin}%</span>
              </div>
              <div className="flex justify-between">
                <span className="typography-muted">Payback:</span>
                <span className="font-medium">{product.payback} mo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
