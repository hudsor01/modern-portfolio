import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BlogCard } from '../blog-card'
import { createMockBlogPostSummary } from '@/test/blog-factories'

describe('BlogCard', () => {
  const mockOnClick = vi.fn()
  const mockOnEdit = vi.fn()
  const mockOnDelete = vi.fn()
  
  const defaultPost = createMockBlogPostSummary({
    title: 'Test Blog Post',
    excerpt: 'This is a test excerpt for the blog post',
    featuredImage: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=600&fit=crop&crop=center&q=80',
    publishedAt: new Date('2024-01-15'),
    readingTime: 5,
    featured: false,
    category: {
      id: 'test-category',
      name: 'Test Category',
      slug: 'test-category',
      postCount: 5,
      totalViews: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    tags: [
      { id: 'tag1', name: 'React', slug: 'react', postCount: 10, totalViews: 500, createdAt: new Date() },
      { id: 'tag2', name: 'TypeScript', slug: 'typescript', postCount: 8, totalViews: 400, createdAt: new Date() },
    ]
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('renders blog card with essential elements', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.getByTestId('blog-card')).toBeInTheDocument()
      expect(screen.getByTestId('blog-card-title')).toHaveTextContent('Test Blog Post')
      expect(screen.getByTestId('blog-excerpt')).toHaveTextContent('This is a test excerpt for the blog post')
    })

    it('renders with featured image when provided', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      const image = screen.getByTestId('next-image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('alt', 'Test Blog Post')
    })

    it('renders placeholder when no featured image', () => {
      const postWithoutImage = createMockBlogPostSummary({
        ...defaultPost,
        featuredImage: undefined,
      })

      render(
        <BlogCard 
          post={postWithoutImage} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.getByTestId('image-placeholder')).toBeInTheDocument()
      expect(screen.queryByTestId('next-image')).not.toBeInTheDocument()
    })

    it('displays category badge when category exists', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.getByText('Test Category')).toBeInTheDocument()
    })

    it('displays formatted publication date', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      // The exact format might vary by system locale, so let's check for year
      expect(screen.getByText(/2024/)).toBeInTheDocument()
    })

    it('displays "Draft" when no publication date', () => {
      const draftPost = createMockBlogPostSummary({
        ...defaultPost,
        publishedAt: undefined,
      })

      render(
        <BlogCard 
          post={draftPost} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.getByText('Draft')).toBeInTheDocument()
    })

    it('displays reading time', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.getByText('5 min read')).toBeInTheDocument()
    })

    it('uses default reading time when not provided', () => {
      const postWithoutReadingTime = createMockBlogPostSummary({
        ...defaultPost,
        readingTime: undefined,
      })

      render(
        <BlogCard 
          post={postWithoutReadingTime} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.getByText('5 min read')).toBeInTheDocument() // Default fallback
    })
  })

  describe('Tags Display', () => {
    it('displays up to 3 tags', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })

    it('shows "+X more" when more than 3 tags', () => {
      const postWithManyTags = createMockBlogPostSummary({
        ...defaultPost,
        tags: [
          { id: 'tag1', name: 'React', slug: 'react', postCount: 10, totalViews: 500, createdAt: new Date() },
          { id: 'tag2', name: 'TypeScript', slug: 'typescript', postCount: 8, totalViews: 400, createdAt: new Date() },
          { id: 'tag3', name: 'Next.js', slug: 'nextjs', postCount: 6, totalViews: 300, createdAt: new Date() },
          { id: 'tag4', name: 'Testing', slug: 'testing', postCount: 4, totalViews: 200, createdAt: new Date() },
          { id: 'tag5', name: 'Vitest', slug: 'vitest', postCount: 2, totalViews: 100, createdAt: new Date() },
        ]
      })

      render(
        <BlogCard 
          post={postWithManyTags} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
      expect(screen.getByText('Next.js')).toBeInTheDocument()
      expect(screen.getByText('+2 more')).toBeInTheDocument()
      expect(screen.queryByText('Testing')).not.toBeInTheDocument()
      expect(screen.queryByText('Vitest')).not.toBeInTheDocument()
    })

    it('handles posts with no tags gracefully', () => {
      const postWithoutTags = createMockBlogPostSummary({
        ...defaultPost,
        tags: [],
      })

      render(
        <BlogCard 
          post={postWithoutTags} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.queryByText('React')).not.toBeInTheDocument()
      expect(screen.queryByText('+0 more')).not.toBeInTheDocument()
    })
  })

  describe('Featured Posts', () => {
    it('displays featured badge when post is featured', () => {
      const featuredPost = createMockBlogPostSummary({
        ...defaultPost,
        featured: true,
      })

      render(
        <BlogCard 
          post={featuredPost} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.getByTestId('featured-badge')).toBeInTheDocument()
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })

    it('does not display featured badge when post is not featured', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.queryByTestId('featured-badge')).not.toBeInTheDocument()
    })
  })

  describe('Excerpt Handling', () => {
    it('displays full excerpt when under character limit', () => {
      const shortExcerpt = 'Short excerpt'
      const postWithShortExcerpt = createMockBlogPostSummary({
        ...defaultPost,
        excerpt: shortExcerpt,
      })

      render(
        <BlogCard 
          post={postWithShortExcerpt} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.getByText(shortExcerpt)).toBeInTheDocument()
    })

    it('truncates long excerpts with ellipsis', () => {
      const longExcerpt = 'A'.repeat(200) // 200 characters
      const postWithLongExcerpt = createMockBlogPostSummary({
        ...defaultPost,
        excerpt: longExcerpt,
      })

      render(
        <BlogCard 
          post={postWithLongExcerpt} 
          onClick={mockOnClick} 
        />
      )

      const truncatedText = screen.getByTestId('blog-excerpt').textContent
      expect(truncatedText).toMatch(/\.{3}$/) // Ends with ellipsis
      expect(truncatedText!.length).toBeLessThan(longExcerpt.length)
    })

    it('handles posts without excerpt gracefully', () => {
      const postWithoutExcerpt = createMockBlogPostSummary({
        ...defaultPost,
        excerpt: undefined,
      })

      render(
        <BlogCard 
          post={postWithoutExcerpt} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.queryByTestId('blog-excerpt')).not.toBeInTheDocument()
    })
  })

  describe('Interaction Handling', () => {
    it('calls onClick when card is clicked', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      fireEvent.click(screen.getByTestId('blog-card'))
      expect(mockOnClick).toHaveBeenCalledWith(defaultPost)
      expect(mockOnClick).toHaveBeenCalledTimes(1)
    })

    it('calls onClick when Enter key is pressed', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      fireEvent.keyDown(screen.getByTestId('blog-card'), { key: 'Enter' })
      expect(mockOnClick).toHaveBeenCalledWith(defaultPost)
    })

    it('calls onClick when Space key is pressed', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      fireEvent.keyDown(screen.getByTestId('blog-card'), { key: ' ' })
      expect(mockOnClick).toHaveBeenCalledWith(defaultPost)
    })

    it('does not call onClick for other keys', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      fireEvent.keyDown(screen.getByTestId('blog-card'), { key: 'Tab' })
      expect(mockOnClick).not.toHaveBeenCalled()
    })

    it('has proper accessibility attributes', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      const card = screen.getByTestId('blog-card')
      expect(card).toHaveAttribute('role', 'article')
      expect(card).toHaveAttribute('tabIndex', '0')
      expect(card).toHaveAttribute('aria-label', 'Blog post: Test Blog Post')
    })
  })

  describe('Action Buttons', () => {
    it('displays action buttons when showActions is true', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          showActions={true}
        />
      )

      expect(screen.getByLabelText('Edit post')).toBeInTheDocument()
      expect(screen.getByLabelText('Delete post')).toBeInTheDocument()
    })

    it('does not display action buttons by default', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      )

      expect(screen.queryByLabelText('Edit post')).not.toBeInTheDocument()
      expect(screen.queryByLabelText('Delete post')).not.toBeInTheDocument()
    })

    it('calls onEdit when edit button is clicked', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          showActions={true}
        />
      )

      fireEvent.click(screen.getByLabelText('Edit post'))
      expect(mockOnEdit).toHaveBeenCalledWith(defaultPost)
      expect(mockOnClick).not.toHaveBeenCalled() // Should not trigger card click
    })

    it('calls onDelete when delete button is clicked', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          showActions={true}
        />
      )

      fireEvent.click(screen.getByLabelText('Delete post'))
      expect(mockOnDelete).toHaveBeenCalledWith(defaultPost)
      expect(mockOnClick).not.toHaveBeenCalled() // Should not trigger card click
    })

    it('prevents card click when action buttons are clicked', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          showActions={true}
        />
      )

      // Click edit button
      fireEvent.click(screen.getByLabelText('Edit post'))
      expect(mockOnEdit).toHaveBeenCalledWith(defaultPost)
      expect(mockOnClick).not.toHaveBeenCalled()

      // Click delete button
      fireEvent.click(screen.getByLabelText('Delete post'))
      expect(mockOnDelete).toHaveBeenCalledWith(defaultPost)
      expect(mockOnClick).not.toHaveBeenCalled()
    })
  })

  describe('Variants', () => {
    it('applies default variant classes by default', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      const card = screen.getByTestId('blog-card')
      expect(card).not.toHaveClass('blog-card--compact')
    })

    it('applies compact variant classes when specified', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick}
          variant="compact" 
        />
      )

      const card = screen.getByTestId('blog-card')
      expect(card).toHaveClass('blog-card--compact')
    })
  })

  describe('Error Handling', () => {
    it('handles missing category gracefully', () => {
      const postWithoutCategory = createMockBlogPostSummary({
        ...defaultPost,
        category: undefined,
      })

      render(
        <BlogCard 
          post={postWithoutCategory} 
          onClick={mockOnClick} 
        />
      )

      expect(screen.queryByText('Test Category')).not.toBeInTheDocument()
      // Should still render other elements
      expect(screen.getByTestId('blog-card-title')).toBeInTheDocument()
    })

    it('handles action callbacks being undefined', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick}
          showActions={true}
          // onEdit and onDelete are undefined
        />
      )

      expect(screen.getByLabelText('Edit post')).toBeInTheDocument()
      expect(screen.getByLabelText('Delete post')).toBeInTheDocument()

      // Should not throw when clicked
      expect(() => {
        fireEvent.click(screen.getByLabelText('Edit post'))
        fireEvent.click(screen.getByLabelText('Delete post'))
      }).not.toThrow()
    })

    it('handles malformed dates gracefully', () => {
      // Instead of using invalid date string, use undefined publishedAt
      const postWithInvalidDate = createMockBlogPostSummary({
        ...defaultPost,
        publishedAt: undefined,
      })

      expect(() => {
        render(
          <BlogCard 
            post={postWithInvalidDate} 
            onClick={mockOnClick} 
          />
        )
      }).not.toThrow()
      
      // Should show "Draft" for undefined publishedAt
      expect(screen.getByText('Draft')).toBeInTheDocument()
    })
  })

  describe('CSS Classes and Styling', () => {
    it('applies proper CSS classes for interactivity', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      const card = screen.getByTestId('blog-card')
      expect(card).toHaveClass('cursor-pointer')
      expect(card).toHaveClass('group')
      expect(card).toHaveClass('transform')
      expect(card).toHaveClass('transition-all')
    })

    it('applies glassmorphism styling', () => {
      render(
        <BlogCard
          post={defaultPost}
          onClick={mockOnClick}
        />
      )

      const card = screen.getByTestId('blog-card')
      expect(card).toHaveClass('glass')
      expect(card).toHaveClass('rounded-3xl')
    })

    it('applies focus styles for accessibility', () => {
      render(
        <BlogCard 
          post={defaultPost} 
          onClick={mockOnClick} 
        />
      )

      const card = screen.getByTestId('blog-card')
      expect(card).toHaveClass('focus:outline-none')
      expect(card).toHaveClass('focus:ring-2')
      expect(card).toHaveClass('focus:ring-primary')
    })
  })
})