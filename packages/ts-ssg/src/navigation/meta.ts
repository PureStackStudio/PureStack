import fs from 'node:fs/promises'
import path from 'node:path'
import { resolveRouteInfo } from '../build/out-path'
import type { ContentFile } from '../discover/content'
import { parseFrontmatterSource } from '../frontmatter/frontmatter'
import type { ContentMeta } from './model'
import {
  humanizeSegment,
  resolveBoolean,
  resolveFolderKey,
  resolveNumber,
  resolveString,
  toPosixPath,
} from './utils'

export async function loadContentMeta(
  files: ContentFile[],
): Promise<ContentMeta[]> {
  const result: ContentMeta[] = []
  for (const file of files) {
    const raw = await fs.readFile(file.absPath, 'utf8')
    const parsed = parseFrontmatterSource(raw, file.relPath)
    const frontmatter = parsed.frontmatter
    const relPosix = toPosixPath(file.relPath)
    const baseName = path.posix.basename(relPosix, file.ext)
    const isIndex = baseName === 'index'
    const folder = resolveFolderKey(file.relPath)
    const { urlPath } = resolveRouteInfo(file)

    const nav = frontmatter.nav
    const hidden =
      resolveBoolean(nav?.hidden) ||
      resolveBoolean(frontmatter.hidden) ||
      resolveBoolean(frontmatter.draft)
    const title =
      resolveString(nav?.title) ||
      resolveString(frontmatter.title) ||
      extractHeadingTitle(parsed.body) ||
      humanizeSegment(baseName)
    const order = resolveNumber(nav?.order) ?? resolveNumber(frontmatter.order)
    const badge = resolveString(nav?.badge)
    const icon = resolveString(nav?.icon)

    result.push({
      file,
      folder,
      urlPath,
      title,
      order,
      badge,
      icon,
      hidden,
      isIndex,
    })
  }
  return result
}

function extractHeadingTitle(content: string) {
  const match = content.match(/^\s*#\s+(.+?)\s*$/m)
  if (!match) return undefined
  return match[1]
    .replace(/\s*#+\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
}
