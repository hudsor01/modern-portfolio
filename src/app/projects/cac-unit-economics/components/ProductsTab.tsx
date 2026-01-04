'use client'

import { SectionCard } from '@/components/ui/section-card'
import { productTierEconomics } from '../data/constants'
import { formatCurrency } from '@/lib/utils/data-formatters'

export function ProductsTab() {
  return (
    <SectionCard
      title="SaaS Product Tier Unit Economics & Profitability"
      description="Multi-tier pricing strategy analysis showing $349 Enterprise Pro achieving 83.2% gross margin with 6.2-month payback optimization"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {productTierEconomics.map((product, index) => (
          <div key={index} className="bg-muted/20 rounded-xl p-4 border border-border">
            <h3 className="text-base font-semibold mb-3">{product.tier}</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">CAC:</span>
                <span className="font-medium">{formatCurrency(product.cac)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">LTV:</span>
                <span className="font-medium">{formatCurrency(product.ltv)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Margin:</span>
                <span className="font-medium">{product.margin}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payback:</span>
                <span className="font-medium">{product.payback} mo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  )
}
