/**
 * Advanced Content SEO Analysis Engine
 * Real-time SEO scoring, readability analysis, and optimization recommendations
 */

import type { SEOScore, SEOSuggestion } from '@/types/seo'

export interface ContentAnalysis {
  seoScore: SEOScore
  readabilityScore: ReadabilityAnalysis
  keywordAnalysis: KeywordAnalysis
  structureAnalysis: ContentStructureAnalysis
  suggestions: SEOSuggestion[]
  competitiveness: CompetitivenessAnalysis
  optimization: OptimizationOpportunities
}

export interface ReadabilityAnalysis {
  fleschKincaidScore: number
  fleschReadingEase: number
  averageSentenceLength: number
  averageSyllablesPerWord: number
  passiveVoicePercentage: number
  complexWords: number
  grade: 'Elementary' | 'Middle School' | 'High School' | 'College' | 'Graduate'
  recommendations: string[]
}

export interface KeywordAnalysis {
  primaryKeywords: KeywordMetrics[]
  secondaryKeywords: KeywordMetrics[]
  keywordDensity: Record<string, number>
  keywordDistribution: KeywordDistribution[]
  semanticKeywords: string[]
  missingKeywords: string[]
  overOptimizedKeywords: string[]
}

export interface KeywordMetrics {
  keyword: string
  frequency: number
  density: number
  prominence: number
  locations: KeywordLocation[]
  tfidfScore: number
}

export interface KeywordLocation {
  type: 'title' | 'heading' | 'first-paragraph' | 'content' | 'conclusion'
  position: number
  context: string
}

export interface KeywordDistribution {
  keyword: string
  sections: Array<{
    section: string
    count: number
    percentage: number
  }>
}

export interface ContentStructureAnalysis {
  headingStructure: HeadingAnalysis
  paragraphAnalysis: ParagraphAnalysis
  listUsage: ListAnalysis
  linkAnalysis: LinkAnalysis
  imageAnalysis: ImageAnalysis
  schemaCompliance: SchemaCompliance
}

export interface HeadingAnalysis {
  h1Count: number
  h2Count: number
  h3Count: number
  h4Count: number
  h5Count: number
  h6Count: number
  hierarchy: Array<{ level: number; text: string; keywords: string[] }>
  issues: string[]
}

export interface ParagraphAnalysis {
  totalParagraphs: number
  averageParagraphLength: number
  shortParagraphs: number
  longParagraphs: number
  recommendations: string[]
}

export interface ListAnalysis {
  bulletLists: number
  numberedLists: number
  totalListItems: number
  recommendations: string[]
}

export interface LinkAnalysis {
  internalLinks: Array<{ url: string; anchor: string; context: string }>
  externalLinks: Array<{ url: string; anchor: string; context: string }>
  brokenLinks: string[]
  anchorTextAnalysis: AnchorTextAnalysis
}

export interface AnchorTextAnalysis {
  exactMatch: number
  partialMatch: number
  branded: number
  generic: number
  recommendations: string[]
}

export interface ImageAnalysis {
  totalImages: number
  imagesWithAlt: number
  imagesWithoutAlt: number
  altTextQuality: Array<{ src: string; alt: string; quality: 'good' | 'fair' | 'poor' }>
  recommendations: string[]
}

export interface SchemaCompliance {
  hasStructuredData: boolean
  schemaTypes: string[]
  requiredProperties: Array<{ property: string; present: boolean }>
  recommendations: string[]
}

export interface CompetitivenessAnalysis {
  contentLength: number
  competitorBenchmark: number
  uniquenessScore: number
  topicCoverage: number
  authoritySignals: number
}

export interface OptimizationOpportunities {
  titleOptimization: TitleOptimization
  metaDescriptionOptimization: MetaDescriptionOptimization
  contentOptimization: ContentOptimization
  technicalOptimization: TechnicalOptimization
}

export interface TitleOptimization {
  current: string
  optimized: string[]
  improvements: string[]
}

export interface MetaDescriptionOptimization {
  current: string
  optimized: string[]
  improvements: string[]
}

export interface ContentOptimization {
  keywordGaps: string[]
  contentGaps: string[]
  structureImprovements: string[]
  readabilityImprovements: string[]
}

export interface TechnicalOptimization {
  pagespeedOpportunities: string[]
  crawlabilityIssues: string[]
  mobileFriendliness: string[]
  coreWebVitals: string[]
}

export class ContentAnalyzer {
  private readonly optimalKeywordDensity = { min: 0.5, max: 2.5 }
  // private readonly optimalContentLength = { min: 300, max: 3000 } // Unused for now
  private readonly optimalParagraphLength = { min: 50, max: 150 }

  /**
   * Perform comprehensive content analysis
   */
  analyzeContent(content: {
    title: string
    description: string
    content: string
    keywords: string[]
    url?: string
  }): ContentAnalysis {
    const { title, description, content: bodyContent, keywords } = content

    // Perform all analysis components
    const readabilityScore = this.analyzeReadability(bodyContent)
    const keywordAnalysis = this.analyzeKeywords(bodyContent, keywords, title)
    const structureAnalysis = this.analyzeContentStructure(bodyContent)
    const competitiveness = this.analyzeCompetitiveness(bodyContent, keywords)
    const optimization = this.generateOptimizationOpportunities({
      title,
      description,
      content: bodyContent,
      keywords,
      readability: readabilityScore,
      structure: structureAnalysis
    })

    // Calculate comprehensive SEO score
    const seoScore = this.calculateComprehensiveSEOScore({
      title,
      description,
      content: bodyContent,
      keywords,
      readability: readabilityScore,
      structure: structureAnalysis,
      keywordAnalysis
    })

    // Generate actionable suggestions
    const suggestions = this.generateActionableSuggestions({
      seoScore,
      readability: readabilityScore,
      keywords: keywordAnalysis,
      structure: structureAnalysis,
      optimization
    })

    return {
      seoScore,
      readabilityScore,
      keywordAnalysis,
      structureAnalysis,
      suggestions,
      competitiveness,
      optimization
    }
  }

  /**
   * Analyze content readability using multiple metrics
   */
  private analyzeReadability(content: string): ReadabilityAnalysis {
    const sentences = this.extractSentences(content)
    const words = this.extractWords(content)
    const syllables = this.countTotalSyllables(content)
    const complexWords = this.countComplexWords(words)
    const passiveVoiceCount = this.countPassiveVoice(content)

    const averageSentenceLength = words.length / sentences.length
    const averageSyllablesPerWord = syllables / words.length

    // Flesch-Kincaid Grade Level
    const fleschKincaidScore = 0.39 * averageSentenceLength + 11.8 * averageSyllablesPerWord - 15.59

    // Flesch Reading Ease
    const fleschReadingEase = 206.835 - (1.015 * averageSentenceLength) - (84.6 * averageSyllablesPerWord)

    const passiveVoicePercentage = (passiveVoiceCount / sentences.length) * 100

    const grade = this.determineReadingGrade(fleschReadingEase)
    const recommendations = this.generateReadabilityRecommendations({
      fleschReadingEase,
      averageSentenceLength,
      passiveVoicePercentage,
      complexWords: complexWords.length
    })

    return {
      fleschKincaidScore: Math.round(fleschKincaidScore * 10) / 10,
      fleschReadingEase: Math.round(fleschReadingEase * 10) / 10,
      averageSentenceLength: Math.round(averageSentenceLength * 10) / 10,
      averageSyllablesPerWord: Math.round(averageSyllablesPerWord * 10) / 10,
      passiveVoicePercentage: Math.round(passiveVoicePercentage * 10) / 10,
      complexWords: complexWords.length,
      grade,
      recommendations
    }
  }

  /**
   * Analyze keyword usage and optimization
   */
  private analyzeKeywords(content: string, targetKeywords: string[], title: string): KeywordAnalysis {
    const words = this.extractWords(content)
    const contentLower = content.toLowerCase()
    // const titleLower = title.toLowerCase() // unused for now

    // Analyze primary and secondary keywords
    const primaryKeywords = this.analyzeKeywordMetrics(targetKeywords.slice(0, 3), content, title)
    const secondaryKeywords = this.analyzeKeywordMetrics(targetKeywords.slice(3), content, title)

    // Calculate keyword density
    const keywordDensity: Record<string, number> = {}
    targetKeywords.forEach(keyword => {
      const occurrences = (contentLower.match(new RegExp(keyword.toLowerCase(), 'g')) || []).length
      keywordDensity[keyword] = (occurrences / words.length) * 100
    })

    // Analyze keyword distribution
    const keywordDistribution = this.analyzeKeywordDistribution(targetKeywords, content)

    // Extract semantic keywords
    const semanticKeywords = this.extractSemanticKeywords(content, targetKeywords)

    // Identify missing and over-optimized keywords
    const missingKeywords = this.identifyMissingKeywords(targetKeywords, content, title)
    const overOptimizedKeywords = this.identifyOverOptimizedKeywords(keywordDensity)

    return {
      primaryKeywords,
      secondaryKeywords,
      keywordDensity,
      keywordDistribution,
      semanticKeywords,
      missingKeywords,
      overOptimizedKeywords
    }
  }

  /**
   * Analyze content structure and organization
   */
  private analyzeContentStructure(content: string): ContentStructureAnalysis {
    const headingStructure = this.analyzeHeadings(content)
    const paragraphAnalysis = this.analyzeParagraphs(content)
    const listUsage = this.analyzeLists(content)
    const linkAnalysis = this.analyzeLinks(content)
    const imageAnalysis = this.analyzeImages(content)
    const schemaCompliance = this.analyzeSchemaCompliance(content)

    return {
      headingStructure,
      paragraphAnalysis,
      listUsage,
      linkAnalysis,
      imageAnalysis,
      schemaCompliance
    }
  }

  /**
   * Extract sentences from content
   */
  private extractSentences(content: string): string[] {
    return content
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
  }

  /**
   * Extract words from content
   */
  private extractWords(content: string): string[] {
    return content
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0)
  }

  /**
   * Count total syllables in content
   */
  private countTotalSyllables(content: string): number {
    const words = this.extractWords(content)
    return words.reduce((total, word) => total + this.countSyllables(word), 0)
  }

  /**
   * Count syllables in a word
   */
  private countSyllables(word: string): number {
    const vowels = word.match(/[aeiouy]+/g)
    let syllableCount = vowels ? vowels.length : 1
    
    // Adjust for silent 'e'
    if (word.endsWith('e')) {
      syllableCount--
    }
    
    return Math.max(1, syllableCount)
  }

  /**
   * Count complex words (3+ syllables)
   */
  private countComplexWords(words: string[]): string[] {
    return words.filter(word => this.countSyllables(word) >= 3)
  }

  /**
   * Count passive voice usage
   */
  private countPassiveVoice(content: string): number {
    const passivePatterns = [
      /\b(am|is|are|was|were|being|been)\s+\w+ed\b/gi,
      /\b(am|is|are|was|were|being|been)\s+\w+en\b/gi
    ]
    
    return passivePatterns.reduce((count, pattern) => {
      const matches = content.match(pattern)
      return count + (matches ? matches.length : 0)
    }, 0)
  }

  /**
   * Determine reading grade level
   */
  private determineReadingGrade(fleschScore: number): ReadabilityAnalysis['grade'] {
    if (fleschScore >= 90) return 'Elementary'
    if (fleschScore >= 80) return 'Middle School'
    if (fleschScore >= 70) return 'High School'
    if (fleschScore >= 60) return 'College'
    return 'Graduate'
  }

  /**
   * Generate readability recommendations
   */
  private generateReadabilityRecommendations(metrics: {
    fleschReadingEase: number
    averageSentenceLength: number
    passiveVoicePercentage: number
    complexWords: number
  }): string[] {
    const recommendations: string[] = []

    if (metrics.fleschReadingEase < 60) {
      recommendations.push('Simplify sentence structure and use shorter words to improve readability')
    }

    if (metrics.averageSentenceLength > 20) {
      recommendations.push('Break up long sentences. Aim for 15-20 words per sentence')
    }

    if (metrics.passiveVoicePercentage > 20) {
      recommendations.push('Reduce passive voice usage. Aim for less than 10% passive voice')
    }

    if (metrics.complexWords > 50) {
      recommendations.push('Replace complex words with simpler alternatives where possible')
    }

    return recommendations
  }

  /**
   * Analyze keyword metrics for specific keywords
   */
  private analyzeKeywordMetrics(keywords: string[], content: string, title: string): KeywordMetrics[] {
    const contentLower = content.toLowerCase()
    // const titleLower = title.toLowerCase() // unused for now
    const words = this.extractWords(content)

    return keywords.map(keyword => {
      const keywordLower = keyword.toLowerCase()
      const frequency = (contentLower.match(new RegExp(keywordLower, 'g')) || []).length
      const density = (frequency / words.length) * 100
      
      // Calculate prominence (early appearance bonus)
      const firstOccurrence = contentLower.indexOf(keywordLower)
      const prominence = firstOccurrence < 100 ? 100 - firstOccurrence : 0

      // Find keyword locations
      const locations = this.findKeywordLocations(keyword, content, title)

      // Calculate TF-IDF score (simplified)
      const tfidfScore = this.calculateTFIDF(keyword, content)

      return {
        keyword,
        frequency,
        density: Math.round(density * 100) / 100,
        prominence,
        locations,
        tfidfScore
      }
    })
  }

  /**
   * Find keyword locations in content
   */
  private findKeywordLocations(keyword: string, content: string, title: string): KeywordLocation[] {
    const locations: KeywordLocation[] = []
    const keywordLower = keyword.toLowerCase()

    // Check title
    if (title.toLowerCase().includes(keywordLower)) {
      locations.push({
        type: 'title',
        position: title.toLowerCase().indexOf(keywordLower),
        context: title
      })
    }

    // Check headings
    const headingMatches = content.match(/^#{1,6}\s+.*$/gm) || []
    headingMatches.forEach((heading, index) => {
      if (heading.toLowerCase().includes(keywordLower)) {
        locations.push({
          type: 'heading',
          position: index,
          context: heading
        })
      }
    })

    // Check first paragraph
    const paragraphs = content.split('\n\n')
    if (paragraphs[0] && paragraphs[0].toLowerCase().includes(keywordLower)) {
      locations.push({
        type: 'first-paragraph',
        position: paragraphs[0].toLowerCase().indexOf(keywordLower),
        context: paragraphs[0].substring(0, 100) + '...'
      })
    }

    return locations
  }

  /**
   * Calculate simplified TF-IDF score
   */
  private calculateTFIDF(keyword: string, content: string): number {
    const words = this.extractWords(content)
    const keywordCount = words.filter(word => word === keyword.toLowerCase()).length
    const tf = keywordCount / words.length
    
    // Simplified IDF (would need corpus for real IDF)
    const idf = Math.log(10000 / (keywordCount + 1))
    
    return tf * idf
  }

  /**
   * Analyze keyword distribution across content sections
   */
  private analyzeKeywordDistribution(keywords: string[], content: string): KeywordDistribution[] {
    const sections = this.splitContentIntoSections(content)
    
    return keywords.map(keyword => {
      const keywordLower = keyword.toLowerCase()
      const sectionAnalysis = sections.map(section => {
        const count = (section.content.toLowerCase().match(new RegExp(keywordLower, 'g')) || []).length
        const words = this.extractWords(section.content).length
        const percentage = words > 0 ? (count / words) * 100 : 0
        
        return {
          section: section.type,
          count,
          percentage: Math.round(percentage * 100) / 100
        }
      })
      
      return {
        keyword,
        sections: sectionAnalysis
      }
    })
  }

  /**
   * Split content into logical sections
   */
  private splitContentIntoSections(content: string): Array<{ type: string; content: string }> {
    const sections: Array<{ type: string; content: string }> = []
    const lines = content.split('\n')
    let currentSection = { type: 'introduction', content: '' }
    
    lines.forEach(line => {
      if (line.match(/^#{1,6}\s/)) {
        if (currentSection.content.trim()) {
          sections.push(currentSection)
        }
        currentSection = { type: 'section', content: line }
      } else {
        currentSection.content += line + '\n'
      }
    })
    
    if (currentSection.content.trim()) {
      sections.push(currentSection)
    }
    
    return sections
  }

  /**
   * Extract semantic keywords related to target keywords
   */
  private extractSemanticKeywords(content: string, targetKeywords: string[]): string[] {
    // This is a simplified semantic analysis
    // In production, you'd use NLP libraries or APIs
    const words = this.extractWords(content)
    const semanticKeywords: string[] = []
    
    // Simple co-occurrence analysis
    targetKeywords.forEach(keyword => {
      const keywordIndex = words.indexOf(keyword.toLowerCase())
      if (keywordIndex !== -1) {
        // Get words near the target keyword
        const start = Math.max(0, keywordIndex - 5)
        const end = Math.min(words.length, keywordIndex + 5)
        const nearbyWords = words.slice(start, end)
        
        nearbyWords.forEach(word => {
          if (word.length > 4 && !targetKeywords.includes(word) && !semanticKeywords.includes(word)) {
            semanticKeywords.push(word)
          }
        })
      }
    })
    
    return semanticKeywords.slice(0, 10)
  }

  /**
   * Identify missing keywords that should be included
   */
  private identifyMissingKeywords(targetKeywords: string[], content: string, title: string): string[] {
    const contentLower = content.toLowerCase()
    const titleLower = title.toLowerCase()
    
    return targetKeywords.filter(keyword => {
      const keywordLower = keyword.toLowerCase()
      return !contentLower.includes(keywordLower) && !titleLower.includes(keywordLower)
    })
  }

  /**
   * Identify over-optimized keywords
   */
  private identifyOverOptimizedKeywords(keywordDensity: Record<string, number>): string[] {
    return Object.entries(keywordDensity)
      .filter(([, density]) => density > this.optimalKeywordDensity.max)
      .map(([keyword]) => keyword)
  }

  /**
   * Analyze heading structure
   */
  private analyzeHeadings(content: string): HeadingAnalysis {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const headings: Array<{ level: number; text: string; keywords: string[] }> = []
    const counts = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 }
    const issues: string[] = []
    
    let match
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1]?.length || 1
      const text = match[2]?.trim() || ''
      
      counts[`h${level}` as keyof typeof counts]++
      
      // Extract keywords from heading
      const keywords = this.extractWords(text)
      headings.push({ level, text, keywords })
    }
    
    // Analyze issues
    if (counts.h1 === 0) {
      issues.push('Missing H1 heading')
    } else if (counts.h1 > 1) {
      issues.push('Multiple H1 headings found. Use only one H1 per page.')
    }
    
    if (counts.h2 === 0 && content.length > 1000) {
      issues.push('Long content should include H2 subheadings for better structure')
    }
    
    return {
      h1Count: counts.h1,
      h2Count: counts.h2,
      h3Count: counts.h3,
      h4Count: counts.h4,
      h5Count: counts.h5,
      h6Count: counts.h6,
      hierarchy: headings,
      issues
    }
  }

  /**
   * Analyze paragraph structure
   */
  private analyzeParagraphs(content: string): ParagraphAnalysis {
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)
    const lengths = paragraphs.map(p => this.extractWords(p).length)
    const averageLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length
    
    const shortParagraphs = lengths.filter(len => len < this.optimalParagraphLength.min).length
    const longParagraphs = lengths.filter(len => len > this.optimalParagraphLength.max).length
    
    const recommendations: string[] = []
    
    if (shortParagraphs > paragraphs.length * 0.3) {
      recommendations.push('Many paragraphs are too short. Consider combining related ideas.')
    }
    
    if (longParagraphs > paragraphs.length * 0.2) {
      recommendations.push('Some paragraphs are too long. Break them into smaller, focused paragraphs.')
    }
    
    return {
      totalParagraphs: paragraphs.length,
      averageParagraphLength: Math.round(averageLength),
      shortParagraphs,
      longParagraphs,
      recommendations
    }
  }

  /**
   * Analyze list usage
   */
  private analyzeLists(content: string): ListAnalysis {
    const bulletLists = (content.match(/^\s*[-*+]\s/gm) || []).length
    const numberedLists = (content.match(/^\s*\d+\.\s/gm) || []).length
    const totalListItems = bulletLists + numberedLists
    
    const recommendations: string[] = []
    
    if (totalListItems === 0 && content.length > 1000) {
      recommendations.push('Consider adding bullet points or numbered lists to improve scannability')
    }
    
    return {
      bulletLists,
      numberedLists,
      totalListItems,
      recommendations
    }
  }

  /**
   * Analyze links in content
   */
  private analyzeLinks(content: string): LinkAnalysis {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const internalLinks: Array<{ url: string; anchor: string; context: string }> = []
    const externalLinks: Array<{ url: string; anchor: string; context: string }> = []
    const brokenLinks: string[] = []
    
    let match
    while ((match = linkRegex.exec(content)) !== null) {
      const anchor = match[1]
      const url = match[2]
      const context = content.substring(Math.max(0, match.index - 50), match.index + 50)
      
      if (url && (url.startsWith('/') || url.includes('localhost') || url.includes('richardhudson.dev'))) {
        internalLinks.push({ url, anchor, context })
      } else if (url) {
        externalLinks.push({ url, anchor, context })
      }
    }
    
    // Analyze anchor text
    const allAnchors = [...internalLinks, ...externalLinks].map(link => link.anchor.toLowerCase())
    const anchorTextAnalysis: AnchorTextAnalysis = {
      exactMatch: 0,
      partialMatch: 0,
      branded: 0,
      generic: allAnchors.filter(anchor => 
        anchor.includes('click here') || anchor.includes('read more') || anchor.includes('here')
      ).length,
      recommendations: []
    }
    
    if (anchorTextAnalysis.generic > 0) {
      anchorTextAnalysis.recommendations.push('Avoid generic anchor text like "click here" or "read more"')
    }
    
    return {
      internalLinks,
      externalLinks,
      brokenLinks,
      anchorTextAnalysis
    }
  }

  /**
   * Analyze images in content
   */
  private analyzeImages(content: string): ImageAnalysis {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g
    const images: Array<{ src: string; alt: string; quality: 'good' | 'fair' | 'poor' }> = []
    
    let match
    while ((match = imageRegex.exec(content)) !== null) {
      const alt = match[1]
      const src = match[2]
      
      let quality: 'good' | 'fair' | 'poor' = 'poor'
      if (alt && alt.length > 10) {
        quality = 'good'
      } else if (alt && alt.length > 0) {
        quality = 'fair'
      }
      
      if (src) {
        images.push({ src, alt, quality })
      }
    }
    
    const totalImages = images.length
    const imagesWithAlt = images.filter(img => img.alt).length
    const imagesWithoutAlt = totalImages - imagesWithAlt
    
    const recommendations: string[] = []
    if (imagesWithoutAlt > 0) {
      recommendations.push(`${imagesWithoutAlt} image(s) missing alt text`)
    }
    
    const poorQualityAlt = images.filter(img => img.quality === 'poor').length
    if (poorQualityAlt > 0) {
      recommendations.push(`${poorQualityAlt} image(s) have poor quality alt text`)
    }
    
    return {
      totalImages,
      imagesWithAlt,
      imagesWithoutAlt,
      altTextQuality: images,
      recommendations
    }
  }

  /**
   * Analyze schema compliance
   */
  private analyzeSchemaCompliance(content: string): SchemaCompliance {
    // This is a simplified analysis
    // In production, you'd parse actual JSON-LD or microdata
    const hasStructuredData = content.includes('@context') || content.includes('itemscope')
    const schemaTypes: string[] = []
    
    if (content.includes('"@type": "Article"')) schemaTypes.push('Article')
    if (content.includes('"@type": "Person"')) schemaTypes.push('Person')
    if (content.includes('"@type": "Organization"')) schemaTypes.push('Organization')
    
    const requiredProperties = [
      { property: 'headline', present: content.includes('headline') },
      { property: 'datePublished', present: content.includes('datePublished') },
      { property: 'author', present: content.includes('author') }
    ]
    
    const recommendations: string[] = []
    if (!hasStructuredData) {
      recommendations.push('Add structured data (JSON-LD) for better search engine understanding')
    }
    
    return {
      hasStructuredData,
      schemaTypes,
      requiredProperties,
      recommendations
    }
  }

  /**
   * Analyze competitiveness
   */
  private analyzeCompetitiveness(content: string, keywords: string[]): CompetitivenessAnalysis {
    const contentLength = this.extractWords(content).length
    const competitorBenchmark = 1200 // Average competitor content length
    const uniquenessScore = Math.min(100, contentLength / 10) // Simplified calculation
    const topicCoverage = keywords.length * 10 // Simplified calculation
    const authoritySignals = content.split('http').length - 1 // Count of external references
    
    return {
      contentLength,
      competitorBenchmark,
      uniquenessScore,
      topicCoverage,
      authoritySignals
    }
  }

  /**
   * Generate optimization opportunities
   */
  private generateOptimizationOpportunities(data: {
    title: string
    description: string
    content: string
    keywords: string[]
    readability: ReadabilityAnalysis
    structure: ContentStructureAnalysis
  }): OptimizationOpportunities {
    const { title, description, content, keywords, readability, structure } = data

    // Title optimization
    const titleOptimization: TitleOptimization = {
      current: title,
      optimized: this.generateOptimizedTitles(title, keywords),
      improvements: this.analyzeTitleImprovements(title, keywords)
    }

    // Meta description optimization
    const metaDescriptionOptimization: MetaDescriptionOptimization = {
      current: description,
      optimized: this.generateOptimizedDescriptions(description, keywords, content),
      improvements: this.analyzeDescriptionImprovements(description, keywords)
    }

    // Content optimization
    const contentOptimization: ContentOptimization = {
      keywordGaps: this.identifyKeywordGaps(content, keywords),
      contentGaps: this.identifyContentGaps(content, keywords),
      structureImprovements: this.identifyStructureImprovements(structure),
      readabilityImprovements: readability.recommendations
    }

    // Technical optimization
    const technicalOptimization: TechnicalOptimization = {
      pagespeedOpportunities: ['Optimize images', 'Minify CSS/JS', 'Enable compression'],
      crawlabilityIssues: [],
      mobileFriendliness: ['Ensure responsive design', 'Optimize touch targets'],
      coreWebVitals: ['Optimize Largest Contentful Paint', 'Minimize layout shift']
    }

    return {
      titleOptimization,
      metaDescriptionOptimization,
      contentOptimization,
      technicalOptimization
    }
  }

  /**
   * Generate optimized title variations
   */
  private generateOptimizedTitles(title: string, keywords: string[]): string[] {
    const variations: string[] = []
    const primaryKeyword = keywords[0]
    
    if (primaryKeyword) {
      variations.push(`${primaryKeyword}: ${title}`)
      variations.push(`${title} - ${primaryKeyword} Guide`)
      variations.push(`Complete ${primaryKeyword} ${title}`)
    }
    
    return variations.slice(0, 3)
  }

  /**
   * Analyze title improvements
   */
  private analyzeTitleImprovements(title: string, keywords: string[]): string[] {
    const improvements: string[] = []
    
    if (title.length < 30) {
      improvements.push('Title is too short - expand to 50-60 characters')
    }
    
    if (title.length > 60) {
      improvements.push('Title is too long - keep under 60 characters')
    }
    
    const primaryKeyword = keywords[0]
    if (primaryKeyword && !title.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      improvements.push(`Include primary keyword "${primaryKeyword}" in title`)
    }
    
    return improvements
  }

  /**
   * Generate optimized meta descriptions
   */
  private generateOptimizedDescriptions(_description: string, keywords: string[], content: string): string[] {
    const variations: string[] = []
    const primaryKeyword = keywords[0]
    const firstSentence = content.split('.')[0]
    
    if (primaryKeyword && firstSentence) {
      variations.push(`${primaryKeyword}: ${firstSentence.slice(0, 120)}...`)
      variations.push(`Learn about ${primaryKeyword}. ${firstSentence.slice(0, 100)}...`)
      variations.push(`Discover ${primaryKeyword} insights and strategies. ${firstSentence.slice(0, 80)}...`)
    }
    
    return variations.slice(0, 3)
  }

  /**
   * Analyze description improvements
   */
  private analyzeDescriptionImprovements(description: string, keywords: string[]): string[] {
    const improvements: string[] = []
    
    if (description.length < 120) {
      improvements.push('Meta description is too short - expand to 150-160 characters')
    }
    
    if (description.length > 160) {
      improvements.push('Meta description is too long - keep under 160 characters')
    }
    
    const primaryKeyword = keywords[0]
    if (primaryKeyword && !description.toLowerCase().includes(primaryKeyword.toLowerCase())) {
      improvements.push(`Include primary keyword "${primaryKeyword}" in description`)
    }
    
    return improvements
  }

  /**
   * Identify keyword gaps
   */
  private identifyKeywordGaps(content: string, keywords: string[]): string[] {
    const contentLower = content.toLowerCase()
    return keywords.filter(keyword => !contentLower.includes(keyword.toLowerCase()))
  }

  /**
   * Identify content gaps
   */
  private identifyContentGaps(content: string, _keywords: string[]): string[] {
    const gaps: string[] = []
    
    // This would typically involve competitor analysis
    // For now, suggest common content types
    if (!content.includes('example')) {
      gaps.push('Add practical examples')
    }
    
    if (!content.includes('benefit')) {
      gaps.push('Highlight key benefits')
    }
    
    if (content.length < 1000) {
      gaps.push('Expand content depth and coverage')
    }
    
    return gaps
  }

  /**
   * Identify structure improvements
   */
  private identifyStructureImprovements(structure: ContentStructureAnalysis): string[] {
    const improvements: string[] = []
    
    if (structure.headingStructure.h1Count === 0) {
      improvements.push('Add H1 heading')
    }
    
    if (structure.headingStructure.h2Count === 0) {
      improvements.push('Add H2 subheadings for better structure')
    }
    
    if (structure.listUsage.totalListItems === 0) {
      improvements.push('Add bullet points or numbered lists')
    }
    
    if (structure.linkAnalysis.internalLinks.length === 0) {
      improvements.push('Add internal links to related content')
    }
    
    return improvements
  }

  /**
   * Calculate comprehensive SEO score
   */
  private calculateComprehensiveSEOScore(data: {
    title: string
    description: string
    content: string
    keywords: string[]
    readability: ReadabilityAnalysis
    structure: ContentStructureAnalysis
    keywordAnalysis: KeywordAnalysis
  }): SEOScore {
    const { title, description, content, keywords, readability, structure, keywordAnalysis } = data

    // Title score (25%)
    let titleScore = 100
    if (title.length === 0) titleScore = 0 // Empty title gets 0
    else if (title.length < 30 || title.length > 60) titleScore -= 30
    if (keywords[0] && title && !title.toLowerCase().includes(keywords[0].toLowerCase())) titleScore -= 20

    // Description score (20%)
    let descriptionScore = 100
    if (description.length === 0) descriptionScore = 0 // Empty description gets 0
    else if (description.length < 120 || description.length > 160) descriptionScore -= 30
    if (keywords[0] && description && !description.toLowerCase().includes(keywords[0].toLowerCase())) descriptionScore -= 20

    // Keywords score (25%)
    let keywordsScore = 100
    if (keywordAnalysis.missingKeywords.length > 0) keywordsScore -= 20
    if (keywordAnalysis.overOptimizedKeywords.length > 0) keywordsScore -= 30

    // Content score (30%)
    let contentScore = 100
    const wordCount = this.extractWords(content).length
    if (wordCount === 0) contentScore = 0 // Empty content gets 0
    else if (wordCount < 300) contentScore -= 40
    if (structure.headingStructure.h1Count === 0) contentScore -= 20
    if (structure.headingStructure.h2Count === 0) contentScore -= 15
    if (readability.fleschReadingEase < 50) contentScore -= 15

    const overall = Math.round((titleScore * 0.25 + descriptionScore * 0.20 + keywordsScore * 0.25 + contentScore * 0.30))

    return {
      title: Math.max(0, titleScore),
      description: Math.max(0, descriptionScore),
      keywords: Math.max(0, keywordsScore),
      content: Math.max(0, contentScore),
      overall: Math.max(0, overall)
    }
  }

  /**
   * Generate actionable suggestions
   */
  private generateActionableSuggestions(data: {
    seoScore: SEOScore
    readability: ReadabilityAnalysis
    keywords: KeywordAnalysis
    structure: ContentStructureAnalysis
    optimization: OptimizationOpportunities
  }): SEOSuggestion[] {
    const suggestions: SEOSuggestion[] = []

    // Title suggestions
    if (data.seoScore.title < 80) {
      suggestions.push({
        type: 'title',
        message: 'Optimize title length and include primary keyword',
        priority: 'high'
      })
    }

    // Description suggestions
    if (data.seoScore.description < 80) {
      suggestions.push({
        type: 'description',
        message: 'Improve meta description length and keyword inclusion',
        priority: 'high'
      })
    }

    // Keyword suggestions
    if (data.keywords.missingKeywords.length > 0) {
      suggestions.push({
        type: 'keywords',
        message: `Include missing keywords: ${data.keywords.missingKeywords.slice(0, 3).join(', ')}`,
        priority: 'medium'
      })
    }

    // Content suggestions
    if (data.seoScore.content < 70) {
      suggestions.push({
        type: 'content',
        message: 'Improve content structure with headings and expand word count',
        priority: 'high'
      })
    }

    // Readability suggestions
    if (data.readability.fleschReadingEase < 50) {
      suggestions.push({
        type: 'content',
        message: 'Improve readability by using shorter sentences and simpler words',
        priority: 'medium'
      })
    }

    return suggestions
  }
}

export const contentAnalyzer = new ContentAnalyzer()