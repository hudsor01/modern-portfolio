import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { BreadcrumbListJsonLd } from '@/components/seo/json-ld/breadcrumb-json-ld'
import PartnershipProgramPageContent from './_components/PartnershipProgramPageContent'
import { canonicalUrl, SITE_ORIGIN } from '@/lib/absolute-url'

export const dynamic = 'force-static'

const ogImageUrl = canonicalUrl(
  `/api/og?${new URLSearchParams({
    title: 'Enterprise Partnership Program Implementation',
    subtitle: 'Revenue Operations Project',
  }).toString()}`
)

export const metadata: Metadata = {
  title: 'Enterprise Partnership Program Implementation',
  description:
    "Led comprehensive design and implementation of a company's first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals.",
  openGraph: {
    title: 'Enterprise Partnership Program Implementation',
    description:
      "Led comprehensive design and implementation of a company's first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals.",
    url: canonicalUrl('/projects/partnership-program-implementation'),
    siteName: 'Richard Hudson',
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: 'Enterprise Partnership Program Implementation',
      },
    ],
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise Partnership Program Implementation',
    description:
      "Led comprehensive design and implementation of a company's first partnership program, creating automated partner onboarding, commission tracking, and performance analytics. Built production-ready integrations with CRM, billing systems, and partner portals.",
    images: [ogImageUrl],
  },
  alternates: {
    canonical: canonicalUrl('/projects/partnership-program-implementation'),
  },
}

export default async function PartnershipProgramImplementationPage() {
  const nonce = (await headers()).get('x-nonce')
  return (
    <>
      <BreadcrumbListJsonLd
        nonce={nonce}
        items={[
          { name: 'Home', url: SITE_ORIGIN },
          { name: 'Projects', url: canonicalUrl('/projects') },
          {
            name: 'Enterprise Partnership Program Implementation',
            url: canonicalUrl('/projects/partnership-program-implementation'),
          },
        ]}
      />
      <PartnershipProgramPageContent />
    </>
  )
}
