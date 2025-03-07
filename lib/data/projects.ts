export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies?: string[];
  featured?: boolean;
  features?: string[];
}

/**
 * Async function to fetch all projects
 * This would be where you'd fetch from an API in a real application
 */
export async function getProjects(): Promise<Project[]> {
  // Simulate API delay for demo purposes
  // In a real app, this would be a fetch call
  await new Promise(resolve => setTimeout(resolve, 100));
  return projects;
}

/**
 * Get a specific project by its slug
 */
export function getProjectById(slug: string): Project | undefined {
  return projects.find(project => project.slug === slug);
}

const projects: Project[] = [
  {
    id: 'churn-retention',
    slug: 'churn-retention',
    title: 'Customer Churn & Retention Analytics',
    description: 'A sophisticated analytics platform that helps businesses understand and reduce customer churn while improving retention rates through predictive modeling and actionable insights.',
    image: '/images/projects/churn-retention.jpg',
    liveUrl: 'https://demo.churnanalytics.example.com',
    githubUrl: 'https://github.com/hudsonr01/churn-retention',
    technologies: [
      'React',
      'TypeScript',
      'Recharts',
      'Tailwind CSS',
      'Next.js',
      'Machine Learning',
      'Python',
      'FastAPI'
    ],
    featured: true,
    features: [
      'Churn prediction algorithms to identify at-risk customers',
      'Cohort analysis for retention tracking over time',
      'Customer segmentation based on behavior patterns',
      'Heatmap visualization of retention by customer segment',
      'Automated alert system for high-risk accounts',
      'A/B testing framework for retention strategy optimization',
      'Integration with CRM platforms for unified customer data'
    ]
  },
  {
    id: 'deal-funnel',
    slug: 'deal-funnel',
    title: 'Sales Pipeline Funnel Analytics',
    description: 'A comprehensive sales pipeline visualization tool that tracks conversion rates across different stages of the sales process, helping sales teams identify bottlenecks and optimize their approach.',
    image: '/images/projects/deal-funnel.jpg',
    liveUrl: 'https://demo.salesfunnel.example.com',
    githubUrl: 'https://github.com/hudsonr01/deal-funnel',
    technologies: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'Next.js', 'Redux'],
    featured: true,
    features: [
      'Interactive funnel visualization of the sales pipeline',
      'Stage-by-stage conversion analytics',
      'Time-in-stage tracking for deal velocity metrics',
      'Win/loss ratio analysis by sales rep and deal type',
      'Custom pipeline configuration for different sales processes',
      'Historical trend analysis to track improvement over time'
    ]
  },
  {
    id: 'lead-attribution',
    slug: 'lead-attribution',
    title: 'Lead Source Attribution Dashboard',
    description: 'An interactive dashboard for tracking and analyzing lead sources to optimize marketing spend and improve ROI. Visualizes lead attribution data with interactive charts.',
    image: '/images/projects/lead-attribution.jpg',
    liveUrl: 'https://demo.leadattribution.example.com',
    githubUrl: 'https://github.com/hudsonr01/lead-attribution',
    technologies: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'Next.js'],
    featured: true,
    features: [
      'Interactive pie charts for visualizing lead sources',
      'Real-time data updates and filtering capabilities',
      'Custom reporting and data export functionality',
      'Campaign performance metrics and ROI calculations',
      'Integration with CRM systems for unified lead tracking'
    ]
  },
  {
    id: 'revenue-kpi',
    slug: 'revenue-kpi',
    title: 'Revenue KPI Dashboard',
    description: 'An executive dashboard that provides a comprehensive view of revenue metrics and KPIs, allowing business leaders to monitor performance, identify trends, and make data-driven decisions.',
    image: '/images/projects/revenue-kpi.jpg',
    liveUrl: 'https://demo.revenuekpi.example.com',
    githubUrl: 'https://github.com/hudsonr01/revenue-kpi',
    technologies: [
      'React',
      'TypeScript',
      'Recharts',
      'Tailwind CSS',
      'Next.js',
      'GraphQL',
      'REST API'
    ],
    featured: true,
    features: [
      'Real-time revenue tracking with multiple visualization options',
      'Customizable KPI cards for key metrics monitoring',
      'Year-over-year and month-over-month comparison views',
      'Goal tracking and progress visualization',
      'Forecast modeling based on historical performance',
      'Data export and report generation capabilities',
      'Role-based access control for different stakeholders'
    ]
  }
];