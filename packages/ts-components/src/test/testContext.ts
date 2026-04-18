import type {
  PageInfo,
  PageOutlineItem,
  SiteConfig,
  TsSsgContext,
  TsSsgNavigation,
} from '@purestack/ts-common'
import { DEFAULT_THEME_OPTIONS } from '@purestack/ts-style'
import type { DeepPartial } from '@purestack/ts-util'

const DEFAULT_SITE: DeepPartial<SiteConfig> = {
  siteTitle: 'Test Site',
  style: {
    theme: DEFAULT_THEME_OPTIONS,
  },
  logo: {
    brand: 'Pure Stack',
    letterColors: '000011111',
    subtitleLetterColors: '111111111111111111111',
    colors: ['var(--ps-current-text-default)', 'var(--ps-current-text-subtle)'],
    logoBackground: 1,
    logoForeground: 0,
    href: '/',
    icon: 'iconoir:cube',
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
  return {
    site,
    pageInfo: createTestPageInfo(options.pageInfo),
    navigation: options.navigation,
    outline: options.outline,
    theme: site.style.theme,
    recordScriptEntrypoint: () => {},
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
