import { Metadata } from 'next'

export const pageMetadata = {
  home: {
    title: 'Richard Hudson | Revenue Operations Consultant & Business Growth Expert',
    description: 'Revenue Operations Consultant in Dallas-Fort Worth. Expert in sales automation, CRM optimization, and data-driven growth strategies. $4.8M+ revenue generated across 8+ projects.',
    keywords: [
      'revenue operations consultant',
      'RevOps expert Dallas',
      'sales operations optimization',
      'marketing automation specialist',
      'business intelligence consulting',
      'SaaS revenue growth',
      'CRM optimization expert',
      'Salesforce consultant',
      'HubSpot implementation',
      'data analytics consulting',
      'process automation expert',
      'revenue forecasting',
      'sales pipeline optimization',
      'customer lifecycle management',
      'B2B growth strategies'
    ]
  },
  about: {
    title: 'About Richard Hudson | Revenue Operations Expert in Dallas-Fort Worth',
    description: 'Meet Richard Hudson, Revenue Operations Consultant based in Plano, Texas. 10+ years experience in Salesforce, HubSpot, data analytics, and process automation. Serving Dallas-Fort Worth metroplex with proven results: $4.8M+ revenue generated, 432% growth achieved.',
    keywords: [
      'Richard Hudson biography',
      'Revenue Operations consultant Dallas',
      'Plano Texas RevOps expert',
      'Dallas Fort Worth business consultant',
      'Salesforce certified consultant',
      'HubSpot implementation specialist',
      'business process automation',
      'revenue growth strategies',
      'CRM optimization expert',
      'data analytics consultant'
    ]
  },
  projects: {
    title: 'Revenue Operations Projects | Proven Success Stories & Case Studies',
    description: 'Explore proven RevOps success stories and case studies: $4.8M+ revenue generated, 25% churn reduction, 35% conversion optimization, 432% transaction growth. Real-world examples of sales automation, data analytics, and business intelligence solutions.',
    keywords: [
      'revenue operations case studies',
      'RevOps success stories',
      'sales automation examples',
      'business intelligence projects',
      'CRM optimization results',
      'data analytics case studies',
      'marketing automation success',
      'revenue growth projects',
      'conversion optimization examples',
      'customer retention strategies'
    ]
  },
  resume: {
    title: 'Richard Hudson Resume | Revenue Operations Professional Experience',
    description: 'Download Richard Hudson\'s resume: 10+ years Revenue Operations experience, expert in Salesforce, HubSpot, Tableau, SQL, Python. Proven track record with $4.8M+ revenue generated and 432% growth achieved. Professional PDF resume available.',
    keywords: [
      'Richard Hudson resume',
      'Revenue Operations experience',
      'Salesforce expert resume',
      'HubSpot specialist CV',
      'business intelligence consultant',
      'data analytics professional',
      'RevOps consultant resume',
      'CRM implementation experience',
      'process automation specialist',
      'revenue growth expert'
    ]
  },
  contact: {
    title: 'Contact Richard Hudson | Revenue Operations Consulting Services',
    description: 'Schedule a consultation with Richard Hudson, Revenue Operations Expert in Dallas-Fort Worth. Free 30-minute discovery call available. Get expert guidance on sales optimization, marketing automation, CRM implementation, and business growth strategies.',
    keywords: [
      'revenue operations consultation',
      'RevOps consulting services',
      'Dallas business consultant',
      'sales optimization expert',
      'marketing automation consultant',
      'CRM implementation services',
      'business growth strategies',
      'free consultation call',
      'revenue operations expert',
      'process automation consultant'
    ]
  },
  projectPages: {
    'revenue-kpi': {
      title: 'Revenue KPI Dashboard | Business Intelligence Analytics Project',
      description: 'Interactive Revenue KPI Dashboard showcasing real-time business metrics, partner performance analytics, and revenue forecasting. Built with advanced data visualization techniques for executive-level reporting and strategic decision-making.',
      keywords: ['revenue KPI dashboard', 'business intelligence', 'data visualization', 'executive reporting', 'revenue analytics']
    },
    'deal-funnel': {
      title: 'Sales Pipeline Funnel Analysis | Conversion Optimization Project',
      description: 'Comprehensive Sales Pipeline Funnel Analysis revealing conversion bottlenecks and optimization opportunities. Advanced analytics showing stage-by-stage performance metrics with actionable insights for sales team improvement.',
      keywords: ['sales funnel analysis', 'conversion optimization', 'pipeline management', 'sales analytics', 'lead conversion']
    },
    'churn-retention': {
      title: 'Customer Churn & Retention Analysis | Predictive Analytics Project',
      description: 'Advanced Customer Churn & Retention Analysis using predictive modeling to identify at-risk customers and optimize retention strategies. Features cohort analysis, lifetime value calculations, and actionable retention recommendations.',
      keywords: ['customer churn analysis', 'retention strategies', 'predictive analytics', 'customer lifetime value', 'cohort analysis']
    },
    'lead-attribution': {
      title: 'Lead Attribution Analytics | Multi-Touch Attribution Modeling',
      description: 'Sophisticated Lead Attribution Analytics system implementing multi-touch attribution modeling to optimize marketing spend and channel performance. Comprehensive analysis of customer journey touchpoints and conversion paths.',
      keywords: ['lead attribution', 'multi-touch attribution', 'marketing analytics', 'customer journey', 'marketing ROI']
    },
    'cac-unit-economics': {
      title: 'CAC & Unit Economics Analysis | Customer Acquisition Cost Optimization',
      description: 'Comprehensive Customer Acquisition Cost (CAC) and Unit Economics Analysis providing deep insights into acquisition efficiency, payback periods, and lifetime value ratios. Strategic recommendations for sustainable growth.',
      keywords: ['customer acquisition cost', 'unit economics', 'CAC analysis', 'lifetime value', 'acquisition efficiency']
    },
    'partner-performance': {
      title: 'Partner Performance Analytics | ROI Tracking & Optimization',
      description: 'Advanced Partner Performance Analytics dashboard tracking ROI, commission structures, and partnership effectiveness. Real-time insights into partner productivity, revenue attribution, and strategic partnership optimization.',
      keywords: ['partner performance', 'partnership analytics', 'commission tracking', 'partner ROI', 'channel performance']
    }
  }
}

export function getPageMetadata(page: string, slug?: string): Metadata {
  if (page === 'projects' && slug && typeof pageMetadata.projectPages === 'object' && slug in pageMetadata.projectPages) {
    const projectMeta = pageMetadata.projectPages[slug as keyof typeof pageMetadata.projectPages]
    return {
      title: projectMeta.title,
      description: projectMeta.description,
      keywords: projectMeta.keywords,
      openGraph: {
        title: projectMeta.title,
        description: projectMeta.description,
        url: `https://richardwhudsonjr.com/projects/${slug}`,
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: projectMeta.title,
        description: projectMeta.description,
      },
      alternates: {
        canonical: `https://richardwhudsonjr.com/projects/${slug}`,
      },
    }
  }

  const pageMeta = pageMetadata[page as keyof typeof pageMetadata]
  if (!pageMeta || typeof pageMeta === 'object' && !('title' in pageMeta)) return {}

  const path = page === 'home' ? '' : `/${page}`
  
  return {
    title: 'title' in pageMeta ? pageMeta.title : '',
    description: 'description' in pageMeta ? pageMeta.description : '',
    keywords: 'keywords' in pageMeta ? pageMeta.keywords : [],
    openGraph: {
      title: 'title' in pageMeta ? pageMeta.title : '',
      description: 'description' in pageMeta ? pageMeta.description : '',
      url: `https://richardwhudsonjr.com${path}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'title' in pageMeta ? pageMeta.title : '',
      description: 'description' in pageMeta ? pageMeta.description : '',
    },
    alternates: {
      canonical: `https://richardwhudsonjr.com${path}`,
    },
  }
}