/**
 * Resume data constants
 * Centralized data for the resume page
 */

export const headline = 'Revenue Operations Professional'

export const summary =
  'Data and revenue operations professional with experience across digital marketing, business systems, partner operations and analytics, after six years as an IT specialist in the Texas Army National Guard. Proven expertise in developing SQL logic, optimizing sales funnels and building automated systems that scale.'

export const experience = [
  {
    title: 'Data Analyst',
    company: 'HomeVestors of America, Inc.',
    period: 'July 2026 - Present',
    current: true,
    location: 'Dallas-Fort Worth, TX',
    type: 'Full-time',
    description: [],
    technologies: [],
  },
  {
    title: 'Revenue Operations Consultant',
    company: 'Thryv',
    period: 'December 2022 - November 2024',
    current: false,
    location: 'Grapevine, TX',
    type: 'Full-time',
    description: [
      'Administered partner attribution system connecting PartnerStack, Workato and Salesforce to ensure accurate data flow across Sales, Finance and Marketing',
      'Improved forecast accuracy by 40% through systematic data hygiene, stage-to-category mapping and the enforcement of duplicate management logic',
      'Maintained data quality across a Salesforce instance of 5M+ records, developing cross-functional metrics and analyzing cohort behavior to support executive leadership',
      'Diagnosed and resolved complex data integration failures in Tray.io via systematic debugging, preventing revenue data loss and maintaining ETL reliability',
    ],
    technologies: ['Salesforce', 'PartnerStack', 'Workato', 'Tray.io'],
  },
  {
    title: 'Channel Operations Lead & Sales Operations Analyst',
    company: 'Thryv',
    period: 'March 2020 - December 2022',
    current: false,
    location: 'Grapevine, TX',
    type: 'Full-time',
    description: [
      'Designed PartnerStack-Salesforce pipeline architecture that improved attribution accuracy and reduced operational cycle time by 30%, contributing to $1.1M in attributed revenue',
      'Transformed operations from manual processes to a scalable automated system supporting 5,000+ partners',
      'Built segmented Salesforce dashboards tracking pipeline coverage, forecast-to-quota variance and conversion metrics to provide real-time trajectory insight',
      'Administered Market Development Fund program and referral tracking across unlimited chains, coordinating approvals directly with Finance',
    ],
    technologies: ['Salesforce', 'PartnerStack'],
  },
  {
    title: 'Business Systems Specialist',
    company: 'Thryv',
    period: 'December 2017 - March 2020',
    current: false,
    location: 'Grapevine, TX',
    type: 'Full-time',
    description: [
      'Led Salesforce platform integration and automation reducing order processing time by 60%',
      'Achieved 95% SLA compliance managing offshore operations team',
      'Developed KPI monitoring systems improving revenue visibility and team performance metrics',
      'Implemented automated workflows reducing manual processing time by 40%',
      'Deployed validation rules and Flows enforcing clean data structures across Opportunity, Account and Lead objects',
      'Coordinated systematic data cleanup and QuickBooks auditing with Sales Operations and Finance, ensuring accurate forecast hierarchies',
    ],
    technologies: ['Salesforce', 'QuickBooks'],
  },
  {
    title: 'Digital Marketing Associate',
    company: 'Thryv',
    period: 'April 2016 - December 2017',
    current: false,
    location: 'Grapevine, TX',
    type: 'Full-time',
    description: [
      'Led digital marketing operations for more than 300 clients across web, social and search platforms',
      'Collaborated with web design team on development and content for more than 200 client websites',
      'Implemented Search Engine Optimization and content strategies improving search visibility',
    ],
    technologies: ['SEO', 'Content Strategy', 'Social Media'],
  },
  {
    title: 'Information Technology Specialist (25B)',
    company: 'Texas Army National Guard',
    period: 'March 2005 - March 2011',
    current: false,
    location: 'Fort Worth, TX',
    type: 'Military',
    description: [
      'Maintained $250,000+ IT equipment inventory with 100% accountability and delivered 99.9% network uptime for 500+ personnel during combat operations in Iraq',
    ],
    technologies: ['Network Administration', 'IT Asset Management'],
  },
]

export const education = [
  {
    degree: 'Bachelor of Science (BS) in Business Administration',
    institution: 'The University of Texas at Dallas',
    period: '2012 - 2015',
    focus: 'Concentration in Entrepreneurship',
  },
]

export const skills = [
  {
    category: 'Revenue Operations',
    items: [
      'Sales Operations',
      'Cross-functional Collaboration',
      'Process Optimization',
      'Strategic Planning',
      'Data Visualization',
      'Forecasting & Analytics',
    ],
  },
  {
    category: 'Tools & Platforms',
    items: ['Salesforce', 'HubSpot', 'Salesloft', 'PartnerStack', 'Power BI', 'Tableau'],
  },
  {
    category: 'Technical Skills',
    items: [
      'Python',
      'SQL',
      'Excel (Advanced)',
      'Webhooks',
      'API Integrations',
      'Financial Modeling',
    ],
  },
]

export const certifications = [
  'HubSpot Revenue Operations Certification',
  // Same credential names as /about and the Person JSON-LD (owner-confirmed).
  'Salesloft Admin Certification Level 1',
  'Salesloft Admin Certification Level 2',
  'Microsoft Career Essentials in Data Analysis',
  'Microsoft Career Essentials in Business Analysis',
  'Atlassian Agile Project Management',
]
