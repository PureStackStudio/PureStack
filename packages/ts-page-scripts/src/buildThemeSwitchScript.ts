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
 * - Uses scoped theme stylesheets loaded as <link data-theme="...">.
 * - Adds data-theme and data-theme-ready attributes on <html>.
 */
export function buildThemeSwitchScript(themes: string[]) {
  const unique = [...new Set(themes)]
  const serialized = JSON.stringify(unique)
  const payload = `"use strict";var themeSwitchThemes=${serialized};`
  return `(function(){${payload}${buildEmbeddedThemeSwitchScript()}})();`
}
