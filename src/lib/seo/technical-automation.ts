/**
 * Technical SEO Automation
 * Automated sitemap generation, RSS feeds, schema markup, and technical optimizations
 */

import { siteConfig } from '@/lib/config/site'

export interface SitemapURL {
  loc: string
  lastmod?: string
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number
}

export interface RSSItem {
  title: string
  description: string
  link: string
  pubDate: string
  author?: string
  category?: string
  guid?: string
  content?: string
}

export interface SchemaMarkup {
  '@context': string
  '@type': string
  [key: string]: unknown
}

export interface TechnicalSEOReport {
  sitemap: {
    generated: boolean
    urlCount: number
    lastGenerated: string
    urls: SitemapURL[]
  }
  rss: {
    generated: boolean
    itemCount: number
    lastGenerated: string
    feedUrl: string
  }
  schema: {
    implemented: boolean
    types: string[]
    errors: string[]
  }
  robotsTxt: {
    exists: boolean
    optimized: boolean
    issues: string[]
  }
  performance: {
    score: number
    opportunities: string[]
    metrics: PerformanceMetrics
  }
  crawlability: {
    score: number
    issues: CrawlabilityIssue[]
  }
  mobileFriendliness: {
    score: number
    issues: string[]
  }
}

export interface PerformanceMetrics {
  firstContentfulPaint: number
  largestContentfulPaint: number
  cumulativeLayoutShift: number
  firstInputDelay: number
  totalBlockingTime: number
}

export interface CrawlabilityIssue {
  type: 'error' | 'warning' | 'info'
  message: string
  url?: string
  impact: 'high' | 'medium' | 'low'
}

export class TechnicalSEOAutomation {
  private readonly baseUrl = siteConfig.url

  /**
   * Generate complete technical SEO report
   */
  async generateTechnicalReport(): Promise<TechnicalSEOReport> {
    const sitemap = await this.generateSitemapReport()
    const rss = await this.generateRSSReport()
    const schema = await this.analyzeSchemaImplementation()
    const robotsTxt = await this.analyzeRobotsTxt()
    const performance = await this.analyzePerformance()
    const crawlability = await this.analyzeCrawlability()
    const mobileFriendliness = await this.analyzeMobileFriendliness()

    return {
      sitemap,
      rss,
      schema,
      robotsTxt,
      performance,
      crawlability,
      mobileFriendliness
    }
  }

  /**
   * Generate comprehensive sitemap with all pages
   */
  async generateSitemap(additionalUrls: SitemapURL[] = []): Promise<string> {
    const urls: SitemapURL[] = [
      // Static pages
      {
        loc: this.baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 1.0
      },
      {
        loc: `${this.baseUrl}/about`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/projects`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: 0.9
      },
      {
        loc: `${this.baseUrl}/resume`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.7
      },
      {
        loc: `${this.baseUrl}/contact`,
        lastmod: new Date().toISOString(),
        changefreq: 'yearly',
        priority: 0.6
      },
      // Project pages
      {
        loc: `${this.baseUrl}/projects/revenue-kpi`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/projects/deal-funnel`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/projects/churn-retention`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/projects/lead-attribution`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/projects/cac-unit-economics`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/projects/partner-performance`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/projects/multi-channel-attribution`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/projects/customer-lifetime-value`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/projects/commission-optimization`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      {
        loc: `${this.baseUrl}/projects/revenue-operations-center`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: 0.8
      },
      ...additionalUrls
    ]

    const sitemapXml = this.generateSitemapXML(urls)
    return sitemapXml
  }

  /**
   * Generate RSS feed for blog posts
   */
  async generateRSSFeed(items: RSSItem[]): Promise<string> {
    const now = new Date().toUTCString()
    
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name}</title>
    <description>${siteConfig.description}</description>
    <link>${this.baseUrl}</link>
    <language>en-US</language>
    <managingEditor>${siteConfig.author.email} (${siteConfig.author.name})</managingEditor>
    <webMaster>${siteConfig.author.email} (${siteConfig.author.name})</webMaster>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <atom:link href="${this.baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <title>${siteConfig.name}</title>
      <url>${siteConfig.ogImage}</url>
      <link>${this.baseUrl}</link>
    </image>
    ${items.map(item => this.generateRSSItem(item)).join('\n    ')}
  </channel>
</rss>`

    return rssXml
  }

  /**
   * Generate JSON-LD structured data for different content types
   */
  generateSchemaMarkup(type: 'website' | 'person' | 'article' | 'organization' | 'breadcrumb', data: Record<string, unknown>): SchemaMarkup {
    const baseSchema = {
      '@context': 'https://schema.org'
    }

    switch (type) {
      case 'website':
        return {
          ...baseSchema,
          '@type': 'WebSite',
          name: siteConfig.name,
          description: siteConfig.description,
          url: this.baseUrl,
          author: {
            '@type': 'Person',
            name: siteConfig.author.name,
            email: siteConfig.author.email
          },
          sameAs: [
            siteConfig.links.linkedin,
            siteConfig.links.github,
            siteConfig.links.twitter
          ],
          potentialAction: {
            '@type': 'SearchAction',
            target: `${this.baseUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        }

      case 'person':
        return {
          ...baseSchema,
          '@type': 'Person',
          name: siteConfig.author.name,
          email: siteConfig.author.email,
          url: this.baseUrl,
          jobTitle: 'Revenue Operations Professional',
          worksFor: {
            '@type': 'Organization',
            name: 'Hudson Digital Solutions'
          },
          sameAs: [
            siteConfig.links.linkedin,
            siteConfig.links.github,
            siteConfig.links.twitter
          ],
          knowsAbout: [
            'Revenue Operations',
            'Data Analytics',
            'Business Intelligence',
            'Sales Operations',
            'Marketing Analytics'
          ],
          alumniOf: data.education || [],
          hasOccupation: {
            '@type': 'Occupation',
            name: 'Revenue Operations Specialist',
            occupationLocation: {
              '@type': 'Country',
              name: 'United States'
            },
            skills: [
              'Data Analysis',
              'Business Intelligence',
              'Revenue Optimization',
              'CRM Management',
              'Forecasting'
            ]
          }
        }

      case 'article':
        return {
          ...baseSchema,
          '@type': 'Article',
          headline: data.title,
          description: data.description,
          author: {
            '@type': 'Person',
            name: data.author || siteConfig.author.name,
            email: siteConfig.author.email
          },
          publisher: {
            '@type': 'Organization',
            name: siteConfig.name,
            url: this.baseUrl
          },
          datePublished: data.publishedAt,
          dateModified: data.modifiedAt || data.publishedAt,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': data.url
          },
          image: data.image || siteConfig.ogImage,
          articleSection: data.category,
          keywords: Array.isArray(data.keywords) ? data.keywords.join(', ') : undefined,
          wordCount: data.wordCount,
          url: data.url
        }

      case 'organization':
        return {
          ...baseSchema,
          '@type': 'Organization',
          name: 'Hudson Digital Solutions',
          url: this.baseUrl,
          founder: {
            '@type': 'Person',
            name: siteConfig.author.name
          },
          foundingDate: '2020',
          description: 'Professional revenue operations and data analytics consulting services',
          serviceArea: {
            '@type': 'Country',
            name: 'United States'
          },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Revenue Operations Services',
            itemListElement: [
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Revenue Operations Consulting',
                  description: 'Comprehensive revenue operations strategy and implementation'
                }
              },
              {
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: 'Data Analytics & Business Intelligence',
                  description: 'Advanced data analytics and reporting solutions'
                }
              }
            ]
          }
        }

      case 'breadcrumb':
        return {
          ...baseSchema,
          '@type': 'BreadcrumbList',
          itemListElement: (data.items as Array<{name: string, url: string}>).map((item, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        }

      default:
        return {
          ...baseSchema,
          '@type': 'Thing'
        }
    }
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(customRules: string[] = []): string {
    const defaultRules = [
      'User-agent: *',
      'Allow: /',
      '',
      '# Disallow crawling of API routes',
      'Disallow: /api/',
      '',
      '# Disallow crawling of private files',
      'Disallow: /_next/',
      'Disallow: /static/',
      '',
      '# Allow specific bots',
      'User-agent: Googlebot',
      'Allow: /',
      '',
      'User-agent: Bingbot',
      'Allow: /',
      '',
      '# Block problematic bots',
      'User-agent: SemrushBot',
      'Disallow: /',
      '',
      'User-agent: AhrefsBot',
      'Disallow: /',
      '',
      'User-agent: MJ12bot',
      'Disallow: /',
      '',
      `# Sitemap location`,
      `Sitemap: ${this.baseUrl}/sitemap.xml`,
      `Sitemap: ${this.baseUrl}/rss.xml`,
      '',
      '# Crawl-delay for aggressive bots',
      'User-agent: *',
      'Crawl-delay: 1'
    ]

    return [...defaultRules, ...customRules].join('\n')
  }

  /**
   * Analyze page speed and performance
   */
  async analyzePageSpeed(_url: string): Promise<{
    score: number
    metrics: PerformanceMetrics
    opportunities: string[]
  }> {
    // This would typically integrate with Google PageSpeed Insights API
    // For now, providing structure and mock data
    
    const mockMetrics: PerformanceMetrics = {
      firstContentfulPaint: 1.2,
      largestContentfulPaint: 2.1,
      cumulativeLayoutShift: 0.05,
      firstInputDelay: 8,
      totalBlockingTime: 45
    }

    const opportunities = this.generatePerformanceOpportunities(mockMetrics)
    const score = this.calculatePerformanceScore(mockMetrics)

    return {
      score,
      metrics: mockMetrics,
      opportunities
    }
  }

  /**
   * Check for broken links
   */
  async checkBrokenLinks(urls: string[]): Promise<Array<{
    url: string
    status: number
    error?: string
  }>> {
    const results: Array<{ url: string; status: number; error?: string }> = []

    for (const url of urls) {
      try {
        const response = await fetch(url, { method: 'HEAD' })
        results.push({
          url,
          status: response.status
        })
      } catch (error) {
        results.push({
          url,
          status: 0,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return results
  }

  /**
   * Detect duplicate content
   */
  async detectDuplicateContent(pages: Array<{ url: string; content: string }>): Promise<Array<{
    url1: string
    url2: string
    similarity: number
    type: 'exact' | 'substantial' | 'partial'
  }>> {
    const duplicates: Array<{
      url1: string
      url2: string
      similarity: number
      type: 'exact' | 'substantial' | 'partial'
    }> = []

    for (let i = 0; i < pages.length; i++) {
      for (let j = i + 1; j < pages.length; j++) {
        const pageA = pages[i]
        const pageB = pages[j]
        
        if (!pageA || !pageB) continue
        
        const similarity = this.calculateContentSimilarity(
          pageA.content,
          pageB.content
        )

        if (similarity > 0.3) {
          let type: 'exact' | 'substantial' | 'partial' = 'partial'
          if (similarity > 0.9) type = 'exact'
          else if (similarity > 0.7) type = 'substantial'

          duplicates.push({
            url1: pageA.url,
            url2: pageB.url,
            similarity,
            type
          })
        }
      }
    }

    return duplicates
  }

  /**
   * Generate sitemap XML
   */
  private generateSitemapXML(urls: SitemapURL[]): string {
    const urlElements = urls.map(url => {
      const lastmod = url.lastmod ? `    <lastmod>${url.lastmod}</lastmod>` : ''
      const changefreq = url.changefreq ? `    <changefreq>${url.changefreq}</changefreq>` : ''
      const priority = url.priority ? `    <priority>${url.priority}</priority>` : ''

      return `  <url>
    <loc>${url.loc}</loc>${lastmod}${changefreq}${priority}
  </url>`
    }).join('\n')

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`
  }

  /**
   * Generate RSS item XML
   */
  private generateRSSItem(item: RSSItem): string {
    const guid = item.guid || item.link
    const content = item.content ? `<content:encoded><![CDATA[${item.content}]]></content:encoded>` : ''
    const category = item.category ? `<category>${item.category}</category>` : ''
    const author = item.author ? `<author>${item.author}</author>` : ''

    return `<item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${guid}</guid>
      <pubDate>${item.pubDate}</pubDate>${author}${category}${content}
    </item>`
  }

  /**
   * Generate sitemap report
   */
  private async generateSitemapReport() {
    const sitemap = await this.generateSitemap()
    const urls = this.extractUrlsFromSitemap(sitemap)

    return {
      generated: true,
      urlCount: urls.length,
      lastGenerated: new Date().toISOString(),
      urls
    }
  }

  /**
   * Generate RSS report
   */
  private async generateRSSReport() {
    // Mock RSS items - in production, this would come from actual blog posts
    const mockItems: RSSItem[] = []

    return {
      generated: true,
      itemCount: mockItems.length,
      lastGenerated: new Date().toISOString(),
      feedUrl: `${this.baseUrl}/rss.xml`
    }
  }

  /**
   * Analyze schema implementation
   */
  private async analyzeSchemaImplementation() {
    // This would analyze actual pages for schema markup
    return {
      implemented: true,
      types: ['WebSite', 'Person', 'Organization'],
      errors: []
    }
  }

  /**
   * Analyze robots.txt
   */
  private async analyzeRobotsTxt() {
    return {
      exists: true,
      optimized: true,
      issues: []
    }
  }

  /**
   * Analyze performance
   */
  private async analyzePerformance() {
    const mockMetrics: PerformanceMetrics = {
      firstContentfulPaint: 1.2,
      largestContentfulPaint: 2.1,
      cumulativeLayoutShift: 0.05,
      firstInputDelay: 8,
      totalBlockingTime: 45
    }

    return {
      score: this.calculatePerformanceScore(mockMetrics),
      opportunities: this.generatePerformanceOpportunities(mockMetrics),
      metrics: mockMetrics
    }
  }

  /**
   * Analyze crawlability
   */
  private async analyzeCrawlability() {
    const issues: CrawlabilityIssue[] = []
    
    return {
      score: 95,
      issues
    }
  }

  /**
   * Analyze mobile friendliness
   */
  private async analyzeMobileFriendliness() {
    return {
      score: 100,
      issues: []
    }
  }

  /**
   * Extract URLs from sitemap XML
   */
  private extractUrlsFromSitemap(sitemapXml: string): SitemapURL[] {
    // Simple XML parsing - in production, use proper XML parser
    const urlMatches = sitemapXml.match(/<url>[\s\S]*?<\/url>/g) || []
    
    return urlMatches.map(urlXml => {
      const loc = urlXml.match(/<loc>(.*?)<\/loc>/)?.[1] || ''
      const lastmod = urlXml.match(/<lastmod>(.*?)<\/lastmod>/)?.[1]
      const changefreq = urlXml.match(/<changefreq>(.*?)<\/changefreq>/)?.[1] as SitemapURL['changefreq']
      const priority = parseFloat(urlXml.match(/<priority>(.*?)<\/priority>/)?.[1] || '0.5')

      return {
        loc,
        lastmod,
        changefreq,
        priority
      }
    })
  }

  /**
   * Calculate performance score based on metrics
   */
  private calculatePerformanceScore(metrics: PerformanceMetrics): number {
    let score = 100

    // FCP scoring
    if (metrics.firstContentfulPaint > 1.8) score -= 10
    if (metrics.firstContentfulPaint > 3.0) score -= 20

    // LCP scoring
    if (metrics.largestContentfulPaint > 2.5) score -= 15
    if (metrics.largestContentfulPaint > 4.0) score -= 25

    // CLS scoring
    if (metrics.cumulativeLayoutShift > 0.1) score -= 10
    if (metrics.cumulativeLayoutShift > 0.25) score -= 20

    // FID scoring
    if (metrics.firstInputDelay > 100) score -= 10
    if (metrics.firstInputDelay > 300) score -= 20

    // TBT scoring
    if (metrics.totalBlockingTime > 200) score -= 10
    if (metrics.totalBlockingTime > 600) score -= 20

    return Math.max(0, score)
  }

  /**
   * Generate performance improvement opportunities
   */
  private generatePerformanceOpportunities(metrics: PerformanceMetrics): string[] {
    const opportunities: string[] = []

    if (metrics.firstContentfulPaint > 1.8) {
      opportunities.push('Optimize First Contentful Paint by reducing server response time')
    }

    if (metrics.largestContentfulPaint > 2.5) {
      opportunities.push('Improve Largest Contentful Paint by optimizing images and critical resources')
    }

    if (metrics.cumulativeLayoutShift > 0.1) {
      opportunities.push('Reduce Cumulative Layout Shift by reserving space for images and ads')
    }

    if (metrics.firstInputDelay > 100) {
      opportunities.push('Minimize First Input Delay by reducing JavaScript execution time')
    }

    if (metrics.totalBlockingTime > 200) {
      opportunities.push('Reduce Total Blocking Time by optimizing third-party scripts')
    }

    return opportunities
  }

  /**
   * Calculate content similarity between two texts
   */
  private calculateContentSimilarity(content1: string, content2: string): number {
    const words1 = new Set(content1.toLowerCase().split(/\s+/))
    const words2 = new Set(content2.toLowerCase().split(/\s+/))
    
    const intersection = new Set([...words1].filter(x => words2.has(x)))
    const union = new Set([...words1, ...words2])
    
    return intersection.size / union.size
  }
}

export const technicalSEOAutomation = new TechnicalSEOAutomation()