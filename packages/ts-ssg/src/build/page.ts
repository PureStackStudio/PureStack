import matter from 'gray-matter'
import { getLogger } from 'logpot'

import { type SiteConfig } from '../config/config'
import { type ContentFile } from '../discover/content'
import { compileMdxToHtml } from '../mdx/mdx'
import { renderPage } from '../renderer'
import { Cache } from '../util/cache'
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
  const parsed = matter(source)
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
