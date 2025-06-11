'use client'

import { useTheme } from 'next-themes'
import Image, { ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

interface ThemeImageProps extends Omit<ImageProps, 'src'> {
  lightSrc: string
  darkSrc: string
}

export function ThemeImage({ lightSrc, darkSrc, alt, ...props }: ThemeImageProps) {
  const { resolvedTheme } = useTheme()
  const [src, setSrc] = useState(lightSrc)
  
  useEffect(() => {
    setSrc(resolvedTheme === 'dark' ? darkSrc : lightSrc)
  }, [resolvedTheme, lightSrc, darkSrc])

  return <Image {...props} src={src} alt={alt} />
}
