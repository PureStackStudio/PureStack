import fs from 'node:fs/promises'
import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { ensureDir } from '@purestack/ts-util-node'

const FAVICON_OUTPUT_NAME = 'favicon.svg'

export async function writeGeneratedFavicon(config: SiteConfig): Promise<void> {
  if (!config.favicon) return
  const svg = buildFaviconSvg(config, getSvgIcon(config.favicon))
  const absPath = path.join(config.outDir, FAVICON_OUTPUT_NAME)
  await ensureDir(absPath)
  await fs.writeFile(absPath, svg, 'utf8')
}

function buildFaviconSvg(config: SiteConfig, iconSvg: string) {
  const viewBox = extractViewBox(iconSvg) ?? '0 0 24 24'
  const body = extractSvgBody(iconSvg)
    .replaceAll('currentColor', config.style.theme.colors.dark.accent)
    .replaceAll('stroke-width="1.5"', 'stroke-width="1.8"')

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">`,
    `<rect width="24" height="24" rx="6" fill="none"/>`,
    body,
    '</svg>',
  ].join('')
}

function extractViewBox(svg: string) {
  const match = svg.match(/viewBox="([^"]+)"/i)
  return match?.[1]
}

function extractSvgBody(svg: string) {
  return svg.replace(/^[\s\S]*?<svg[^>]*>/i, '').replace(/<\/svg>\s*$/i, '')
}
