import { buildEmbeddedThemeSwitchScript } from './embed/themeSwitch.embed'

/**
 * Builds the inline theme switcher runtime.
 *
 * Usage (runtime):
 *   window.tsSsgTheme.get()
 *   window.tsSsgTheme.list()
 *   window.tsSsgTheme.set(theme: string)
 *
 * Behavior:
 * - Reads preferred theme from localStorage key "ts-ssg-theme" if present.
 * - Falls back to prefers-color-scheme when available.
 * - Enables the matching <link data-theme="..."> and disables the rest.
 * - Adds data-theme, data-theme-mode, and data-theme-ready attributes on <html>.
 */
export function buildThemeSwitchScript(themes: string[]) {
  const unique = [...new Set(themes)]
  const serialized = JSON.stringify(unique)
  const payload = `globalThis.__PURESTACK_THEME_SWITCH_THEMES__=${serialized};`
  return `(function(){${payload}})();${buildEmbeddedThemeSwitchScript()}`
}
