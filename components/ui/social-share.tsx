'use client'

import React from 'react'
import { Facebook, Twitter, Linkedin, Mail, Link } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SocialShareProps {
	url: string
	title: string
	description?: string
	className?: string
	compact?: boolean
}

/**
 * SocialShare - A component for sharing content to social media
 *
 * @param url - The URL to share
 * @param title - The title of the content
 * @param description - Optional description
 * @param className - Additional CSS classes
 * @param compact - Whether to show a compact version
 */
export function SocialShare({
	url,
	title,
	description = '',
	className,
	compact = false,
}: SocialShareProps) {
	const encodedUrl = encodeURIComponent(url)
	const encodedTitle = encodeURIComponent(title)
	const encodedDescription = encodeURIComponent(description)

	const handleCopyLink = () => {
		navigator.clipboard.writeText(url).then(
			() => {
				toast.success('Link copied to clipboard!')
			},
			() => {
				toast.error('Failed to copy link')
			}
		)
	}

	const iconSize = compact ? 18 : 20
	const variant = compact ? 'ghost' : 'outline'
	const size = compact ? 'sm' : 'default'

	return (
		<div className={cn('flex flex-wrap gap-2', className)}>
			{!compact && <span className='text-sm font-medium'>Share:</span>}

			<Button
				variant={variant}
				size={size}
				onClick={() =>
					window.open(
						`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
						'_blank'
					)
				}
				aria-label='Share on Twitter'>
				<Twitter size={iconSize} />
				{!compact && <span className='ml-2'>Twitter</span>}
			</Button>

			<Button
				variant={variant}
				size={size}
				onClick={() =>
					window.open(
						`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
						'_blank'
					)
				}
				aria-label='Share on Facebook'>
				<Facebook size={iconSize} />
				{!compact && <span className='ml-2'>Facebook</span>}
			</Button>

			<Button
				variant={variant}
				size={size}
				onClick={() =>
					window.open(
						`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
						'_blank'
					)
				}
				aria-label='Share on LinkedIn'>
				<Linkedin size={iconSize} />
				{!compact && <span className='ml-2'>LinkedIn</span>}
			</Button>

			<Button
				variant={variant}
				size={size}
				onClick={() =>
					window.open(
						`mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
						'_blank'
					)
				}
				aria-label='Share via Email'>
				<Mail size={iconSize} />
				{!compact && <span className='ml-2'>Email</span>}
			</Button>

			<Button variant={variant} size={size} onClick={handleCopyLink} aria-label='Copy Link'>
				<Link size={iconSize} />
				{!compact && <span className='ml-2'>Copy Link</span>}
			</Button>
		</div>
	)
}
