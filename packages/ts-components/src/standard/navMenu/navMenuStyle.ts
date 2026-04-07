import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerNavStyles() {
  themes.forEach((theme, palette, options) => {
    registerNavShellStyles(theme, palette, options)
    registerNavLinkStyles(theme, palette, options)
    registerNavSummaryStyles(theme, palette, options)
    registerNavBadgeStyles(theme, palette, options)
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
    .padding('16px')
    .borderRadius(options.radii.lg)
    .border('1px solid transparent')
    .fontSize(options.typography.baseSize)
    .lineHeight(options.typography.baseLineHeight)
    .maxHeight('100%')
    .background(palette.background.surface)
    .borderColor(palette.border.subtle)
    .color(palette.text.default)
    .overflowY('auto')
    .overflowX('hidden')
  styleBuilder
    .select('.nav__header-row', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('8px')
    .marginBottom('8px')
  styleBuilder
    .select('.nav__header', theme)
    .fontWeight('700')
    .fontSize('0.78rem')
    .letterSpacing('0.08em')
    .textTransform('uppercase')
    .color(palette.text.subtle)
    .opacity('0.5')
  styleBuilder
    .select('.nav__panel-toggle', theme)
    .display('none')
    .alignItems('center')
    .justifyContent('center')
    .padding('0')
    .border(`1px solid ${palette.semanticTone.accent.background}`)
    .borderRadius(options.radii.md)
    .background(palette.semanticTone.accent.background)
    .color(palette.semanticTone.accent.text)
    .cursor('pointer')
    .transition('background 160ms ease, color 160ms ease')
    .top('49px')
  styleBuilder.select('.nav__panel-toggle-label', theme).display('inline-block')
  styleBuilder.select('.nav__panel-toggle-icon', theme).display('none')
  styleBuilder
    .select('.nav__panel-toggle:hover', theme)
    .background(palette.semanticTone.accent.hover)
    .color(palette.semanticTone.accent.text)
  styleBuilder
    .select(
      '.nav__panel-toggle:focus-visible, .nav__collapse-toggle:focus-visible',
      theme,
    )
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
  styleBuilder
    .select('.nav__collapse-toggle', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .width('30px')
    .height('30px')
    .padding('0')
    .border(`1px solid ${palette.border.default}`)
    .borderRadius(options.radii.md)
    .background(palette.background.raised)
    .color(palette.text.subtle)
    .cursor('pointer')
    .transition('background 160ms ease, color 160ms ease')
  styleBuilder
    .select('.nav__collapse-toggle:hover', theme)
    .background(palette.background.accentMuted)
    .color(palette.text.accent)
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
    .width('16px')
    .height('16px')
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
    .media('min-width: 1024px')
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
    .media('min-width: 1024px')
    .transition('transform 260ms ease')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar',
      theme,
    )
    .media('min-width: 1024px')
    .width('26px')
    .position('fixed')
    .left('0')
    .right('auto')
    .top('72px')
    .height('calc(100dvh - 72px)')
    .maxHeight('none')
    .background('transparent')
    .boxShadow('none')
    .overflow('visible')
    .transform('translateX(calc(-100% + 26px))')
    .zIndex(140)
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar.doc-sidebar--open',
      theme,
    )
    .media('min-width: 1024px')
    .width('260px')
    .background('transparent')
    .boxShadow('none')
    .transform('translateX(0)')
  styleBuilder
    .select(
      '.template-doc.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-shell',
      theme,
    )
    .media('min-width: 1024px')
    .gridTemplateColumns('minmax(0, 1fr)')
  styleBuilder
    .select(
      '.template-doc.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-shell--toc',
      theme,
    )
    .media('min-width: 1321px')
    .gridTemplateColumns('minmax(0, 1fr) 240px')
  styleBuilder
    .select(
      '.template-doc.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-shell--toc',
      theme,
    )
    .media('max-width: 1320px')
    .gridTemplateColumns('1fr')
  styleBuilder
    .select(
      '.template-doc.template-doc--nav-collapsed.template-doc--toc-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-shell--toc',
      theme,
    )
    .media('min-width: 1024px')
    .gridTemplateColumns('1fr')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__header, .template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__collapse-toggle, .template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__list',
      theme,
    )
    .media('min-width: 1024px')
    .display('none')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__menu',
      theme,
    )
    .media('min-width: 1024px')
    .width('26px')
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
    .media('min-width: 1024px')
    .margin('0')
    .width('26px')
    .height('118px')
    .position('static')
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar:not(.doc-sidebar--open) .nav__panel-toggle',
      theme,
    )
    .media('min-width: 1024px')
    .display('inline-flex')
    .position('absolute')
    .alignItems('center')
    .justifyContent('center')
    .writingMode('vertical-rl')
    .textOrientation('mixed')
    .width('26px')
    .height('118px')
    .fontSize('0.70rem')
    .fontWeight('700')
    .letterSpacing('0.12em')
    .textTransform('uppercase')
    .userSelect('none')
    .border(`1px solid ${palette.border.default}`)
    .borderLeft('none')
    .borderRadius(`0 ${options.radii.md} ${options.radii.md} 0`)
  styleBuilder
    .select(
      '.template-doc--nav-collapsed.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-sidebar.doc-sidebar--open .nav__panel-toggle',
      theme,
    )
    .media('min-width: 1024px')
    .display('none')

  styleBuilder
    .select('.nav__panel-toggle, .nav__collapse-toggle', theme)
    .media('max-width: 1023px')
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
    .display('grid')
    .gap('4px')
  styleBuilder
    .select('.nav__list .nav__list', theme)
    .marginTop('6px')
    .paddingLeft('12px')
    .borderLeft('1px solid transparent')
    .borderLeftColor(palette.border.default)
  styleBuilder.select('.nav__item', theme).display('grid').gap('4px')
  styleBuilder.select('.nav__leaf', theme).display('block')
  styleBuilder.select('.nav__group', theme).display('grid')
  styleBuilder
    .select('.template-doc--has-nav .doc-sidebar .nav__menu', theme)
    .media('max-width: 1023px')
    .width('100%')
    .maxWidth('none')
    .minHeight('calc(100dvh - 72px)')
    .borderRadius('0')
    .border('0')
    .padding('16px 16px 20px')
    .height('100%')
    .overflow('auto')
    .boxSizing('border-box')

  styleBuilder
    .select(
      '.doc-nav-toggle:checked ~ .doc-shell .doc-sidebar .nav__menu',
      theme,
    )
    .media('max-width: 720px')
    .padding('60px 16px 20px')
}

export function registerNavLinkStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.nav__link', theme)
    .display('block')
    .padding('8px 12px')
    .borderRadius(options.radii.md)
    .textDecoration('none')
    .fontWeight('600')
    .transition('background 160ms ease, color 160ms ease')
    .color(palette.text.default)
  styleBuilder
    .select('.nav__link:hover', theme)
    .background(palette.semanticTone.ghost.hover)
  styleBuilder
    .select('.nav__link--active', theme)
    .background(palette.semanticTone.accent.background)
    .color(palette.semanticTone.accent.text)
  styleBuilder
    .select('.nav__link:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
  styleBuilder
    .select('.nav__text', theme)
    .display('block')
    .padding('8px 12px')
    .borderRadius(options.radii.md)
    .fontWeight('600')
    .color(palette.text.subtle)
}

export function registerNavSummaryStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.nav__summary', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('8px')
    .cursor('pointer')
    .borderRadius(options.radii.md)
  styleBuilder
    .select('.nav__summary:hover', theme)
    .background(palette.background.surfaceAlt)
  styleBuilder
    .select('.nav__summary:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
  styleBuilder
    .select('.nav__summary--active', theme)
    .background(palette.semanticTone.accent.background)
  styleBuilder
    .select('.nav__summary--active .nav__text', theme)
    .color(palette.semanticTone.accent.text)
  styleBuilder
    .select('.nav__summary-content', theme)
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .flex('1')
  styleBuilder
    .select('.nav__chevron', theme)
    .width('8px')
    .height('8px')
    .borderRight('2px solid currentColor')
    .borderBottom('2px solid currentColor')
    .transform('rotate(-45deg)')
    .transition('transform 160ms ease')
    .color(palette.text.subtle)
  styleBuilder
    .select('.nav__group[open] > .nav__summary .nav__chevron', theme)
    .transform('rotate(45deg)')
  styleBuilder
    .select('.nav__summary::-webkit-details-marker', theme)
    .display('none')
  styleBuilder.select('.nav__summary::marker', theme).content('""')
}

export function registerNavBadgeStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.nav__badge', theme)
    .padding('2px 8px')
    .borderRadius(options.radii.pill)
    .fontSize('11px')
    .fontWeight('700')
    .letterSpacing('0.02em')
    .textTransform('uppercase')
    .background(palette.semanticTone.accent.background)
    .color(palette.semanticTone.accent.text)
}
