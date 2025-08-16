'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BlogPostFilters,
  BlogPostSort
} from '@/types/shared-api'
import { BlogFilters as BlogFiltersType, Category, Tag } from '@/types/blog'
import { useBlogPosts, useBlogCategories, useBlogTags } from '@/hooks/use-api-queries'
import { BlogCard } from './blog-card'
import { BlogFilters } from './blog-filters'
import { BlogSearch } from './blog-search'
import { BlogPagination } from './blog-pagination'
import { ContactModal } from '@/components/ui/contact-modal'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Grid, List, Search, Filter, TrendingUp, BookOpen, Users, Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BlogHomeLayoutProps {
  className?: string
}

type ViewMode = 'grid' | 'list'

export function BlogHomeLayout({ className }: BlogHomeLayoutProps) {
  const [filters, setFilters] = useState<BlogPostFilters>({
    published: true,
  })
  const [blogFilters, setBlogFilters] = useState<BlogFiltersType>({})
  const [sort] = useState<BlogPostSort>({
    field: 'publishedAt',
    order: 'desc'
  })
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)

  // Fetch data using integrated hooks
  const { data: postsData, isLoading: postsLoading, error: postsError } = useBlogPosts({
    filters,
    sort,
    page,
    limit: 12
  })
  
  const { data: categories = [] } = useBlogCategories()
  const { data: tags = [] } = useBlogTags({ popular: true, limit: 20 })


  const handleBlogFiltersChange = (newFilters: BlogFiltersType) => {
    setBlogFilters(newFilters)
    // Convert blog filters to API filters
    const apiFilters: Partial<BlogPostFilters> = {
      search: newFilters.search,
      categoryId: newFilters.category,
      featured: newFilters.featured,
    }
    setFilters(prev => ({ ...prev, ...apiFilters }))
    setPage(1)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setFilters(prev => ({ ...prev, search: query }))
    setPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    // Scroll to top of posts section
    const postsSection = document.getElementById('blog-posts')
    if (postsSection) {
      postsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  return (
    <>
      <motion.div
        className={cn('min-h-screen', className)}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Hero Section with Glassmorphism Design */}
        <motion.section 
          className="relative py-20 md:py-32 overflow-hidden"
          variants={itemVariants}
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-[image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[length:50px_50px]" />
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob [animation-delay:2s]" />
          <div className="absolute bottom-0 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob [animation-delay:4s]" />
          
          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-4xl mx-auto">
              <motion.h1 
                className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                Revenue Operations Insights
              </motion.h1>
              <motion.p 
                className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed"
                variants={itemVariants}
              >
                Strategic insights, data-driven analyses, and actionable frameworks for modern revenue operations
              </motion.p>
              
              {/* Stats Section with Glassmorphism */}
              <motion.div
                variants={itemVariants}
                className="max-w-4xl mx-auto mb-12"
              >
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                  <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { icon: BookOpen, value: '25+', label: 'Expert Articles' },
                        { icon: Users, value: '5K+', label: 'Monthly Readers' },
                        { icon: Clock, value: '6 min', label: 'Avg Read Time' },
                      ].map((stat, index) => (
                        <div key={index} className="text-center group">
                          <div className="p-3 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 backdrop-blur border border-blue-400/30 rounded-2xl mb-3 mx-auto w-fit group-hover:scale-110 transition-transform duration-300">
                            <stat.icon className="w-6 h-6 text-blue-300" />
                          </div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent mb-1">
                            {stat.value}
                          </div>
                          <div className="text-sm text-gray-200 font-medium">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Search and CTA - Improved Readability */}
              <motion.div 
                className="max-w-3xl mx-auto"
                variants={itemVariants}
              >
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 hover:bg-white/15 hover:border-white/30 transition-all duration-500 shadow-2xl">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                      <div className="flex-1">
                        <BlogSearch
                          placeholder="Search insights, frameworks, analytics..."
                          onSearch={handleSearch}
                          className="w-full bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/25 focus:border-white/40"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowFilters(!showFilters)}
                          className="flex items-center gap-2 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/40 hover:text-white"
                        >
                          <Filter className="h-4 w-4" />
                          Filters
                        </Button>
                        <Button
                          onClick={() => setIsContactModalOpen(true)}
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border border-blue-400/20 hover:border-blue-300/40 flex items-center gap-2 shadow-lg hover:shadow-xl"
                        >
                          Get Consulting
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <div className="container mx-auto px-4 py-8">
          {/* Filters Section with Glassmorphism */}
          {showFilters && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
                  <BlogFilters
                    categories={categories as Category[]}
                    tags={tags as Tag[]}
                    filters={blogFilters}
                    onFiltersChange={handleBlogFiltersChange}
                    isLoading={postsLoading}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* View Controls */}
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
            variants={itemVariants}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'All Insights'}
              </h2>
              {postsData?.pagination && (
                <span className="text-sm text-gray-400">
                  ({postsData.pagination.total} posts)
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="flex items-center gap-2"
              >
                <Grid className="h-4 w-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="flex items-center gap-2"
              >
                <List className="h-4 w-4" />
                List
              </Button>
            </div>
          </motion.div>

          {/* Posts Grid with Error and Loading States */}
          <section id="blog-posts">
            {postsLoading ? (
              <div className={cn(
                'grid gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                  : 'grid-cols-1'
              )}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-6">
                    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
                      <Skeleton className="h-48 w-full rounded-xl mb-4 bg-white/10" />
                      <Skeleton className="h-4 w-3/4 mb-2 bg-white/10" />
                      <Skeleton className="h-4 w-1/2 bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : postsError ? (
              <motion.div 
                className="text-center py-16 bg-white/5 backdrop-blur border border-white/10 rounded-3xl"
                variants={itemVariants}
              >
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
                  <Search className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">Failed to load posts</h3>
                  <p className="text-gray-400 mb-6">
                    There was an error loading the blog posts. Please try again.
                  </p>
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    Reload Page
                  </Button>
                </div>
              </motion.div>
            ) : postsData?.data && postsData.data.length > 0 ? (
              <motion.div 
                className={cn(
                  'grid gap-6 justify-center',
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center'
                    : 'grid-cols-1'
                )}
                variants={containerVariants}
              >
                {postsData.data.map((post) => (
                  <motion.div key={post.id} variants={itemVariants} className="w-full max-w-sm">
                    <BlogCard
                      post={post}
                      variant={viewMode === 'list' ? 'compact' : 'default'}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-16 bg-white/5 backdrop-blur border border-white/10 rounded-3xl"
                variants={itemVariants}
              >
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8 max-w-md mx-auto">
                  <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">No posts found</h3>
                  <p className="text-gray-400 mb-6">
                    Try adjusting your search or filter criteria
                  </p>
                  <Button
                    onClick={() => {
                      setFilters({ published: true })
                      setSearchQuery('')
                      setPage(1)
                    }}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                  >
                    Reset Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </section>

          {/* Pagination with Glassmorphism */}
          {postsData?.data && postsData.data.length > 0 && postsData.pagination.totalPages > 1 && (
            <motion.div 
              className="mt-12 flex justify-center"
              variants={itemVariants}
            >
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-4">
                <BlogPagination
                  currentPage={postsData.pagination.page}
                  totalPages={postsData.pagination.totalPages}
                  hasNext={postsData.pagination.hasNext}
                  hasPrev={postsData.pagination.hasPrev}
                  onPageChange={handlePageChange}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Newsletter/CTA Section */}
        <motion.section 
          className="py-16 mt-16 relative overflow-hidden"
          variants={itemVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-500/10" />
          <div className="container mx-auto px-4 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-500">
                <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
                  <TrendingUp className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                  <h2 className="text-3xl font-bold mb-4 text-white">Ready to Optimize Your Revenue Operations?</h2>
                  <p className="text-xl text-gray-200 mb-6 leading-relaxed">
                    Get personalized insights and strategies tailored to your business needs
                  </p>
                  <Button
                    onClick={() => setIsContactModalOpen(true)}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border border-blue-400/20 hover:border-blue-300/40 px-8 py-3 text-lg flex items-center gap-3 mx-auto"
                  >
                    Schedule a Consultation
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>

      {/* Contact Modal Integration */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </>
  )
}