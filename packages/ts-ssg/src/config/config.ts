import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { isPlainObject } from '@purestack/utils'
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
  consent: ConsentConfig
  pagefind: PagefindConfig
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

export interface ConsentScriptConfig {
  src?: string
  content?: string
  type?: string
  async?: boolean
  defer?: boolean
  integrity?: string
  nonce?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
  referrerPolicy?: string
}

export interface ConsentServiceConfig {
  id: string
  category: string
  label?: string
  description?: string
  scripts: ConsentScriptConfig[]
}

export interface ConsentCategoryConfig {
  id: string
  label: string
  description?: string
  required?: boolean
}

export interface ConsentConfig {
  enabled: boolean
  storageKey: string
  policyVersion: string
  bannerTitle: string
  bannerDescription: string
  privacyPolicyUrl?: string
  privacyPolicyLabel: string
  acceptAllLabel: string
  rejectAllLabel: string
  manageLabel: string
  saveLabel: string
  settingsLabel: string
  categories: ConsentCategoryConfig[]
  services: ConsentServiceConfig[]
}

export interface PagefindConfig {
  excludePaths: string[]
}

export type PartialSitemapConfig = Partial<Omit<SitemapConfig, 'robots'>> & {
  robots?: Partial<RobotsConfig>
}

export type PartialConsentScriptConfig = Partial<ConsentScriptConfig>
export type PartialConsentServiceConfig = Partial<
  Omit<ConsentServiceConfig, 'scripts'>
> & {
  scripts?: PartialConsentScriptConfig[]
}
export type PartialConsentCategoryConfig = Partial<ConsentCategoryConfig>
export type PartialConsentConfig = Partial<
  Omit<ConsentConfig, 'categories' | 'services'>
> & {
  categories?: PartialConsentCategoryConfig[]
  services?: PartialConsentServiceConfig[]
}

export type PartialSiteConfig = Partial<
  Omit<SiteConfig, 'theme' | 'sitemap' | 'logo' | 'consent' | 'pagefind'>
> & {
  logo?: PartialLogoConfig
  theme?: ThemeOptionsInput
  sitemap?: PartialSitemapConfig
  consent?: PartialConsentConfig
  pagefind?: Partial<PagefindConfig>
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
    | 'consent'
    | 'pagefind'
  >
> & { theme?: ThemeOptionsInput; sitemap?: PartialSitemapConfig }

const DEFAULT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)
export const SITE_CONFIG_FILENAME = 'siteConfig.json'
const DEFAULT_CONSENT_CATEGORIES: ConsentCategoryConfig[] = [
  {
    id: 'necessary',
    label: 'Necessary',
    description: 'Required for core site functionality.',
    required: true,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    description: 'Stores optional settings like personalized UX behavior.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Helps improve the site by measuring usage.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Used for advertising and campaign attribution.',
  },
]

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
  const consent = resolveConsentConfig(input.consent, fileConfig.consent)
  const pagefind = resolvePagefindConfig(input.pagefind, fileConfig.pagefind)
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
    consent,
    pagefind,
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
    subtitleAlign: resolveSubtitleAlign(
      input?.subtitleAlign ?? file?.subtitleAlign,
    ),
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

function resolveConsentConfig(
  input?: PartialConsentConfig,
  file?: PartialConsentConfig,
): ConsentConfig {
  const categories = resolveConsentCategories(
    input?.categories,
    file?.categories,
  )
  const services = resolveConsentServices(
    input?.services,
    file?.services,
    categories,
  )
  return {
    enabled: input?.enabled ?? file?.enabled ?? false,
    storageKey: resolveString(
      input?.storageKey,
      file?.storageKey,
      'ts-ssg-consent',
    ),
    policyVersion: resolveString(
      input?.policyVersion,
      file?.policyVersion,
      '1',
    ),
    bannerTitle: resolveString(
      input?.bannerTitle,
      file?.bannerTitle,
      'Your privacy choices',
    ),
    bannerDescription: resolveString(
      input?.bannerDescription,
      file?.bannerDescription,
      'We use cookies and similar technologies to improve your experience. You can accept all, reject non-essential, or manage preferences.',
    ),
    privacyPolicyUrl: resolveOptionalString(
      input?.privacyPolicyUrl ?? file?.privacyPolicyUrl,
    ),
    privacyPolicyLabel: resolveString(
      input?.privacyPolicyLabel,
      file?.privacyPolicyLabel,
      'Privacy Policy',
    ),
    acceptAllLabel: resolveString(
      input?.acceptAllLabel,
      file?.acceptAllLabel,
      'Accept all',
    ),
    rejectAllLabel: resolveString(
      input?.rejectAllLabel,
      file?.rejectAllLabel,
      'Reject non-essential',
    ),
    manageLabel: resolveString(
      input?.manageLabel,
      file?.manageLabel,
      'Manage preferences',
    ),
    saveLabel: resolveString(input?.saveLabel, file?.saveLabel, 'Save choices'),
    settingsLabel: resolveString(
      input?.settingsLabel,
      file?.settingsLabel,
      'Privacy settings',
    ),
    categories,
    services,
  }
}

function resolvePagefindConfig(
  input?: Partial<PagefindConfig>,
  file?: Partial<PagefindConfig>,
): PagefindConfig {
  return {
    excludePaths: normalizePagefindExcludePaths(
      input?.excludePaths ?? file?.excludePaths,
    ),
  }
}

function resolveConsentCategories(
  input: PartialConsentCategoryConfig[] | undefined,
  file: PartialConsentCategoryConfig[] | undefined,
) {
  const source = Array.isArray(input)
    ? input
    : Array.isArray(file)
      ? file
      : DEFAULT_CONSENT_CATEGORIES
  const categories: ConsentCategoryConfig[] = []
  const seen = new Set<string>()
  for (const entry of source) {
    if (!isPlainObject(entry)) continue
    const id = resolveOptionalString(entry.id)
    if (!id) continue
    if (seen.has(id)) {
      throw new Error(`Duplicate consent category id "${id}".`)
    }
    const required = entry.required === true || id === 'necessary'
    const label = resolveString(entry.label, toTitleCase(id))
    categories.push({
      id,
      label,
      description: resolveOptionalString(entry.description),
      required,
    })
    seen.add(id)
  }
  if (!seen.has('necessary')) {
    categories.unshift({
      id: 'necessary',
      label: 'Necessary',
      description: 'Required for core site functionality.',
      required: true,
    })
  }
  return categories
}

function resolveConsentServices(
  input: PartialConsentServiceConfig[] | undefined,
  file: PartialConsentServiceConfig[] | undefined,
  categories: ConsentCategoryConfig[],
) {
  const source = Array.isArray(input) ? input : Array.isArray(file) ? file : []
  const categoryIds = new Set(categories.map((entry) => entry.id))
  const services: ConsentServiceConfig[] = []
  const seenServiceIds = new Set<string>()
  for (const entry of source) {
    if (!isPlainObject(entry)) continue
    const id = resolveOptionalString(entry.id)
    if (!id) continue
    if (seenServiceIds.has(id)) {
      throw new Error(`Duplicate consent service id "${id}".`)
    }
    const category = resolveOptionalString(entry.category)
    if (!category || !categoryIds.has(category)) {
      throw new Error(
        `Consent service "${id}" references unknown category "${entry.category ?? ''}".`,
      )
    }
    const scripts = resolveConsentServiceScripts(entry.scripts, id)
    services.push({
      id,
      category,
      label: resolveOptionalString(entry.label),
      description: resolveOptionalString(entry.description),
      scripts,
    })
    seenServiceIds.add(id)
  }
  return services
}

function resolveConsentServiceScripts(
  scripts: PartialConsentScriptConfig[] | undefined,
  serviceId: string,
) {
  if (!Array.isArray(scripts) || scripts.length === 0) {
    throw new Error(
      `Consent service "${serviceId}" must define at least one script.`,
    )
  }
  const resolved: ConsentScriptConfig[] = []
  for (const entry of scripts) {
    if (!isPlainObject(entry)) continue
    const src = resolveOptionalString(entry.src)
    const content = resolveOptionalString(entry.content)
    if (!src && !content) {
      throw new Error(
        `Consent service "${serviceId}" has a script without "src" or "content".`,
      )
    }
    resolved.push({
      src,
      content,
      type: resolveOptionalString(entry.type),
      async: entry.async === true,
      defer: entry.defer === true,
      integrity: resolveOptionalString(entry.integrity),
      nonce: resolveOptionalString(entry.nonce),
      crossOrigin: resolveCrossOrigin(entry.crossOrigin),
      referrerPolicy: resolveOptionalString(entry.referrerPolicy),
    })
  }
  if (resolved.length === 0) {
    throw new Error(`Consent service "${serviceId}" has no valid scripts.`)
  }
  return resolved
}

function resolveCrossOrigin(
  value: unknown,
): 'anonymous' | 'use-credentials' | undefined {
  if (value === 'anonymous' || value === 'use-credentials') return value
  return undefined
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

function toTitleCase(value: string) {
  const normalized = value.replaceAll(/[-_]+/g, ' ').trim()
  if (normalized.length === 0) return 'Consent'
  return normalized.replaceAll(/\b\w/g, (char) => char.toUpperCase())
}

function normalizePagefindExcludePaths(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const unique = new Set<string>()
  for (const entry of value) {
    if (typeof entry !== 'string') continue
    const trimmed = entry.trim()
    if (!trimmed) continue
    const normalized = normalizeExcludePath(trimmed)
    unique.add(normalized)
  }
  return [...unique]
}

function normalizeExcludePath(pathname: string): string {
  const normalized = pathname.replaceAll('\\', '/').trim()
  if (normalized === '/') return '/'
  const withLeading = normalized.startsWith('/') ? normalized : `/${normalized}`
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`
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
