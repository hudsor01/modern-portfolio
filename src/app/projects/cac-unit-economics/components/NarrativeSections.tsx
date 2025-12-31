'use client'

import {
  SectionCard,
  ResultCard,
  TechGrid,
  FeatureCard,
} from '@/components/projects/shared'
import { technologies } from '../data/constants'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Project Overview */}
      <SectionCard title="Project Overview" titleVariant="primary">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Developed a comprehensive Customer Acquisition Cost (CAC) and unit economics analysis system to optimize customer acquisition efficiency and establish sustainable growth metrics for long-term business planning.
          </p>
          <p className="leading-relaxed">
            This analytical framework became the foundation for strategic decision-making around customer acquisition investments, channel optimization, and pricing strategies, enabling the organization to achieve industry-leading LTV:CAC ratios and sustainable growth.
          </p>
        </div>
      </SectionCard>

      {/* Challenge */}
      <SectionCard title="Challenge" titleVariant="warning">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            The organization was struggling with unsustainable customer acquisition costs and lacked visibility into the true unit economics of their business model:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>CAC calculations were inconsistent across teams, leading to conflicting optimization strategies</li>
            <li>No systematic tracking of customer payback periods or lifetime value relationships</li>
            <li>Marketing spend decisions were made without understanding channel-specific unit economics</li>
            <li>Pricing strategies weren&apos;t aligned with acquisition cost realities and profitability targets</li>
            <li>No early warning system for unsustainable growth patterns or CAC inflation</li>
            <li>Investor reporting lacked standardized unit economics metrics and benchmarking</li>
          </ul>
          <p className="leading-relaxed">
            With rising competition driving up acquisition costs across all channels and pressure to achieve profitability, the company needed a sophisticated approach to understanding and optimizing customer unit economics.
          </p>
        </div>
      </SectionCard>

      {/* Solution */}
      <SectionCard title="Solution" titleVariant="success">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            Built a comprehensive unit economics analytics platform that provides real-time visibility into CAC, LTV, and payback metrics with sophisticated segmentation and optimization capabilities:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Unit Economics Framework" titleVariant="primary">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Standardized CAC calculation methodology across all acquisition channels</li>
                <li>Cohort-based LTV analysis with predictive modeling and confidence intervals</li>
                <li>Payback period tracking with channel and segment-specific benchmarks</li>
                <li>Contribution margin analysis and profitability modeling</li>
                <li>LTV:CAC ratio optimization with industry benchmarking</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Optimization Tools" titleVariant="secondary">
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Real-time channel performance monitoring and alerting</li>
                <li>Budget allocation optimization based on unit economics efficiency</li>
                <li>Scenario modeling for pricing and acquisition strategy decisions</li>
                <li>Automated insights and recommendations for CAC improvement</li>
                <li>Executive dashboards with investor-ready metrics and trend analysis</li>
              </ul>
            </FeatureCard>
          </div>
        </div>
      </SectionCard>

      {/* Results & Impact */}
      <SectionCard title="Results & Impact" titleVariant="success">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The unit economics optimization system enabled data-driven growth strategies that significantly improved acquisition efficiency and long-term profitability:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard value="32%" label="CAC Reduction Achievement" variant="primary" />
            <ResultCard value="3.6:1" label="LTV:CAC Ratio Achieved" variant="secondary" />
            <ResultCard value="8.4 mo" label="Customer Payback Period" variant="primary" />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Reduced blended CAC from $247 to $168 through channel optimization and efficiency improvements</li>
              <li>Achieved industry-leading LTV:CAC ratio of 3.6:1, exceeding the 3:1 benchmark for sustainable growth</li>
              <li>Improved customer payback period from 14.2 months to 8.4 months through pricing optimization</li>
              <li>Identified $890K in annual savings through elimination of unprofitable acquisition channels</li>
              <li>Increased overall contribution margin by 28% through better customer segment targeting</li>
              <li>Enabled data-driven pricing strategy that improved unit economics while maintaining growth</li>
              <li>Reduced time-to-insight for unit economics analysis from 2 weeks to 1 day</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings" titleVariant="accent">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">Unit Economics Strategy</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Sustainable growth requires maintaining LTV:CAC ratios above 3:1 with payback periods under 12 months</li>
                <li>Channel-specific unit economics can vary by 200%+, making blended metrics misleading for optimization</li>
                <li>Customer segmentation significantly impacts unit economics and should drive targeted acquisition strategies</li>
                <li>Pricing decisions have exponential impact on unit economics and should be optimized alongside acquisition costs</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Implementation Success Factors</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Standardized calculation methodologies are essential for consistent decision-making across teams</li>
                <li>Real-time monitoring enables quick intervention before unit economics deteriorate significantly</li>
                <li>Cohort-based analysis provides more accurate LTV predictions than aggregate historical data</li>
                <li>Executive visibility into unit economics drives more disciplined growth and investment decisions</li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project reinforced that sustainable growth is not about maximizing acquisition volume, but optimizing the efficiency and profitability of each customer acquired. Unit economics must be the north star for all growth initiatives.
          </p>
        </div>
      </SectionCard>

      {/* Technologies Used */}
      <TechGrid technologies={technologies} />
    </div>
  )
}
