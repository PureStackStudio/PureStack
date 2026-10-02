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
  themes,
} from '@purestack/ts-style'
import { getTopBarToggleVisibleSelectors } from '../topBar/topBarStyle'

export function registerNavStyles() {
  themes.forEach((theme, palette) => {
    registerNavShellStyles(theme, palette)
    registerNavSummaryStyles(theme, palette)
  })
}

export function registerNavShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('li.nav__item', theme)
    .marginInlineStart('-0.5rem')
    .marginInlineEnd('-0.5rem')
  styleBuilder
    .select('li.nav__item .icon', theme)
    .width('1.3em')
    .height('1.3em')
  styleBuilder.select('li.nav__item .btn', theme).gap('0.5em').padding('0.5em')
  styleBuilder
    .select('.nav__list .nav__list li.nav__item', theme)
    .marginInlineStart('0.75rem')
    .marginInlineEnd('0rem')
  styleBuilder
    .select('.nav__menu', theme)
    .display('block')
    .padding('1em')
    .borderRadius(`${palette.radii.lg} !important`)
    .border('1px solid transparent')
    .apply(palette.applyFont(palette.font.size.body))
    .maxHeight(`calc(100vh - ${docLayoutVar('sidebarTop')} - 1.5625rem)`)
    .overflowY('auto')
    .overflowX('hidden')
    .marginRight(docLayoutVar('activeShellPaddingInlineStart'))
  styleBuilder
    .select('.nav__header-row', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('0.5em')
  registerNavAccountPlacementStyles(theme)
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
    .borderRadius(palette.radii.md)
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
    .display('none')
    .alignItems('center')
    .justifyContent('center')
    .padding('0.25em')
    .border(`transparent`)
    .borderRadius(palette.radii.md)
    .background('transparent')
    .cursor('pointer')
    .transition('background 160ms ease, color 160ms ease')
    .apply(palette.applyFont(palette.font.size.xxxs))
  // Collapsing belongs to the doc layout, so only a docked menu offers it.
  styleBuilder
    .select('.doc-sidebar .nav__collapse-toggle', theme)
    .display('inline-flex')
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
    .transformOrigin('left center')
    .transform('translateX(0)')
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
    .top(docLayoutVar('sidebarTop'))
    .height(`calc(100dvh - ${docLayoutVar('sidebarTop')})`)
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
    .border('none !important')
    .borderRadius('0 !important')
    .overflow('visible')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__header-row',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .margin('0')
    .width(docLayoutVar('activeRailWidth'))
    .height('7.375rem')
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
    .borderRadius(`0 ${palette.radii.md} ${palette.radii.md} 0`)
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar.doc-sidebar--open .nav__panel-toggle',
      theme,
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .display('none')

  styleBuilder
    .select(
      '.doc-sidebar .nav__panel-toggle, .doc-sidebar .nav__collapse-toggle',
      theme,
    )
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
  styleBuilder
    .select('.template-doc--has-nav .doc-sidebar .nav__menu', theme)
    .media(mediaBelow(BREAKPOINTS.lg))
    .width('100%')
    .maxWidth('none')
    .minHeight(`calc(100dvh - ${docLayoutVar('sidebarTopMobile')})`)
    .maxHeight('none')
    .borderRadius('0 !important')
    .border('0 !important')
    .padding('1rem 1rem 1.25rem')
    .height('100%')
    .overflow('auto')
    .boxSizing('border-box')
}

function registerNavAccountPlacementStyles(theme: ThemeMode) {
  styleBuilder.select('.nav__menu .nav__account', theme).display('none')
  for (const rule of getTopBarToggleVisibleSelectors(
    '.doc-sidebar .nav__menu .nav__account',
  )) {
    let selector = styleBuilder.select(rule.selector, theme)
    if (rule.media) selector = selector.media(rule.media)
    selector.display('inline-block').marginLeft('auto')
  }
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
    .right('0.125rem')
    .transform('rotate(0deg)')
    .transition('transform 160ms ease')
    .top('50%')
    .set('translate', '0 -50%')
    .color(palette.current.text.subtle)
  styleBuilder
    .select('.nav__group[open] > .nav__summary .nav__chevron', theme)
    .transform('rotate(-90deg)')
  styleBuilder.select('.nav__summary::marker', theme).content('""')
}
