interface KeywordRanking {
  keyword: string
  position: number
  change: number
  volume: number
  difficulty: number
  url?: string
  lastUpdated: string
}

interface SEOConfig {
  apiKey?: string
  baseUrl?: string
  rateLimitMs: number
}

class KeywordTracker {
  private config: SEOConfig
  private cache = new Map<string, { data: KeywordRanking; timestamp: number }>()
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

  constructor(config: SEOConfig) {
    this.config = config
  }

  private getCachedRanking(keyword: string): KeywordRanking | null {
    const cached = this.cache.get(keyword)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data
    }
    return null
  }

  private setCachedRanking(keyword: string, ranking: KeywordRanking): void {
    this.cache.set(keyword, { data: ranking, timestamp: Date.now() })
  }

  private async fetchKeywordData(keyword: string): Promise<KeywordRanking> {
    // Check cache first
    const cached = this.getCachedRanking(keyword)
    if (cached) return cached

    // In production, this would integrate with SEO APIs like:
    // - Ahrefs API
    // - SEMrush API
    // - Moz API
    // - Google Search Console API
    // - Custom web scraping service
    
    if (this.config.apiKey && this.config.baseUrl) {
      try {
        // Example implementation for a real SEO service
        const response = await fetch(`${this.config.baseUrl}/keywords/${encodeURIComponent(keyword)}`, {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`SEO API error: ${response.status}`)
        }

        const data = await response.json()
        const ranking: KeywordRanking = {
          keyword,
          position: data.position || 0,
          change: data.change || 0,
          volume: data.volume || 0,
          difficulty: data.difficulty || 0,
          url: data.url,
          lastUpdated: new Date().toISOString(),
        }

        this.setCachedRanking(keyword, ranking)
        return ranking
      } catch (error) {
        console.warn(`Failed to fetch SEO data for "${keyword}":`, error)
      }
    }

    // Fallback to realistic mock data for development/demo
    const mockRanking: KeywordRanking = {
      keyword,
      position: this.generateRealisticPosition(keyword),
      change: Math.floor(Math.random() * 21) - 10, // -10 to +10
      volume: this.generateRealisticVolume(keyword),
      difficulty: this.generateRealisticDifficulty(keyword),
      lastUpdated: new Date().toISOString(),
    }

    this.setCachedRanking(keyword, mockRanking)
    return mockRanking
  }

  private generateRealisticPosition(keyword: string): number {
    // Generate more realistic positions based on keyword characteristics
    const keywordLength = keyword.length
    const hasNumbers = /\d/.test(keyword)
    const isLongTail = keyword.split(' ').length > 3

    let basePosition = 50

    // Shorter, branded keywords tend to rank better
    if (keywordLength < 20) basePosition -= 20
    if (hasNumbers) basePosition -= 10
    if (isLongTail) basePosition -= 15

    // Add some randomness
    const randomFactor = Math.floor(Math.random() * 40) - 20
    return Math.max(1, Math.min(100, basePosition + randomFactor))
  }

  private generateRealisticVolume(keyword: string): number {
    // Generate volume based on keyword characteristics
    const wordCount = keyword.split(' ').length
    const isGeneric = ['the', 'and', 'for', 'with'].some(word => keyword.includes(word))
    
    let baseVolume = 1000

    if (wordCount === 1) baseVolume *= 5 // Single words have higher volume
    if (wordCount > 4) baseVolume *= 0.3 // Long-tail has lower volume
    if (isGeneric) baseVolume *= 2

    return Math.floor(baseVolume * (0.5 + Math.random()))
  }

  private generateRealisticDifficulty(keyword: string): number {
    // Generate difficulty based on keyword characteristics
    const wordCount = keyword.split(' ').length
    const isCommercial = ['buy', 'price', 'cost', 'best', 'review'].some(word => keyword.includes(word))
    
    let baseDifficulty = 50

    if (wordCount === 1) baseDifficulty += 20 // Shorter keywords are harder
    if (wordCount > 4) baseDifficulty -= 15 // Long-tail is easier
    if (isCommercial) baseDifficulty += 15 // Commercial intent is harder

    return Math.max(1, Math.min(100, baseDifficulty + Math.floor(Math.random() * 20) - 10))
  }

  async trackKeywords(keywords: string[]): Promise<KeywordRanking[]> {
    const results: KeywordRanking[] = []
    
    for (const keyword of keywords) {
      try {
        const ranking = await this.fetchKeywordData(keyword)
        results.push(ranking)
        
        // Rate limiting
        if (this.config.rateLimitMs > 0) {
          await new Promise(resolve => setTimeout(resolve, this.config.rateLimitMs))
        }
      } catch (error) {
        console.error(`Failed to track keyword "${keyword}":`, error)
        // Add fallback entry
        results.push({
          keyword,
          position: 0,
          change: 0,
          volume: 0,
          difficulty: 0,
          lastUpdated: new Date().toISOString(),
        })
      }
    }

    return results
  }
}

// Create singleton instance with configuration
const keywordTracker = new KeywordTracker({
  apiKey: process.env.SEO_API_KEY,
  baseUrl: process.env.SEO_API_BASE_URL,
  rateLimitMs: 1000, // 1 second between requests
})

export async function trackKeywords(keywords: string[]): Promise<KeywordRanking[]> {
  return keywordTracker.trackKeywords(keywords)
}

export type { KeywordRanking }
