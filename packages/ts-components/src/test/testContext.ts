import type { DeepPartial } from '@purestack/ts-util'

import { DEFAULT_THEME_OPTIONS } from '../style/themeOptions'
import type {
  PageOutlineItem,
  TsSsgContext,
  TsSsgNavigation,
  TsSsgPageInfo,
  TsSsgSiteConfig,
} from '../ts-ssg-context'

const DEFAULT_SITE: TsSsgSiteConfig = {
  siteTitle: 'Test Site',
  style: {
    theme: DEFAULT_THEME_OPTIONS,
  },
  logo: {
    wordOne: 'Pure',
    wordTwo: 'Stack',
    href: '/',
  },
  consent: {
    enabled: false,
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
  },
}

const DEFAULT_PAGE_INFO: TsSsgPageInfo = {
  relPath: 'index.md',
  urlPath: '/',
  frontmatter: {
    layout: {
      navMode: 'sidebar',
      fullWidth: false,
      showToc: false,
      showFooter: true,
    },
  },
}

interface TestContextOptions {
  site?: DeepPartial<TsSsgSiteConfig>
  pageInfo?: DeepPartial<TsSsgPageInfo>
  navigation?: TsSsgNavigation
  outline?: PageOutlineItem[]
}

export function createTestSite(
  overrides: DeepPartial<TsSsgSiteConfig> = {},
): TsSsgSiteConfig {
  return mergeValue(DEFAULT_SITE, overrides)
}

export function createTestPageInfo(
  overrides: DeepPartial<TsSsgPageInfo> = {},
): TsSsgPageInfo {
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
