'use client'

import { SectionCard } from '@/components/ui/section-card'
import { ResultCard, FeatureCard } from '@/components/projects/shared'
import { formatCurrency } from '../utils'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Situation */}
      <SectionCard title="Situation">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I took over the customer analytics function, I discovered the organization had
            zero visibility into which customers would be valuable long-term versus which would
            churn. Marketing was treating all customers equally, sales couldn't prioritize leads,
            and customer success was spreading resources thin across 4,287 active accounts
            without any risk-based framework.
          </p>
          <p className="leading-relaxed">
            The lack of predictive analytics was costing us real money—we were acquiring
            low-value customers at the same cost as high-value ones, and our retention efforts
            were entirely reactive. I knew we needed a scientific approach to understanding
            customer value that could transform how every team makes decisions.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was tasked with building a customer lifetime value prediction model that would
            become the foundation for data-driven decision-making across the entire organization.
            My specific objectives included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Develop predictive CLV models with at least 90% accuracy for customer segmentation</li>
            <li>Create a multi-tier customer segmentation framework based on predicted lifetime value</li>
            <li>Build early warning systems to identify at-risk customers before they churn</li>
            <li>Enable marketing to allocate budget based on predicted customer value, not historical averages</li>
            <li>Integrate predictions with CRM and marketing automation for actionable insights</li>
            <li>Deliver 24-month revenue forecasting with confidence intervals</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a comprehensive CLV prediction system from scratch, combining
            machine learning algorithms with RFM analysis to segment customers and predict
            future value with unprecedented accuracy:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="Analytical Framework I Built">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>RFM analysis (Recency, Frequency, Monetary) segmentation engine</li>
                <li>Predictive modeling using customer behavior patterns and ML algorithms</li>
                <li>Cohort analysis and retention curve modeling for trend identification</li>
                <li>Churn probability scoring with automated early warning triggers</li>
                <li>Dynamic customer journey mapping with intervention recommendations</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Technical Implementation">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Interactive dashboard with segment drill-down capabilities</li>
                <li>Real-time customer scoring integrated with CRM workflows</li>
                <li>Automated segment assignment with personalized recommendations</li>
                <li>Integration with marketing automation for targeted campaigns</li>
                <li>24-month forecasting engine with confidence intervals</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the data science effort, designed the 5-tier segmentation
            methodology, and trained cross-functional teams on leveraging CLV insights for
            their specific use cases. The rollout was phased by team to ensure adoption
            before expanding capabilities.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The CLV prediction model I built transformed how the organization approaches
            customer relationships, enabling data-driven decisions that delivered measurable
            revenue impact:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard
              value={formatCurrency(1276000)}
              label="Predicted Revenue Impact"
              variant="primary"
            />
            <ResultCard value="94.3%" label="Prediction Accuracy Achieved" variant="secondary" />
            <ResultCard value="42%" label="Improvement in Marketing ROI" variant="primary" />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Increased customer retention rate by 18% through proactive intervention triggers</li>
              <li>Reduced churn probability from 21% to 12.8% for at-risk segments</li>
              <li>Improved marketing campaign efficiency by 42% through value-based targeting</li>
              <li>Enabled 5-tier customer segmentation with 96.7% model confidence</li>
              <li>Identified 1,156 high-value customers contributing 67% of revenue—enabling focused investment</li>
              <li>Reduced customer acquisition cost by 28% through channel optimization based on CLV predictions</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">Strategic Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Customer behavior patterns are far more predictable than I initially assumed when
                  proper data science techniques are applied consistently
                </li>
                <li>
                  The top 20% of customers (Champions + Loyal) contribute 60%+ of total revenue—
                  validating focused investment strategies
                </li>
                <li>
                  Predictive models need regular retraining; I now schedule quarterly recalibration
                  as market conditions evolve
                </li>
                <li>
                  Early intervention is 3x more cost-effective than reactive retention—I learned
                  to prioritize prevention over cure
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Technical Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  RFM analysis combined with behavioral data significantly outperforms demographic-only
                  segmentation—I now start every CLV project with RFM foundations
                </li>
                <li>
                  24-month prediction horizon provides optimal balance between accuracy and
                  actionability for most business planning cycles
                </li>
                <li>
                  Real-time scoring enables dynamic customer journey optimization that static
                  segments can't achieve
                </li>
                <li>
                  Visual dashboards drive adoption when they answer specific business questions,
                  not just display data
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project taught me that sophisticated analytics can be made accessible and
            actionable for business teams. The key is translating complex predictions into
            simple, clear recommendations that drive immediate action—I now apply this
            principle to every analytics system I build.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
