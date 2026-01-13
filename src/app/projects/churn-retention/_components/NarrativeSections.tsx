'use client'

import { SectionCard } from '@/components/ui/section-card'
import { formatCurrency } from '@/lib/utils/data-formatters'

interface NarrativeSectionsProps {
  revenueSaved: number
}

export function NarrativeSections({ revenueSaved }: NarrativeSectionsProps) {
  return (
    <div className="space-y-12 mt-12">
      {/* Situation */}
      <SectionCard title="Situation" variant="glass" padding="lg">
        <div className="space-y-4 text-muted-foreground">
          <p className="text-lg leading-relaxed">
            When I took ownership of partner success operations, I discovered we had a
            critical blind spot: partner churn was completely reactive. We were losing
            valuable partners without any advance warning, and by the time the retention
            team engaged, it was usually too late. With a growing partner base and
            significant revenue at stake, the reactive approach was costing us real money.
          </p>
          <p className="leading-relaxed">
            High-value partners were leaving due to unaddressed concerns, retention efforts
            were costly and unfocused—targeting the wrong segments—and there was no
            understanding of churn patterns or leading indicators. Manual tracking was
            impossible at scale.
          </p>
        </div>
      </SectionCard>

      {/* Task */}
      <SectionCard title="Task" variant="glass" padding="lg">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I was tasked with building a predictive churn analysis system that would
            transform partner retention from reactive firefighting to proactive
            relationship management. My specific objectives included:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Develop an early warning system that identifies at-risk partners 60-90 days before potential churn</li>
            <li>Build machine learning models achieving at least 85% prediction accuracy</li>
            <li>Create automated alert systems to trigger proactive interventions</li>
            <li>Enable segmented retention campaigns based on risk profiles and partner value</li>
            <li>Reduce overall churn rate by at least 15% within the first year</li>
            <li>Integrate with CRM and partner portals for 360-degree partner health visibility</li>
          </ul>
        </div>
      </SectionCard>

      {/* Action */}
      <SectionCard title="Action" variant="glass" padding="lg">
        <div className="space-y-4 text-muted-foreground">
          <p className="leading-relaxed">
            I designed and built a comprehensive churn prediction and retention analytics
            platform from scratch, using machine learning algorithms and real-time data
            analysis:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-muted/50 rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-primary mb-3">Predictive Analytics I Built</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Machine learning models for churn probability scoring</li>
                <li>Real-time partner engagement tracking and anomaly detection</li>
                <li>Behavioral pattern analysis across transaction and engagement data</li>
                <li>Cohort analysis for retention curve optimization</li>
                <li>Predictive lifecycle modeling with 60-90 day advance warnings</li>
              </ul>
            </div>
            <div className="bg-muted/50 rounded-xl p-6 border border-border">
              <h3 className="font-semibold text-secondary mb-3">Retention Operations</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Automated alert system for at-risk partners I configured</li>
                <li>Segmented retention campaign workflows based on risk tier</li>
                <li>Partner health score monitoring with intervention triggers</li>
                <li>Success team task prioritization based on partner value and risk</li>
                <li>ROI tracking for retention initiatives</li>
              </ul>
            </div>
          </div>

          <p className="leading-relaxed mt-4">
            I personally led the integration with CRM systems, partner portals, and
            communication platforms to provide a 360-degree view of partner health
            and automated intervention triggers. The rollout was phased by partner
            tier to validate accuracy before scaling.
          </p>
        </div>
      </SectionCard>

      {/* Result */}
      <SectionCard title="Result" variant="glass" padding="lg">
        <div className="space-y-6 text-muted-foreground">
          <p className="leading-relaxed">
            The churn prediction system I built transformed partner retention from reactive
            firefighting to proactive relationship management, delivering measurable revenue
            impact:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
              <div className="text-2xl font-semibold text-primary mb-2">23%</div>
              <div className="text-sm text-muted-foreground">Churn Rate Reduction</div>
            </div>
            <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 text-center">
              <div className="text-2xl font-semibold text-secondary mb-2">89%</div>
              <div className="text-sm text-muted-foreground">Prediction Accuracy</div>
            </div>
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 text-center">
              <div className="text-2xl font-semibold text-accent mb-2">
                {formatCurrency(revenueSaved, { compact: true })}
              </div>
              <div className="text-sm text-muted-foreground">
                Revenue Saved from Retention
              </div>
            </div>
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
              <div className="text-2xl font-semibold text-primary mb-2">67%</div>
              <div className="text-sm text-muted-foreground">
                Success Rate of Interventions
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-secondary">
              Quantified Business Outcomes I Delivered:
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Reduced partner churn rate from 14.2% to 10.9% quarterly</li>
              <li>Increased retention rate for high-value partners to 92%</li>
              <li>Achieved 67% success rate for at-risk partner interventions I designed</li>
              <li>
                Saved {formatCurrency(revenueSaved, { compact: true })} in annual revenue through
                proactive retention
              </li>
              <li>
                Improved partner satisfaction scores by 18% through proactive outreach
              </li>
              <li>Reduced retention team workload by 34% through targeted interventions</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Key Learnings */}
      <SectionCard title="Key Learnings" variant="glass" padding="lg">
        <div className="space-y-4 text-muted-foreground">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-accent">Customer Success Insights</h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Early engagement is 3x more effective than late-stage retention—I now
                  prioritize prevention over cure
                </li>
                <li>
                  Partners with declining engagement show churn intent 60-90 days before
                  actual churn; I learned to trust the signals
                </li>
                <li>
                  Personalized retention approaches significantly outperform generic
                  campaigns—I segment everything now
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-primary">
                Technical Implementation Insights
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>
                  Real-time data processing is crucial for actionable churn predictions;
                  batch processing is too slow
                </li>
                <li>
                  Model accuracy improves significantly with multi-dimensional engagement
                  data—I now collect everything
                </li>
                <li>
                  Automated workflows reduce response time from days to hours; I automate
                  every intervention trigger
                </li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4">
            This project taught me that retention is fundamentally about relationship
            health, not just transactional metrics. The most successful interventions
            I've designed address underlying business challenges rather than just
            engagement gaps.
          </p>
        </div>
      </SectionCard>

      {/* Technologies Used */}
      <SectionCard title="Technologies Used" variant="default" padding="lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'React 19',
            'TypeScript',
            'Recharts',
            'Machine Learning',
            'Predictive Analytics',
            'Data Modeling',
            'Real-time Processing',
            'CRM Integration',
            'Behavioral Analytics',
            'Cohort Analysis',
            'Automation Workflows',
            'Customer Success',
          ].map((tech, index) => (
            <span
              key={index}
              className="bg-muted/50 text-muted-foreground px-3 py-2 rounded-lg text-sm text-center border border-border hover:bg-muted transition-colors"
            >
              {tech}
            </span>
          ))}
        </div>
      </SectionCard>

      {/* Insights Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SectionCard
          title="Key Insight"
          variant="glass"
          padding="md"
          className="bg-primary/5 border-primary/20"
        >
          <p className="text-muted-foreground text-sm">
            Partners with less than 3 months tenure show 2x higher churn risk. Focus
            onboarding efforts here.
          </p>
        </SectionCard>
        <SectionCard
          title="Opportunity"
          variant="glass"
          padding="md"
          className="bg-secondary/5 border-secondary/20"
        >
          <p className="text-muted-foreground text-sm">
            Implementing proactive engagement for at-risk segments could reduce churn by up
            to 15%.
          </p>
        </SectionCard>
        <SectionCard
          title="Action Required"
          variant="glass"
          padding="md"
          className="bg-accent/5 border-accent/20"
        >
          <p className="text-muted-foreground text-sm">
            Schedule quarterly business reviews with top 20% of partners to maintain
            retention rates.
          </p>
        </SectionCard>
      </div>
    </div>
  )
}
