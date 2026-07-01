import { Style } from '@purestack/ts-css'

import { normalizeThemeName, type ThemeName } from './themeAssets'
import { themes } from './themeOptions'
import { listThemePaletteVarEntries } from './themePaletteVars'

const styleBuilders = new Map<ThemeName, Style>()
export type StyleBuilder = typeof styleBuilder
export const styleBuilder = {
  get(theme: ThemeName) {
    if (!theme) {
      throw new Error(
        'Theme name is required. Create both light and dark themes.',
      )
    }
    const normalized = normalizeThemeName(theme)
    const existing = styleBuilders.get(normalized)
    if (existing) return existing
    const created = new Style().scope(getThemeScopeSelector(normalized))
    styleBuilders.set(normalized, created)
    return created
  },
  select(selector: string, theme: ThemeName) {
    const normalized = normalizeThemeName(theme)
    const scoped = styleBuilder.get(normalized)
    return isThemeRootSelector(selector)
      ? scoped.select(':scope')
      : scoped.select(selector)
  },
  has(theme: ThemeName) {
    const normalized = normalizeThemeName(theme)
    return styleBuilders.has(normalized)
  },
  ensureThemes(themes: ThemeName[]) {
    const missing = themes.filter((theme) => !styleBuilder.has(theme))
    if (missing.length > 0) {
      throw new Error(
        `Missing theme styles for: ${missing.map(normalizeThemeName).join(', ')}`,
      )
    }
  },
  list() {
    return [...styleBuilders.keys()]
  },
  async render(theme: ThemeName, pretty: boolean = true) {
    const normalized = normalizeThemeName(theme)
    const style = styleBuilder.get(normalized)
    applyThemePaletteVariableDeclarations(style.select(':scope'), normalized)
    const rendered = pretty ? style.toPrettyCSS() : style.toCSS()
    return rendered
  },
  reset() {
    styleBuilders.clear()
  },
}

function getThemeScopeSelector(theme: ThemeName) {
  return `html[data-theme="${normalizeThemeName(theme)}"]`
}

function isThemeRootSelector(selector: string) {
  const trimmed = selector.trim()
  return trimmed === 'html' || trimmed === ':root'
}

function applyThemePaletteVariableDeclarations(style: Style, theme: ThemeName) {
  for (const entry of listThemePaletteVarEntries(themes.rawPalette(theme))) {
    style.set(entry.name, entry.value)
  }
}
