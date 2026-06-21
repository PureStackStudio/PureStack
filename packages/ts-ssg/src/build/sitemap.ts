import fs from 'node:fs/promises'
import path from 'node:path'
import type { RobotsConfig, SitemapConfig } from '@purestack/ts-common'
import { withBasePath } from '@purestack/ts-util'
import { ensureDir } from '@purestack/ts-util-node'

export interface SitemapPageEntry {
  urlPath: string
  lastModifiedMs?: number
}

export interface SitemapWriteResult {
  outPath: string
  urls: number
  robotsOutPath?: string
}

export function buildSitemapXml(
  baseUrl: string,
  pages: SitemapPageEntry[],
  basePath = '',
): string {
  const sortedPages = [...pages].sort((left, right) =>
    left.urlPath.localeCompare(right.urlPath),
  )
  const rows = sortedPages.map((page) => {
    const loc = xmlEscape(
      joinBaseUrl(baseUrl, withBasePath(basePath, page.urlPath)),
    )
    const lastmod = formatLastMod(page.lastModifiedMs)
    if (!lastmod) {
      return `  <url><loc>${loc}</loc></url>`
    }
    return `  <url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`
  })
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...rows,
    '</urlset>',
    '',
  ].join('\n')
}

export async function writeSitemap(
  outDir: string,
  config: SitemapConfig,
  pages: SitemapPageEntry[],
  basePath = '',
): Promise<SitemapWriteResult | null> {
  if (!config.enabled) return null
  if (config.baseUrl.length === 0) return null
  const outPath = path.join(outDir, config.fileName)
  const xml = buildSitemapXml(config.baseUrl, pages, basePath)
  await ensureDir(outPath)
  await fs.writeFile(outPath, xml, 'utf8')
  const robotsOutPath = await writeRobotsTxt(outDir, config, basePath)
  return { outPath, urls: pages.length, robotsOutPath }
}

function joinBaseUrl(baseUrl: string, urlPath: string) {
  if (urlPath === '/') return `${baseUrl}/`
  return `${baseUrl}${urlPath}`
}

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function formatLastMod(lastModifiedMs: number | undefined) {
  if (typeof lastModifiedMs !== 'number' || Number.isNaN(lastModifiedMs)) {
    return ''
  }
  return new Date(lastModifiedMs).toISOString()
}

function publicPathForFileName(fileName: string) {
  const posix = fileName.replaceAll('\\', '/').replace(/^\/+/, '')
  return `/${posix}`
}

async function writeRobotsTxt(
  outDir: string,
  config: SitemapConfig,
  basePath: string,
) {
  if (!config.robots.enabled) return undefined
  const robotsOutPath = path.join(outDir, config.robots.fileName)
  const primarySitemapUrl = joinBaseUrl(
    config.baseUrl,
    withBasePath(basePath, publicPathForFileName(config.fileName)),
  )
  const robots = buildRobotsTxt(config.robots, primarySitemapUrl)
  await ensureDir(robotsOutPath)
  await fs.writeFile(robotsOutPath, robots, 'utf8')
  return robotsOutPath
}

function buildRobotsTxt(config: RobotsConfig, primarySitemapUrl: string) {
  const lines: string[] = []
  lines.push(`User-agent: ${config.userAgent}`)
  for (const allow of config.allow) {
    lines.push(`Allow: ${allow}`)
  }
  for (const disallow of config.disallow) {
    lines.push(`Disallow: ${disallow}`)
  }
  if (typeof config.crawlDelay === 'number') {
    lines.push(`Crawl-delay: ${config.crawlDelay}`)
  }
  if (config.host) {
    lines.push(`Host: ${config.host}`)
  }
  lines.push(`Sitemap: ${primarySitemapUrl}`)
  for (const sitemapUrl of config.additionalSitemaps) {
    lines.push(`Sitemap: ${sitemapUrl}`)
  }
  for (const directive of config.customDirectives) {
    lines.push(directive)
  }
  lines.push('')
  return lines.join('\n')
}
