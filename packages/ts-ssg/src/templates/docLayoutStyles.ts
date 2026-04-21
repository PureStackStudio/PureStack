import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  getBreakpoint,
  mediaBelow,
  mediaMax,
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerDocLayoutStyles() {
  themes.forEach((theme, palette, options) => {
    registerDocLayoutShellStyles(theme, palette, options)
    registerDocLayoutSidebarStyles(theme, options)
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
    .background(palette.semanticTone.neutral.canvas)
    .color(palette.current.text.default)

  styleBuilder
    .select('.doc-shell', theme)
    .display('grid')
    .gap('28px')
    .padding('32px')
    .maxWidth(getBreakpoint(BREAKPOINTS.wide))
    .margin('0 auto')
    .width('100%')
    .boxSizing('border-box')
    .gridTemplateColumns('260px minmax(0, 1fr)')

  styleBuilder
    .select('.template-doc--full-main .doc-shell', theme)
    .maxWidth('none')
    .margin('0')
    .padding('1em')

  styleBuilder
    .select(
      '.template-doc--full-main.template-doc--nav-collapsed .doc-shell',
      theme,
    )
    .paddingLeft('3rem')

  styleBuilder
    .select(
      '.template-doc--full-main.template-doc--toc-collapsed .doc-shell',
      theme,
    )
    .paddingRight('3rem')

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
    .select('.doc-sidebar', theme) // sync this with '.doc-toc' to get same behavior on both sides.
    .position('sticky')
    .top('88px')
    .width('100%')
    .zIndex(30)
    .alignSelf('start')
    .height('calc(100vh - 112px)')
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
    .zIndex(35)
    .overflow('auto')
    .boxShadow(options.shadows.strong)
  styleBuilder
    .select(
      '.template-doc.template-doc--nav-ready.template-doc--nav-drawer .doc-sidebar',
      theme,
    )
    .transition('transform 220ms ease')
}

function registerDocLayoutResponsiveStyles(
  theme: ThemeMode,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-shell', theme)
    .media(mediaBelow(BREAKPOINTS.lg))
    .gridTemplateColumns('1fr')
    .padding('16px')
  styleBuilder
    .select('.template-doc', theme)
    .media(mediaBelow(BREAKPOINTS.lg))
    .overflowX('hidden')
  styleBuilder
    .select(
      '.template-doc--nav-drawer .doc-sidebar, .template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar',
      theme,
    )
    .media(mediaBelow(BREAKPOINTS.lg))
    .position('fixed')
    .top('72px')
    .left('auto')
    .right('0')
    .bottom('0')
    .height('calc(100dvh - 72px)')
    .maxWidth('100vw')
    .maxHeight('none')
    .borderRadius('0')
    .background('inherit')
    .overflow('hidden')
    .transform('translateX(120%)')
    .zIndex(50)
    .boxShadow(options.shadows.strong)
  styleBuilder
    .select(
      '.template-doc--nav-drawer .doc-sidebar, .template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar',
      theme,
    )
    .media(mediaMax(BREAKPOINTS.sm))
    .left('0')
    .right('0')
    .width('100%')
    .maxWidth('none')
  styleBuilder
    .select(
      '.template-doc.template-doc--nav-ready.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar',
      theme,
    )
    .media(mediaBelow(BREAKPOINTS.lg))
    .transition('transform 220ms ease')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-shell .doc-sidebar', theme)
    .transform('translateX(0)')
}
