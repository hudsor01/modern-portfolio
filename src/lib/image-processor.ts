import sharp, { type Sharp, type Metadata } from 'sharp'
import fs from 'fs'
import path from 'path'

interface ImageProcessorConfig {
  formats: string[]
  sizes: number[]
  quality: number
}

interface ImageProcessorCache {
  metadata: Map<string, Metadata>
}

interface ProcessResult {
  success: boolean
  file: string
}

// Helper function to get memoized metadata
async function getMemoizedMetadata(
  image: Sharp,
  filePath: string,
  cache: ImageProcessorCache
): Promise<Metadata> {
  const cached = cache.metadata.get(filePath)
  if (cached) {
    return cached
  }

  const metadata = await image.metadata()
  cache.metadata.set(filePath, metadata)
  return metadata
}

// Helper function to check if file exists and is newer
function isFileNewer(sourcePath: string, targetPath: string): boolean {
  if (!fs.existsSync(targetPath)) return true

  const sourceStats = fs.statSync(sourcePath)
  const targetStats = fs.statSync(targetPath)

  return sourceStats.mtime > targetStats.mtime
}

/**
 * Process a single image file
 */
async function processImageFile(
  file: string,
  outputPath: string,
  config: ImageProcessorConfig,
  cache: ImageProcessorCache
): Promise<ProcessResult> {
  const filename = path.basename(file)

  const image = sharp(file)
  const metadata = await getMemoizedMetadata(image, file, cache)

  // Generate responsive sizes
  const sizePromises: Promise<sharp.OutputInfo>[] = []
  const imageWidth = metadata.width ?? 0

  for (const format of config.formats) {
    for (const width of config.sizes.filter((w) => w <= imageWidth)) {
      const outputFilename = path.join(
        outputPath,
        `${path.parse(filename).name}-${width}.${format}`
      )

      // Skip if file exists and is newer than source
      if (!isFileNewer(file, outputFilename)) {
        console.log(`Skipping ${filename} (already up to date)`)
        continue
      }

      sizePromises.push(
        image
          .clone() // Clone to avoid multiple operations on same pipeline
          .resize(width)
          .toFormat(format as keyof sharp.FormatEnum, { quality: config.quality })
          .toFile(outputFilename)
      )
    }
  }

  // Generate placeholder
  const placeholderPath = path.join(outputPath, `${path.parse(filename).name}-placeholder.webp`)
  if (isFileNewer(file, placeholderPath)) {
    sizePromises.push(
      image.clone().resize(20).blur(10).toFormat('webp', { quality: 20 }).toFile(placeholderPath)
    )
  } else {
    console.log(`Skipping placeholder (already up to date)`)
  }

  // Wait for all size variants to complete
  await Promise.all(sizePromises)

  return { success: true, file }
}

export {
  processImageFile,
  isFileNewer,
  getMemoizedMetadata,
}

export type { ImageProcessorConfig, ImageProcessorCache, ProcessResult }
