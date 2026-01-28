const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

const imgDir = path.join(__dirname, '../src/pkg_main/assets/img')

const compressionConfig = {
  'kt.png': { width: 600, quality: 50, colors: 64 },
  'loading-bg.png': { width: 300, quality: 40, colors: 32 },
  'shenghuochangshi-bg.png': { width: 400, quality: 50, colors: 32 },
  'kantuceping-bg-1.png': { width: 400, quality: 50, colors: 32 },
  'kantuceping-bg.png': { width: 400, quality: 50, colors: 32 },
  'shouyedingbg-2.png': { width: 400, quality: 50, colors: 32 },
  'shouyedingbg-1.png': { width: 400, quality: 50, colors: 32 },
  'shouyedingbg-5.png': { width: 400, quality: 50, colors: 32 },
  'tupianceshi-bg.png': { width: 400, quality: 50, colors: 32 },
  'shouyedingbg.png': { width: 400, quality: 50, colors: 32 },
  'shangdian-bg2.png': { width: 400, quality: 50, colors: 32 },
  'shangdian-bg1.png': { width: 400, quality: 50, colors: 32 },
  'tx.png': { width: 200, quality: 60, colors: 64 },
  'quweiceping-bg.png': { width: 400, quality: 50, colors: 32 }
}

async function compressImages() {
  let totalSaved = 0

  for (const [filename, config] of Object.entries(compressionConfig)) {
    const filePath = path.join(imgDir, filename)

    if (!fs.existsSync(filePath)) {
      console.log(`跳过不存在的文件: ${filename}`)
      continue
    }

    try {
      const originalStats = fs.statSync(filePath)
      const originalSize = originalStats.size

      const image = sharp(filePath)
      const metadata = await image.metadata()

      const targetWidth = config.width
      const targetHeight = Math.round(
        (metadata.height / metadata.width) * targetWidth
      )

      await sharp(filePath)
        .resize(targetWidth, targetHeight, { fit: 'cover' })
        .png({
          compressionLevel: 9,
          quality: config.quality,
          palette: true,
          colors: config.colors
        })
        .toFile(filePath + '.tmp')

      fs.unlinkSync(filePath)
      fs.renameSync(filePath + '.tmp', filePath)

      const newStats = fs.statSync(filePath)
      const newSize = newStats.size
      const saved = originalSize - newSize
      totalSaved += saved

      console.log(
        `✓ ${filename}: ${(originalSize / 1024).toFixed(2)}KB → ${(
          newSize / 1024
        ).toFixed(2)}KB (节省 ${(saved / 1024).toFixed(2)}KB)`
      )
    } catch (error) {
      console.error(`✗ 压缩 ${filename} 失败:`, error.message)
    }
  }

  console.log(`\n总共节省: ${(totalSaved / 1024).toFixed(2)}KB`)
}

compressImages()
