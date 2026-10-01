import { defineComponent, html } from 'regor'

export interface ThemeToggle {}

/**
 * One icon button that flips between the light and dark themes. The theme
 * stylesheets decide which glyph shows, so the markup carries no state; the
 * theme runtime binds every [data-theme-toggle] and keeps aria-pressed in sync.
 */
const themeToggleTemplate = html`<button
  class="theme-toggle"
  type="button"
  aria-label="Dark theme"
  aria-pressed="false"
  data-theme-toggle
>
  <Icon
    class="theme-toggle__glyph theme-toggle__glyph--light"
    name="lucide:sun"
    aria-hidden="true"/>
  <Icon
    class="theme-toggle__glyph theme-toggle__glyph--dark"
    name="lucide:moon"
    aria-hidden="true"/>
</button>`

function defineThemeToggleComponent() {
  return defineComponent<ThemeToggle>(themeToggleTemplate)
}

export function defineThemeToggleComponents() {
  return { themeToggle: defineThemeToggleComponent() }
}
