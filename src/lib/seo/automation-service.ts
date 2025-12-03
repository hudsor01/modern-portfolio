/**
 * SEO Automation Service
 * Comprehensive SEO automation system with intelligent content optimization
 */

import { Metadata } from 'next'
import { siteConfig } from '@/lib/config/site'
import { contentAnalyzer } from './content-analyzer'
import type { 
  SEOScore, 
  SEOSuggestion
} from '@/types/seo'

export interface SEOAutomationConfig {
  content: string
  title?: string
  description?: string
  keywords?: string[]
  path?: string
  type?: 'website' | 'article' | 'blog'
  publishedAt?: string
  modifiedAt?: string
  author?: string
  category?: string
  tags?: string[]
  locale?: string
  alternates?: Record<string, string>
}

export interface SEOAutomationResult {
  metadata: Metadata
  score: SEOScore
  suggestions: SEOSuggestion[]
  optimizedTitle: string
  optimizedDescription: string
  extractedKeywords: string[]
  readabilityScore: number
  internalLinks: string[]
  imageOptimizations: ImageOptimization[]
  schemaData: Record<string, unknown>
}

export interface ImageOptimization {
  src: string
  alt?: string
  hasAlt: boolean
  suggestion?: string
  priority: 'high' | 'medium' | 'low'
}

export class SEOAutomationService {
  private readonly maxTitleLength = 60
  private readonly maxDescriptionLength = 160
  // private readonly minContentLength = 300 // Unused for now
  // private readonly keywordDensityRange = { min: 0.5, max: 2.5 } // Reserved for future use

  /**
   * Generate comprehensive SEO optimization for content
   */
  async optimizeContent(config: SEOAutomationConfig): Promise<SEOAutomationResult> {
    const {
      content,
      title: rawTitle,
      description: rawDescription,
      keywords: rawKeywords = [],
      path = '',
      type = 'website',
      publishedAt,
      modifiedAt,
      author,
      category,
      tags = [],
      locale = 'en-US',
      alternates = {}
    } = config

    // Step 1: Extract and optimize content elements
    const extractedKeywords = this.extractKeywords(content)
    const combinedKeywords = [...new Set([...rawKeywords, ...extractedKeywords])]
    
    const optimizedTitle = this.optimizeTitle(rawTitle || this.generateTitle(content, combinedKeywords))
    const optimizedDescription = this.optimizeDescription(
      rawDescription || this.generateDescription(content, combinedKeywords)
    )

    // Step 2: Analyze content for SEO score
    const analysis = contentAnalyzer.analyzeContent({
      title: optimizedTitle,
      description: optimizedDescription,
      keywords: combinedKeywords,
      content,
      url: path || ''
    })

    // Step 3: Calculate readability score
    const readabilityScore = this.calculateReadabilityScore(content)

    // Step 4: Extract internal links and image optimizations
    const internalLinks = this.extractInternalLinks(content)
    const imageOptimizations = this.analyzeImages(content)

    // Step 5: Generate structured data
    const schemaData = this.generateSchemaData({
      title: optimizedTitle,
      description: optimizedDescription,
      content,
      type,
      publishedAt,
      modifiedAt,
      author,
      category,
      tags,
      path
    })

    // Step 6: Generate comprehensive metadata
    const metadata = this.generateEnhancedMetadata({
      title: optimizedTitle,
      description: optimizedDescription,
      keywords: combinedKeywords,
      path,
      type,
      publishedAt,
      modifiedAt,
      author,
      category,
      tags,
      locale,
      alternates,
      schemaData
    })

    // Step 7: Add additional suggestions based on comprehensive analysis (unused for now)
    // const additionalSuggestions = [
    //   ...this.generateContentSuggestions(content, combinedKeywords),
    //   ...this.generateTechnicalSuggestions(imageOptimizations, internalLinks)
    // ]

    return {
      metadata,
      score: analysis.seoScore,
      suggestions: analysis.suggestions,
      optimizedTitle,
      optimizedDescription,
      extractedKeywords: combinedKeywords,
      readabilityScore,
      internalLinks,
      imageOptimizations,
      schemaData
    }
  }

  /**
   * Extract keywords from content using frequency analysis and NLP techniques
   */
  private extractKeywords(content: string): string[] {
    const text = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    const words = text.split(' ')
    const stopWords = new Set([
      'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
      'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before',
      'after', 'above', 'below', 'between', 'among', 'is', 'are', 'was',
      'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
      'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
      'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she',
      'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your',
      'his', 'its', 'our', 'their', 'a', 'an'
    ])

    // Count word frequencies
    const wordFreq: Record<string, number> = {}
    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1
      }
    })

    // Extract phrases (2-3 words)
    const phrases: Record<string, number> = {}
    for (let i = 0; i < words.length - 1; i++) {
      const word1 = words[i];
      const word2 = words[i + 1];
      if (!word1 || !word2) continue;

      const twoWord = `${word1} ${word2}`
      const word3 = words[i + 2];
      const threeWord = i < words.length - 2 && word3 ? `${word1} ${word2} ${word3}` : ''

      if (twoWord.length > 6 && !stopWords.has(word1) && !stopWords.has(word2)) {
        phrases[twoWord] = (phrases[twoWord] || 0) + 1
      }

      if (threeWord && threeWord.length > 10 && word3 && !stopWords.has(word3)) {
        phrases[threeWord] = (phrases[threeWord] || 0) + 1
      }
    }

    // Combine and sort by frequency
    const allKeywords = [
      ...Object.entries(wordFreq).map(([word, freq]) => ({ keyword: word, freq, type: 'word' })),
      ...Object.entries(phrases).map(([phrase, freq]) => ({ keyword: phrase, freq, type: 'phrase' }))
    ]

    return allKeywords
      .sort((a, b) => b.freq - a.freq)
      .slice(0, 15)
      .map(item => item.keyword)
  }

  /**
   * Generate title from content and keywords
   */
  private generateTitle(content: string, keywords: string[]): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const firstSentence = sentences[0]?.trim()
    
    if (firstSentence && firstSentence.length <= this.maxTitleLength) {
      return firstSentence
    }

    // Use primary keyword + descriptive text
    const primaryKeyword = keywords[0]
    if (primaryKeyword) {
      return `${primaryKeyword.charAt(0).toUpperCase() + primaryKeyword.slice(1)} - Professional Guide`
    }

    return 'Professional Portfolio & Insights'
  }

  /**
   * Generate description from content and keywords
   */
  private generateDescription(content: string, keywords: string[]): string {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10)
    let description = ''
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim()
      if (description.length + trimmed.length + 2 <= this.maxDescriptionLength) {
        description += (description ? '. ' : '') + trimmed
      } else {
        break
      }
    }

    // Ensure we include primary keywords
    if (keywords.length > 0 && keywords[0] && !description.toLowerCase().includes(keywords[0].toLowerCase())) {
      const primaryKeyword = keywords[0]
      const maxLength = this.maxDescriptionLength - primaryKeyword.length - 10
      description = `${primaryKeyword}: ${description.slice(0, maxLength)}...`
    }

    return description || 'Explore professional insights, data analytics projects, and revenue operations expertise.'
  }

  /**
   * Optimize title for SEO
   */
  private optimizeTitle(title: string): string {
    if (title.length <= this.maxTitleLength) {
      return title
    }

    // Truncate at word boundary
    const words = title.split(' ')
    let optimized = ''
    
    for (const word of words) {
      if (optimized.length + word.length + 1 <= this.maxTitleLength) {
        optimized += (optimized ? ' ' : '') + word
      } else {
        break
      }
    }

    return optimized || title.slice(0, this.maxTitleLength - 3) + '...'
  }

  /**
   * Optimize description for SEO
   */
  private optimizeDescription(description: string): string {
    if (description.length <= this.maxDescriptionLength) {
      return description
    }

    // Find last complete sentence within limit
    const sentences = description.split(/[.!?]+/)
    let optimized = ''
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim()
      if (optimized.length + trimmed.length + 2 <= this.maxDescriptionLength) {
        optimized += (optimized ? '. ' : '') + trimmed
      } else {
        break
      }
    }

    return optimized || description.slice(0, this.maxDescriptionLength - 3) + '...'
  }

  /**
   * Calculate readability score using Flesch Reading Ease formula
   */
  private calculateReadabilityScore(content: string): number {
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    const words = content.trim().split(/\s+/).length
    const syllables = this.countSyllables(content)

    if (sentences === 0 || words === 0) return 0

    const avgSentenceLength = words / sentences
    const avgSyllablesPerWord = syllables / words

    const score = 206.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord)
    return Math.max(0, Math.min(100, Math.round(score)))
  }

  /**
   * Count syllables in text (approximation)
   */
  private countSyllables(text: string): number {
    const words = text.toLowerCase().match(/\b[a-z]+\b/g) || []
    return words.reduce((total, word) => {
      let syllables = word.match(/[aeiouy]+/g)?.length || 1
      if (word.endsWith('e')) syllables--
      return total + Math.max(1, syllables)
    }, 0)
  }

  /**
   * Extract internal links from content
   */
  private extractInternalLinks(content: string): string[] {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const links: string[] = []
    let match

    while ((match = linkRegex.exec(content)) !== null) {
      const url = match[2]
      if (url && (url.startsWith('/') || url.includes(siteConfig.url))) {
        links.push(url)
      }
    }

    return [...new Set(links)]
  }

  /**
   * Analyze images for SEO optimization
   */
  private analyzeImages(content: string): ImageOptimization[] {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    const images: ImageOptimization[] = []
    let match

    while ((match = imageRegex.exec(content)) !== null) {
      const alt = match[1]
      const src = match[2]
      if (!src) continue;

      const hasAlt = Boolean(alt && alt.trim().length > 0)

      const optimization: ImageOptimization = {
        src,
        alt: alt || undefined,
        hasAlt,
        priority: hasAlt ? 'low' : 'high'
      }

      if (!hasAlt) {
        optimization.suggestion = 'Add descriptive alt text for better accessibility and SEO'
      } else if (alt && alt.length < 10) {
        optimization.suggestion = 'Alt text is too short. Make it more descriptive'
        optimization.priority = 'medium'
      }

      images.push(optimization)
    }

    return images
  }

  // Commented out - reserved for future use
  // /**
  //  * Generate additional content suggestions
  //  * @internal Reserved for future use
  //  */
  // private generateContentSuggestions(content: string, keywords: string[]): SEOSuggestion[] {
  //   const suggestions: SEOSuggestion[] = []
  //   const wordCount = content.trim().split(/\s+/).length

  //   // Keyword density analysis
  //   keywords.slice(0, 3).forEach(keyword => {
  //     const occurrences = (content.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
  //     const density = (occurrences / wordCount) * 100

  //     if (density < this.keywordDensityRange.min) {
  //       suggestions.push({
  //         type: 'content',
  //         message: `Increase usage of keyword "${keyword}" (current density: ${density.toFixed(1)}%)`,
  //         priority: 'medium'
  //       })
  //     } else if (density > this.keywordDensityRange.max) {
  //       suggestions.push({
  //         type: 'content',
  //         message: `Reduce usage of keyword "${keyword}" to avoid over-optimization (current density: ${density.toFixed(1)}%)`,
  //         priority: 'high'
  //       })
  //     }
  //   })

  //   // Content structure analysis
  //   const headingCount = (content.match(/^#{1,6}\s/gm) || []).length
  //   if (headingCount === 0 && wordCount > 500) {
  //     suggestions.push({
  //       type: 'content',
  //       message: 'Add headings (H2, H3) to improve content structure and readability',
  //       priority: 'high'
  //     })
  //   }

  //   // List usage
  //   if (wordCount > 300 && !content.includes('- ') && !content.includes('* ')) {
  //     suggestions.push({
  //       type: 'content',
  //       message: 'Consider adding bullet points or numbered lists to improve scannability',
  //       priority: 'medium'
  //     })
  //   }

  //   return suggestions
  // }

  // /**
  //  * Generate technical SEO suggestions
  //  * @internal Reserved for future use
  //  */
  // private generateTechnicalSuggestions(
  //   images: ImageOptimization[],
  //   internalLinks: string[]
  // ): SEOSuggestion[] {
  //   const suggestions: SEOSuggestion[] = []

  //   // Image optimization suggestions
  //   const imagesWithoutAlt = images.filter(img => !img.hasAlt)
  //   if (imagesWithoutAlt.length > 0) {
  //     suggestions.push({
  //       type: 'content',
  //       message: `${imagesWithoutAlt.length} image(s) missing alt text. Add descriptive alt attributes.`,
  //       priority: 'high'
  //     })
  //   }

  //   // Internal linking suggestions
  //   if (internalLinks.length === 0) {
  //     suggestions.push({
  //       type: 'content',
  //       message: 'Add internal links to related content to improve site structure and SEO',
  //       priority: 'medium'
  //     })
  //   } else if (internalLinks.length > 10) {
  //     suggestions.push({
  //       type: 'content',
  //       message: 'Too many internal links may dilute link equity. Consider reducing to 5-10 relevant links.',
  //       priority: 'low'
  //     })
  //   }

  //   return suggestions
  // }

  /**
   * Generate structured data for content
   */
  private generateSchemaData(config: {
    title: string
    description: string
    content: string
    type: string
    publishedAt?: string
    modifiedAt?: string
    author?: string
    category?: string
    tags?: string[]
    path: string
  }) {
    const { title, description, content, type, publishedAt, modifiedAt, author, category, tags, path } = config
    const url = `${siteConfig.url}${path}`

    const baseSchema = {
      "@context": "https://schema.org",
      "@type": type === 'article' || type === 'blog' ? "Article" : "WebPage",
      "headline": title,
      "description": description,
      "url": url,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url
      }
    }

    if (type === 'article' || type === 'blog') {
      return {
        ...baseSchema,
        "@type": "Article",
        "author": {
          "@type": "Person",
          "name": author || siteConfig.author.name,
          "url": siteConfig.author.url || siteConfig.url
        },
        "publisher": {
          "@type": "Organization",
          "name": siteConfig.name,
          "url": siteConfig.url
        },
        "datePublished": publishedAt,
        "dateModified": modifiedAt || publishedAt,
        "articleSection": category,
        "keywords": tags?.join(', '),
        "wordCount": content.trim().split(/\s+/).length,
        "articleBody": content
      }
    }

    return baseSchema
  }

  /**
   * Generate enhanced metadata with comprehensive SEO optimizations
   */
  private generateEnhancedMetadata(config: {
    title: string
    description: string
    keywords: string[]
    path: string
    type: string
    publishedAt?: string
    modifiedAt?: string
    author?: string
    category?: string
    tags?: string[]
    locale: string
    alternates: Record<string, string>
    schemaData: Record<string, unknown>
  }): Metadata {
    const {
      title,
      description,
      keywords,
      path,
      type,
      publishedAt,
      modifiedAt,
      author,
      category,
      tags,
      locale,
      alternates
    } = config

    const url = `${siteConfig.url}${path}`
    const canonicalUrl = `${siteConfig.url}${path}`
    const fullTitle = `${title} | ${siteConfig.name}`

    return {
      title: fullTitle,
      description,
      keywords: keywords.join(', '),
      authors: [{ name: author || siteConfig.author.name }],
      creator: author || siteConfig.author.name,
      publisher: siteConfig.name,
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1
        }
      },
      openGraph: {
        title: fullTitle,
        description,
        url,
        siteName: siteConfig.name,
        locale,
        type: type === 'article' || type === 'blog' ? 'article' : 'website',
        publishedTime: publishedAt,
        modifiedTime: modifiedAt,
        section: category,
        tags,
        images: [
          {
            url: siteConfig.ogImage,
            width: 1200,
            height: 630,
            alt: title
          }
        ]
      },
      twitter: {
        card: 'summary_large_image',
        title: fullTitle,
        description,
        creator: '@richardhudson',
        images: [siteConfig.ogImage]
      },
      alternates: {
        canonical: canonicalUrl,
        languages: alternates
      },
      other: {
        'article:author': author || siteConfig.author.name,
        'article:section': category || '',
        'article:tag': tags?.join(', ') || '',
        'article:published_time': publishedAt || '',
        'article:modified_time': modifiedAt || ''
      }
    }
  }
}

export const seoAutomationService = new SEOAutomationService()