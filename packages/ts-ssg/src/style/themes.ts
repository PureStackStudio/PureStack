export const REQUIRED_THEMES = ['light', 'dark'] as const

export type ThemeName = string
export type RequiredTheme = (typeof REQUIRED_THEMES)[number]

export interface ThemeStylesheetLink {
  theme: ThemeName
  href: string
  rel: string
  media?: string
  title?: string
  dataTheme?: string
  disabled?: boolean
}

export function normalizeThemeName(name: string): string {
  const normalized = name.trim().toLowerCase()
  if (!normalized) {
    throw new Error('Theme name must be a non-empty string.')
  }
  return normalized
}

export function normalizeThemes(themes: ThemeName[]): ThemeName[] {
  const seen = new Set<ThemeName>()
  for (const theme of themes) {
    const normalized = normalizeThemeName(theme)
    if (!seen.has(normalized)) {
      seen.add(normalized)
    }
  }
  return [...seen]
}

export function orderThemes(themes: ThemeName[]): ThemeName[] {
  const normalized = normalizeThemes(themes)
  const missing = REQUIRED_THEMES.filter((theme) => !normalized.includes(theme))
  if (missing.length > 0) {
    throw new Error(
      `styleThemes must include ${REQUIRED_THEMES.join(', ')}.`,
    )
  }
  const extras = normalized.filter(
    (theme) => !REQUIRED_THEMES.includes(theme as RequiredTheme),
  )
  extras.sort()
  return [...REQUIRED_THEMES, ...extras]
}

export function resolveThemes(
  ...values: Array<ThemeName[] | undefined>
): ThemeName[] {
  const picked = values.find((value) => Array.isArray(value) && value.length > 0)
  if (!picked) {
    return [...REQUIRED_THEMES]
  }
  return orderThemes(picked)
}

export function resolveThemeFileName(
  fileName: string,
  theme: ThemeName,
): string {
  const normalized = normalizeThemeName(theme)
  const hasCss = fileName.toLowerCase().endsWith('.css')
  const base = hasCss ? fileName.slice(0, -4) : fileName
  const suffix = '.css'
  if (normalized === 'light') {
    return `${base}${suffix}`
  }
  return `${base}.${normalized}${suffix}`
}

export function resolveThemeHref(styleHref: string, theme: ThemeName): string {
  if (!styleHref) return styleHref
  const { path, query, hash } = splitHref(styleHref)
  const normalized = normalizeThemeName(theme)
  const hasCss = path.toLowerCase().endsWith('.css')
  const base = hasCss ? path.slice(0, -4) : path
  const suffix = '.css'
  const themedPath =
    normalized === 'light'
      ? `${base}${suffix}`
      : `${base}.${normalized}${suffix}`
  return `${themedPath}${query}${hash}`
}

export function resolveThemeStyleLinks(
  styleHref: string,
  themes: ThemeName[],
): ThemeStylesheetLink[] {
  if (!styleHref) return []
  const ordered = orderThemes(themes)
  return ordered.map((theme) => {
    const href = resolveThemeHref(styleHref, theme)
    return {
      theme,
      href,
      rel: 'stylesheet',
      dataTheme: theme,
      disabled: theme !== 'light',
      ...(theme !== 'light' ? { title: theme } : {}),
    }
  })
}

function splitHref(href: string) {
  const hashIndex = href.indexOf('#')
  const beforeHash = hashIndex === -1 ? href : href.slice(0, hashIndex)
  const hash = hashIndex === -1 ? '' : href.slice(hashIndex)
  const queryIndex = beforeHash.indexOf('?')
  const path = queryIndex === -1 ? beforeHash : beforeHash.slice(0, queryIndex)
  const query = queryIndex === -1 ? '' : beforeHash.slice(queryIndex)
  return { path, query, hash }
}
