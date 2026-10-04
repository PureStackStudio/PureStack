import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { isTypeScriptAssetPath, urlNormalizer } from '@purestack/ts-util'
import { CONTENT_EXTS, isContentExt } from '../discover/contentExtensions'
import type { ResolvedContentFile } from '../i18n/content'
import { resolveRouteInfo } from '../routing/route'

const CONTENT_EXT_LIST = [...CONTENT_EXTS]

/**
 * Every page and asset the build publishes from the content folder, keyed by
 * posix source path, so content URLs are checked without touching the disk.
 */
export class ContentRouteIndex {
  private readonly pagesByRelPath = new Map<string, ResolvedContentFile>()
  private readonly assetRelPaths = new Set<string>()

  constructor(
    pages: readonly ResolvedContentFile[],
    assets: Iterable<string> = [],
  ) {
    for (const page of pages) {
      this.pagesByRelPath.set(toIndexKey(page.relPath, page.ext), page)
    }
    for (const asset of assets) {
      // TypeScript sources become hashed bundles, not files at their own path.
      if (!isTypeScriptAssetPath(asset)) {
        this.assetRelPaths.add(toPosixPath(asset))
      }
    }
  }

  get pages() {
    return [...this.pagesByRelPath.values()]
  }

  withPages(pages: readonly ResolvedContentFile[]) {
    return new ContentRouteIndex(pages, this.assetRelPaths)
  }

  withAssets(assets: Iterable<string>) {
    return new ContentRouteIndex(this.pages, assets)
  }

  hasSameFiles(other: ContentRouteIndex | undefined) {
    return (
      other !== undefined &&
      haveSameKeys(this.pagesByRelPath, other.pagesByRelPath) &&
      haveSameKeys(this.assetRelPaths, other.assetRelPaths)
    )
  }

  findFile(relPath: string) {
    return this.pagesByRelPath.get(
      toIndexKey(relPath, path.posix.extname(relPath)),
    )
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

  hasAsset(relPath: string) {
    return this.assetRelPaths.has(relPath)
  }

  private findWithContentExt(stem: string) {
    for (const ext of CONTENT_EXT_LIST) {
      const file = this.pagesByRelPath.get(`${stem}${ext}`)
      if (file) return file
    }
    return undefined
  }
}

/**
 * Turns a URL written in content into the public URL of the page or file it
 * names.
 *
 * Relative URLs are relative to the source file. Pages may omit their
 * extension; files are named exactly. Either must exist or the build fails.
 * Root-absolute URLs without a content extension may be served by another
 * build, so they pass through unchanged, as do external, hash and query URLs.
 */
export function resolveContentUrl(
  url: string,
  sourceRelPath: string,
  routes: ContentRouteIndex,
  config?: SiteConfig,
): string {
  if (!url || url.trim() !== url) return url
  if (urlNormalizer.isSpecialHref(url)) return url

  const { base, suffix } = urlNormalizer.splitSuffix(url)
  const urlPath = toPosixPath(base)
  const ext = path.posix.extname(urlPath).toLowerCase()
  const isContentLink = isContentExt(ext)
  const isAbsolute = urlPath.startsWith('/')
  if (isAbsolute && !isContentLink) return url

  const source = toPosixPath(sourceRelPath)
  const targetRelPath = isAbsolute
    ? resolveAbsoluteTargetRelPath(source, urlPath, config)
    : path.posix.join(path.posix.dirname(source), decodePath(urlPath))
  if (escapesContentRoot(targetRelPath)) {
    throw new Error(
      `Content link "${url}" in "${source}" escapes the content root.`,
    )
  }

  const publicPath = findWithLocaleFallback(
    targetRelPath,
    source,
    config,
    (relPath) => findPublicPath(routes, relPath, urlPath, isContentLink),
  )
  if (publicPath) return `${publicPath}${suffix}`
  throw new Error(
    ext
      ? `Content link "${url}" in "${source}" points to a missing file "${targetRelPath}".`
      : `Content link "${url}" in "${source}" does not match any page or file. Write a root-absolute URL such as "/blog/" for anything outside this content folder.`,
  )
}

function findPublicPath(
  routes: ContentRouteIndex,
  targetRelPath: string,
  urlPath: string,
  isContentLink: boolean,
) {
  if (isContentLink) return toPageUrl(routes.findFile(targetRelPath))
  const stem = toPageStem(targetRelPath)
  const preferFolder = isFolderPath(urlPath)
  // A page always has a content extension, so an exact file is an asset.
  if (!preferFolder && routes.hasAsset(stem)) return `/${stem}`
  return toPageUrl(routes.findPage(stem, preferFolder))
}

function toPageUrl(page: ResolvedContentFile | undefined) {
  return page ? resolveRouteInfo(page).urlPath : undefined
}

function resolveAbsoluteTargetRelPath(
  source: string,
  urlPath: string,
  config?: SiteConfig,
) {
  const targetRelPath = path.posix.normalize(
    decodePath(urlPath).replace(/^\/+/, ''),
  )
  if (!config?.i18n.enabled) return targetRelPath
  const sourceLocale = resolveLocale(source, config)
  if (!sourceLocale || resolveLocale(targetRelPath, config)) {
    return targetRelPath
  }
  return path.posix.join(sourceLocale, targetRelPath)
}

/**
 * A translated page may use a page or file that exists only in the default
 * locale; the URL then names that one instead of failing the build.
 */
function findWithLocaleFallback(
  targetRelPath: string,
  source: string,
  config: SiteConfig | undefined,
  find: (relPath: string) => string | undefined,
) {
  const publicPath = find(targetRelPath)
  if (publicPath || !config?.i18n.enabled) return publicPath
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
function isFolderPath(urlPath: string) {
  return /(^|\/)\.{0,2}$/.test(urlPath)
}

function decodePath(value: string) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function haveSameKeys(
  left: ReadonlyMap<string, unknown> | ReadonlySet<string>,
  right: ReadonlyMap<string, unknown> | ReadonlySet<string>,
) {
  if (left.size !== right.size) return false
  for (const key of left.keys()) {
    if (!right.has(key)) return false
  }
  return true
}

function toIndexKey(relPath: string, ext: string) {
  const posix = toPosixPath(relPath)
  return `${posix.slice(0, posix.length - ext.length)}${ext.toLowerCase()}`
}

function toPosixPath(value: string) {
  return value.replaceAll('\\', '/')
}
