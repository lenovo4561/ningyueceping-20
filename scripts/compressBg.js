const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

// 压缩背景图片
const bgPath = path.join(__dirname, '../src/assets/img/loading-bg.png')
const outputPath = path.join(__dirname, '../src/assets/img/loading-bg.png')
const backupPath = path.join(
  __dirname,
  '../src/assets/img/loading-bg_backup.png'
)

async function compressBg() {
  try {
    // 获取原始文件大小
    const originalStats = fs.statSync(bgPath)
    console.log(`原始文件大小: ${(originalStats.size / 1024).toFixed(2)} KB`)

    // 备份原始文件（如果备份不存在）
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(bgPath, backupPath)
      console.log('已备份原始文件')
    }

    // 读取图片
    const image = sharp(backupPath)
    const metadata = await image.metadata()

    console.log(`图片尺寸: ${metadata.width}x${metadata.height}`)

    // 压缩图片
    await sharp(backupPath)
      .resize(metadata.width, metadata.height, {
        fit: 'cover'
      })
      .png({
        compressionLevel: 9,
        quality: 70,
        palette: true,
        colors: 64
      })
      .toFile(outputPath + '.tmp')

    // 替换原文件
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath)
    }
    fs.renameSync(outputPath + '.tmp', outputPath)

    // 获取压缩后的文件大小
    const compressedStats = fs.statSync(outputPath)
    console.log(
      `压缩后文件大小: ${(compressedStats.size / 1024).toFixed(2)} KB`
    )
    console.log(
      `压缩率: ${(
        ((originalStats.size - compressedStats.size) / originalStats.size) *
        100
      ).toFixed(2)}%`
    )

    // 删除备份文件
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath)
      console.log('已删除备份文件')
    }

    console.log('背景图压缩完成！')
  } catch (error) {
    console.error('压缩背景图时出错:', error)
    process.exit(1)
  }
}

compressBg()
