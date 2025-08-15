import { 
  BlogPost, 
  Author, 
  Category, 
  Tag, 
  PostStatus, 
  ContentType, 
  BlogPostCreateInput,
  BlogPostFilter,
  BlogAnalytics,
  SEOAnalysis,
  SEOIssue,
  BlogPostSummary 
} from '../types/blog'

// =======================
// BLOG FACTORIES
// =======================

// Factory for creating mock blog authors
export const createMockAuthor = (overrides: Partial<Author> = {}): Author => ({
  id: 'author-1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  slug: 'john-doe',
  bio: 'Experienced tech writer and developer with a passion for sharing knowledge.',
  avatar: '/images/authors/john-doe.jpg',
  website: 'https://johndoe.com',
  twitter: 'johndoe',
  linkedin: 'johndoe',
  github: 'johndoe',
  metaDescription: 'Tech writer and developer John Doe',
  totalViews: 15000,
  totalPosts: 25,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  ...overrides,
})

// Factory for creating mock blog categories
export const createMockCategory = (overrides: Partial<Category> = {}): Category => ({
  id: 'category-1',
  name: 'Technology',
  slug: 'technology',
  description: 'Latest trends and insights in technology',
  color: '#3b82f6',
  icon: 'tech',
  metaTitle: 'Technology Articles',
  metaDescription: 'Explore the latest technology articles and insights',
  keywords: ['technology', 'development', 'programming'],
  postCount: 15,
  totalViews: 25000,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  ...overrides,
})

// Factory for creating mock blog tags
export const createMockTag = (overrides: Partial<Tag> = {}): Tag => ({
  id: 'tag-1',
  name: 'React',
  slug: 'react',
  description: 'Articles about React development',
  color: '#61dafb',
  metaDescription: 'React development articles and tutorials',
  postCount: 10,
  totalViews: 12000,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  ...overrides,
})

// Factory for creating mock blog posts
export const createMockBlogPost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  id: 'post-1',
  title: 'Getting Started with React Testing',
  slug: 'getting-started-with-react-testing',
  excerpt: 'Learn the fundamentals of testing React components with modern testing tools.',
  content: '# Getting Started with React Testing\n\nTesting React components is essential for building reliable applications...',
  contentType: ContentType.MARKDOWN,
  status: PostStatus.PUBLISHED,
  metaTitle: 'Getting Started with React Testing - Complete Guide',
  metaDescription: 'Comprehensive guide to testing React components with Jest, Testing Library, and best practices.',
  keywords: ['react', 'testing', 'jest', 'testing-library'],
  featuredImage: '/images/blog/react-testing.jpg',
  featuredImageAlt: 'React Testing Setup',
  readingTime: 8,
  wordCount: 1200,
  publishedAt: new Date('2024-01-15'),
  createdAt: new Date('2024-01-10'),
  updatedAt: new Date('2024-01-15'),
  authorId: 'author-1',
  categoryId: 'category-1',
  currentVersion: 1,
  viewCount: 1500,
  likeCount: 45,
  shareCount: 20,
  commentCount: 8,
  seoScore: 85,
  ...overrides,
})

// Factory for creating mock blog post summaries
export const createMockBlogPostSummary = (overrides: Partial<BlogPostSummary> = {}): BlogPostSummary => ({
  id: 'post-1',
  title: 'Getting Started with React Testing',
  slug: 'getting-started-with-react-testing',
  excerpt: 'Learn the fundamentals of testing React components with modern testing tools.',
  featuredImage: '/images/blog/react-testing.jpg',
  publishedAt: new Date('2024-01-15'),
  viewCount: 1500,
  commentCount: 8,
  readingTime: 8,
  author: createMockAuthor(),
  category: createMockCategory(),
  tags: [createMockTag()],
  featured: false,
  ...overrides,
})

// Factory for creating mock blog post create input
export const createMockBlogPostInput = (overrides: Partial<BlogPostCreateInput> = {}): BlogPostCreateInput => ({
  title: 'New Blog Post',
  content: '# New Blog Post\n\nThis is a new blog post content...',
  excerpt: 'This is a new blog post excerpt.',
  contentType: ContentType.MARKDOWN,
  status: PostStatus.DRAFT,
  metaTitle: 'New Blog Post - Tech Insights',
  metaDescription: 'A comprehensive guide to the latest technology trends.',
  keywords: ['technology', 'development', 'guide'],
  authorId: 'author-1',
  categoryId: 'category-1',
  tagIds: ['tag-1'],
  ...overrides,
})

// Factory for creating mock blog filters
export const createMockBlogFilter = (overrides: Partial<BlogPostFilter> = {}): BlogPostFilter => ({
  status: PostStatus.PUBLISHED,
  search: '',
  featured: false,
  published: true,
  ...overrides,
})

// Factory for creating mock blog analytics
export const createMockBlogAnalytics = (overrides: Partial<BlogAnalytics> = {}): BlogAnalytics => ({
  totalPosts: 50,
  publishedPosts: 45,
  draftPosts: 5,
  totalViews: 125000,
  totalInteractions: 2500,
  avgReadingTime: 6.5,
  topPosts: [
    createMockBlogPost({ id: 'top-1', title: 'Top Post 1', viewCount: 5000 }),
    createMockBlogPost({ id: 'top-2', title: 'Top Post 2', viewCount: 4500 }),
  ],
  topCategories: [
    createMockCategory({ id: 'top-cat-1', name: 'Technology', postCount: 20 }),
    createMockCategory({ id: 'top-cat-2', name: 'Development', postCount: 15 }),
  ],
  topTags: [
    createMockTag({ id: 'top-tag-1', name: 'React', postCount: 12 }),
    createMockTag({ id: 'top-tag-2', name: 'TypeScript', postCount: 10 }),
  ],
  recentActivity: [],
  seoSummary: {
    averageScore: 82.5,
    totalIssues: 15,
    criticalIssues: 2,
    opportunities: 8,
    lastAnalysis: new Date(),
    topKeywords: [],
  },
  ...overrides,
})

// Factory for creating mock SEO analysis
export const createMockSEOAnalysis = (overrides: Partial<SEOAnalysis> = {}): SEOAnalysis => ({
  score: 85,
  issues: [
    {
      type: 'warning',
      category: 'meta',
      message: 'Meta description is too short',
      description: 'Consider expanding the meta description to 120-160 characters',
      fix: 'Add more descriptive text to the meta description',
      impact: 'medium',
    } as SEOIssue,
  ],
  opportunities: [
    {
      type: 'keyword',
      message: 'Add more internal links',
      description: 'Internal linking helps with SEO and user navigation',
      action: 'Add 2-3 relevant internal links',
      potential: 'medium',
    },
  ],
  technicalChecks: [
    {
      name: 'Title Tag',
      status: 'pass',
      message: 'Title tag is properly formatted',
    },
  ],
  contentAnalysis: {
    wordCount: 1200,
    readingTime: 8,
    readabilityScore: 75,
    sentimentScore: 0.6,
    keywordDensity: { 'react': 2.5, 'testing': 3.1 },
    headingStructure: [
      { level: 1, text: 'Getting Started with React Testing', wordCount: 5 },
      { level: 2, text: 'Introduction', wordCount: 1 },
    ],
    internalLinks: 3,
    externalLinks: 5,
    images: 2,
    imageAltTexts: 2,
  },
  keywordAnalysis: {
    primary: 'react testing',
    secondary: ['jest', 'testing library', 'unit testing'],
    density: { 'react': 2.5, 'testing': 3.1, 'jest': 1.2 },
    prominence: { 'react': 0.8, 'testing': 0.9, 'jest': 0.5 },
    suggestions: ['component testing', 'integration testing'],
  },
  ...overrides,
})

// Factory for creating mock blog list response
export const createMockBlogListResponse = (count = 10) => ({
  posts: Array.from({ length: count }, (_, index) => 
    createMockBlogPostSummary({
      id: `post-${index + 1}`,
      title: `Blog Post ${index + 1}`,
      slug: `blog-post-${index + 1}`,
    })
  ),
  totalCount: count,
  hasMore: count >= 10,
})

// Factory for creating mock RSS feed items
export const createMockRSSFeedItem = (post: BlogPost) => ({
  title: post.title,
  description: post.excerpt || '',
  link: `https://example.com/blog/${post.slug}`,
  guid: post.id,
  pubDate: post.publishedAt?.toISOString() || new Date().toISOString(),
  author: post.author?.email || 'noreply@example.com',
  category: post.category?.name || 'Uncategorized',
})

// Factory for creating multiple mock posts
export const createMockBlogPosts = (count = 5): BlogPost[] => {
  const categories = ['Technology', 'Development', 'Design', 'Business']
  const tags = ['React', 'TypeScript', 'Next.js', 'Testing', 'SEO']
  
  return Array.from({ length: count }, (_, index) => 
    createMockBlogPost({
      id: `post-${index + 1}`,
      title: `Blog Post ${index + 1}: ${categories[index % categories.length]} Insights`,
      slug: `blog-post-${index + 1}`,
      categoryId: `category-${(index % categories.length) + 1}`,
      keywords: [tags[index % tags.length], tags[(index + 1) % tags.length]],
      viewCount: Math.floor(Math.random() * 5000) + 100,
      publishedAt: new Date(2024, 0, index + 1),
    })
  )
}

// Factory for creating multiple mock categories
export const createMockCategories = (count = 4): Category[] => {
  const names = ['Technology', 'Development', 'Design', 'Business']
  
  return Array.from({ length: count }, (_, index) => 
    createMockCategory({
      id: `category-${index + 1}`,
      name: names[index],
      slug: names[index].toLowerCase(),
      postCount: Math.floor(Math.random() * 20) + 5,
    })
  )
}

// Factory for creating multiple mock tags
export const createMockTags = (count = 5): Tag[] => {
  const names = ['React', 'TypeScript', 'Next.js', 'Testing', 'SEO']
  
  return Array.from({ length: count }, (_, index) => 
    createMockTag({
      id: `tag-${index + 1}`,
      name: names[index],
      slug: names[index].toLowerCase(),
      postCount: Math.floor(Math.random() * 15) + 2,
    })
  )
}

// Factory for creating mock API errors
export const createMockApiError = (message = 'API Error', status = 500) => ({
  message,
  status,
  code: 'API_ERROR',
  timestamp: new Date().toISOString(),
})

// Factory for creating mock fetch responses
export const createMockFetchResponse = <T>(data: T, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => data,
  text: async () => JSON.stringify(data),
  headers: new Headers(),
  statusText: ok ? 'OK' : 'Error',
})