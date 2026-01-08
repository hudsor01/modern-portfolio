'use client'

import { SectionCard } from '@/components/ui/section-card'
import { ResultCard, FeatureCard } from '@/components/projects/shared'
import { attributionMetrics } from '../data/constants'
import { formatCurrency } from '../utils'

export function NarrativeSections() {
  return (
    <div className="space-y-12 mt-12">
      {/* Situation */}
      <SectionCard title="Situation">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I was brought in to optimize the marketing analytics stack, I inherited
            attribution models that were fundamentally broken. Traditional linear and time-decay
            models were underestimating channel synergy effects, cross-device journeys were
            creating attribution gaps, and the team was making campaign optimization decisions
            based on incomplete channel interaction data.
          </p>
          <p className="leading-relaxed">
            With 12 active marketing channels, complex B2B customer journeys, and a $3.2M annual
            marketing budget at stake, the organization needed a sophisticated attribution
            solution that could handle multi-channel complexity. Budget allocation models
            couldn't account for diminishing returns or channel saturation, and there was no
            way to predict the impact of budget shifts across different channel combinations.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was charged with building an advanced multi-channel attribution system that
            would move beyond rule-based models to machine learning-powered insights. My
            specific mandate included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Develop ML-powered attribution that captures complex channel interactions and synergies</li>
            <li>Build cross-device customer journey reconstruction using probabilistic modeling</li>
            <li>Create budget optimization recommendations with scenario modeling capabilities</li>
            <li>Implement channel saturation analysis to identify diminishing returns points</li>
            <li>Enable predictive budget planning for quarterly forecasting accuracy above 80%</li>
            <li>Reduce attribution analysis time from days to hours with automated insights</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a machine learning-powered multi-channel attribution platform
            from scratch, using advanced algorithms to understand channel interactions and
            predict optimal marketing strategies:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FeatureCard title="ML Attribution Engine I Built">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Algorithmic attribution using ensemble machine learning models</li>
                <li>Cross-channel interaction analysis with synergy quantification</li>
                <li>Probabilistic customer journey reconstruction across devices</li>
                <li>Dynamic attribution weights based on conversion likelihood</li>
                <li>Incremental lift testing and media mix optimization</li>
              </ul>
            </FeatureCard>
            <FeatureCard title="Predictive Analytics Features">
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Budget optimization recommendations with scenario modeling</li>
                <li>Channel saturation curves and diminishing returns analysis</li>
                <li>Predictive conversion probability scoring per journey</li>
                <li>Real-time campaign performance monitoring with automated alerts</li>
                <li>Automated insights generation with actionable recommendations</li>
              </ul>
            </FeatureCard>
          </div>

          <p className="leading-relaxed mt-4">
            I personally architected the ML pipeline, designed the model interpretability layer
            for marketing team adoption, and led the change management process to shift from
            intuition-based to data-driven budget decisions. The system was deployed in phases
            to validate accuracy before expanding recommendations.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The ML-powered attribution system I built delivered unprecedented insights into
            channel performance and enabled data-driven optimizations that significantly
            improved marketing efficiency:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ResultCard value="92.4%" label="ML Attribution Accuracy" variant="primary" />
            <ResultCard value="47.8%" label="Conversion Rate Improvement" variant="secondary" />
            <ResultCard
              value={formatCurrency(attributionMetrics.totalROI)}
              label="Marketing ROI Optimization"
              variant="primary"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-primary">Quantified Business Outcomes I Delivered:</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                Discovered channel synergy effects worth $890K annually in previously hidden value
              </li>
              <li>
                Reduced customer acquisition cost by 31% through optimized channel mix allocation
              </li>
              <li>
                Increased marketing qualified leads by 38% with same budget through ML-guided reallocation
              </li>
              <li>Improved campaign ROI prediction accuracy from 67% to 92.4% using my ML models</li>
              <li>Identified optimal budget allocation across 12 channels, saving $640K annually</li>
              <li>
                Reduced attribution analysis time from 3 days to 2 hours with automated insights
              </li>
              <li>Enabled predictive budget planning with 85% accuracy for quarterly forecasts</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent-foreground">
                Advanced Attribution Insights
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Machine learning attribution significantly outperforms rule-based models in
                  complex environments—I now default to ML for any portfolio with 5+ channels
                </li>
                <li>
                  Channel synergy effects can account for 20-30% of total conversion value;
                  this was the most surprising finding of the project
                </li>
                <li>
                  Cross-device attribution requires probabilistic modeling, not deterministic
                  matching—I learned to embrace uncertainty
                </li>
                <li>
                  Budget saturation curves vary dramatically by channel; I now build individual
                  optimization models for each
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">Implementation Excellence</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Model interpretability is crucial for marketing team adoption—I invested
                  heavily in explainable AI features
                </li>
                <li>
                  Real-time attribution enables agile campaign optimization that batch
                  analysis can't achieve
                </li>
                <li>
                  Automated insights generation scales attribution analysis across large
                  channel portfolios without added headcount
                </li>
                <li>
                  Predictive capabilities transform attribution from a reporting tool to a
                  strategic planning engine
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project established that advanced attribution modeling is not just about
            measurement—it's about enabling predictive marketing intelligence that can guide
            strategic decisions before campaigns even launch. I now approach every attribution
            project with prediction as the primary goal, not just measurement.
          </p>
        </div>
      </SectionCard>
    </div>
  )
}
