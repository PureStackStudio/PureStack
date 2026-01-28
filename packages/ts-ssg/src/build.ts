import fs from 'node:fs/promises'
import path from 'node:path'

import matter from 'gray-matter'
import { getLogger } from 'logpot'

import { type PartialConfig, resolveConfig } from './config'
import { ContentFile, discoverContent } from './content'
import { ensureDir } from './fs'
import { compileMdxToHtml } from './mdx'
import { renderPage } from './renderer'

export interface BuildResult {
  outDir: string
  pages: number
}

export async function buildSite(
  input: PartialConfig = {},
): Promise<BuildResult> {
  const config = resolveConfig(input)
  const log = getLogger()
  log.info('build config resolved', {
    contentDir: config.contentDir,
    outDir: config.outDir,
  })
  const files = await discoverContent(config.contentDir)
  let pages = 0
  for (const file of files) {
    const raw = await fs.readFile(file.absPath, 'utf-8')
    const parsed = matter(raw)
    const bodyHtml = await compileMdxToHtml(parsed.content)
    const title = resolveTitle(parsed.data, file.relPath)
    const html = await renderPage({
      title,
      bodyHtml,
      siteTitle: config.siteTitle,
    })

    const outPath = resolveOutPath(config.outDir, file)
    await ensureDir(outPath)
    await fs.writeFile(outPath, html, 'utf-8')
    log.info('page written', { outPath })
    pages += 1
  }

  const result = { outDir: config.outDir, pages }
  return result
}

function resolveOutPath(outDir: string, file: ContentFile) {
  const baseName = path.basename(file.relPath, file.ext)
  if (baseName === 'index') {
    return path.join(outDir, path.dirname(file.relPath), 'index.html')
  }
  return path.join(outDir, path.dirname(file.relPath), baseName, 'index.html')
}

function resolveTitle(frontmatter: Record<string, unknown>, relPath: string) {
  const title = frontmatter.title
  if (typeof title === 'string' && title.trim().length > 0) {
    return title.trim()
  }
  const base = path.basename(relPath, path.extname(relPath))
  return base === 'index' ? '' : base
}
