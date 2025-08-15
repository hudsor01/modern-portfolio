/**
 * Blog State Atoms
 * Atomic state management for blog functionality and filtering
 */

import { atom } from 'jotai'
import { atomWithURL, atomWithPersistence, atomWithDebounce, createId } from './utils'
import type {
  BlogState,
  BlogFilters,
  BlogSortField,
  BlogSearchState,
  BlogSearchResult,
  SearchFacets,
  FacetCount,
  BlogPaginationState
} from './types'

// =======================
// CORE BLOG STATE ATOMS
// =======================

/**
 * Core blog state management
 */
export const blogStateAtom = atom<BlogState>({
  filters: {
    categories: [],
    tags: [],
    authors: [],
    dateRange: undefined,
    status: undefined,
    featured: undefined,
    readingTime: undefined
  },
  searchQuery: '',
  sortBy: 'publishedAt',
  sortOrder: 'desc',
  page: 1,
  limit: 12,
  totalPosts: 0,
  hasMore: false,
  viewMode: 'grid',
  selectedPost: undefined,
  bookmarkedPosts: [],
  recentlyViewed: []
})

/**
 * Blog filters with URL synchronization
 */
export const blogFiltersAtom = atomWithURL<BlogFilters>('filters', {
  categories: [],
  tags: [],
  authors: [],
  dateRange: undefined,
  status: undefined,
  featured: undefined,
  readingTime: undefined
}, JSON.stringify, JSON.parse)

/**
 * Search query with URL synchronization and debouncing
 */
const baseSearchQueryAtom = atomWithURL<string>('q', '')
export const searchQueryAtom = atomWithDebounce(baseSearchQueryAtom, 300)

/**
 * Sort field with URL synchronization
 */
export const sortFieldAtom = atomWithURL<BlogSortField>('sort', 'publishedAt')

/**
 * Sort order with URL synchronization
 */
export const sortOrderAtom = atomWithURL<'asc' | 'desc'>('order', 'desc')

/**
 * Current page with URL synchronization
 */
export const currentPageAtom = atomWithURL<number>('page', 1, String, Number)

/**
 * Items per page
 */
export const itemsPerPageAtom = atom<number>(12)

/**
 * View mode with persistence
 */
export const viewModeAtom = atomWithPersistence<'grid' | 'list' | 'compact'>('blog-view-mode', 'grid')

// =======================
// FILTER MANAGEMENT ATOMS
// =======================

/**
 * Category filters
 */
export const categoryFiltersAtom = atom(
  (get) => get(blogFiltersAtom).categories,
  (get, set, categories: string[]) => {
    const current = get(blogFiltersAtom)
    set(blogFiltersAtom, { ...current, categories })
  }
)

/**
 * Tag filters
 */
export const tagFiltersAtom = atom(
  (get) => get(blogFiltersAtom).tags,
  (get, set, tags: string[]) => {
    const current = get(blogFiltersAtom)
    set(blogFiltersAtom, { ...current, tags })
  }
)

/**
 * Author filters
 */
export const authorFiltersAtom = atom(
  (get) => get(blogFiltersAtom).authors,
  (get, set, authors: string[]) => {
    const current = get(blogFiltersAtom)
    set(blogFiltersAtom, { ...current, authors })
  }
)

/**
 * Date range filter
 */
export const dateRangeFilterAtom = atom(
  (get) => get(blogFiltersAtom).dateRange,
  (get, set, dateRange: { from: Date; to: Date } | undefined) => {
    const current = get(blogFiltersAtom)
    set(blogFiltersAtom, { ...current, dateRange })
  }
)

/**
 * Featured posts filter
 */
export const featuredFilterAtom = atom(
  (get) => get(blogFiltersAtom).featured,
  (get, set, featured: boolean | undefined) => {
    const current = get(blogFiltersAtom)
    set(blogFiltersAtom, { ...current, featured })
  }
)

/**
 * Reading time filter
 */
export const readingTimeFilterAtom = atom(
  (get) => get(blogFiltersAtom).readingTime,
  (get, set, readingTime: { min: number; max: number } | undefined) => {
    const current = get(blogFiltersAtom)
    set(blogFiltersAtom, { ...current, readingTime })
  }
)

// =======================
// FILTER ACTIONS
// =======================

/**
 * Add category to filters
 */
export const addCategoryFilterAtom = atom(
  null,
  (get, set, category: string) => {
    const current = get(categoryFiltersAtom)
    if (!current.includes(category)) {
      set(categoryFiltersAtom, [...current, category])
    }
  }
)

/**
 * Remove category from filters
 */
export const removeCategoryFilterAtom = atom(
  null,
  (get, set, category: string) => {
    const current = get(categoryFiltersAtom)
    set(categoryFiltersAtom, current.filter(c => c !== category))
  }
)

/**
 * Toggle category filter
 */
export const toggleCategoryFilterAtom = atom(
  null,
  (get, set, category: string) => {
    const current = get(categoryFiltersAtom)
    if (current.includes(category)) {
      set(removeCategoryFilterAtom, category)
    } else {
      set(addCategoryFilterAtom, category)
    }
  }
)

/**
 * Add tag to filters
 */
export const addTagFilterAtom = atom(
  null,
  (get, set, tag: string) => {
    const current = get(tagFiltersAtom)
    if (!current.includes(tag)) {
      set(tagFiltersAtom, [...current, tag])
    }
  }
)

/**
 * Remove tag from filters
 */
export const removeTagFilterAtom = atom(
  null,
  (get, set, tag: string) => {
    const current = get(tagFiltersAtom)
    set(tagFiltersAtom, current.filter(t => t !== tag))
  }
)

/**
 * Toggle tag filter
 */
export const toggleTagFilterAtom = atom(
  null,
  (get, set, tag: string) => {
    const current = get(tagFiltersAtom)
    if (current.includes(tag)) {
      set(removeTagFilterAtom, tag)
    } else {
      set(addTagFilterAtom, tag)
    }
  }
)

/**
 * Clear all filters
 */
export const clearAllFiltersAtom = atom(
  null,
  (get, set) => {
    set(blogFiltersAtom, {
      categories: [],
      tags: [],
      authors: [],
      dateRange: undefined,
      status: undefined,
      featured: undefined,
      readingTime: undefined
    })
    set(searchQueryAtom, '')
    set(currentPageAtom, 1)
  }
)

// =======================
// SEARCH STATE ATOMS
// =======================

/**
 * Blog search state management
 */
export const blogSearchStateAtom = atom<BlogSearchState>({
  query: '',
  suggestions: [],
  recentSearches: [],
  isSearching: false,
  results: [],
  facets: {
    categories: [],
    tags: [],
    authors: [],
    years: []
  }
})

/**
 * Search suggestions
 */
export const searchSuggestionsAtom = atom(
  (get) => get(blogSearchStateAtom).suggestions,
  (get, set, suggestions: string[]) => {
    const current = get(blogSearchStateAtom)
    set(blogSearchStateAtom, { ...current, suggestions })
  }
)

/**
 * Recent searches with persistence
 */
export const recentSearchesAtom = atomWithPersistence<string[]>('blog-recent-searches', [])

/**
 * Add to recent searches
 */
export const addRecentSearchAtom = atom(
  null,
  (get, set, query: string) => {
    if (!query.trim()) return
    
    const current = get(recentSearchesAtom)
    const updated = [query, ...current.filter(s => s !== query)].slice(0, 10)
    set(recentSearchesAtom, updated)
  }
)

/**
 * Clear recent searches
 */
export const clearRecentSearchesAtom = atom(
  null,
  (get, set) => {
    set(recentSearchesAtom, [])
  }
)

/**
 * Search results
 */
export const searchResultsAtom = atom(
  (get) => get(blogSearchStateAtom).results,
  (get, set, results: BlogSearchResult[]) => {
    const current = get(blogSearchStateAtom)
    set(blogSearchStateAtom, { ...current, results })
  }
)

/**
 * Search facets
 */
export const searchFacetsAtom = atom(
  (get) => get(blogSearchStateAtom).facets,
  (get, set, facets: SearchFacets) => {
    const current = get(blogSearchStateAtom)
    set(blogSearchStateAtom, { ...current, facets })
  }
)

/**
 * Is searching state
 */
export const isSearchingAtom = atom(
  (get) => get(blogSearchStateAtom).isSearching,
  (get, set, isSearching: boolean) => {
    const current = get(blogSearchStateAtom)
    set(blogSearchStateAtom, { ...current, isSearching })
  }
)

// =======================
// PAGINATION ATOMS
// =======================

/**
 * Blog pagination state
 */
export const blogPaginationAtom = atom<BlogPaginationState>({
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  itemsPerPage: 12,
  hasNextPage: false,
  hasPrevPage: false
})

/**
 * Update pagination state
 */
export const updatePaginationAtom = atom(
  null,
  (get, set, update: Partial<BlogPaginationState>) => {
    const current = get(blogPaginationAtom)
    set(blogPaginationAtom, { ...current, ...update })
  }
)

/**
 * Go to next page
 */
export const nextPageAtom = atom(
  null,
  (get, set) => {
    const { currentPage, hasNextPage } = get(blogPaginationAtom)
    if (hasNextPage) {
      set(currentPageAtom, currentPage + 1)
    }
  }
)

/**
 * Go to previous page
 */
export const prevPageAtom = atom(
  null,
  (get, set) => {
    const { currentPage, hasPrevPage } = get(blogPaginationAtom)
    if (hasPrevPage && currentPage > 1) {
      set(currentPageAtom, currentPage - 1)
    }
  }
)

/**
 * Go to specific page
 */
export const goToPageAtom = atom(
  null,
  (get, set, page: number) => {
    const { totalPages } = get(blogPaginationAtom)
    if (page >= 1 && page <= totalPages) {
      set(currentPageAtom, page)
    }
  }
)

// =======================
// BOOKMARKS AND FAVORITES
// =======================

/**
 * Bookmarked posts with persistence
 */
export const bookmarkedPostsAtom = atomWithPersistence<string[]>('bookmarked-posts', [])

/**
 * Add bookmark
 */
export const addBookmarkAtom = atom(
  null,
  (get, set, postId: string) => {
    const current = get(bookmarkedPostsAtom)
    if (!current.includes(postId)) {
      set(bookmarkedPostsAtom, [...current, postId])
    }
  }
)

/**
 * Remove bookmark
 */
export const removeBookmarkAtom = atom(
  null,
  (get, set, postId: string) => {
    const current = get(bookmarkedPostsAtom)
    set(bookmarkedPostsAtom, current.filter(id => id !== postId))
  }
)

/**
 * Toggle bookmark
 */
export const toggleBookmarkAtom = atom(
  null,
  (get, set, postId: string) => {
    const current = get(bookmarkedPostsAtom)
    if (current.includes(postId)) {
      set(removeBookmarkAtom, postId)
    } else {
      set(addBookmarkAtom, postId)
    }
  }
)

/**
 * Check if post is bookmarked
 */
export const isBookmarkedAtom = atom(
  (get) => (postId: string) => {
    const bookmarked = get(bookmarkedPostsAtom)
    return bookmarked.includes(postId)
  }
)

// =======================
// RECENTLY VIEWED
// =======================

/**
 * Recently viewed posts with session storage
 */
export const recentlyViewedPostsAtom = atomWithPersistence<string[]>('recently-viewed-posts', [], {
  storage: typeof window !== 'undefined' ? sessionStorage : undefined
})

/**
 * Add to recently viewed
 */
export const addRecentlyViewedAtom = atom(
  null,
  (get, set, postId: string) => {
    const current = get(recentlyViewedPostsAtom)
    const updated = [postId, ...current.filter(id => id !== postId)].slice(0, 20)
    set(recentlyViewedPostsAtom, updated)
  }
)

/**
 * Clear recently viewed
 */
export const clearRecentlyViewedAtom = atom(
  null,
  (get, set) => {
    set(recentlyViewedPostsAtom, [])
  }
)

// =======================
// READING PROGRESS
// =======================

/**
 * Reading progress for individual posts
 */
export const readingProgressAtom = atomWithPersistence<Record<string, number>>('reading-progress', {})

/**
 * Update reading progress for a post
 */
export const updateReadingProgressAtom = atom(
  null,
  (get, set, payload: { postId: string; progress: number }) => {
    const current = get(readingProgressAtom)
    set(readingProgressAtom, {
      ...current,
      [payload.postId]: Math.min(100, Math.max(0, payload.progress))
    })
  }
)

/**
 * Get reading progress for a post
 */
export const getReadingProgressAtom = atom(
  (get) => (postId: string) => {
    const progress = get(readingProgressAtom)
    return progress[postId] || 0
  }
)

// =======================
// BLOG PREFERENCES
// =======================

/**
 * Blog reading preferences
 */
export const blogPreferencesAtom = atomWithPersistence('blog-preferences', {
  autoSave: true,
  highlightCode: true,
  showReadingTime: true,
  showTags: true,
  showAuthor: true,
  showDate: true,
  showViewCount: false,
  fontSize: 'medium' as 'small' | 'medium' | 'large',
  lineHeight: 'normal' as 'compact' | 'normal' | 'relaxed',
  theme: 'auto' as 'light' | 'dark' | 'auto'
})

/**
 * Update blog preferences
 */
export const updateBlogPreferencesAtom = atom(
  null,
  (get, set, preferences: Partial<typeof blogPreferencesAtom>) => {
    const current = get(blogPreferencesAtom)
    set(blogPreferencesAtom, { ...current, ...preferences })
  }
)

// =======================
// ACTIVE FILTERS STATE
// =======================

/**
 * Check if any filters are active
 */
export const hasActiveFiltersAtom = atom((get) => {
  const filters = get(blogFiltersAtom)
  const query = get(searchQueryAtom)
  
  return (
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.authors.length > 0 ||
    filters.dateRange !== undefined ||
    filters.featured !== undefined ||
    filters.readingTime !== undefined ||
    query.trim() !== ''
  )
})

/**
 * Count of active filters
 */
export const activeFiltersCountAtom = atom((get) => {
  const filters = get(blogFiltersAtom)
  const query = get(searchQueryAtom)
  
  let count = 0
  
  if (filters.categories.length > 0) count += filters.categories.length
  if (filters.tags.length > 0) count += filters.tags.length
  if (filters.authors.length > 0) count += filters.authors.length
  if (filters.dateRange !== undefined) count += 1
  if (filters.featured !== undefined) count += 1
  if (filters.readingTime !== undefined) count += 1
  if (query.trim() !== '') count += 1
  
  return count
})

// =======================
// RESET ATOMS
// =======================

/**
 * Reset all blog state
 */
export const resetBlogStateAtom = atom(
  null,
  (get, set) => {
    set(clearAllFiltersAtom)
    set(searchQueryAtom, '')
    set(currentPageAtom, 1)
    set(sortFieldAtom, 'publishedAt')
    set(sortOrderAtom, 'desc')
    set(viewModeAtom, 'grid')
    
    // Clear search state
    set(blogSearchStateAtom, {
      query: '',
      suggestions: [],
      recentSearches: [],
      isSearching: false,
      results: [],
      facets: {
        categories: [],
        tags: [],
        authors: [],
        years: []
      }
    })
    
    // Reset pagination
    set(blogPaginationAtom, {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 12,
      hasNextPage: false,
      hasPrevPage: false
    })
  }
)

/**
 * Reset only filters (keep bookmarks and preferences)
 */
export const resetFiltersOnlyAtom = atom(
  null,
  (get, set) => {
    set(clearAllFiltersAtom)
  }
)