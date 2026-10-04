import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { urlNormalizer } from '@purestack/ts-util'
import { CONTENT_EXTS, isContentExt } from '../discover/contentExtensions'
import type { ResolvedContentFile } from '../i18n/content'
import { resolveRouteInfo } from '../routing/route'

const CONTENT_EXT_LIST = [...CONTENT_EXTS]

/**
 * Every content page the build knows, keyed by its posix source path, so a
 * content link is checked against real files without touching the disk.
 */
export class ContentRouteIndex {
  private readonly byRelPath = new Map<string, ResolvedContentFile>()

  constructor(files: readonly ResolvedContentFile[]) {
    for (const file of files) {
      this.byRelPath.set(toIndexKey(file.relPath, file.ext), file)
    }
  }

  hasSamePages(other: ContentRouteIndex | undefined) {
    if (!other || other.byRelPath.size !== this.byRelPath.size) return false
    for (const relPath of this.byRelPath.keys()) {
      if (!other.byRelPath.has(relPath)) return false
    }
    return true
  }

  findFile(relPath: string) {
    return this.byRelPath.get(toIndexKey(relPath, path.posix.extname(relPath)))
  }

  /**
   * Finds the page an extension-less path names. `a/c` is the file `a/c.*`,
   * else the folder page `a/c/index.*` or `a/c/c.*`; `a/c/` asks for the
   * folder page first.
   */
  findPage(stem: string, preferFolder: boolean) {
    if (!stem) return this.findWithContentExt('index')
    const file = () => this.findWithContentExt(stem)
    const folder = () =>
      this.findWithContentExt(`${stem}/index`) ??
      this.findWithContentExt(`${stem}/${path.posix.basename(stem)}`)
    return preferFolder ? (folder() ?? file()) : (file() ?? folder())
  }

  private findWithContentExt(stem: string) {
    for (const ext of CONTENT_EXT_LIST) {
      const file = this.byRelPath.get(`${stem}${ext}`)
      if (file) return file
    }
    return undefined
  }
}

/**
 * Turns a link written in content into the URL of the page it names.
 *
 * Relative links are relative to the source file, with or without a content
 * extension, and must match a page or the build fails. Root-absolute links
 * without a content extension are URLs, possibly served by another build, so
 * they pass through unchanged, as do external, hash, query and asset links.
 */
export function resolveContentHref(
  href: string,
  sourceRelPath: string,
  routes: ContentRouteIndex,
  config?: SiteConfig,
): string {
  if (!href || href.trim() !== href) return href
  if (urlNormalizer.isSpecialHref(href)) return href

  const { base, suffix } = urlNormalizer.splitSuffix(href)
  const hrefPath = toPosixPath(base)
  const ext = path.posix.extname(hrefPath).toLowerCase()
  const isContentLink = isContentExt(ext)
  const isAbsolute = hrefPath.startsWith('/')
  if (isAbsolute && !isContentLink) return href

  const source = toPosixPath(sourceRelPath)
  const targetRelPath = isAbsolute
    ? resolveAbsoluteTargetRelPath(source, hrefPath, config)
    : path.posix.join(path.posix.dirname(source), decodePath(hrefPath))
  const isAsset = Boolean(ext) && !isContentLink
  if (escapesContentRoot(targetRelPath)) {
    if (isAsset) return href
    throw new Error(
      `Content link "${href}" in "${source}" escapes the content root.`,
    )
  }

  const file = findWithLocaleFallback(
    isContentLink ? targetRelPath : toPageStem(targetRelPath),
    source,
    config,
    isContentLink
      ? (relPath) => routes.findFile(relPath)
      : (stem) => routes.findPage(stem, isFolderPath(hrefPath)),
  )
  if (file) return `${resolveRouteInfo(file).urlPath}${suffix}`
  // A relative link with a non-content extension names an asset, not a page.
  if (isAsset) return href
  throw new Error(
    isContentLink
      ? `Content link "${href}" in "${source}" points to a missing file "${targetRelPath}".`
      : `Content link "${href}" in "${source}" does not match any page. Write a root-absolute URL such as "/blog/" for pages outside this content folder.`,
  )
}

function resolveAbsoluteTargetRelPath(
  source: string,
  hrefPath: string,
  config?: SiteConfig,
) {
  const targetRelPath = path.posix.normalize(
    decodePath(hrefPath).replace(/^\/+/, ''),
  )
  if (!config?.i18n.enabled) return targetRelPath
  const sourceLocale = resolveLocale(source, config)
  if (!sourceLocale || resolveLocale(targetRelPath, config)) {
    return targetRelPath
  }
  return path.posix.join(sourceLocale, targetRelPath)
}

/**
 * A translated page may link to a page that exists only in the default
 * locale; the link then names that page instead of failing the build.
 */
function findWithLocaleFallback(
  targetRelPath: string,
  source: string,
  config: SiteConfig | undefined,
  find: (relPath: string) => ResolvedContentFile | undefined,
) {
  const file = find(targetRelPath)
  if (file || !config?.i18n.enabled) return file
  const locale = resolveLocale(targetRelPath, config)
  const { defaultLocale } = config.i18n
  if (!locale || !defaultLocale || locale === defaultLocale) return undefined
  if (resolveLocale(source, config) !== locale) return undefined
  return find(`${defaultLocale}${targetRelPath.slice(locale.length)}`)
}

function resolveLocale(relPath: string, config: SiteConfig) {
  const locale = relPath.split('/')[0]
  return config.i18n.locales.includes(locale) ? locale : undefined
}

function escapesContentRoot(relPath: string) {
  return relPath === '..' || relPath.startsWith('../')
}

/** `guides/` and `.` name folders; the content root is the empty stem. */
function toPageStem(relPath: string) {
  const stem = relPath.replace(/\/+$/, '')
  return stem === '.' ? '' : stem
}

/** `./`, `.`, `..` and `guides/` name folders; `guides` may name a file. */
function isFolderPath(hrefPath: string) {
  return /(^|\/)\.{0,2}$/.test(hrefPath)
}

function decodePath(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function toIndexKey(relPath: string, ext: string) {
  const posix = toPosixPath(relPath)
  return `${posix.slice(0, posix.length - ext.length)}${ext.toLowerCase()}`
}

function toPosixPath(value: string) {
  return value.replaceAll('\\', '/')
}
