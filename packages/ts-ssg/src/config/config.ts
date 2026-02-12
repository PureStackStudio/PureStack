import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  type NavigationConfig,
  resolveNavigationConfig,
} from '../navigation/navigation'
import { resolveThemes } from '../style/themeAssets'
import {
  type ThemeOptions,
  type ThemeOptionsInput,
  themes,
} from '../style/themeOptions'

export interface SiteConfig {
  rootDir: string
  contentDir: string
  outDir: string
  siteTitle: string
  logo: LogoConfig
  styleFileName: string
  styleHref: string
  styleThemes: string[]
  navigation: NavigationConfig
  theme: ThemeOptions
  sitemap: SitemapConfig
}

export interface LogoConfig {
  wordOne: string
  wordTwo: string
  subtitle?: string
  subtitleAlign?: 'start' | 'center' | 'end' | 'justify'
  href: string
  iconSvg?: string
  iconSize?: string
  wordFontSize?: string
  subtitleFontSize?: string
}

export type PartialLogoConfig = Partial<LogoConfig>

export interface SitemapConfig {
  enabled: boolean
  baseUrl: string
  fileName: string
  robots: RobotsConfig
}

export interface RobotsConfig {
  enabled: boolean
  fileName: string
  userAgent: string
  allow: string[]
  disallow: string[]
  crawlDelay?: number
  host?: string
  additionalSitemaps: string[]
  customDirectives: string[]
}

export type PartialSitemapConfig = Partial<Omit<SitemapConfig, 'robots'>> & {
  robots?: Partial<RobotsConfig>
}

export type PartialSiteConfig = Partial<
  Omit<SiteConfig, 'theme' | 'sitemap' | 'logo'>
> & {
  logo?: PartialLogoConfig
  theme?: ThemeOptionsInput
  sitemap?: PartialSitemapConfig
}
export type SiteConfigFile = Partial<
  Pick<
    SiteConfig,
    | 'outDir'
    | 'siteTitle'
    | 'logo'
    | 'styleFileName'
    | 'styleHref'
    | 'styleThemes'
    | 'navigation'
  >
> & { theme?: ThemeOptionsInput; sitemap?: PartialSitemapConfig }

const DEFAULT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)
export const SITE_CONFIG_FILENAME = 'siteConfig.json'

export function resolveSiteConfig(input: PartialSiteConfig = {}): SiteConfig {
  const rootDir = input.rootDir ?? DEFAULT_ROOT
  const contentDir = input.contentDir ?? path.join(rootDir, 'sample-content')
  const fileConfig = loadSiteConfigFile(contentDir)
  const outDir =
    input.outDir ??
    resolveOutDirFromFile(fileConfig.outDir, rootDir) ??
    path.join(rootDir, 'dist', 'site')
  const siteTitle = resolveString(
    input.siteTitle,
    fileConfig.siteTitle,
    'ts-ssg',
  )
  const logo = resolveLogoConfig(input.logo, fileConfig.logo)
  const styleFileName = resolveString(
    input.styleFileName,
    fileConfig.styleFileName,
    'site.css',
  )
  const styleHref = resolveString(
    input.styleHref,
    fileConfig.styleHref,
    `/${styleFileName}`,
  )
  const styleThemes = resolveThemes(input.styleThemes, fileConfig.styleThemes)
  const navigation = resolveNavigationConfig(
    input.navigation,
    fileConfig.navigation,
  )
  const theme = themes.resolve(input.theme, fileConfig.theme)
  const sitemap = resolveSitemapConfig(input.sitemap, fileConfig.sitemap)
  return {
    rootDir,
    contentDir,
    outDir,
    siteTitle,
    logo,
    styleFileName,
    styleHref,
    styleThemes,
    navigation,
    theme,
    sitemap,
  }
}

function resolveLogoConfig(
  input?: PartialLogoConfig,
  file?: PartialLogoConfig,
): LogoConfig {
  return {
    wordOne: resolveString(input?.wordOne, file?.wordOne, 'Pure'),
    wordTwo: resolveString(input?.wordTwo, file?.wordTwo, 'Stack'),
    subtitle: resolveOptionalString(input?.subtitle ?? file?.subtitle),
    subtitleAlign: resolveSubtitleAlign(input?.subtitleAlign ?? file?.subtitleAlign),
    href: resolveString(input?.href, file?.href, '/'),
    iconSvg: resolveOptionalString(input?.iconSvg ?? file?.iconSvg),
    iconSize: resolveOptionalString(input?.iconSize ?? file?.iconSize),
    wordFontSize: resolveOptionalString(
      input?.wordFontSize ?? file?.wordFontSize,
    ),
    subtitleFontSize: resolveOptionalString(
      input?.subtitleFontSize ?? file?.subtitleFontSize,
    ),
  }
}

function resolveSubtitleAlign(
  value: unknown,
): 'start' | 'center' | 'end' | 'justify' | undefined {
  if (
    value === 'start' ||
    value === 'center' ||
    value === 'end' ||
    value === 'justify'
  )
    return value
  return undefined
}

function resolveString(...values: Array<string | undefined>) {
  for (const value of values) {
    if (typeof value === 'string' && value.length > 0) return value
  }
  return ''
}

function resolveOutDirFromFile(value: unknown, rootDir: string) {
  if (typeof value !== 'string' || value.length === 0) return undefined
  if (path.isAbsolute(value)) return value
  return path.join(rootDir, value)
}

function resolveSitemapConfig(
  input?: PartialSitemapConfig,
  file?: PartialSitemapConfig,
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

function normalizeBaseUrl(value: string): string {
  const normalized = value.trim()
  if (normalized.length === 0) return ''
  return normalized.replace(/\/+$/, '')
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

function resolveOptionalString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  return normalized.length > 0 ? normalized : undefined
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

function loadSiteConfigFile(contentDir: string): SiteConfigFile {
  const filePath = path.join(contentDir, SITE_CONFIG_FILENAME)
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('siteConfig.json must contain a JSON object.')
    }
    return parsed as SiteConfigFile
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return {}
    const message = err.message ?? String(err)
    throw new Error(`Failed to read ${SITE_CONFIG_FILENAME}: ${message}`, {
      cause: error,
    })
  }
}
