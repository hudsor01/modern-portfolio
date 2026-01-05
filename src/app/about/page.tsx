import { generateMetadata } from '@/app/shared-metadata'
import { Navbar } from '@/components/layout/navbar'
import { PersonalInfo } from '@/components/about/personal-info'
import { SkillsSection } from '@/components/about/skills-section'
import { ExperienceStats } from '@/components/about/experience-stats'
import { CertificationsSection } from '@/components/about/certifications-section'

const EXPERIENCE_STATS = [
  { label: 'Projects Delivered', value: '10+', icon: 'check-circle' },
  { label: 'Revenue Generated', value: '$4.8M+', icon: 'dollar-sign' },
  { label: 'Transaction Growth', value: '432%', icon: 'bar-chart' },
  { label: 'Network Expansion', value: '2,217%', icon: 'rocket' },
]

const CERTIFICATIONS = [
  {
    name: 'SalesLoft Admin Certification Level 1',
    issuer: 'SalesLoft',
    badge: '/images/certifications/salesloft-admin-badge-1.png',
    description: 'Foundational administration and configuration of SalesLoft sales engagement platform',
    skills: ['Platform Setup', 'User Management', 'Basic Cadences', 'Email Templates']
  },
  {
    name: 'SalesLoft Admin Certification Level 2',
    issuer: 'SalesLoft',
    badge: '/images/certifications/salesloft-admin-badge-2.png',
    description: 'Advanced administration including complex automation, integrations, and advanced analytics',
    skills: ['Advanced Automation', 'CRM Integrations', 'Advanced Analytics', 'Complex Workflows']
  },
  {
    name: 'HubSpot Revenue Operations Certification',
    issuer: 'HubSpot Academy',
    badge: '/images/certifications/hubspot-revops-badge.png',
    description: 'Comprehensive revenue operations strategy, process optimization, and performance analysis',
    skills: ['Revenue Operations', 'Sales Process Optimization', 'Marketing Alignment', 'Analytics & Forecasting']
  }
]

const PERSONAL_INFO = {
  name: 'Richard Hudson',
  title: 'Revenue Operations Professional',
  location: 'Plano, TX • Serving Dallas-Fort Worth Metroplex • Remote & On-Site Available',
  email: 'contact@richardwhudsonjr.com',
  bio: `Revenue Operations leader who transforms complexity into competitive advantage. 10+ years architecting data-driven systems that have generated $4.8M+ in revenue, driven 432% transaction growth, and expanded partner networks by 2,217%.

I specialize in the intersection of strategy and execution—building automated pipelines, predictive analytics, and scalable processes that turn operational chaos into sustainable growth engines. SalesLoft Admin certified (Level 1 & 2) and HubSpot Revenue Operations certified.`,
  highlights: [
    'Based in Plano, TX with deep knowledge of Dallas-Fort Worth business ecosystem and market dynamics',
    'SalesLoft Admin Certified (Level 1 & 2) and HubSpot Revenue Operations Certified professional',
    'Specialized in revenue operations and growth analytics with proven $4.8M+ revenue generation track record',
    'Expert in partnership program development and implementation with 432% growth achievements',
    'Proven track record of increasing revenue efficiency by 40%+ across multiple DFW organizations',
    'Comprehensive experience with Dallas tech startups, Fort Worth traditional industries, and enterprise headquarters',
    'Expert in building automated reporting systems and data-driven decision frameworks',
    'Active member of Dallas-Fort Worth business community with extensive local network',
    'Available for professional opportunities and consulting throughout DFW metroplex',
    'Specialized knowledge of Texas business regulations, local market conditions, and industry best practices',
  ],
}

export const metadata = generateMetadata(
  'About Richard Hudson | Revenue Operations Professional | Dallas-Fort Worth',
  'Richard Hudson - Plano, Texas Revenue Operations Professional serving Dallas-Fort Worth metroplex with 10+ years experience. SalesLoft Admin certified (Level 1 & 2) and HubSpot Revenue Operations certified. Partnership program implementation specialist with system integration experience. Expert in data analytics, process automation, and CRM optimization. $4.8M+ revenue generated across 10+ projects, 432% transaction growth achieved.',
  '/about'
)

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

        {/* Personal Information Section - Hero */}
        <section className="relative pt-24 pb-16 lg:pt-32 lg:pb-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <PersonalInfo personalInfo={PERSONAL_INFO} />
          </div>
        </section>

        {/* Experience Stats Section */}
        <section className="relative py-16 lg:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <ExperienceStats stats={EXPERIENCE_STATS} />
          </div>
        </section>

        {/* Skills Section */}
        <section className="relative py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <SkillsSection />
          </div>
        </section>

        {/* Certifications Section */}
        <section className="relative py-16 lg:py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <CertificationsSection certifications={CERTIFICATIONS} />
          </div>
        </section>
      </main>
    </div>
  )
}
