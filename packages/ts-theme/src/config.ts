import type {
  DocLayoutConfig,
  PageTocConfig,
  SiteConfigInput,
  SiteStyleConfig,
} from '@purestack/ts-common'
import {
  docLayoutDefaults,
  pickSemanticTone,
  resolveThemes,
  themes,
} from '@purestack/ts-style'
import type { DeepPartial } from '@purestack/ts-util'
import {
  pickBoolean,
  resolveConfigUrl,
  resolveOptionalString,
  resolveString,
} from '@purestack/ts-util'

export function resolveStyleConfig(
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
  const href = resolveConfigUrl(
    resolveString(styleInput?.href, styleFile?.href, `/assets/${fileName}`),
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

export function resolveFavicon(...values: Array<unknown>): string | undefined {
  for (const value of values) {
    const favicon = resolveOptionalString(value)
    if (favicon) return favicon
  }
  return undefined
}

export function resolvePageTocConfig(
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

export function resolveDocLayoutConfig(
  input?: DeepPartial<DocLayoutConfig>,
  file?: DeepPartial<DocLayoutConfig>,
): DocLayoutConfig {
  return {
    sidebarTop:
      resolveOptionalString(input?.sidebarTop) ??
      resolveOptionalString(file?.sidebarTop) ??
      docLayoutDefaults.sidebarTop,
    sidebarTopMobile:
      resolveOptionalString(input?.sidebarTopMobile) ??
      resolveOptionalString(file?.sidebarTopMobile) ??
      docLayoutDefaults.sidebarTopMobile,
  }
}
