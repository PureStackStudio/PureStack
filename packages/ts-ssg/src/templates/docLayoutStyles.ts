import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  docLayoutDefaults,
  docLayoutVar,
  docLayoutVars,
  getBreakpoint,
  mediaBelow,
  mediaMax,
  mediaMin,
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerDocLayoutStyles() {
  themes.forEach((theme, palette, options) => {
    if (options.mobileRemSize) {
      styleBuilder
        .select('html', theme)
        .media(mediaBelow(BREAKPOINTS.md))
        .fontSize(options.mobileRemSize)
    }
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
    .display('flex')
    .flexDirection('column')
    .minHeight('100dvh')
    .fontFamily(options.typography.baseFamily)
    .background(palette.semanticTone.neutral.canvas)
    .color(palette.current.text.default)
    .set(docLayoutVars.defaultNavWidth, docLayoutDefaults.defaultNavWidth)
    .set(docLayoutVars.defaultTocWidth, docLayoutDefaults.defaultTocWidth)
    .set(docLayoutVars.defaultRailWidth, docLayoutDefaults.defaultRailWidth)
    .set(
      docLayoutVars.defaultShellPaddingInlineStart,
      docLayoutDefaults.defaultShellPaddingInlineStart,
    )
    .set(
      docLayoutVars.defaultShellPaddingInlineEnd,
      docLayoutDefaults.defaultShellPaddingInlineEnd,
    )
    .set(
      docLayoutVars.defaultShellPaddingBlock,
      docLayoutDefaults.defaultShellPaddingBlock,
    )
    .set(
      docLayoutVars.compactShellPaddingInlineStart,
      docLayoutDefaults.compactShellPaddingInlineStart,
    )
    .set(
      docLayoutVars.compactShellPaddingInlineEnd,
      docLayoutDefaults.compactShellPaddingInlineEnd,
    )
    .set(
      docLayoutVars.compactShellPaddingBlock,
      docLayoutDefaults.compactShellPaddingBlock,
    )
    .set(
      docLayoutVars.fullShellPaddingInlineStart,
      docLayoutDefaults.fullShellPaddingInlineStart,
    )
    .set(
      docLayoutVars.fullShellPaddingInlineEnd,
      docLayoutDefaults.fullShellPaddingInlineEnd,
    )
    .set(
      docLayoutVars.fullShellPaddingBlock,
      docLayoutDefaults.fullShellPaddingBlock,
    )
    .set(docLayoutVars.minNavWidth, docLayoutDefaults.minNavWidth)
    .set(docLayoutVars.maxNavWidth, docLayoutDefaults.maxNavWidth)
    .set(docLayoutVars.minTocWidth, docLayoutDefaults.minTocWidth)
    .set(docLayoutVars.maxTocWidth, docLayoutDefaults.maxTocWidth)
    .set(
      docLayoutVars.preferredNavWidth,
      `clamp(${docLayoutVar('minNavWidth')}, var(${docLayoutVars.userNavWidth}, ${docLayoutVar('defaultNavWidth')}), ${docLayoutVar('maxNavWidth')})`,
    )
    .set(
      docLayoutVars.preferredTocWidth,
      `clamp(${docLayoutVar('minTocWidth')}, var(${docLayoutVars.userTocWidth}, ${docLayoutVar('defaultTocWidth')}), ${docLayoutVar('maxTocWidth')})`,
    )
    .set(
      docLayoutVars.preferredShellPaddingInlineStart,
      `var(${docLayoutVars.userShellPaddingInlineStart}, ${docLayoutVar('defaultShellPaddingInlineStart')})`,
    )
    .set(
      docLayoutVars.preferredShellPaddingInlineEnd,
      `var(${docLayoutVars.userShellPaddingInlineEnd}, ${docLayoutVar('defaultShellPaddingInlineEnd')})`,
    )
    .set(docLayoutVars.activeNavWidth, '0')
    .set(docLayoutVars.activeTocWidth, '0')
    .set(docLayoutVars.activeRailWidth, docLayoutVar('defaultRailWidth'))
    .set(
      docLayoutVars.activeShellPaddingInlineStart,
      docLayoutVar('preferredShellPaddingInlineStart'),
    )
    .set(
      docLayoutVars.activeShellPaddingInlineEnd,
      docLayoutVar('preferredShellPaddingInlineEnd'),
    )
    .set(
      docLayoutVars.activeShellPaddingBlock,
      docLayoutVar('defaultShellPaddingBlock'),
    )

  styleBuilder
    .select(
      '.template-doc--has-nav:not(.template-doc--nav-drawer):not(.template-doc--nav-collapsed)',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .set(docLayoutVars.activeNavWidth, docLayoutVar('preferredNavWidth'))

  styleBuilder
    .select('.template-doc--has-toc:not(.template-doc--toc-collapsed)', theme)
    .media(mediaMin(BREAKPOINTS.toc))
    .set(docLayoutVars.activeTocWidth, docLayoutVar('preferredTocWidth'))

  styleBuilder
    .select('.template-doc--full-main', theme)
    .set(
      docLayoutVars.activeShellPaddingInlineStart,
      docLayoutVar('fullShellPaddingInlineStart'),
    )
    .set(
      docLayoutVars.activeShellPaddingInlineEnd,
      docLayoutVar('fullShellPaddingInlineEnd'),
    )
    .set(
      docLayoutVars.activeShellPaddingBlock,
      docLayoutVar('fullShellPaddingBlock'),
    )

  styleBuilder
    .select('.doc-shell', theme)
    .display('grid')
    .flex('1 0 auto')
    .gap('0')
    .paddingInlineStart(docLayoutVar('activeShellPaddingInlineStart'))
    .paddingInlineEnd(docLayoutVar('activeShellPaddingInlineEnd'))
    .set('padding-block', docLayoutVar('activeShellPaddingBlock'))
    .margin('0')
    .width('100%')
    .boxSizing('border-box')
    .gridTemplateColumns('minmax(0, 1fr)')

  styleBuilder
    .select('.doc-shell .doc-main > article', theme)
    .maxWidth(getBreakpoint(BREAKPOINTS.wide))
    .margin('0 auto')

  styleBuilder
    .select('.template-doc--full-main .doc-shell .doc-main > article', theme)
    .maxWidth('none')
    .margin('0')

  styleBuilder
    .select(
      '.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-shell:not(.doc-shell--toc)',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .gridTemplateColumns(`${docLayoutVar('activeNavWidth')} minmax(0, 1fr)`)

  styleBuilder.select('.template-doc > .site-footer', theme).flex('0 0 auto')
  styleBuilder.select('.doc-shell--single', theme).gridTemplateColumns('1fr')
  styleBuilder
    .select('.doc-shell--nav-drawer', theme)
    .gridTemplateColumns('1fr')
  styleBuilder.select('.doc-main', theme).minWidth('0')
  styleBuilder.select('.doc-content', theme).margin('0').padding('0')
  styleBuilder.select('.doc-content :where(ul,ol)', theme).listStyle('auto')
}

function registerDocLayoutSidebarStyles(
  theme: ThemeMode,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-sidebar', theme) // sync this with '.doc-toc' to get same behavior on both sides.
    .position('sticky')
    .top('6.5625rem')
    .width('100%')
    .zIndex(30)
    .alignSelf('start')
    .maxHeight('calc(100vh - 8.125rem)')
    .overflow('hidden')
    .touchAction('none')
    .set('overscroll-behavior', 'none')
    .userSelect('none')
  styleBuilder
    .select('.template-doc--nav-drawer .doc-sidebar', theme)
    .position('fixed')
    .top('6.5625rem')
    .right('1rem')
    .left('auto')
    .width('fit-content')
    .minWidth('18.75rem')
    .height('auto')
    .transform('translateX(120%)')
    .zIndex(40)
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
  styleBuilder
    .select('.template-doc', theme)
    .media(mediaBelow(BREAKPOINTS.lg))
    .set(
      docLayoutVars.activeShellPaddingInlineStart,
      docLayoutVar('compactShellPaddingInlineStart'),
    )
    .set(
      docLayoutVars.activeShellPaddingInlineEnd,
      docLayoutVar('compactShellPaddingInlineEnd'),
    )
    .set(
      docLayoutVars.activeShellPaddingBlock,
      docLayoutVar('compactShellPaddingBlock'),
    )
  styleBuilder
    .select('.template-doc.template-doc--full-main', theme)
    .media(mediaBelow(BREAKPOINTS.lg))
    .set(
      docLayoutVars.activeShellPaddingInlineStart,
      docLayoutVar('compactShellPaddingInlineStart'),
    )
    .set(
      docLayoutVars.activeShellPaddingInlineEnd,
      docLayoutVar('compactShellPaddingInlineEnd'),
    )
    .set(
      docLayoutVars.activeShellPaddingBlock,
      docLayoutVar('compactShellPaddingBlock'),
    )
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
    .top('4.875rem')
    .left('auto')
    .right('0')
    .bottom('0')
    .height('calc(100dvh - 4.875rem)')
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
