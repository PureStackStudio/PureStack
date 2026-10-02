import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type {
  AnalyticsConfig,
  AuthConfig,
  ConsentCategory,
  ConsentConfig,
  ConsentScript,
  ConsentService,
  Ga4Config,
  I18nConfig,
  I18nUrlStrategy,
  PagefindConfig,
  PageTocConfig,
  PreviewConfig,
  RobotsConfig,
  SiteConfig,
  SiteConfigInput,
  SiteHtmlConfig,
  SiteLogoConfig,
  SiteMdxConfig,
  SitemapConfig,
  SiteScriptsConfig,
  SiteStyleConfig,
} from '@purestack/ts-common'
import {
  docLayoutDefaults,
  pickSemanticTone,
  resolveThemes,
  themes,
} from '@purestack/ts-style'
import type { DeepPartial } from '@purestack/ts-util'
import { isPlainObject, normalizeBasePath } from '@purestack/ts-util'
import { resolveNavigationConfig } from '../navigation/navigation'

const DEFAULT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)
export const SITE_CONFIG_FILENAME = 'siteConfig.json'
const DEFAULT_CONSENT_CATEGORIES: ConsentCategory[] = [
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
  const logo = resolveSiteLogoConfig(input.logo, fileConfig.logo)
  const style = resolveStyleConfig(input, fileConfig)
  const html = resolveHtmlConfig(input.html, fileConfig.html)
  const navigation = resolveNavigationConfig(
    input.navigation,
    fileConfig.navigation,
  )
  const pageToc = resolvePageTocConfig(input.pageToc, fileConfig.pageToc)
  const auth = resolveAuthConfig(input.auth, fileConfig.auth)
  const scripts = resolveScriptsConfig(input.scripts, fileConfig.scripts)
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
  const preview = resolvePreviewConfig(input.preview, fileConfig.preview)
  const i18n = resolveI18nConfig(input.i18n, fileConfig.i18n)
  const mdx = resolveMdxConfig(input.mdx, fileConfig.mdx)
  return {
    rootDir,
    contentDir,
    outDir,
    publishDir,
    basePath,
    siteTitle,
    favicon: resolveFavicon(input.favicon, fileConfig.favicon),
    logo,
    docLayout: {
      sidebarTop:
        resolveOptionalString(input.docLayout?.sidebarTop) ??
        resolveOptionalString(fileConfig.docLayout?.sidebarTop) ??
        docLayoutDefaults.sidebarTop,
      sidebarTopMobile:
        resolveOptionalString(input.docLayout?.sidebarTopMobile) ??
        resolveOptionalString(fileConfig.docLayout?.sidebarTopMobile) ??
        docLayoutDefaults.sidebarTopMobile,
    },
    style,
    html,
    navigation,
    pageToc,
    auth,
    scripts,
    sitemap,
    consent,
    analytics,
    pagefind,
    preview,
    i18n,
    mdx,
  }
}

function resolveScriptsConfig(
  input?: DeepPartial<SiteScriptsConfig>,
  file?: DeepPartial<SiteScriptsConfig>,
): SiteScriptsConfig {
  return {
    cacheBusting: pickBoolean(input?.cacheBusting, file?.cacheBusting, true),
  }
}

function resolveAuthConfig(
  input?: DeepPartial<AuthConfig>,
  file?: DeepPartial<AuthConfig>,
): AuthConfig {
  return {
    enabled: pickBoolean(input?.enabled, file?.enabled, false),
    signUp: pickBoolean(input?.signUp, file?.signUp, true),
    signedInStorageKey: resolveString(
      input?.signedInStorageKey,
      file?.signedInStorageKey,
      'signed-in-hint',
    ),
  }
}

function resolvePageTocConfig(
  input?: DeepPartial<PageTocConfig>,
  file?: DeepPartial<PageTocConfig>,
): PageTocConfig {
  const variant =
    resolveOptionalString(input?.variant) ??
    resolveOptionalString(file?.variant)
  const className =
    resolveOptionalString(input?.class) ?? resolveOptionalString(file?.class)
  return {
    enabled: pickBoolean(input?.enabled, file?.enabled, true),
    tone: pickSemanticTone(input?.tone, file?.tone) ?? 'neutral',
    ...(variant ? { variant } : {}),
    ...(className ? { class: className } : {}),
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
  const href = resolveString(
    styleInput?.href,
    styleFile?.href,
    `/assets/${fileName}`,
  )
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

function resolveSiteLogoConfig(
  input?: DeepPartial<SiteLogoConfig>,
  file?: DeepPartial<SiteLogoConfig>,
): SiteLogoConfig {
  const href = input?.href !== undefined ? input.href : file?.href
  return {
    brand: resolveString(input?.brand, file?.brand, 'Pure Stack'),
    letterColors: resolveOptionalString(
      input?.letterColors ?? file?.letterColors,
    ),
    subtitleLetterColors: resolveOptionalString(
      input?.subtitleLetterColors ?? file?.subtitleLetterColors,
    ),
    brandSizeSm: resolveOptionalString(input?.brandSizeSm ?? file?.brandSizeSm),
    brandSizeMd: resolveOptionalString(input?.brandSizeMd ?? file?.brandSizeMd),
    brandSizeLg: resolveOptionalString(input?.brandSizeLg ?? file?.brandSizeLg),
    brandSizeXl: resolveOptionalString(input?.brandSizeXl ?? file?.brandSizeXl),
    subtitleSizeSm: resolveOptionalString(
      input?.subtitleSizeSm ?? file?.subtitleSizeSm,
    ),
    subtitleSizeMd: resolveOptionalString(
      input?.subtitleSizeMd ?? file?.subtitleSizeMd,
    ),
    subtitleSizeLg: resolveOptionalString(
      input?.subtitleSizeLg ?? file?.subtitleSizeLg,
    ),
    subtitleSizeXl: resolveOptionalString(
      input?.subtitleSizeXl ?? file?.subtitleSizeXl,
    ),
    iconSize: resolveOptionalString(input?.iconSize ?? file?.iconSize),
    iconSizeSm: resolveOptionalString(input?.iconSizeSm ?? file?.iconSizeSm),
    iconSizeMd: resolveOptionalString(input?.iconSizeMd ?? file?.iconSizeMd),
    iconSizeLg: resolveOptionalString(input?.iconSizeLg ?? file?.iconSizeLg),
    iconSizeXl: resolveOptionalString(input?.iconSizeXl ?? file?.iconSizeXl),
    subtitleInset: resolveOptionalString(
      input?.subtitleInset ?? file?.subtitleInset,
    ),
    subtitleInsetSm: resolveOptionalString(
      input?.subtitleInsetSm ?? file?.subtitleInsetSm,
    ),
    subtitleInsetMd: resolveOptionalString(
      input?.subtitleInsetMd ?? file?.subtitleInsetMd,
    ),
    subtitleInsetLg: resolveOptionalString(
      input?.subtitleInsetLg ?? file?.subtitleInsetLg,
    ),
    subtitleInsetXl: resolveOptionalString(
      input?.subtitleInsetXl ?? file?.subtitleInsetXl,
    ),
    component: resolveOptionalString(input?.component ?? file?.component),
    colors: (input?.colors ?? file?.colors)?.filter(
      (color): color is string => typeof color === 'string',
    ),
    logoBackground: input?.logoBackground ?? file?.logoBackground,
    logoForeground: input?.logoForeground ?? file?.logoForeground,
    href: href === null || href === '' ? href : resolveString(href, '/'),
    subtitle: resolveOptionalString(input?.subtitle ?? file?.subtitle),
    suffix: resolveOptionalString(input?.suffix ?? file?.suffix),
    ariaLabel: resolveOptionalString(input?.ariaLabel ?? file?.ariaLabel),
    icon: resolveOptionalString(input?.icon ?? file?.icon),
    imageSrc: resolveOptionalString(input?.imageSrc ?? file?.imageSrc),
    imageSrcDark: resolveOptionalString(
      input?.imageSrcDark ?? file?.imageSrcDark,
    ),
    monogram: resolveOptionalString(input?.monogram ?? file?.monogram),
    brandColor: resolveOptionalString(input?.brandColor ?? file?.brandColor),
    accentColor: resolveOptionalString(input?.accentColor ?? file?.accentColor),
    markBackground: resolveOptionalString(
      input?.markBackground ?? file?.markBackground,
    ),
    markColor: resolveOptionalString(input?.markColor ?? file?.markColor),
    brandSize: resolveOptionalString(input?.brandSize ?? file?.brandSize),
    subtitleSize: resolveOptionalString(
      input?.subtitleSize ?? file?.subtitleSize,
    ),
    markSize: resolveOptionalString(input?.markSize ?? file?.markSize),
    gap: resolveOptionalString(input?.gap ?? file?.gap),
    layout: resolveLogoChoice(input?.layout ?? file?.layout, [
      'horizontal',
      'stacked',
      'wordmark',
      'mark',
    ] as const),
    size: resolveLogoChoice(input?.size ?? file?.size, [
      'sm',
      'md',
      'lg',
      'xl',
    ] as const),
    appearance: resolveLogoChoice(input?.appearance ?? file?.appearance, [
      'plain',
      'badge',
      'outline',
    ] as const),
    markStyle: resolveLogoChoice(input?.markStyle ?? file?.markStyle, [
      'plain',
      'soft',
      'solid',
      'outline',
    ] as const),
    wordmarkStyle: resolveLogoChoice(
      input?.wordmarkStyle ?? file?.wordmarkStyle,
      ['plain', 'accent', 'gradient'] as const,
    ),
    shape: resolveLogoChoice(input?.shape ?? file?.shape, [
      'rounded',
      'square',
      'circle',
    ] as const),
    tone: pickSemanticTone(input?.tone, file?.tone),
  }
}

function resolveLogoChoice<T extends string>(
  value: unknown,
  choices: readonly T[],
): T | undefined {
  return typeof value === 'string' && choices.includes(value as T)
    ? (value as T)
    : undefined
}

function resolveFavicon(...values: Array<unknown>): string | undefined {
  for (const value of values) {
    const favicon = resolveOptionalString(value)
    if (favicon) return favicon
  }
  return undefined
}

function resolveString(...values: Array<string | undefined>) {
  for (const value of values) {
    if (typeof value === 'string' && value.length > 0) return value
  }
  return ''
}

function pickBoolean(input: unknown, file: unknown, fallback = false) {
  const searchValues = [input, file]
  for (const value of searchValues) {
    if (typeof value === 'boolean') return value
  }
  return fallback
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
    enabled: input?.enabled ?? file?.enabled ?? true,
    excludePaths: normalizePagefindExcludePaths(
      input?.excludePaths ?? file?.excludePaths,
    ),
  }
}

function resolvePreviewConfig(
  input?: DeepPartial<PreviewConfig>,
  file?: DeepPartial<PreviewConfig>,
): PreviewConfig {
  return {
    title: resolveOptionalString(input?.title ?? file?.title),
    description: resolveOptionalString(input?.description ?? file?.description),
    image: resolveOptionalString(input?.image ?? file?.image),
    imageAlt: resolveOptionalString(input?.imageAlt ?? file?.imageAlt),
    imageWidth: normalizePreviewImageDimension(
      input?.imageWidth ?? file?.imageWidth,
    ),
    imageHeight: normalizePreviewImageDimension(
      input?.imageHeight ?? file?.imageHeight,
    ),
    siteName: resolveOptionalString(input?.siteName ?? file?.siteName),
    type: resolveOptionalString(input?.type ?? file?.type),
    locale: resolveOptionalString(input?.locale ?? file?.locale),
    twitterCard: resolveOptionalString(input?.twitterCard ?? file?.twitterCard),
    twitterSite: resolveOptionalString(input?.twitterSite ?? file?.twitterSite),
    twitterCreator: resolveOptionalString(
      input?.twitterCreator ?? file?.twitterCreator,
    ),
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

function normalizePreviewImageDimension(value: unknown) {
  if (typeof value !== 'number' || !Number.isInteger(value)) return undefined
  return value > 0 ? value : undefined
}

function resolveMdxConfig(
  input?: Partial<SiteMdxConfig>,
  file?: Partial<SiteMdxConfig>,
): SiteMdxConfig {
  return {
    highlighter: resolveMdxHighlighter(input?.highlighter, file?.highlighter),
    disableHighlighter:
      input?.disableHighlighter ?? file?.disableHighlighter ?? false,
    compileMdAsMdx: input?.compileMdAsMdx ?? file?.compileMdAsMdx ?? true,
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
  input: Array<DeepPartial<ConsentCategory>> | undefined,
  file: Array<DeepPartial<ConsentCategory>> | undefined,
) {
  const source = Array.isArray(input)
    ? input
    : Array.isArray(file)
      ? file
      : DEFAULT_CONSENT_CATEGORIES
  const categories: ConsentCategory[] = []
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
  input: Array<DeepPartial<ConsentService>> | undefined,
  file: Array<DeepPartial<ConsentService>> | undefined,
  categories: ConsentCategory[],
) {
  const source = Array.isArray(input) ? input : Array.isArray(file) ? file : []
  const categoryIds = new Set(categories.map((entry) => entry.id))
  const services: ConsentService[] = []
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
  services: ConsentService[],
  categories: ConsentCategory[],
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

function buildGa4ConsentScripts(measurementId: string): ConsentScript[] {
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
  scripts: Array<DeepPartial<ConsentScript>> | undefined,
  serviceId: string,
) {
  if (!Array.isArray(scripts) || scripts.length === 0) {
    throw new Error(
      `Consent service "${serviceId}" must define at least one script.`,
    )
  }
  const resolved: ConsentScript[] = []
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
