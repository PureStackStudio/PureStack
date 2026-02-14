import { styleBuilder } from '../../../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../../../style/themeOptions'
import type { ThemePalette } from '../../../style/themePalette'

export function registerTopBarStyles() {
  themes.forEach((theme, palette, options) => {
    registerTopBarShellStyles(theme, palette, options)
    registerTopBarSearchStyles(theme)
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
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) minmax(220px, 420px) minmax(0, 1fr)')
    .alignItems('center')
    .gap('16px')
    .padding('16px')
    .position('sticky')
    .top('0')
    .zIndex(40)
    .backdropFilter('blur(10px)')
    .borderBottom('1px solid transparent')
    .background(palette.background.surfaceAlt)
    .borderBottomColor(palette.border.subtle)
  styleBuilder
    .select('.topbar__logo', theme)
    .display('inline-flex')
    .justifySelf('start')
    .minWidth('0')
  styleBuilder
    .select('.topbar__logo .site-logo__link', theme)
    .padding('8px 12px')
    .maxWidth('100%')
  styleBuilder
    .select('.topbar__logo .site-logo__glyph', theme)
    .width('30px')
    .height('30px')
  styleBuilder.select('.topbar__logo .site-logo__word', theme).fontSize('20px')
  styleBuilder
    .select('.topbar__logo .site-logo__subtitle', theme)
    .fontSize('8px')
  styleBuilder
    .select('.topbar__controls', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifySelf('end')
    .gap('10px')
    .minWidth('0')
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
    .color(palette.text.subtle)
}

export function registerTopBarSearchStyles(theme: ThemeMode) {
  styleBuilder
    .select('.topbar__search', theme)
    .display('block')
    .width('100%')
    .justifySelf('center')
    .minWidth('0')
  styleBuilder
    .select('.topbar__search .site-search', theme)
    .width('100%')
    .maxWidth('none')
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
    .background(palette.background.surface)
    .borderColor(palette.border.default)
    .color(palette.text.subtle)
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
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
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
    .select('.topbar', theme)
    .media('max-width: 900px')
    .gridTemplateColumns('minmax(0, 1fr) minmax(180px, 360px) minmax(0, 1fr)')
  styleBuilder
    .select('.topbar', theme)
    .media('max-width: 600px')
    .gridTemplateColumns('minmax(0, 1fr) auto')
    .gap('10px')
  styleBuilder
    .select('.topbar__search', theme)
    .media('max-width: 600px')
    .display('none')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar .topbar__search', theme)
    .media('max-width: 600px')
    .display('block')
    .position('absolute')
    .top('calc(100% + 8px)')
    .left('16px')
    .right('16px')
    .zIndex('80')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .topbar', theme)
    .media('max-width: 600px')
    .zIndex(90)
  styleBuilder
    .select(
      '.doc-nav-toggle:checked ~ .topbar .topbar__search .site-search',
      theme,
    )
    .media('max-width: 600px')
    .width('min(560px, calc(100vw - 24px))')
    .margin('0 auto')
  styleBuilder
    .select(
      '.doc-nav-toggle:checked ~ .topbar .topbar__search .site-search__results',
      theme,
    )
    .media('max-width: 600px')
    .left('50%')
    .right('auto')
    .transform('translateX(-50%)')
    .width('min(560px, calc(100vw - 24px))')
    .zIndex('120')
}
