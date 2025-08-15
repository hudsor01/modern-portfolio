import { describe, it, expect, beforeEach } from 'vitest'
import { ContentAnalyzer } from '../content-analyzer'

describe('ContentAnalyzer', () => {
  let analyzer: ContentAnalyzer
  
  const sampleContent = {
    title: 'Revenue Operations Best Practices: A Complete Guide',
    description: 'Discover proven strategies for optimizing revenue operations, from data analytics to process automation. Learn how to align sales, marketing, and customer success teams.',
    content: `# Revenue Operations Best Practices: A Complete Guide

Revenue operations (RevOps) has become a critical function for modern businesses looking to optimize their sales, marketing, and customer success efforts.

## What is Revenue Operations?

Revenue Operations is the strategic approach to aligning sales, marketing, and customer success operations across the entire customer lifecycle. It focuses on process optimization, technology implementation, and data-driven decision making.

### Key Components of Effective RevOps

Revenue operations encompasses several key areas:

- Data management and analytics
- Process optimization and automation
- Technology stack integration
- Cross-functional team alignment

## Implementation Strategies

Here are the most effective strategies for implementing RevOps:

1. Start with a solid data foundation
2. Focus on process before technology
3. Measure and iterate continuously
4. Invest in team training and development

### Common Challenges

Many organizations face similar challenges when implementing revenue operations:

**Data silos**: Information scattered across different systems makes it difficult to get a unified view of the customer journey.

**Process misalignment**: When teams work in isolation, processes become disconnected and inefficient.

**Technology complexity**: Too many tools without proper integration create more problems than they solve.

## Best Practices for Success

To achieve success with revenue operations, consider these best practices:

- Establish clear KPIs and success metrics
- Create cross-functional workflows
- Implement regular performance reviews
- Focus on continuous improvement

Revenue operations is not just about technology—it's about creating a culture of data-driven decision making and cross-functional collaboration.

![Revenue Operations Dashboard](/images/revops-dashboard.jpg)

The benefits of effective revenue operations include improved efficiency, better customer experience, and increased revenue growth.

For more information about implementing revenue operations in your organization, [contact our team](/contact) or [read our case studies](/case-studies).`,
    keywords: ['revenue operations', 'revops', 'data analytics', 'process automation', 'sales optimization']
  }

  beforeEach(() => {
    analyzer = new ContentAnalyzer()
  })

  describe('Content Analysis', () => {
    it('performs comprehensive content analysis', () => {
      const analysis = analyzer.analyzeContent(sampleContent)

      expect(analysis).toHaveProperty('seoScore')
      expect(analysis).toHaveProperty('readabilityScore')
      expect(analysis).toHaveProperty('keywordAnalysis')
      expect(analysis).toHaveProperty('structureAnalysis')
      expect(analysis).toHaveProperty('suggestions')
      expect(analysis).toHaveProperty('competitiveness')
      expect(analysis).toHaveProperty('optimization')
    })

    it('returns SEO score with all components', () => {
      const analysis = analyzer.analyzeContent(sampleContent)

      expect(analysis.seoScore).toHaveProperty('title')
      expect(analysis.seoScore).toHaveProperty('description')
      expect(analysis.seoScore).toHaveProperty('keywords')
      expect(analysis.seoScore).toHaveProperty('content')
      expect(analysis.seoScore).toHaveProperty('overall')

      // Scores should be numbers between 0 and 100
      expect(analysis.seoScore.title).toBeGreaterThanOrEqual(0)
      expect(analysis.seoScore.title).toBeLessThanOrEqual(100)
      expect(analysis.seoScore.overall).toBeGreaterThanOrEqual(0)
      expect(analysis.seoScore.overall).toBeLessThanOrEqual(100)
    })

    it('provides actionable suggestions', () => {
      const analysis = analyzer.analyzeContent(sampleContent)

      expect(analysis.suggestions).toBeInstanceOf(Array)
      analysis.suggestions.forEach(suggestion => {
        expect(suggestion).toHaveProperty('type')
        expect(suggestion).toHaveProperty('message')
        expect(suggestion).toHaveProperty('priority')
        expect(['high', 'medium', 'low']).toContain(suggestion.priority)
      })
    })
  })

  describe('Readability Analysis', () => {
    it('calculates readability metrics correctly', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const readability = analysis.readabilityScore

      expect(readability).toHaveProperty('fleschKincaidScore')
      expect(readability).toHaveProperty('fleschReadingEase')
      expect(readability).toHaveProperty('averageSentenceLength')
      expect(readability).toHaveProperty('averageSyllablesPerWord')
      expect(readability).toHaveProperty('passiveVoicePercentage')
      expect(readability).toHaveProperty('complexWords')
      expect(readability).toHaveProperty('grade')
      expect(readability).toHaveProperty('recommendations')

      // Values should be reasonable
      expect(readability.fleschKincaidScore).toBeGreaterThan(0)
      expect(readability.fleschReadingEase).toBeGreaterThan(0)
      expect(readability.averageSentenceLength).toBeGreaterThan(5)
      expect(readability.averageSyllablesPerWord).toBeGreaterThan(1)
      expect(readability.passiveVoicePercentage).toBeGreaterThanOrEqual(0)
    })

    it('determines correct reading grade', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const grade = analysis.readabilityScore.grade

      expect(['Elementary', 'Middle School', 'High School', 'College', 'Graduate']).toContain(grade)
    })

    it('provides readability recommendations for difficult content', () => {
      const difficultContent = {
        ...sampleContent,
        content: 'The implementation of sophisticated revenue optimization methodologies necessitates comprehensive analytical frameworks that facilitate synergistic cross-functional collaborative paradigms through technologically-enhanced process automation mechanisms.'
      }

      const analysis = analyzer.analyzeContent(difficultContent)
      expect(analysis.readabilityScore.recommendations.length).toBeGreaterThan(0)
    })

    it('handles very simple content', () => {
      const simpleContent = {
        ...sampleContent,
        content: 'This is simple. Easy to read. Short sentences work well. People like them.'
      }

      const analysis = analyzer.analyzeContent(simpleContent)
      expect(analysis.readabilityScore.fleschReadingEase).toBeGreaterThan(80)
      expect(analysis.readabilityScore.grade).toBe('Elementary')
    })
  })

  describe('Keyword Analysis', () => {
    it('analyzes primary and secondary keywords', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const keywords = analysis.keywordAnalysis

      expect(keywords).toHaveProperty('primaryKeywords')
      expect(keywords).toHaveProperty('secondaryKeywords')
      expect(keywords).toHaveProperty('keywordDensity')
      expect(keywords).toHaveProperty('keywordDistribution')

      keywords.primaryKeywords.forEach(keyword => {
        expect(keyword).toHaveProperty('keyword')
        expect(keyword).toHaveProperty('frequency')
        expect(keyword).toHaveProperty('density')
        expect(keyword).toHaveProperty('prominence')
        expect(keyword).toHaveProperty('locations')
        expect(keyword).toHaveProperty('tfidfScore')
      })
    })

    it('calculates keyword density correctly', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const keywordDensity = analysis.keywordAnalysis.keywordDensity

      // Should have density for target keywords
      expect(keywordDensity).toHaveProperty('revenue operations')
      expect(keywordDensity['revenue operations']).toBeGreaterThan(0)

      // Densities should be reasonable percentages
      Object.values(keywordDensity).forEach(density => {
        expect(density).toBeGreaterThanOrEqual(0)
        expect(density).toBeLessThan(50) // No keyword should be more than 50% of content
      })
    })

    it('identifies keyword locations correctly', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const primaryKeyword = analysis.keywordAnalysis.primaryKeywords[0]

      if (primaryKeyword) {
        expect(primaryKeyword.locations).toBeInstanceOf(Array)
        primaryKeyword.locations.forEach(location => {
          expect(['title', 'heading', 'first-paragraph', 'content', 'conclusion']).toContain(location.type)
          expect(location).toHaveProperty('position')
          expect(location).toHaveProperty('context')
        })
      }
    })

    it('identifies missing keywords', () => {
      const contentWithoutKeywords = {
        ...sampleContent,
        content: 'This is a generic article about business processes and workflows.',
        keywords: ['revenue operations', 'data analytics', 'automation']
      }

      const analysis = analyzer.analyzeContent(contentWithoutKeywords)
      expect(analysis.keywordAnalysis.missingKeywords.length).toBeGreaterThan(0)
      expect(analysis.keywordAnalysis.missingKeywords).toContain('revenue operations')
    })

    it('identifies over-optimized keywords', () => {
      const overOptimizedContent = {
        ...sampleContent,
        content: Array(100).fill('revenue operations').join(' '),
        keywords: ['revenue operations']
      }

      const analysis = analyzer.analyzeContent(overOptimizedContent)
      expect(analysis.keywordAnalysis.overOptimizedKeywords).toContain('revenue operations')
    })

    it('extracts semantic keywords', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      expect(analysis.keywordAnalysis.semanticKeywords).toBeInstanceOf(Array)
      expect(analysis.keywordAnalysis.semanticKeywords.length).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Content Structure Analysis', () => {
    it('analyzes heading structure correctly', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const headings = analysis.structureAnalysis.headingStructure

      expect(headings).toHaveProperty('h1Count')
      expect(headings).toHaveProperty('h2Count')
      expect(headings).toHaveProperty('h3Count')
      expect(headings).toHaveProperty('hierarchy')
      expect(headings).toHaveProperty('issues')

      expect(headings.h1Count).toBe(1) // Sample content has one H1
      expect(headings.h2Count).toBeGreaterThan(0) // Sample content has H2s
      expect(headings.hierarchy).toBeInstanceOf(Array)
    })

    it('identifies heading structure issues', () => {
      const contentWithoutH1 = {
        ...sampleContent,
        content: '## This has no H1\n\nSome content here.'
      }

      const analysis = analyzer.analyzeContent(contentWithoutH1)
      expect(analysis.structureAnalysis.headingStructure.issues).toContain('Missing H1 heading')
    })

    it('analyzes paragraph structure', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const paragraphs = analysis.structureAnalysis.paragraphAnalysis

      expect(paragraphs).toHaveProperty('totalParagraphs')
      expect(paragraphs).toHaveProperty('averageParagraphLength')
      expect(paragraphs).toHaveProperty('shortParagraphs')
      expect(paragraphs).toHaveProperty('longParagraphs')
      expect(paragraphs).toHaveProperty('recommendations')

      expect(paragraphs.totalParagraphs).toBeGreaterThan(0)
      expect(paragraphs.averageParagraphLength).toBeGreaterThan(0)
    })

    it('analyzes list usage', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const lists = analysis.structureAnalysis.listUsage

      expect(lists).toHaveProperty('bulletLists')
      expect(lists).toHaveProperty('numberedLists')
      expect(lists).toHaveProperty('totalListItems')
      expect(lists).toHaveProperty('recommendations')

      // Sample content has both bullet and numbered lists
      expect(lists.totalListItems).toBeGreaterThan(0)
    })

    it('analyzes links in content', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const links = analysis.structureAnalysis.linkAnalysis

      expect(links).toHaveProperty('internalLinks')
      expect(links).toHaveProperty('externalLinks')
      expect(links).toHaveProperty('brokenLinks')
      expect(links).toHaveProperty('anchorTextAnalysis')

      // Sample content has internal links
      expect(links.internalLinks.length).toBeGreaterThan(0)
      
      links.internalLinks.forEach(link => {
        expect(link).toHaveProperty('url')
        expect(link).toHaveProperty('anchor')
        expect(link).toHaveProperty('context')
      })
    })

    it('analyzes images in content', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const images = analysis.structureAnalysis.imageAnalysis

      expect(images).toHaveProperty('totalImages')
      expect(images).toHaveProperty('imagesWithAlt')
      expect(images).toHaveProperty('imagesWithoutAlt')
      expect(images).toHaveProperty('altTextQuality')
      expect(images).toHaveProperty('recommendations')

      // Sample content has one image
      expect(images.totalImages).toBe(1)
      expect(images.imagesWithAlt).toBe(0) // Image has no alt text
      expect(images.imagesWithoutAlt).toBe(1)
    })

    it('provides recommendations for missing alt text', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const images = analysis.structureAnalysis.imageAnalysis

      expect(images.recommendations).toContain('1 image(s) missing alt text')
    })

    it('analyzes schema compliance', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const schema = analysis.structureAnalysis.schemaCompliance

      expect(schema).toHaveProperty('hasStructuredData')
      expect(schema).toHaveProperty('schemaTypes')
      expect(schema).toHaveProperty('requiredProperties')
      expect(schema).toHaveProperty('recommendations')

      // Sample content has no structured data
      expect(schema.hasStructuredData).toBe(false)
      expect(schema.recommendations).toContain('Add structured data (JSON-LD) for better search engine understanding')
    })
  })

  describe('Competitiveness Analysis', () => {
    it('analyzes content competitiveness', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const competitiveness = analysis.competitiveness

      expect(competitiveness).toHaveProperty('contentLength')
      expect(competitiveness).toHaveProperty('competitorBenchmark')
      expect(competitiveness).toHaveProperty('uniquenessScore')
      expect(competitiveness).toHaveProperty('topicCoverage')
      expect(competitiveness).toHaveProperty('authoritySignals')

      expect(competitiveness.contentLength).toBeGreaterThan(0)
      expect(competitiveness.uniquenessScore).toBeGreaterThanOrEqual(0)
      expect(competitiveness.topicCoverage).toBeGreaterThanOrEqual(0)
    })
  })

  describe('Optimization Opportunities', () => {
    it('generates optimization opportunities', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const optimization = analysis.optimization

      expect(optimization).toHaveProperty('titleOptimization')
      expect(optimization).toHaveProperty('metaDescriptionOptimization')
      expect(optimization).toHaveProperty('contentOptimization')
      expect(optimization).toHaveProperty('technicalOptimization')
    })

    it('provides title optimization suggestions', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const titleOpt = analysis.optimization.titleOptimization

      expect(titleOpt).toHaveProperty('current')
      expect(titleOpt).toHaveProperty('optimized')
      expect(titleOpt).toHaveProperty('improvements')

      expect(titleOpt.current).toBe(sampleContent.title)
      expect(titleOpt.optimized).toBeInstanceOf(Array)
      expect(titleOpt.improvements).toBeInstanceOf(Array)
    })

    it('provides meta description optimization', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const descOpt = analysis.optimization.metaDescriptionOptimization

      expect(descOpt).toHaveProperty('current')
      expect(descOpt).toHaveProperty('optimized')
      expect(descOpt).toHaveProperty('improvements')

      expect(descOpt.current).toBe(sampleContent.description)
      expect(descOpt.optimized).toBeInstanceOf(Array)
      expect(descOpt.improvements).toBeInstanceOf(Array)
    })

    it('identifies content optimization opportunities', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const contentOpt = analysis.optimization.contentOptimization

      expect(contentOpt).toHaveProperty('keywordGaps')
      expect(contentOpt).toHaveProperty('contentGaps')
      expect(contentOpt).toHaveProperty('structureImprovements')
      expect(contentOpt).toHaveProperty('readabilityImprovements')

      expect(contentOpt.keywordGaps).toBeInstanceOf(Array)
      expect(contentOpt.contentGaps).toBeInstanceOf(Array)
      expect(contentOpt.structureImprovements).toBeInstanceOf(Array)
      expect(contentOpt.readabilityImprovements).toBeInstanceOf(Array)
    })

    it('provides technical optimization suggestions', () => {
      const analysis = analyzer.analyzeContent(sampleContent)
      const techOpt = analysis.optimization.technicalOptimization

      expect(techOpt).toHaveProperty('pagespeedOpportunities')
      expect(techOpt).toHaveProperty('crawlabilityIssues')
      expect(techOpt).toHaveProperty('mobileFriendliness')
      expect(techOpt).toHaveProperty('coreWebVitals')

      expect(techOpt.pagespeedOpportunities).toBeInstanceOf(Array)
      expect(techOpt.crawlabilityIssues).toBeInstanceOf(Array)
      expect(techOpt.mobileFriendliness).toBeInstanceOf(Array)
      expect(techOpt.coreWebVitals).toBeInstanceOf(Array)
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('handles empty content gracefully', () => {
      const emptyContent = {
        title: '',
        description: '',
        content: '',
        keywords: []
      }

      const analysis = analyzer.analyzeContent(emptyContent)
      expect(analysis).toBeDefined()
      expect(analysis.seoScore.overall).toBeLessThan(50) // Should have low score
    })

    it('handles content with no keywords', () => {
      const contentWithoutKeywords = {
        ...sampleContent,
        keywords: []
      }

      const analysis = analyzer.analyzeContent(contentWithoutKeywords)
      expect(analysis).toBeDefined()
      expect(analysis.keywordAnalysis.primaryKeywords).toEqual([])
      expect(analysis.keywordAnalysis.secondaryKeywords).toEqual([])
    })

    it('handles very short content', () => {
      const shortContent = {
        title: 'Short Title',
        description: 'Short description',
        content: 'Very short content.',
        keywords: ['short']
      }

      const analysis = analyzer.analyzeContent(shortContent)
      expect(analysis).toBeDefined()
      expect(analysis.seoScore.content).toBeLessThan(70) // Should penalize short content
    })

    it('handles very long titles and descriptions', () => {
      const longMetaContent = {
        ...sampleContent,
        title: 'A'.repeat(100),
        description: 'B'.repeat(200)
      }

      const analysis = analyzer.analyzeContent(longMetaContent)
      expect(analysis.optimization.titleOptimization.improvements).toContain('Title is too long - keep under 60 characters')
      expect(analysis.optimization.metaDescriptionOptimization.improvements).toContain('Meta description is too long - keep under 160 characters')
    })

    it('handles content with special characters and formatting', () => {
      const formattedContent = {
        title: 'Title with "quotes" & symbols!',
        description: 'Description with émojis 🚀 and spéciâl chäracters',
        content: `# Héading with Spëcial Characters

Content with **bold**, *italic*, and \`code\` formatting.

- List ítem with special chars
- Another item with numbers: 123,456.78

> Blockquote with "quotes" and 'apostrophes'

| Table | Header |
|-------|--------|
| Data  | Value  |`,
        keywords: ['special', 'characters', 'formatting']
      }

      const analysis = analyzer.analyzeContent(formattedContent)
      expect(analysis).toBeDefined()
      expect(analysis.readabilityScore).toBeDefined()
      expect(analysis.keywordAnalysis).toBeDefined()
    })

    it('handles content with no headings', () => {
      const noHeadingsContent = {
        ...sampleContent,
        content: 'This is content with no headings. Just plain paragraphs of text. No structure at all.'
      }

      const analysis = analyzer.analyzeContent(noHeadingsContent)
      expect(analysis.structureAnalysis.headingStructure.issues).toContain('Missing H1 heading')
      expect(analysis.optimization.contentOptimization.structureImprovements).toContain('Add H1 heading')
    })

    it('calculates scores consistently', () => {
      const analysis1 = analyzer.analyzeContent(sampleContent)
      const analysis2 = analyzer.analyzeContent(sampleContent)

      expect(analysis1.seoScore.overall).toBe(analysis2.seoScore.overall)
      expect(analysis1.readabilityScore.fleschReadingEase).toBe(analysis2.readabilityScore.fleschReadingEase)
    })
  })
})