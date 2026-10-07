import {
  styleBuilder,
  type ThemeMode,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'

const GLYPH_MOTION =
  'transform 360ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease'

export function registerThemeToggleStyles() {
  themes.forEach((theme, palette) => {
    registerThemeToggleButtonStyles(theme, palette)
    registerThemeToggleGlyphStyles(theme)
  })
}

function registerThemeToggleButtonStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.theme-toggle, a.topbar__icon', theme)
    .display('inline-grid')
    .placeItems('center')
    .flexShrink('0')
    .width('2.625rem')
    .height('2.625rem')
    .padding('0')
    .borderRadius(palette.radii.pill)
    .border('1px solid transparent')
    .background('transparent')
    .color(palette.current.text.subtle)
    .cursor('pointer')
    .transition('background 160ms ease, color 160ms ease')

  styleBuilder
    .select('.theme-toggle:hover, a.topbar__icon:hover', theme)
    .background(palette.current.surface.hover.background)
    .borderColor(palette.current.surface.hover.border)
    .color(palette.current.text.default)

  styleBuilder
    .select('.theme-toggle:active, a.topbar__icon:active', theme)
    .background(palette.current.surface.active.background)

  styleBuilder
    .select('.theme-toggle:focus-visible, a.topbar__icon:focus-visible', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
    .outlineOffset('2px')
}

/**
 * Both glyphs share one grid cell. The theme in use shows its own glyph and
 * tucks the other away rotated, so a switch reads as one turning motion.
 */
function registerThemeToggleGlyphStyles(theme: ThemeMode) {
  const shown = theme === 'dark' ? 'dark' : 'light'
  const hidden = theme === 'dark' ? 'light' : 'dark'
  const hiddenTurn = theme === 'dark' ? '90deg' : '-90deg'

  styleBuilder
    .select('.theme-toggle .theme-toggle__glyph, a.topbar__icon .icon', theme)
    .gridArea('1 / 1')
    .width('1.25rem')
    .height('1.25rem')

  styleBuilder
    .select(`.theme-toggle .theme-toggle__glyph--${shown}`, theme)
    .opacity(1)
    .transform('rotate(0deg) scale(1)')

  styleBuilder
    .select(`.theme-toggle .theme-toggle__glyph--${hidden}`, theme)
    .opacity(0)
    .transform(`rotate(${hiddenTurn}) scale(0.5)`)

  // Animate only once the runtime has settled the first theme, so a page
  // never loads with the glyphs mid-turn.
  styleBuilder
    .select(':scope[data-theme-ready] .theme-toggle__glyph', theme)
    .transition(GLYPH_MOTION)

  styleBuilder
    .select(':scope[data-theme-ready] .theme-toggle__glyph', theme)
    .media('prefers-reduced-motion: reduce')
    .transition('none')
}
