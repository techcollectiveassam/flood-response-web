import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const sourcePath = path.join(repoRoot, 'public', 'favicon.svg')
const outputDir = path.join(repoRoot, 'public', 'icons')
const fallbackColor = '#ffffff'

function findDominantColor(svg) {
  const counts = new Map()

  for (const match of svg.match(/#[0-9a-fA-F]{6}\b/g) ?? []) {
    const color = match.toLowerCase()
    counts.set(color, (counts.get(color) ?? 0) + 1)
  }

  let dominant = fallbackColor
  let highestCount = 0

  for (const [color, count] of counts) {
    if (count > highestCount) {
      dominant = color
      highestCount = count
    }
  }

  return dominant
}

function renderSvg(svg, size) {
  return sharp(svg, { density: 384 }).resize(size, size, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
}

async function main() {
  await mkdir(outputDir, { recursive: true })

  const svg = await readFile(sourcePath)
  const backgroundColor = findDominantColor(svg.toString('utf8'))

  await renderSvg(svg, 192).png().toFile(path.join(outputDir, 'icon-192.png'))
  await renderSvg(svg, 512).png().toFile(path.join(outputDir, 'icon-512.png'))

  const maskableSize = 512
  const foregroundSize = Math.round(maskableSize * 0.8)
  const foreground = await renderSvg(svg, foregroundSize)
    .png()
    .toBuffer()

  await sharp({
    create: {
      width: maskableSize,
      height: maskableSize,
      channels: 4,
      background: backgroundColor,
    },
  })
    .composite([{ input: foreground, gravity: 'center' }])
    .png()
    .toFile(path.join(outputDir, 'icon-512-maskable.png'))

  console.log(`Generated PWA icons in ${path.relative(repoRoot, outputDir)}`)
  console.log(`Maskable background color: ${backgroundColor}`)
}

await main()
