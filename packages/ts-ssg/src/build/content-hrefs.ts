import path from 'node:path'
import { urlNormalizer } from '@purestack/ts-util'
import type { ContentFile } from '../discover/content'
import { resolveRouteInfo } from '../routing/route'

export function resolvePageContentHref(
  href: string,
  sourceRelPath: string,
): string {
  const trimmed = href.trim()
  if (!trimmed || trimmed !== href) return href
  if (urlNormalizer.isSpecialHref(trimmed)) return href

  const { base, suffix } = urlNormalizer.splitSuffix(trimmed)
  const ext = path.posix.extname(base).toLowerCase()
  if (ext !== '.md' && ext !== '.mdx') return href

  const targetRelPath = resolveContentTargetRelPath(sourceRelPath, base)
  const route = resolveRouteInfo(toContentFile(targetRelPath, ext))
  return `${route.urlPath}${suffix}`
}

function resolveContentTargetRelPath(sourceRelPath: string, hrefBase: string) {
  const sourcePosix = toPosixPath(sourceRelPath)
  const hrefPosix = toPosixPath(hrefBase)
  const targetRelPath = hrefPosix.startsWith('/')
    ? path.posix.normalize(hrefPosix.replace(/^\/+/, ''))
    : path.posix.normalize(
        path.posix.join(path.posix.dirname(sourcePosix), hrefPosix),
      )
  if (targetRelPath === '..' || targetRelPath.startsWith('../')) {
    throw new Error(
      `Markdown content link escapes the content root: "${hrefBase}" from "${sourceRelPath}".`,
    )
  }
  return targetRelPath
}

function toContentFile(relPath: string, ext: string): ContentFile {
  return {
    absPath: relPath,
    relPath,
    ext,
  }
}

function toPosixPath(value: string) {
  return value.replaceAll('\\', '/')
}
