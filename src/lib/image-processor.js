import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

// Helper function to get memoized metadata
async function getMemoizedMetadata(image, filePath, cache) {
  if (cache.metadata.has(filePath)) {
    return cache.metadata.get(filePath)
  }

  const metadata = await image.metadata()
  cache.metadata.set(filePath, metadata)
  return metadata
}

// Helper function to check if file exists and is newer
function isFileNewer(sourcePath, targetPath) {
  if (!fs.existsSync(targetPath)) return true

  const sourceStats = fs.statSync(sourcePath)
  const targetStats = fs.statSync(targetPath)

  return sourceStats.mtime > targetStats.mtime
}

/**
 * Process a single image file
 * @param {string} file - Path to the image file
 * @param {string} outputPath - Path to output directory
 * @param {object} config - Configuration options
 * @param {object} cache - Cache object for memoization
 * @returns {Promise<object>} - Processing result
 */
async function processImageFile(file, outputPath, config, cache) {
  const filename = path.basename(file)

  const image = sharp(file)
  const metadata = await getMemoizedMetadata(image, file, cache)

  // Generate responsive sizes
  const sizePromises = []

  for (const format of config.formats) {
    for (const width of config.sizes.filter((w) => w <= metadata.width)) {
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
          .toFormat(format, { quality: config.quality })
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
