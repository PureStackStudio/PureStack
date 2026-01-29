import { getLogger } from 'logpot'

import { type SiteConfig } from '../config'
import { type ContentFile } from '../content'
import { compileMdxToHtml } from '../mdx'
import { renderPage } from '../renderer'
import { parseFrontmatter } from './frontmatter'
import { readSource, writeHtml } from './io'
import { resolveOutPath } from './out-path'
import { resolveTitle } from './title'

export async function buildPage(config: SiteConfig, file: ContentFile) {
  const log = getLogger()
  const source = await readSource(file.absPath)
  const parsed = parseFrontmatter(source)
  const title = resolveTitle(parsed.data, file.relPath)
  const bodyHtml = await compileMdxToHtml(parsed.content)
  const html = await renderPage({
    title,
    bodyHtml,
    siteTitle: config.siteTitle,
  })
  const outPath = resolveOutPath(config.outDir, file)
  await writeHtml(outPath, html)
  log.info('page written', { outPath })
}
