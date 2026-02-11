import { styleBuilder } from '../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../style/themeOptions'
import type { ThemePalette } from '../style/themePalette'

export function registerDocLayoutStyles() {
  themes.forEach((theme, palette, options) => {
    registerDocLayoutShellStyles(theme, palette, options)
    registerDocLayoutSidebarStyles(theme, options)
    registerDocLayoutNavStyles(theme, palette, options)
    registerDocLayoutResponsiveStyles(theme, options)
  })
}

function registerDocLayoutShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.template-doc', theme)
    .margin('0')
    .minHeight('100vh')
    .fontFamily(options.typography.baseFamily)
    .background(palette.background.canvas)
    .color(palette.text.default)

  styleBuilder
    .select('.doc-shell', theme)
    .display('grid')
    .gap('28px')
    .padding('32px')
    .maxWidth('1200px')
    .margin('0 auto')
    .width('100%')
    .boxSizing('border-box')
    .gridTemplateColumns('260px minmax(0, 1fr)')

  styleBuilder
    .select('.template-doc--full-main .doc-shell', theme)
    .maxWidth('none')
    .margin('0')
    .padding('32px clamp(24px, 6vw, 64px)')

  styleBuilder.select('.doc-shell--single', theme).gridTemplateColumns('1fr')
  styleBuilder
    .select('.doc-shell--nav-drawer', theme)
    .gridTemplateColumns('1fr')
  styleBuilder.select('.doc-main', theme).minWidth('0')
  styleBuilder.select('.doc-content', theme).margin('0').padding('8px 0 80px')
}

function registerDocLayoutSidebarStyles(
  theme: ThemeMode,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-sidebar', theme)
    .position('sticky')
    .top('24px')
    .alignSelf('start')
    .height('calc(100vh - 48px)')
    .overflow('auto')
  styleBuilder
    .select('.template-doc--nav-drawer .doc-sidebar', theme)
    .position('fixed')
    .top('72px')
    .right('16px')
    .left('auto')
    .width('fit-content')
    .maxWidth('min(360px, calc(100vw - 32px))')
    .maxHeight('calc(100vh - 88px)')
    .height('auto')
    .transform('translateX(120%)')
    .transition('transform 220ms ease')
    .zIndex(35)
    .overflow('auto')
    .boxShadow(options.shadows.strong)
}

function registerDocLayoutNavStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-nav', theme)
    .background(palette.background.surface)
    .border(`1px solid ${palette.border.subtle}`)
    .borderRadius(options.radii.lg)
    .padding('16px')
    .height('100%')
    .boxSizing('border-box')
  styleBuilder
    .select('.doc-nav__list', theme)
    .listStyle('none')
    .margin('0')
    .padding('0')
    .display('grid')
    .gap('6px')
  styleBuilder
    .select('.doc-nav__list .doc-nav__list', theme)
    .paddingLeft('12px')
    .borderLeft(`1px solid ${palette.border.default}`)
  styleBuilder.select('.doc-nav__item', theme).display('grid')
  styleBuilder
    .select('.doc-nav__item a', theme)
    .display('block')
    .padding('8px 12px')
    .borderRadius('10px')
    .textDecoration('none')
    .fontWeight('600')
    .transition('background 160ms ease, color 160ms ease')
    .color(palette.text.default)
  styleBuilder
    .select('.doc-nav__item a:hover', theme)
    .background(palette.background.accentMuted)
  styleBuilder
    .select('.doc-nav__item span', theme)
    .display('block')
    .padding('8px 12px')
    .borderRadius('10px')
    .fontWeight('600')
    .color(palette.text.subtle)
}

function registerDocLayoutResponsiveStyles(
  theme: ThemeMode,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-shell', theme)
    .media('max-width: 1023px')
    .gridTemplateColumns('1fr')
    .padding('16px')
  styleBuilder
    .select('.template-doc--nav-drawer .doc-sidebar', theme)
    .media('max-width: 1023px')
    .position('fixed')
    .top('72px')
    .left('16px')
    .right('16px')
    .bottom('16px')
    .height('auto')
    .transform('translateX(-120%)')
    .transition('transform 220ms ease')
    .zIndex(35)
    .boxShadow(options.shadows.strong)
  styleBuilder
    .select('.template-doc:not(.template-doc--nav-drawer) .doc-sidebar', theme)
    .media('max-width: 1023px')
    .position('static')
    .top('auto')
    .height('auto')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-shell .doc-sidebar', theme)
    .transform('translateX(0)')
}
