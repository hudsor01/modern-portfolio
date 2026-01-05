'use client'

import { TrendingUp, Users, Settings, BarChart } from 'lucide-react'

import { ProjectPageLayout } from '@/components/projects/project-page-layout'
import { LoadingState } from '@/components/projects/loading-state'
import { useLoadingState } from '@/hooks/use-loading-state'
import { ProjectJsonLd } from '@/components/seo/json-ld'
import { STARAreaChart } from '@/components/projects/star-area-chart'

const starData = {
  situation: { phase: 'Situation', impact: 20, efficiency: 15, value: 10 },
  task: { phase: 'Task', impact: 45, efficiency: 40, value: 35 },
  action: { phase: 'Action', impact: 75, efficiency: 80, value: 70 },
  result: { phase: 'Result', impact: 95, efficiency: 98, value: 92 },
}

const achievements = [
  {
    metric: 'Partner Program',
    value: 'First Implementation',
    description:
      "Designed and built company's first-ever partnership program from concept to production",
    icon: <Users className="w-6 h-6" />,
  },
  {
    metric: 'System Integration',
    value: 'Full Production',
    description: 'Production-ready integrations with CRM, billing systems, and partner portals',
    icon: <Settings className="w-6 h-6" />,
  },
  {
    metric: 'Automation Level',
    value: '90%+',
    description: 'Automated partner onboarding, commission tracking, and performance reporting',
    icon: <BarChart className="w-6 h-6" />,
  },
  {
    metric: 'Business Impact',
    value: 'Strategic Success',
    description: 'Program became integral to company revenue strategy and growth',
    icon: <TrendingUp className="w-6 h-6" />,
  },
]

const technicalDetails = [
  {
    title: 'Partner Onboarding Automation',
    description:
      'Built automated partner registration and approval workflows with document verification, background checks, and training completion tracking.',
    technologies: ['Salesforce', 'DocuSign API', 'Custom Workflows'],
  },
  {
    title: 'Commission Tracking System',
    description:
      'Implemented real-time commission calculation engine with multi-tier structures, dispute resolution, and automated payouts.',
    technologies: ['Custom API', 'Database Design', 'Payment Integration'],
  },
  {
    title: 'Performance Analytics Dashboard',
    description:
      'Created comprehensive partner performance tracking with revenue attribution, conversion metrics, and predictive analytics.',
    technologies: ['React', 'TypeScript', 'Data Visualization'],
  },
  {
    title: 'Integration Architecture',
    description:
      'Designed and implemented production integrations connecting CRM, billing systems, partner portals, and internal tools.',
    technologies: ['REST APIs', 'Webhooks', 'Data Synchronization'],
  },
]

export default function PartnershipProgramPage() {
  const { isLoading, handleRefresh } = useLoadingState()

  return (
    <>
      <ProjectJsonLd
        title="Enterprise Partnership Program Implementation"
        description="Led comprehensive design and implementation of a company's first partnership program, creating automated partner onboarding, commission tracking, and performance analytics."
        slug="partnership-program-implementation"
        category="Revenue Operations"
        tags={[
          'Partnership Program',
          'Channel Operations',
          'Partner Onboarding',
          'Commission Automation',
        ]}
      />

      <ProjectPageLayout
        title="Enterprise Partnership Program Implementation"
        description="Led comprehensive design and implementation of a company's first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals."
        tags={[
          { label: 'First Partner Program', variant: 'primary' },
          { label: '90%+ Automation', variant: 'secondary' },
          { label: 'Full Production', variant: 'primary' },
          { label: 'Strategic Success', variant: 'secondary' },
        ]}
        onRefresh={handleRefresh}
        refreshButtonDisabled={isLoading}
      >
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Key Achievements */}
            <div className="space-y-12 mb-16">
              <div className="text-center space-y-4">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Key Achievements
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Strategic implementation results and business impact
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 ease-out"
                  >
                    <div className="text-primary mb-4">{achievement.icon}</div>
                    <div className="space-y-2">
                      <div className="text-xl font-semibold text-foreground">{achievement.value}</div>
                      <div className="text-sm font-medium text-primary">{achievement.metric}</div>
                      <div className="text-sm text-muted-foreground">
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Implementation */}
            <div className="space-y-12 mb-16">
              <div className="text-center space-y-4">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Technical Implementation
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Production-ready systems and integrations built from the ground up
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {technicalDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 ease-out"
                  >
                    <h3 className="text-lg font-semibold text-foreground mb-4">{detail.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {detail.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {detail.technologies.map((tech, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm border border-primary/20"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Professional Narrative Sections */}
            <div className="space-y-16 mb-16">
              {/* Challenge */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  Challenge
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    The organization lacked any structured approach to partner channel sales,
                    missing significant revenue opportunities in an increasingly partnership-driven
                    market. Without a formal program, the company was unable to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Scale sales efforts beyond direct sales team capacity</li>
                    <li>Tap into existing partner networks and relationships</li>
                    <li>Track partner performance or optimize commission structures</li>
                    <li>Maintain consistent partner experience and onboarding</li>
                    <li>Integrate partner-driven deals with existing business systems</li>
                  </ul>
                </div>
              </div>

              {/* Solution */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  Solution
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    Led the complete design and implementation of the company's first enterprise
                    partnership program from concept to production, creating a comprehensive channel
                    management system.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/50 rounded-xl p-6 border border-border">
                      <h3 className="font-semibold text-secondary mb-4">Program Architecture</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Multi-tier partner classification system</li>
                        <li>Automated onboarding with document verification</li>
                        <li>Training and certification requirements</li>
                        <li>Performance-based tier advancement</li>
                        <li>Partner portal with self-service capabilities</li>
                      </ul>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-6 border border-border">
                      <h3 className="font-semibold text-primary mb-4">Technical Integration</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Salesforce CRM integration for lead management</li>
                        <li>Automated commission calculation engine</li>
                        <li>Real-time analytics and reporting dashboards</li>
                        <li>Payment processing and dispute resolution</li>
                        <li>API integrations with billing and support systems</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results & Impact */}
              <div className="bg-card border border-border rounded-2xl p-8">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground mb-6">
                  Results & Impact
                </h2>
                <div className="space-y-6 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    The partnership program became a strategic revenue channel, fundamentally
                    transforming the company's go-to-market approach.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        47
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Active Partners Onboarded
                      </div>
                    </div>
                    <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-secondary mb-2">
                        90%+
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Process Automation
                      </div>
                    </div>
                    <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-accent mb-2">
                        35%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Revenue Growth from Partners
                      </div>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
                      <div className="text-2xl font-bold text-primary mb-2">
                        15 Days
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Average Onboarding Time
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STAR Impact Analysis */}
            <div className="space-y-8 mt-16">
              <div className="text-center space-y-4">
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  STAR Impact Analysis
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Tracking project progression from Situation through Action to measurable Results
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <STARAreaChart data={starData} title="Project Progression Metrics" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-6 bg-card border border-border rounded-2xl">
                  <div className="text-sm text-primary mb-2">Situation</div>
                  <div className="text-lg font-semibold text-foreground">Initial Assessment</div>
                </div>
                <div className="text-center p-6 bg-card border border-border rounded-2xl">
                  <div className="text-sm text-secondary mb-2">Task</div>
                  <div className="text-lg font-semibold text-foreground">Goal Definition</div>
                </div>
                <div className="text-center p-6 bg-card border border-border rounded-2xl">
                  <div className="text-sm text-accent mb-2">Action</div>
                  <div className="text-lg font-semibold text-foreground">Implementation</div>
                </div>
                <div className="text-center p-6 bg-card border border-border rounded-2xl">
                  <div className="text-sm text-primary mb-2">Result</div>
                  <div className="text-lg font-semibold text-foreground">Measurable Impact</div>
                </div>
              </div>
            </div>
          </>
        )}
      </ProjectPageLayout>
    </>
  )
}
