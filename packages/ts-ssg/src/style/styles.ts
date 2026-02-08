import { Style } from '@purestack/ts-css'

import { normalizeThemeName, type ThemeName } from './themeAssets'

const styleBuilders = new Map<ThemeName, Style>()

export const styleBuilder = {
  get(theme?: ThemeName) {
    if (!theme) {
      throw new Error(
        'Theme name is required. Create both light and dark themes.',
      )
    }
    const normalized = normalizeThemeName(theme)
    const existing = styleBuilders.get(normalized)
    if (existing) return existing
    const created = new Style()
    styleBuilders.set(normalized, created)
    return created
  },
  select(selector: string, theme?: ThemeName) {
    return styleBuilder.get(theme).select(selector)
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
    const style = styleBuilder.get(theme)
    return pretty ? style.toPrettyCSS() : style.toCSS()
  },
}
