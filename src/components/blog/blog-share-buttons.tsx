'use client'

import React, { useState } from 'react'
import { m as motion } from 'framer-motion'
import { 
  Share2, 
  Mail,
  Copy,
  Check
} from 'lucide-react'
import { SiX, SiLinkedin, SiFacebook } from 'react-icons/si'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { createContextLogger } from '@/lib/logging/logger'

const logger = createContextLogger('BlogShareButtons')

interface BlogShareButtonsProps {
  url: string
  title: string
  excerpt?: string
  hashtags?: string[]
  onShare?: (platform: string) => void
  variant?: 'default' | 'compact' | 'vertical'
  showLabels?: boolean
  className?: string
}

export function BlogShareButtons({
  url,
  title,
  excerpt = '',
  hashtags = [],
  onShare,
  variant = 'default',
  showLabels = true,
  className
}: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url
  const shareText = excerpt || title

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}&hashtags=${encodeURIComponent(hashtags.join(','))}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(shareText)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${fullUrl}`)}`
  }

  const socialPlatforms = [
    {
      name: 'Twitter',
      icon: SiX,
      url: shareUrls.twitter,
      color: 'text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      bgColor: 'bg-blue-500'
    },
    {
      name: 'Facebook',
      icon: SiFacebook,
      url: shareUrls.facebook,
      color: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      bgColor: 'bg-blue-600'
    },
    {
      name: 'LinkedIn',
      icon: SiLinkedin,
      url: shareUrls.linkedin,
      color: 'text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20',
      bgColor: 'bg-blue-700'
    },
    {
      name: 'Email',
      icon: Mail,
      url: shareUrls.email,
      color: 'text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/20',
      bgColor: 'bg-gray-600'
    }
  ]

  const handleShare = (platform: string, url?: string) => {
    onShare?.(platform)
    
    if (platform === 'copy') {
      copyToClipboard()
      return
    }

    if (platform === 'native' && navigator.share) {
      navigator.share({
        title,
        text: shareText,
        url: fullUrl,
      }).catch((error) => {
        logger.error('Native share failed', error instanceof Error ? error : new Error(String(error)))
      })
      return
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500')
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      logger.error('Failed to copy', err instanceof Error ? err : new Error(String(err)))
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2, staggerChildren: 0.05 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  }

  // Compact variant - just share icon with popover
  if (variant === 'compact') {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('flex items-center gap-2', className)}
          >
            <Share2 className="w-4 h-4" />
            {showLabels && 'Share'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3" align="end">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-2"
          >
            <h4 className="font-medium text-sm mb-3">Share this post</h4>
            {socialPlatforms.map((platform) => {
              const Icon = platform.icon
              return (
                <motion.div key={platform.name} variants={itemVariants}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn('w-full justify-start gap-3 h-10', platform.color)}
                    onClick={() => handleShare(platform.name.toLowerCase(), platform.url)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{platform.name}</span>
                  </Button>
                </motion.div>
              )
            })}
            <motion.div variants={itemVariants}>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 h-10 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                onClick={() => handleShare('copy')}
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </Button>
            </motion.div>
          </motion.div>
        </PopoverContent>
      </Popover>
    )
  }

  // Vertical variant
  if (variant === 'vertical') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn('flex flex-col gap-3', className)}
      >
        {socialPlatforms.map((platform) => {
          const Icon = platform.icon
          return (
            <motion.div key={platform.name} variants={itemVariants}>
              <Button
                variant="outline"
                size="sm"
                className={cn('w-full justify-start gap-3', platform.color)}
                onClick={() => handleShare(platform.name.toLowerCase(), platform.url)}
              >
                <Icon className="w-4 h-4" />
                {showLabels && <span>{platform.name}</span>}
              </Button>
            </motion.div>
          )
        })}
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-3 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20"
            onClick={() => handleShare('copy')}
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {showLabels && <span>{copied ? 'Copied!' : 'Copy Link'}</span>}
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  // Default variant - horizontal buttons
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn('flex items-center gap-2', className)}
    >
      {/* Native Share (if available) */}
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <motion.div variants={itemVariants}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleShare('native')}
            className="flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {showLabels && 'Share'}
          </Button>
        </motion.div>
      )}

      {/* Social Media Buttons */}
      {socialPlatforms.map((platform) => {
        const Icon = platform.icon
        return (
          <motion.div key={platform.name} variants={itemVariants}>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                'flex items-center gap-2',
                !showLabels && 'p-2',
                platform.color
              )}
              onClick={() => handleShare(platform.name.toLowerCase(), platform.url)}
              title={`Share on ${platform.name}`}
            >
              <Icon className="w-4 h-4" />
              {showLabels && <span className="hidden sm:inline">{platform.name}</span>}
            </Button>
          </motion.div>
        )
      })}

      {/* Copy Link Button */}
      <motion.div variants={itemVariants}>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'flex items-center gap-2',
            !showLabels && 'p-2',
            'text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20'
          )}
          onClick={() => handleShare('copy')}
          title="Copy link"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {showLabels && (
            <span className="hidden sm:inline">
              {copied ? 'Copied!' : 'Copy'}
            </span>
          )}
        </Button>
      </motion.div>
    </motion.div>
  )
}

// Floating share buttons for sticky positioning
export function FloatingShareButtons({
  url,
  title,
  excerpt,
  className,
  onShare
}: {
  url: string
  title: string
  excerpt?: string
  className?: string
  onShare?: (platform: string) => void
}) {
  const [isVisible, setIsVisible] = useState(false)

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        'fixed left-4 top-1/2 transform -translate-y-1/2 z-40',
        'hidden lg:block',
        className
      )}
    >
      <BlogShareButtons
        url={url}
        title={title}
        excerpt={excerpt}
        variant="vertical"
        showLabels={false}
        onShare={onShare}
        className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-3 shadow-lg"
      />
    </motion.div>
  )
}