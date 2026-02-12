import { styleBuilder } from '../../../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../../../style/themeOptions'
import type { ThemePalette } from '../../../style/themePalette'

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
    .background(palette.action.ghost.hover)
  styleBuilder
    .select('.nav__link--active', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
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
    .padding('4px')
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
    .background(palette.action.accent.background)
  styleBuilder
    .select('.nav__summary--active .nav__text', theme)
    .color(palette.action.accent.text)
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
    .background(palette.badge.accent.background)
    .color(palette.badge.accent.text)
}
