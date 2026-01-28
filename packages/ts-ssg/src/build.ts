import fs from 'node:fs/promises'
import path from 'node:path'

import matter from 'gray-matter'

import { type PartialConfig, resolveConfig } from './config'
import { discoverContent } from './content'
import { ensureDir, replaceExt } from './fs'
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

    const outPath = path.join(config.outDir, replaceExt(file.relPath, '.html'))
    await ensureDir(outPath)
    await fs.writeFile(outPath, html, 'utf-8')
    pages += 1
  }

  return { outDir: config.outDir, pages }
}

function resolveTitle(frontmatter: Record<string, unknown>, relPath: string) {
  const title = frontmatter.title
  if (typeof title === 'string' && title.trim().length > 0) {
    return title.trim()
  }
  const base = path.basename(relPath, path.extname(relPath))
  return base === 'index' ? '' : base
}
