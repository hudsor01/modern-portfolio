'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

type ImageWithFallbackProps = ImageProps & {
	fallbackSrc: string
}

export function ImageWithFallback({ src, fallbackSrc, alt, ...rest }: ImageWithFallbackProps) {
	const [imgSrc, setImgSrc] = useState(src)

	return (
		<Image
			{...rest}
			src={imgSrc}
			alt={alt}
			onError={() => {
				setImgSrc(fallbackSrc)
			}}
		/>
	)
}
