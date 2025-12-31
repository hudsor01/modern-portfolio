'use client'

import {
  SectionCard,
  ResultCard,
  TechGrid,
  FeatureCard,
} from '@/components/projects/shared'
import { technologies } from '../data/constants'
import { formatCurrency } from '../utils'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Project Overview */}
      <SectionCard title="Project Overview" titleVariant="primary">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            Developed a comprehensive customer lifetime value prediction model using advanced analytics and machine learning to enable data-driven customer segmentation and retention strategies. This initiative was critical for optimizing marketing spend and improving customer acquisition ROI.
          </p>
          <p className="leading-relaxed">
            The CLV model became the foundation for strategic decision-making across sales, marketing, and customer success teams, enabling personalized customer journeys and targeted retention campaigns that significantly improved long-term revenue sustainability.
          </p>
        </div>
      </SectionCard>

      {/* Challenge */}
      <SectionCard title="Challenge" titleVariant="warning">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            The organization lacked a scientific approach to understanding customer value and predicting future behavior, resulting in inefficient resource allocation and missed revenue opportunities:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Marketing campaigns targeted all customers equally, wasting budget on low-value segments</li>
            <li>Sales teams couldn&apos;t prioritize leads based on predicted lifetime value</li>
            <li>Customer success resources were spread thin without risk-based prioritization</li>
            <li>Retention efforts were reactive rather than predictive</li>
            <li>No systematic way to measure the long-term impact of customer acquisition channels</li>
          </ul>
          <p className="leading-relaxed">
            With 4,287 active customers and no predictive analytics framework, the team was essentially flying blind when making strategic decisions about customer investment.
          </p>
        </div>
      </SectionCard>

      {/* Solution */}
      <SectionCard title="Solution" titleVariant="success">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            Built a comprehensive CLV prediction system using machine learning algorithms and RFM analysis to segment customers and predict future value with 94.3% accuracy:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Analytical Framework" titleVariant="primary">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>RFM analysis (Recency, Frequency, Monetary) segmentation</li>
                <li>Predictive modeling using customer behavior patterns</li>
                <li>Cohort analysis and retention curve modeling</li>
                <li>Churn probability scoring with early warning system</li>
                <li>Dynamic customer journey mapping and optimization</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Technical Implementation" titleVariant="secondary">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Interactive dashboard with drill-down capabilities</li>
                <li>Real-time customer scoring and alerts</li>
                <li>Automated segment assignment and recommendations</li>
                <li>Integration with CRM and marketing automation platforms</li>
                <li>24-month forecasting with confidence intervals</li>
              </ul>
            </FeatureCard>
          </div>
        </div>
      </SectionCard>

      {/* Results & Impact */}
      <SectionCard title="Results & Impact" titleVariant="success">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The CLV prediction model transformed how the organization approaches customer relationships, enabling data-driven decisions that significantly improved both customer satisfaction and revenue performance:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              value={formatCurrency(1276000)}
              label="Predicted Revenue Impact"
              variant="primary"
            />
            <ResultCard
              value="94.3%"
              label="Prediction Accuracy"
              variant="secondary"
            />
            <ResultCard
              value="42%"
              label="Improvement in Marketing ROI"
              variant="primary"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Increased customer retention rate by 18% through proactive intervention</li>
              <li>Reduced churn probability from 21% to 12.8% for at-risk segments</li>
              <li>Improved marketing campaign efficiency by 42% through better targeting</li>
              <li>Enabled 5-tier customer segmentation with 96.7% model confidence</li>
              <li>Identified 1,156 high-value customers contributing 67% of revenue</li>
              <li>Reduced customer acquisition cost by 28% through channel optimization</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings" titleVariant="accent">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">Strategic Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>Customer behavior patterns are more predictable than initially assumed when proper data science techniques are applied</li>
                <li>The top 20% of customers (Champions + Loyal) contribute 60%+ of total revenue, validating the Pareto principle</li>
                <li>Predictive models need regular retraining as customer behavior evolves with market conditions</li>
                <li>Early intervention is 3x more cost-effective than reactive retention efforts</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>RFM analysis combined with behavioral data significantly outperforms demographic-only segmentation</li>
                <li>24-month prediction horizon provides optimal balance between accuracy and actionability</li>
                <li>Real-time scoring enables dynamic customer journey optimization</li>
                <li>Visual dashboards increase adoption when they answer specific business questions, not just display data</li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project demonstrated that sophisticated analytics can be made accessible and actionable for business teams. The key is translating complex predictions into simple, clear recommendations that drive immediate action.
          </p>
        </div>
      </SectionCard>

      {/* Technologies Used */}
      <TechGrid technologies={technologies} />
    </div>
  )
}