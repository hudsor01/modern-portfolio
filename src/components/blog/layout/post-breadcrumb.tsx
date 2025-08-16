'use client'

import { motion } from 'framer-motion'
import { BlogPostData } from '@/types/shared-api'
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { MotionVariant } from '@/types/ui'

interface PostBreadcrumbProps {
  post: BlogPostData
  itemVariants: MotionVariant
}

export function PostBreadcrumb({ post, itemVariants }: PostBreadcrumbProps) {
  return (
    <motion.div variants={itemVariants}>
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
          </BreadcrumbItem>
          {post.category && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/blog/category/${post.category.slug}`}>
                  {post.category.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{post.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </motion.div>
  )
}