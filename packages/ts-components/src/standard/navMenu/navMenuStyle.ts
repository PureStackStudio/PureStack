import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  docLayoutVar,
  mediaAbove,
  mediaBelow,
  mediaMax,
  mediaMin,
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerNavStyles() {
  themes.forEach((theme, palette, options) => {
    registerNavShellStyles(theme, palette, options)
    registerNavSummaryStyles(theme, palette)
  })
}

export function registerNavShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.nav__menu', theme)
    .display('block')
    .padding('1em')
    .borderRadius(options.radii.lg)
    .border('1px solid transparent')
    .apply(palette.applyFont(palette.font.size.body))
    .maxHeight('100%')
    .overflowY('auto')
    .overflowX('hidden')
    .marginRight(docLayoutVar('activeShellPaddingInlineStart'))
  styleBuilder
    .select('.nav__header-row', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('0.5em')
    .marginBottom('0.5em')
  styleBuilder.select('.nav__search', theme).display('none').width('100%')
  styleBuilder
    .select('.nav__search', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .display('block')
  styleBuilder
    .select('.nav__header', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w700))
    .textTransform('uppercase')
    .color(palette.current.text.subtle)
    .opacity('0.5')
  styleBuilder
    .select('.nav__panel-toggle', theme)
    .display('none')
    .alignItems('center')
    .justifyContent('center')
    .padding('0')
    .borderRadius(options.radii.md)
    .cursor('pointer')
    .transition('background 160ms ease, color 160ms ease')
    .bottom('5rem')
  styleBuilder.select('.nav__panel-toggle-label', theme).display('inline-block')
  styleBuilder.select('.nav__panel-toggle-icon', theme).display('none')
  styleBuilder
    .select(
      '.nav__panel-toggle:focus-visible, .nav__collapse-toggle:focus-visible',
      theme,
    )
    .outline(`2px solid ${palette.current.border.focus}`)
  styleBuilder
    .select('.nav__collapse-toggle', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .padding('0.25em')
    .border(`transparent`)
    .borderRadius(options.radii.md)
    .background('transparent')
    .cursor('pointer')
    .transition('background 160ms ease, color 160ms ease')
    .apply(palette.applyFont(palette.font.size.xxxs))
  styleBuilder
    .select('.nav__collapse-toggle-icon', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
  styleBuilder.select('.nav__collapse-toggle-icon--open', theme).display('none')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed .nav__collapse-toggle-icon--collapse',
      theme,
    )
    .display('none')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed .nav__collapse-toggle-icon--open',
      theme,
    )
    .display('inline-flex')
  styleBuilder
    .select('.nav__collapse-toggle-icon svg', theme)
    .display('block')
    .fill('none')
    .stroke('currentColor')
    .strokeWidth('1.9')
    .strokeLinecap('round')
    .strokeLinejoin('round')

  styleBuilder
    .select(
      '.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .overflow('visible')
    .transformOrigin('left center')
    .transform('translateX(0)')
    .willChange('transform')
    .zIndex(30)
  styleBuilder
    .select(
      '.template-doc.template-doc--nav-ready.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .transition('transform 260ms ease')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .width(docLayoutVar('activeRailWidth'))
    .position('fixed')
    .left('0')
    .right('auto')
    .top('72px')
    .height('calc(100dvh - 72px)')
    .maxHeight('none')
    .background('transparent')
    .boxShadow('none')
    .overflow('visible')
    .transform(`translateX(calc(-100% + ${docLayoutVar('activeRailWidth')}))`)
    .zIndex(140)
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar.doc-sidebar--open',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .width(docLayoutVar('preferredNavWidth'))
    .background('transparent')
    .boxShadow('none')
    .transform('translateX(0)')
  styleBuilder
    .select(
      '.template-doc.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-shell',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .gridTemplateColumns('minmax(0, 1fr)')
  styleBuilder
    .select(
      '.template-doc.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-shell--toc',
      theme,
    )
    .media(mediaAbove(BREAKPOINTS.toc))
    .gridTemplateColumns(`minmax(0, 1fr) ${docLayoutVar('activeTocWidth')}`)
  styleBuilder
    .select(
      '.template-doc.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-shell--toc',
      theme,
    )
    .media(mediaMax(BREAKPOINTS.toc))
    .gridTemplateColumns('1fr')
  styleBuilder
    .select(
      '.template-doc.template-doc--nav-collapsed.template-doc--toc-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-shell--toc',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .gridTemplateColumns('1fr')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__header, .template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__collapse-toggle, .template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__list',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .display('none')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__menu',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .width(docLayoutVar('activeRailWidth'))
    .marginLeft('0')
    .padding('0')
    .background('transparent')
    .border('none')
    .borderRadius('0')
    .overflow('visible')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__header-row',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .margin('0')
    .width(docLayoutVar('activeRailWidth'))
    .height('118px')
    .position('static')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__panel-toggle',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .display('inline-flex')
    .position('absolute')
    .alignItems('center')
    .justifyContent('center')
    .writingMode('vertical-rl')
    .textOrientation('mixed')
    .height('auto')
    .padding('0.6em 0')
    .width(docLayoutVar('activeRailWidth'))
    .apply(palette.applyFont(palette.font.size.xxxs, palette.font.weight.w700))
    .textTransform('uppercase')
    .userSelect('none')
    .border(`1px solid ${palette.current.border.default}`)
    .borderLeft('none')
    .borderRadius(`0 ${options.radii.md} ${options.radii.md} 0`)
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar.doc-sidebar--open .nav__panel-toggle',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .display('none')

  styleBuilder
    .select('.nav__panel-toggle, .nav__collapse-toggle', theme)
    .media(mediaBelow(BREAKPOINTS.lg))
    .display('none')
  styleBuilder
    .select(
      '.template-doc--nav-drawer .nav__panel-toggle, .template-doc--nav-drawer .nav__collapse-toggle',
      theme,
    )
    .display('none')
  styleBuilder
    .select('.nav__list', theme)
    .listStyle('none')
    .margin('0')
    .padding('0')
  styleBuilder.select('.nav__list .nav__list', theme).paddingLeft('0.75em')
  styleBuilder
    .select('.template-doc--has-nav .doc-sidebar .nav__menu', theme)
    .media(mediaBelow(BREAKPOINTS.lg))
    .width('100%')
    .maxWidth('none')
    .minHeight('calc(100dvh - 72px)')
    .borderRadius('0')
    .border('0')
    .padding('16px 16px 20px')
    .height('100%')
    .overflow('auto')
    .boxSizing('border-box')
}

export function registerNavSummaryStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder.select('.nav__summary', theme).position('relative')
  styleBuilder
    .select('.nav__chevron', theme)
    .position('absolute')
    .left('auto')
    .right('2px')
    .transform('rotate(0deg)')
    .transition('transform 160ms ease')
    .color(palette.current.text.subtle)
  styleBuilder
    .select('.nav__group[open] > .nav__summary .nav__chevron', theme)
    .transform('rotate(-90deg)')
  styleBuilder.select('.nav__summary::marker', theme).content('""')
}
