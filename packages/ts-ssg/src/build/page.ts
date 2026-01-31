import { createHash } from 'node:crypto'
import { getLogger } from 'logpot'

import { Cache } from '../cache'
import { type SiteConfig } from '../config'
import { type ContentFile } from '../content'
import { compileMdxToHtml } from '../mdx'
import { renderPage } from '../renderer'
import { parseFrontmatter } from './frontmatter'
import { resolveHeadConfig } from './head-config'
import { readSource, writeHtml } from './io'
import { resolveOutPath } from './out-path'

const mdxCache = new Cache<string, string>({
  name: 'mdx-html',
  maxEntries: 500,
})

const pageCache = new Cache<string, string>({
  name: 'page-html',
  maxEntries: 500,
})

export async function buildPage(config: SiteConfig, file: ContentFile) {
  const log = getLogger()
  const source = await readSource(file.absPath)
  const parsed = parseFrontmatter(source)
  const headConfig = resolveHeadConfig(parsed.data)
  const sourceHash = hashContent(parsed.content)
  const mdxKey = `mdx:${file.relPath}:${sourceHash}`
  const bodyHtml = await mdxCache.getOrSetAsync(mdxKey, () =>
    compileMdxToHtml(parsed.content),
  )
  const headKey = stableStringify(headConfig)
  const pageKey = `page:${file.relPath}:${sourceHash}:${config.styleHref ?? ''}:${headKey}`
  const html = await pageCache.getOrSetAsync(pageKey, () =>
    renderPage({
      bodyHtml,
      headConfig,
      styleHref: config.styleHref,
    }),
  )
  const outPath = resolveOutPath(config.outDir, file)
  await writeHtml(outPath, html)
  log.info('page written', { outPath })
}

function hashContent(content: string) {
  return createHash('sha1').update(content).digest('hex')
}

function stableStringify(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value !== 'object') return JSON.stringify(value)
  const entries = collectEntries(value as Record<string, unknown>)
  return JSON.stringify(entries)
}

function collectEntries(
  value: Record<string, unknown>,
): Array<[string, unknown]> {
  const keys = Object.keys(value).sort()
  const result: Array<[string, unknown]> = []
  for (const key of keys) {
    const item = value[key]
    if (Array.isArray(item)) {
      result.push([key, item.map((entry) => normalizeValue(entry))])
      continue
    }
    result.push([key, normalizeValue(item)])
  }
  return result
}

function normalizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value
  if (Array.isArray(value)) return value.map((entry) => normalizeValue(entry))
  if (typeof value === 'object') {
    return collectEntries(value as Record<string, unknown>)
  }
  return value
}
