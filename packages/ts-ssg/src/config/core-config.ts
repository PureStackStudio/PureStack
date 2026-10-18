import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type {
  I18nConfig,
  I18nUrlStrategy,
  RobotsConfig,
  SiteConfig,
  SiteConfigDraft,
  SiteConfigInput,
  SiteConfigResolver,
  SiteHtmlConfig,
  SiteMdxConfig,
  SitemapConfig,
  SiteScriptsConfig,
} from '@purestack/ts-common'
import type { DeepPartial } from '@purestack/ts-util'
import {
  clonePlainData,
  isPlainObject,
  merge,
  normalizeBasePath,
  pickBoolean,
  resolveOptionalString,
  resolveString,
} from '@purestack/ts-util'
import { resolveNavigationConfig } from '../navigation/navigation'

const DEFAULT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)
export const SITE_CONFIG_FILENAME = 'siteConfig.json'

export function resolveSiteContentDir(input: SiteConfigInput = {}) {
  return (
    input.contentDir ??
    path.join(input.rootDir ?? DEFAULT_ROOT, 'sample-content')
  )
}

export function resolveCoreSiteConfig(
  input: SiteConfigInput = {},
  resolvers: readonly SiteConfigResolver[] = [],
  fileConfig: SiteConfigInput = loadSiteConfigFile(
    resolveSiteContentDir(input),
  ),
): SiteConfig {
  const rootDir = input.rootDir ?? DEFAULT_ROOT
  const contentDir = resolveSiteContentDir(input)
  const outDir =
    input.outDir ??
    resolvePathFromFileConfig(fileConfig.outDir, contentDir) ??
    path.join(rootDir, 'dist', 'site')
  const publishDir =
    input.publishDir ??
    resolvePathFromFileConfig(fileConfig.publishDir, contentDir) ??
    path.join(rootDir, 'dist', 'publish')
  const basePath = normalizeBasePath(
    resolveString(input.basePath, fileConfig.basePath),
  )
  const siteTitle = resolveString(
    input.siteTitle,
    fileConfig.siteTitle,
    'ts-ssg',
  )
  const html = resolveHtmlConfig(input.html, fileConfig.html)
  const navigation = resolveNavigationConfig(
    input.navigation,
    fileConfig.navigation,
  )
  const scripts = resolveScriptsConfig(input.scripts, fileConfig.scripts)
  const sitemap = resolveSitemapConfig(input.sitemap, fileConfig.sitemap)
  const i18n = resolveI18nConfig(input.i18n, fileConfig.i18n)
  const mdx = resolveMdxConfig(input.mdx, fileConfig.mdx)
  for (const extensions of [fileConfig.extensions, input.extensions]) {
    if (extensions !== undefined && !isPlainObject(extensions))
      throw new Error('extensions must be an object of plugin settings.')
  }
  const config: SiteConfigDraft = {
    extensions: clonePlainData(
      merge(fileConfig.extensions ?? {}, input.extensions),
    ),
    rootDir,
    contentDir,
    outDir,
    publishDir,
    basePath,
    siteTitle,
    html,
    navigation,
    scripts,
    sitemap,
    i18n,
    mdx,
  }
  return applyConfigResolvers(config, resolvers, input, fileConfig)
}

export function applyConfigResolvers(
  config: SiteConfigDraft,
  resolvers: readonly SiteConfigResolver[],
  input: SiteConfigInput = {},
  file: SiteConfigInput = {},
): SiteConfig {
  for (const resolve of resolvers) {
    const contribution = resolve({ config, input, file })
    if (!isPlainObject(contribution))
      throw new Error('A configuration contribution must return an object.')
    config = merge(config, clonePlainData(contribution))
  }
  // The selected owners have now normalized their sections and finalized them.
  return config as SiteConfig
}

function resolveScriptsConfig(
  input?: DeepPartial<SiteScriptsConfig>,
  file?: DeepPartial<SiteScriptsConfig>,
): SiteScriptsConfig {
  return {
    cacheBusting: pickBoolean(input?.cacheBusting, file?.cacheBusting, true),
  }
}

function resolveHtmlConfig(
  input?: DeepPartial<SiteHtmlConfig>,
  file?: DeepPartial<SiteHtmlConfig>,
): SiteHtmlConfig {
  return {
    minify: pickBoolean(input?.minify, file?.minify, false),
  }
}

function resolvePathFromFileConfig(value: unknown, contentDir: string) {
  if (typeof value !== 'string' || value.length === 0) return undefined
  if (path.isAbsolute(value)) return value
  return path.resolve(contentDir, value)
}

function resolveSitemapConfig(
  input?: DeepPartial<SitemapConfig>,
  file?: DeepPartial<SitemapConfig>,
): SitemapConfig {
  const baseUrl = normalizeBaseUrl(input?.baseUrl ?? file?.baseUrl ?? '')
  const enabled = input?.enabled ?? file?.enabled ?? false
  const fileName = resolveString(input?.fileName, file?.fileName, 'sitemap.xml')
  const robots = resolveRobotsConfig(input?.robots, file?.robots)
  if (enabled && baseUrl.length === 0) {
    throw new Error(
      'Sitemap is enabled but sitemap.baseUrl is missing. Provide an absolute base URL.',
    )
  }
  if (robots.enabled && robots.fileName.length === 0) {
    throw new Error(
      'Sitemap robots config is enabled but sitemap.robots.fileName is empty.',
    )
  }
  return {
    enabled,
    baseUrl,
    fileName,
    robots,
  }
}

function resolveI18nConfig(
  input?: DeepPartial<I18nConfig>,
  file?: DeepPartial<I18nConfig>,
): I18nConfig {
  const rawLocales = input?.locales ?? file?.locales
  const locales = normalizeLocales(rawLocales)
  const defaultLocale =
    normalizeLocale(input?.defaultLocale ?? file?.defaultLocale) ??
    locales[0] ??
    ''
  const enabled =
    pickBoolean(input?.enabled, file?.enabled, false) || locales.length > 0
  const resolvedLocales = enabled
    ? normalizeLocales([defaultLocale, ...locales])
    : []
  if (enabled && !defaultLocale) {
    throw new Error(
      'i18n.defaultLocale is required when i18n is enabled or locales are configured.',
    )
  }
  if (enabled && !resolvedLocales.includes(defaultLocale)) {
    throw new Error('i18n.locales must include i18n.defaultLocale.')
  }
  return {
    enabled,
    defaultLocale: enabled ? defaultLocale : '',
    locales: resolvedLocales,
    urlStrategy: resolveI18nUrlStrategy(
      input?.urlStrategy ?? file?.urlStrategy,
    ),
    queryParam: resolveString(input?.queryParam, file?.queryParam, 'lang'),
    cookieName: resolveString(
      input?.cookieName,
      file?.cookieName,
      'ts-ssg.lang',
    ),
  }
}

function normalizeLocales(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const result: string[] = []
  const seen = new Set<string>()
  for (const entry of value) {
    const locale = normalizeLocale(entry)
    if (!locale || seen.has(locale)) continue
    seen.add(locale)
    result.push(locale)
  }
  return result
}

function normalizeLocale(value: unknown): string | undefined {
  const locale = resolveOptionalString(value)
  if (!locale) return undefined
  if (!/^[A-Za-z0-9-]+$/.test(locale)) {
    throw new Error(`Invalid locale "${locale}".`)
  }
  return locale
}

function resolveI18nUrlStrategy(value: unknown): I18nUrlStrategy {
  if (value === 'hidden') return 'hidden'
  return 'prefix-all'
}

function resolveMdxConfig(
  input?: Partial<SiteMdxConfig>,
  file?: Partial<SiteMdxConfig>,
): SiteMdxConfig {
  return {
    ...((input?.highlighter ?? file?.highlighter) !== undefined
      ? { highlighter: input?.highlighter ?? file?.highlighter }
      : {}),
    disableHighlighter:
      input?.disableHighlighter ?? file?.disableHighlighter ?? false,
    compileMdAsMdx: input?.compileMdAsMdx ?? file?.compileMdAsMdx ?? true,
  }
}

function normalizeBaseUrl(value: string): string {
  const normalized = value.trim()
  let end = normalized.length
  while (end > 0 && normalized[end - 1] === '/') --end
  return normalized.slice(0, end)
}

function resolveRobotsConfig(
  input?: Partial<RobotsConfig>,
  file?: Partial<RobotsConfig>,
): RobotsConfig {
  return {
    enabled: input?.enabled ?? file?.enabled ?? true,
    fileName: resolveString(input?.fileName, file?.fileName, 'robots.txt'),
    userAgent: resolveString(input?.userAgent, file?.userAgent, '*'),
    allow: normalizeDirectiveList(input?.allow ?? file?.allow, ['/']),
    disallow: normalizeDirectiveList(input?.disallow ?? file?.disallow, []),
    crawlDelay: normalizeOptionalNumber(input?.crawlDelay ?? file?.crawlDelay),
    host: resolveOptionalString(input?.host ?? file?.host),
    additionalSitemaps: normalizeDirectiveList(
      input?.additionalSitemaps ?? file?.additionalSitemaps,
      [],
    ),
    customDirectives: normalizeDirectiveList(
      input?.customDirectives ?? file?.customDirectives,
      [],
    ),
  }
}

function normalizeOptionalNumber(value: unknown) {
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined
  if (value < 0) return undefined
  return value
}

function normalizeDirectiveList(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) return fallback
  const normalized = value
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
  return normalized.length > 0 ? normalized : fallback
}

export function loadSiteConfigFile(
  contentDir: string,
): SiteConfigInput & { plugins?: string[]; defaultPlugins?: boolean } {
  const filePath = path.join(contentDir, SITE_CONFIG_FILENAME)
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('siteConfig.json must contain a JSON object.')
    }
    return parsed as SiteConfigInput & {
      plugins?: string[]
      defaultPlugins?: boolean
    }
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return {}
    const message = err.message ?? String(err)
    throw new Error(`Failed to read ${SITE_CONFIG_FILENAME}: ${message}`, {
      cause: error,
    })
  }
}
