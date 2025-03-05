'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

type ImageWithFallbackProps = ImageProps & {
	fallbackSrc: string
	sizes?: string
}

export function ImageWithFallback({
	src,
	fallbackSrc,
	alt,
	sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
	loading = 'lazy',
	...rest
}: ImageWithFallbackProps) {
	const [imgSrc, setImgSrc] = useState(src)

	return (
		<Image
			{...rest}
			src={imgSrc}
			alt={alt}
			sizes={sizes}
			loading={loading}
			onError={() => {
				console.warn(`Image load error, falling back to: ${fallbackSrc}`)
				setImgSrc(fallbackSrc)
			}}
		/>
	)
}
