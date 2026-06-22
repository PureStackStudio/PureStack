import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import type { ContentFile } from '../discover/content'
import { resolveRouteInfo } from '../routing/route'

export interface ResolvedContentFile extends ContentFile {
  routeRelPath: string
  outputRelPath: string
  urlPath: string
  locale?: string
  translationKey?: string
}

export type ContentTranslationsByKey = Map<string, ResolvedContentFile[]>

export function resolveContentFiles(
  config: SiteConfig,
  files: ContentFile[],
): ResolvedContentFile[] {
  const localeSet = new Set(config.i18n.locales)
  const resolved = files.map((file) =>
    resolveContentFile(config, file, localeSet),
  )
  return config.i18n.enabled
    ? resolved.sort(compareResolvedContentFiles(config.i18n.defaultLocale))
    : resolved
}

export function resolveContentFile(
  config: SiteConfig,
  file: ContentFile,
  localeSet = new Set(config.i18n.locales),
): ResolvedContentFile {
  if (!config.i18n.enabled) return resolvePlainContentFile(file)
  const sourceRelPath = toPosixPath(file.relPath)
  const [locale = '', ...rest] = sourceRelPath.split('/')
  if (!localeSet.has(locale) || rest.length === 0) {
    return resolvePlainContentFile(file)
  }
  const routeRelPath = rest.join('/')
  const logicalRoute = resolveRouteInfo({
    ...file,
    relPath: routeRelPath,
  }).urlPath
  const urlPath =
    config.i18n.urlStrategy === 'prefix-all'
      ? withLocalePrefix(locale, logicalRoute)
      : logicalRoute
  return {
    ...file,
    locale,
    routeRelPath,
    outputRelPath: sourceRelPath,
    urlPath,
    translationKey: resolveTranslationKey(routeRelPath, file.ext),
  }
}

export function resolveContentTarget(
  config: SiteConfig,
  relPath: string,
  ext: string,
): ResolvedContentFile {
  const file: ContentFile = {
    absPath: relPath,
    relPath,
    ext,
  }
  return resolveContentFile(config, file)
}

export function buildTranslationsByKey(
  files: ResolvedContentFile[],
): ContentTranslationsByKey {
  const byKey: ContentTranslationsByKey = new Map()
  for (const file of files) {
    if (!file.translationKey || !file.locale) continue
    const entries = byKey.get(file.translationKey) ?? []
    entries.push(file)
    byKey.set(file.translationKey, entries)
  }
  return byKey
}

export function resolvePlainContentFile(
  file: ContentFile,
): ResolvedContentFile {
  const routeRelPath = toPosixPath(file.relPath)
  const urlPath = resolveRouteInfo({ ...file, relPath: routeRelPath }).urlPath
  return {
    ...file,
    routeRelPath,
    outputRelPath: routeRelPath,
    urlPath,
  }
}

function compareResolvedContentFiles(defaultLocale: string) {
  return (left: ResolvedContentFile, right: ResolvedContentFile) => {
    const localeOrder = compareLocale(left.locale, right.locale, defaultLocale)
    if (localeOrder !== 0) return localeOrder
    return left.relPath.localeCompare(right.relPath)
  }
}

function compareLocale(
  left: string | undefined,
  right: string | undefined,
  defaultLocale: string,
) {
  if (left === right) return 0
  if (left === defaultLocale) return -1
  if (right === defaultLocale) return 1
  return (left ?? '').localeCompare(right ?? '')
}

function withLocalePrefix(locale: string, urlPath: string) {
  if (urlPath === '/') return `/${locale}/`
  return `/${locale}${urlPath}`
}

function resolveTranslationKey(routeRelPath: string, ext: string) {
  const route = resolveRouteInfo({
    absPath: routeRelPath,
    relPath: routeRelPath,
    ext,
  }).route
  return route || 'index'
}

function toPosixPath(filePath: string) {
  return filePath.split(path.sep).join('/')
}
