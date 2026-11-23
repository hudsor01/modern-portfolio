import HomePageContent from '@/components/layout/home-page-content'
import { generateMetadata as genMeta } from '@/app/shared-metadata'
import { getProjects } from '@/lib/projects'

export const dynamic = 'force-static'

export const metadata = genMeta({
  title: 'Richard Hudson | RevOps Professional in Dallas-Fort Worth',
  absoluteTitle: true,
  description:
    'Richard Hudson — Revenue Operations Professional in Dallas-Fort Worth. SalesLoft Admin (L1/L2) and HubSpot RevOps certified. $4.8M+ revenue impact.',
  path: '/',
  ogTitle: 'Richard Hudson',
  subtitle: 'Revenue Operations Professional',
  ogAlt: 'Richard Hudson - Revenue Operations Professional',
  keywords: [
    'Richard Hudson',
    'revenue operations professional Dallas',
    'partnership program implementation',
    'Salesloft Certified Administrator',
    'Salesloft Administrator Certification',
    'HubSpot Revenue Operations certified',
    'revenue operations Dallas Fort Worth',
    'production system implementation',
    'CRM integration specialist',
    'sales automation expert',
    'revenue operations leadership',
    'partner onboarding automation',
    'commission tracking systems',
    'data analytics expertise',
    'process automation expert',
    'revenue forecasting',
    'channel program development',
    'customer lifecycle management',
    'B2B growth strategies',
    'enterprise system integration',
  ],
})

const FEATURED_SLUGS = [
  'revenue-kpi',
  'forecast-pipeline-intelligence',
  'partnership-program-implementation',
  'sales-enablement',
]

export default async function HomePage() {
  const all = await getProjects()
  const featuredProjects = FEATURED_SLUGS.flatMap((slug) => {
    const match = all.find((p) => p.slug === slug)
    return match ? [match] : []
  })

  return (
    <div className="animate-fade-in-up">
      <HomePageContent featuredProjects={featuredProjects} />
    </div>
  )
}
