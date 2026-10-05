import { readContentSource } from '../discover/content-source'
import { parseFrontmatterSource } from '../frontmatter/frontmatter'
import { resolveRouteFileInfo } from '../routing/route'
import type { ContentMeta, NavigationContentFile } from './model'
import {
  humanizeSegment,
  resolveBoolean,
  resolveFolderKey,
  resolveNumber,
  resolveString,
} from './utils'

export async function loadContentMeta(
  files: NavigationContentFile[],
): Promise<ContentMeta[]> {
  const result: ContentMeta[] = []
  for (const file of files) {
    const raw = await readContentSource(file)
    const parsed = parseFrontmatterSource(raw, file.relPath)
    const frontmatter = parsed.frontmatter
    const route = resolveRouteFileInfo(file)
    const baseName = route.baseName
    const folder = resolveFolderKey(file.relPath)
    const { urlPath } = route

    const nav = frontmatter.nav
    const hidden =
      resolveBoolean(nav?.hidden) ||
      resolveBoolean(frontmatter.hidden) ||
      resolveBoolean(frontmatter.draft) ||
      frontmatter.index === false
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
      isFolderIndex: route.isFolderIndex,
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
