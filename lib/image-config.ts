export const imageConfig = {
  // Default image quality
  defaultQuality: 85,

  // Common image sizes
  sizes: {
    thumbnail: '(max-width: 768px) 100vw, 300px',
    medium: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
    large: '(max-width: 1200px) 100vw, 1200px',
    hero: '100vw',
  },

  // Common aspect ratios
  aspectRatios: {
    square: 1,
    portrait: 3 / 4,
    landscape: 16 / 9,
    wide: 21 / 9,
    blog: 2 / 1,
  },

  // Placeholder options
  placeholders: {
    blur: true,
    color: true,
  },
}

// Helper function to generate blur data URL for small images
export function generateBlurPlaceholder(
  width: number,
  height: number,
  color: string = '#e2e8f0'
): string {
  const svg = `
    <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${color}"/>
    </svg>
  `
  const toBase64 = (str: string) =>
    typeof window === 'undefined' ? Buffer.from(str).toString('base64') : window.btoa(str)

  return `data:image/svg+xml;base64,${toBase64(svg)}`
}
