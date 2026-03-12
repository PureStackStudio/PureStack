import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  resolveThemes,
  type ThemeOptions,
  type ThemeOptionsInput,
  themes,
} from '@purestack/ts-components'
import type { DeepPartial } from '@purestack/ts-util'
import { isPlainObject } from '@purestack/utils'
import {
  type NavigationConfig,
  resolveNavigationConfig,
} from '../navigation/navigation'

export interface SiteConfig {
  rootDir: string
  contentDir: string
  outDir: string
  siteTitle: string
  logo: LogoConfig
  style: SiteStyleConfig
  html: SiteHtmlConfig
  navigation: NavigationConfig
  sitemap: SitemapConfig
  consent: ConsentConfig
  analytics: AnalyticsConfig
  pagefind: PagefindConfig
  mdx: SiteMdxConfig
}

export interface SiteStyleConfig {
  fileName: string
  href: string
  themes: string[]
  pretty: boolean
  theme: ThemeOptions
}

export interface SiteHtmlConfig {
  minify: boolean
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

export interface Ga4Config {
  enabled: boolean
  measurementId?: string
  serviceId: string
  consentCategory: string
}

export interface AnalyticsConfig {
  ga4: Ga4Config
}

export interface PagefindConfig {
  excludePaths: string[]
}

export interface SiteMdxConfig {
  highlighter: 'shiki' | 'highlightjs'
  disableHighlighter: boolean
}

export type SiteStyleConfigInput = DeepPartial<
  Omit<SiteStyleConfig, 'theme'>
> & {
  theme?: ThemeOptionsInput
}

/**
 * Public config input shape for both `buildSite(...)` and `siteConfig.json`.
 * All fields are optional; values are normalized by `resolveSiteConfig`.
 */
export type SiteConfigInput = DeepPartial<Omit<SiteConfig, 'style'>> & {
  style?: SiteStyleConfigInput
}

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

export function resolveSiteConfig(input: SiteConfigInput = {}): SiteConfig {
  const rootDir = input.rootDir ?? DEFAULT_ROOT
  const contentDir = input.contentDir ?? path.join(rootDir, 'sample-content')
  const fileConfig = loadSiteConfigFile(contentDir)
  const outDir =
    input.outDir ??
    resolveOutDirFromFile(fileConfig.outDir, contentDir) ??
    path.join(rootDir, 'dist', 'site')
  const siteTitle = resolveString(
    input.siteTitle,
    fileConfig.siteTitle,
    'ts-ssg',
  )
  const logo = resolveLogoConfig(input.logo, fileConfig.logo)
  const style = resolveStyleConfig(input, fileConfig)
  const html = resolveHtmlConfig(input.html, fileConfig.html)
  const navigation = resolveNavigationConfig(
    input.navigation,
    fileConfig.navigation,
  )
  const sitemap = resolveSitemapConfig(input.sitemap, fileConfig.sitemap)
  const analytics = resolveAnalyticsConfig(
    input.analytics,
    fileConfig.analytics,
  )
  const consent = resolveConsentConfig(
    input.consent,
    fileConfig.consent,
    analytics.ga4,
  )
  const pagefind = resolvePagefindConfig(input.pagefind, fileConfig.pagefind)
  const mdx = resolveMdxConfig(input.mdx, fileConfig.mdx)
  return {
    rootDir,
    contentDir,
    outDir,
    siteTitle,
    logo,
    style,
    html,
    navigation,
    sitemap,
    consent,
    analytics,
    pagefind,
    mdx,
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

function resolveStyleConfig(
  input: SiteConfigInput,
  fileConfig: SiteConfigInput,
): SiteStyleConfig {
  const styleInput = input.style
  const styleFile = fileConfig.style
  const fileName = resolveString(
    styleInput?.fileName,
    styleFile?.fileName,
    'site.css',
  )
  const href = resolveString(styleInput?.href, styleFile?.href, `/${fileName}`)
  const themeNames = resolveThemes(styleInput?.themes, styleFile?.themes)
  const pretty = pickBoolean(styleInput?.pretty, styleFile?.pretty, false)
  const theme = themes.resolve(styleInput?.theme, styleFile?.theme)
  return {
    fileName,
    href,
    themes: themeNames,
    pretty,
    theme,
  }
}

function resolveLogoConfig(
  input?: DeepPartial<LogoConfig>,
  file?: DeepPartial<LogoConfig>,
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

function pickBoolean(...values: Array<unknown>) {
  for (const value of values) {
    if (typeof value === 'boolean') return value
  }
  return false
}

function resolveOutDirFromFile(value: unknown, contentDir: string) {
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

function resolveConsentConfig(
  input?: DeepPartial<ConsentConfig>,
  file?: DeepPartial<ConsentConfig>,
  ga4?: Ga4Config,
): ConsentConfig {
  const enabled = input?.enabled ?? file?.enabled ?? false
  const categories = resolveConsentCategories(
    input?.categories,
    file?.categories,
  )
  let services = resolveConsentServices(
    input?.services,
    file?.services,
    categories,
  )
  if (enabled) {
    services = appendGa4ConsentService(services, categories, ga4)
  }
  return {
    enabled,
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

function resolveAnalyticsConfig(
  input?: DeepPartial<AnalyticsConfig>,
  file?: DeepPartial<AnalyticsConfig>,
): AnalyticsConfig {
  const ga4 = resolveGa4Config(input?.ga4, file?.ga4)
  return { ga4 }
}

function resolveGa4Config(
  input?: DeepPartial<Ga4Config>,
  file?: DeepPartial<Ga4Config>,
): Ga4Config {
  const measurementId = resolveGa4MeasurementId(
    input?.measurementId,
    file?.measurementId,
  )
  const enabled = input?.enabled ?? file?.enabled ?? Boolean(measurementId)
  if (enabled && !measurementId) {
    throw new Error(
      'analytics.ga4.enabled is true but analytics.ga4.measurementId is missing.',
    )
  }
  return {
    enabled,
    measurementId,
    serviceId: resolveString(input?.serviceId, file?.serviceId, 'ga4'),
    consentCategory: resolveString(
      input?.consentCategory,
      file?.consentCategory,
      'analytics',
    ),
  }
}

function resolveGa4MeasurementId(...values: Array<string | undefined>) {
  for (const value of values) {
    const raw = resolveOptionalString(value)
    if (!raw) continue
    const normalized = raw.toUpperCase()
    if (!/^G-[A-Z0-9]+$/.test(normalized)) {
      throw new Error(
        `analytics.ga4.measurementId must look like "G-XXXXXXXX" but got "${raw}".`,
      )
    }
    return normalized
  }
  return undefined
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

function resolveMdxConfig(
  input?: Partial<SiteMdxConfig>,
  file?: Partial<SiteMdxConfig>,
): SiteMdxConfig {
  return {
    highlighter: resolveMdxHighlighter(input?.highlighter, file?.highlighter),
    disableHighlighter:
      input?.disableHighlighter ?? file?.disableHighlighter ?? false,
  }
}

function resolveMdxHighlighter(
  ...values: unknown[]
): SiteMdxConfig['highlighter'] {
  for (const value of values) {
    if (value === 'highlightjs') return 'highlightjs'
    if (value === 'shiki') return 'shiki'
  }
  return 'highlightjs'
}

function resolveConsentCategories(
  input: Array<DeepPartial<ConsentCategoryConfig>> | undefined,
  file: Array<DeepPartial<ConsentCategoryConfig>> | undefined,
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
  input: Array<DeepPartial<ConsentServiceConfig>> | undefined,
  file: Array<DeepPartial<ConsentServiceConfig>> | undefined,
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

function appendGa4ConsentService(
  services: ConsentServiceConfig[],
  categories: ConsentCategoryConfig[],
  ga4?: Ga4Config,
) {
  if (!ga4?.enabled || !ga4.measurementId) return services
  const hasService = services.some((entry) => entry.id === ga4.serviceId)
  if (hasService) return services
  const hasCategory = categories.some(
    (entry) => entry.id === ga4.consentCategory,
  )
  if (!hasCategory) {
    throw new Error(
      `analytics.ga4.consentCategory "${ga4.consentCategory}" does not exist in consent.categories.`,
    )
  }
  return [
    ...services,
    {
      id: ga4.serviceId,
      category: ga4.consentCategory,
      label: 'Google Analytics 4',
      scripts: buildGa4ConsentScripts(ga4.measurementId),
    },
  ]
}

function buildGa4ConsentScripts(measurementId: string): ConsentScriptConfig[] {
  const measurementIdLiteral = JSON.stringify(measurementId)
  return [
    {
      src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`,
      async: true,
    },
    {
      content: [
        'window.dataLayer = window.dataLayer || [];',
        'function gtag(){dataLayer.push(arguments);}',
        "gtag('js', new Date());",
        `gtag('config', ${measurementIdLiteral});`,
      ].join(' '),
    },
  ]
}

function resolveConsentServiceScripts(
  scripts: Array<DeepPartial<ConsentScriptConfig>> | undefined,
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

function loadSiteConfigFile(contentDir: string): SiteConfigInput {
  const filePath = path.join(contentDir, SITE_CONFIG_FILENAME)
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('siteConfig.json must contain a JSON object.')
    }
    return parsed as SiteConfigInput
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return {}
    const message = err.message ?? String(err)
    throw new Error(`Failed to read ${SITE_CONFIG_FILENAME}: ${message}`, {
      cause: error,
    })
  }
}
