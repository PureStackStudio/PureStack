import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { urlNormalizer } from '@purestack/ts-util'
import type { ContentFile } from '../discover/content'
import { isContentExt } from '../discover/contentExtensions'
import { resolveContentTarget } from '../i18n/content'
import { resolveRouteInfo } from '../routing/route'

export function resolvePageContentHref(
  href: string,
  sourceRelPath: string,
  config?: SiteConfig,
): string {
  const trimmed = href.trim()
  if (!trimmed || trimmed !== href) return href
  if (urlNormalizer.isSpecialHref(trimmed)) return href

  const { base, suffix } = urlNormalizer.splitSuffix(trimmed)
  const ext = path.posix.extname(base).toLowerCase()
  if (!isContentExt(ext)) return href

  const targetRelPath = resolveContentTargetRelPath(sourceRelPath, base, config)
  const targetFile =
    config?.i18n.enabled === true
      ? resolveContentTarget(config, targetRelPath, ext)
      : toContentFile(targetRelPath, ext)
  const route = resolveRouteInfo(targetFile)
  return `${route.urlPath}${suffix}`
}

function resolveContentTargetRelPath(
  sourceRelPath: string,
  hrefBase: string,
  config?: SiteConfig,
) {
  const sourcePosix = toPosixPath(sourceRelPath)
  const hrefPosix = toPosixPath(hrefBase)
  const targetRelPath = hrefPosix.startsWith('/')
    ? resolveAbsoluteContentTargetRelPath(sourcePosix, hrefPosix, config)
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

function resolveAbsoluteContentTargetRelPath(
  sourceRelPath: string,
  hrefPath: string,
  config?: SiteConfig,
) {
  const targetRelPath = path.posix.normalize(hrefPath.replace(/^\/+/, ''))
  if (!config?.i18n.enabled) return targetRelPath
  const sourceLocale = resolveSourceLocale(sourceRelPath, config)
  if (!sourceLocale) return targetRelPath
  const targetLocale = targetRelPath.split('/')[0]
  if (config.i18n.locales.includes(targetLocale)) return targetRelPath
  return path.posix.join(sourceLocale, targetRelPath)
}

function resolveSourceLocale(sourceRelPath: string, config: SiteConfig) {
  const sourceLocale = sourceRelPath.split('/')[0]
  return config.i18n.locales.includes(sourceLocale) ? sourceLocale : undefined
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
