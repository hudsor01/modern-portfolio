'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { m as motion, AnimatePresence } from 'framer-motion'
import { Search, X, Filter, Clock, TrendingUp, User, Hash } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { BlogPostSummary, BlogCategory, BlogTag, BlogAuthor, BlogFilters } from '@/types/blog'
import { createContextLogger } from '@/lib/monitoring/logger'

import { TIMING_CONSTANTS } from '@/lib/constants/ui-thresholds'
const logger = createContextLogger('BlogSearch')

interface SearchResult {
  type: 'post' | 'category' | 'tag' | 'author'
  item: BlogPostSummary | BlogCategory | BlogTag | BlogAuthor
  relevance: number
  matchedFields: string[]
}

interface BlogSearchProps {
  onSearch: (query: string) => void
  onFiltersChange?: (filters: BlogFilters) => void
  suggestions?: string[]
  recentSearches?: string[]
  popularSearches?: string[]
  placeholder?: string
  showFilters?: boolean
  showSuggestions?: boolean
  showResults?: boolean
  isLoading?: boolean
  results?: SearchResult[]
  totalResults?: number
  className?: string
  variant?: 'default' | 'compact' | 'expanded'
}

export function BlogSearch({
  onSearch,
  onFiltersChange: _onFiltersChange,
  suggestions: _suggestions = [],
  recentSearches = [],
  popularSearches = [],
  placeholder = 'Search posts, categories, tags...',
  showFilters = false,
  showSuggestions = true,
  showResults = true,
  isLoading = false,
  results = [],
  totalResults = 0,
  className,
  variant = 'default'
}: BlogSearchProps) {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchHistory, setSearchHistory] = useState<string[]>(recentSearches)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced search
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      onSearch(searchQuery)
      if (searchQuery.trim() && !searchHistory.includes(searchQuery.trim())) {
        setSearchHistory(prev => [searchQuery.trim(), ...prev.slice(0, 4)])
      }
    }, TIMING_CONSTANTS.SEARCH_DEBOUNCE)
  }, [onSearch, searchHistory])

  useEffect(() => {
    if (query.length > 2) {
      debouncedSearch(query)
    }
  }, [query, debouncedSearch])

  const handleInputChange = (value: string) => {
    setQuery(value)
    if (value.length > 0) {
      setIsExpanded(true)
    }
  }

  const handleClearSearch = () => {
    setQuery('')
    setIsExpanded(false)
    onSearch('')
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    onSearch(suggestion)
    setIsExpanded(false)
  }


  const formatResult = (result: SearchResult) => {
    switch (result.type) {
      case 'post':
        const post = result.item as BlogPostSummary
        return {
          title: post.title,
          subtitle: post.excerpt || '',
          icon: Clock,
          href: `/blog/${post.slug}`,
          meta: `${post.viewCount} views • ${post.readingTime || 5} min read`
        }
      case 'category':
        const category = result.item as BlogCategory
        return {
          title: category.name,
          subtitle: category.description || '',
          icon: Hash,
          href: `/blog/category/${category.slug}`,
          meta: `${category.postCount} posts`
        }
      case 'tag':
        const tag = result.item as BlogTag
        return {
          title: tag.name,
          subtitle: tag.description || '',
          icon: Hash,
          href: `/blog/tag/${tag.slug}`,
          meta: `${tag.postCount} posts`
        }
      case 'author':
        const author = result.item as BlogAuthor
        return {
          title: author.name,
          subtitle: author.bio || '',
          icon: User,
          href: `/blog/author/${author.slug}`,
          meta: `${author.totalPosts} posts`
        }
      default:
        return {
          title: '',
          subtitle: '',
          icon: Search,
          href: '',
          meta: ''
        }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2, staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  if (variant === 'compact') {
    return (
      <div className={cn('relative', className)}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="pl-10 pr-10 bg-white/50 backdrop-blur-sm border-border focus:border-primary"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={cn('relative w-full max-w-2xl', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className={cn(
            'pl-12 pr-12 h-12 bg-white/10 backdrop-blur-sm border border-white/20',
            'focus:border-primary focus:bg-white/20 transition-all duration-300',
            'rounded-2xl text-lg',
            variant === 'expanded' && 'bg-white dark:bg-card border-border dark:border-border'
          )}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          )}
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="p-2 h-8 w-8 hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          {showFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="p-2 h-8 w-8 hover:bg-white/10"
            >
              <Filter className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Dropdown */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={cn(
              'absolute top-full left-0 right-0 mt-2 z-50',
              'bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl',
              'shadow-xl overflow-hidden',
              variant === 'expanded' && 'bg-white dark:bg-card border-border dark:border-border'
            )}
          >
            <Card className="border-0 bg-transparent">
              <CardContent className="p-0">
                {/* Quick Suggestions */}
                {showSuggestions && query.length === 0 && (
                  <div className="p-4">
                    {searchHistory.length > 0 && (
                      <motion.div variants={itemVariants} className="mb-4">
                        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground dark:text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Recent Searches
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {searchHistory.slice(0, 3).map((search, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20/20"
                              onClick={() => handleSuggestionClick(search)}
                            >
                              {search}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {popularSearches.length > 0 && (
                      <motion.div variants={itemVariants}>
                        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground dark:text-muted-foreground">
                          <TrendingUp className="h-4 w-4" />
                          Popular Searches
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.slice(0, 5).map((search, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-primary/10 dark:hover:bg-primary/20/20"
                              onClick={() => handleSuggestionClick(search)}
                            >
                              {search}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Search Results */}
                {showResults && query.length > 2 && (
                  <div className="max-h-96 overflow-y-auto">
                    {results.length === 0 && !isLoading && (
                      <motion.div
                        variants={itemVariants}
                        className="p-6 text-center text-muted-foreground"
                      >
                        <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p>No results found for "{query}"</p>
                        <p className="text-sm mt-1">Try different keywords or browse categories</p>
                      </motion.div>
                    )}

                    {results.length > 0 && (
                      <>
                        <div className="p-3 bg-white/5 backdrop-blur border-b border-white/10">
                          <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                            {totalResults} results found
                          </span>
                        </div>
                        
                        {results.slice(0, 8).map((result, index) => {
                          const formatted = formatResult(result)
                          const Icon = formatted.icon
                          
                          return (
                            <motion.a
                              key={`${result.type}-${index}`}
                              variants={itemVariants}
                              href={formatted.href}
                              className="block p-4 hover:bg-white/10 dark:hover:bg-muted/20 transition-colors border-b border-white/5 last:border-0"
                              onClick={() => setIsExpanded(false)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  <Icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-foreground dark:text-white line-clamp-1">
                                    {formatted.title}
                                  </div>
                                  {formatted.subtitle && (
                                    <div className="text-sm text-muted-foreground dark:text-muted-foreground line-clamp-2 mt-1">
                                      {formatted.subtitle}
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs capitalize"
                                    >
                                      {result.type}
                                    </Badge>
                                    {formatted.meta && (
                                      <span className="text-xs text-muted-foreground">
                                        {formatted.meta}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </motion.a>
                          )
                        })}
                        
                        {results.length > 8 && (
                          <div className="p-3 text-center border-t border-white/10">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                onSearch(query)
                                setIsExpanded(false)
                              }}
                              className="text-primary hover:text-primary"
                            >
                              View all {totalResults} results
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside handler */}
      {isExpanded && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  )
}

// Search suggestions hook for server-side search
export function useSearchSuggestions(query: string, delay: number = 300) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        // Replace with actual API call
        const response = await fetch(`/api/blog/search/suggestions?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      } catch (error) {
        logger.error('Failed to fetch suggestions', error instanceof Error ? error : new Error(String(error)))
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, delay)

    return () => clearTimeout(timeoutId)
  }, [query, delay])

  return { suggestions, isLoading }
}