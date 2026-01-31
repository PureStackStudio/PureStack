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

const pageCache = new Cache<string, boolean>({
  name: 'page-html',
  maxEntries: Number.POSITIVE_INFINITY,
})

export async function buildPage(config: SiteConfig, file: ContentFile) {
  const pageKey = file.absPath
  if (pageCache.has(pageKey)) return
  const log = getLogger()
  const html = await renderAndCachePage(config, file, pageKey)
  const outPath = resolveOutPath(config.outDir, file)
  await writeHtml(outPath, html)
  log.info('page written', { outPath })
}

async function renderAndCachePage(
  config: SiteConfig,
  file: ContentFile,
  key: string,
) {
  const source = await readSource(file.absPath)
  const parsed = parseFrontmatter(source)
  const headConfig = resolveHeadConfig(parsed.data)
  const bodyHtml = await compileMdxToHtml(parsed.content)
  const html = await renderPage({
    bodyHtml,
    headConfig,
    styleHref: config.styleHref,
  })
  pageCache.set(key, true)
  return html
}
