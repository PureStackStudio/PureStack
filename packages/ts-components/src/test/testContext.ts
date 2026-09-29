import type {
  PageInfo,
  PageOutlineItem,
  SiteConfig,
  TsSsgContext,
  TsSsgNavigation,
} from '@purestack/ts-common'
import { DEFAULT_THEME_OPTIONS } from '@purestack/ts-style'
import { type DeepPartial, withBasePath } from '@purestack/ts-util'

const DEFAULT_SITE: DeepPartial<SiteConfig> = {
  siteTitle: 'Test Site',
  basePath: '',
  style: {
    theme: DEFAULT_THEME_OPTIONS,
  },
  logo: { brand: 'Pure Stack', href: '/', icon: 'iconoir:cube' },
  auth: {
    enabled: false,
    signUp: true,
  },
  pagefind: {
    enabled: false,
    excludePaths: [],
  },
  i18n: {
    enabled: false,
    defaultLocale: '',
    locales: [],
    urlStrategy: 'prefix-all',
    queryParam: 'lang',
    cookieName: 'ts-ssg.lang',
  },
  consent: {
    enabled: false,
    storageKey: 'ts-ssg-consent',
    policyVersion: '1',
    bannerTitle: 'Your privacy choices',
    bannerDescription:
      'We use cookies and similar technologies to improve your experience.',
    privacyPolicyLabel: 'Privacy Policy',
    acceptAllLabel: 'Accept all',
    rejectAllLabel: 'Reject non-essential',
    manageLabel: 'Manage preferences',
    saveLabel: 'Save choices',
    settingsLabel: 'Privacy settings',
    categories: [],
    services: [],
  },
}

const DEFAULT_PAGE_INFO: PageInfo = {
  relPath: 'index.md',
  urlPath: '/',
  frontmatter: {
    layout: {
      navMode: 'sidebar',
      fullWidth: false,
      showToc: false,
      showNav: true,
      showFooter: true,
      tocCollapsed: false,
    },
    template: 'doc',
    hidden: false,
    draft: false,
    nav: { hidden: false },
  },
}

interface TestContextOptions {
  site?: DeepPartial<SiteConfig>
  pageInfo?: DeepPartial<PageInfo>
  navigation?: TsSsgNavigation
  outline?: PageOutlineItem[]
  resolveScriptPublicPath?: (sourceRelPath: string) => string
}

export function createTestSite(
  overrides: DeepPartial<SiteConfig> = {},
): SiteConfig {
  return mergeValue(DEFAULT_SITE, overrides) as SiteConfig
}

export function createTestPageInfo(
  overrides: DeepPartial<PageInfo> = {},
): PageInfo {
  return mergeValue(DEFAULT_PAGE_INFO, overrides)
}

export function createTestContext(
  options: TestContextOptions = {},
): TsSsgContext {
  const site = createTestSite(options.site)
  const pageInfo = createTestPageInfo(options.pageInfo)
  return {
    site,
    pageInfo,
    navigation: options.navigation,
    outline: options.outline,
    theme: site.style.theme,
    basePath: site.basePath,
    locale: pageInfo.locale,
    locales: site.i18n.locales,
    defaultLocale: site.i18n.defaultLocale || undefined,
    resolveLocaleHref: (locale) =>
      pageInfo.translations?.find((entry) => entry.locale === locale)?.urlPath,
    resolvePublicHref: (href) => withBasePath(site.basePath, href),
    recordScriptEntrypoint: () => {},
    resolveScriptPublicPath: options.resolveScriptPublicPath,
    recordRuntimeEmbed: () => {},
  }
}

function mergeValue<T>(base: T, overrides: DeepPartial<T>): T {
  if (Array.isArray(base)) {
    return (Array.isArray(overrides) ? overrides : base) as T
  }
  if (isPlainObject(base) && isPlainObject(overrides)) {
    const result: Record<string, unknown> = { ...base }
    for (const [key, value] of Object.entries(overrides)) {
      if (value === undefined) continue
      const current = result[key]
      result[key] =
        isPlainObject(current) && isPlainObject(value)
          ? mergeValue(current, value)
          : value
    }
    return result as T
  }
  return (overrides === undefined ? base : overrides) as T
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
