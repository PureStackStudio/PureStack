import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerTopBarStyles() {
  themes.forEach((theme, palette, options) => {
    registerTopBarShellStyles(theme, palette, options)
    registerTopBarToggleStyles(theme, palette)
  })
}

export function registerTopBarShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.topbar', theme)
    .padding('16px')
    .position('sticky')
    .top('0')
    .zIndex(40)
    .backdropFilter('blur(10px)')
    .borderBottom('1px solid transparent')
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)
    .borderBottomColor(palette.current.border.subtle)

  styleBuilder.select('.topbar__controls', theme).marginLeft('auto')

  styleBuilder
    .select('.topbar__icon', theme)
    .width('42px')
    .height('42px')
    .borderRadius(options.radii.pill)
    .display('grid')
    .placeItems('center')
    .border('1px solid transparent')
    .background('transparent')
    .cursor('pointer')
    .position('relative')
    .padding('0')
    .color(palette.current.text.subtle)
}

export function registerTopBarToggleStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  registerTopBarToggleVisibilityStyles(theme, palette)
  registerTopBarToggleGlyphStyles(theme)
  registerTopBarToggleCheckedStateStyles(theme)
  registerTopBarResponsiveSearchStyles(theme)
}

function registerTopBarToggleVisibilityStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.topbar__toggle', theme)
    .background(palette.semanticTone.neutral.surface.rest.background)
    .borderColor(palette.current.border.default)
    .color(palette.current.text.subtle)
    .display('none')
  styleBuilder
    .select('.template-doc--nav-drawer .topbar__toggle', theme)
    .display('grid')
  styleBuilder
    .select('.template-doc--has-nav .topbar__toggle', theme)
    .media('max-width: 1023px')
    .display('grid')
  styleBuilder
    .select('.topbar__toggle:focus-visible', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
}

function registerTopBarToggleGlyphStyles(theme: ThemeMode) {
  styleBuilder
    .select('.topbar__toggle::before', theme)
    .content('""')
    .width('18px')
    .height('2px')
    .background('currentColor')
    .position('absolute')
    .top('14px')
    .left('12px')
    .transition('transform 200ms ease, top 200ms ease')
    .boxShadow('0 6px 0 0 currentColor')
  styleBuilder
    .select('.topbar__toggle::after', theme)
    .content('""')
    .width('18px')
    .height('2px')
    .background('currentColor')
    .position('absolute')
    .top('26px')
    .left('12px')
    .transition('transform 200ms ease, top 200ms ease')
}

function registerTopBarToggleCheckedStateStyles(theme: ThemeMode) {
  styleBuilder.select('.doc-nav-toggle', theme).display('none')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__toggle::before', theme)
    .top('20px')
    .transform('rotate(45deg)')
    .boxShadow('none')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__toggle::after', theme)
    .top('20px')
    .transform('rotate(-45deg)')
}

function registerTopBarResponsiveSearchStyles(theme: ThemeMode) {
  styleBuilder
    .select('.topbar__search', theme)
    .media('max-width: 600px')
    .display('none')
}
