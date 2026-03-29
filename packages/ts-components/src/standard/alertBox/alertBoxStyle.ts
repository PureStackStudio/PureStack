import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerAlertBoxStyles() {
  themes.forEach((theme, palette, options) => {
    applyAlertShellStyles(theme, palette, options)
    applyAlertResponsiveStyles(theme)
  })
}

export function applyAlertShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyAlertContainerStyles(theme, palette, options)
  applyAlertIconStyles(theme, palette, options)
  applyAlertHeaderStyles(theme, palette, options)
  applyAlertBodyStyles(theme, palette, options)
  applyAlertActionStyles(theme, palette, options)
  applyAlertMetaStyles(theme, palette)
}

export function applyAlertContainerStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.alert', theme)
    .display('grid')
    .gridTemplateColumns('auto minmax(0, 1fr)')
    .gap('14px')
    .alignItems('start')
    .padding('14px 16px')
    .margin('0 0 14px')
    .border(`1px solid ${palette.border.default}`)
    .borderRadius(options.radii.md)
    .background(palette.background.panel)
    .color(palette.text.default)
    .boxShadow(palette.effect.panelShadow)
}

export function applyAlertIconStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.alert .alert__icon', theme)
    .width('32px')
    .height('32px')
    .borderRadius(options.radii.sm)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .background(palette.icon.neutral.gradient)
    .backgroundColor(palette.icon.neutral.background)
    .border(`1px solid ${palette.icon.neutral.ring}`)
    .color(palette.icon.neutral.color)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.alert__icon svg', theme)
    .width('16px')
    .height('16px')
    .display('block')
    .stroke('currentColor')
    .fill('none')
    .strokeLinecap('round')
    .strokeLinejoin('round')
    .strokeWidth('2.2')
}

export function applyAlertHeaderStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.alert__content', theme)
    .display('grid')
    .gap('10px')
    .minWidth('0')
  styleBuilder
    .select('.alert__header', theme)
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .flexWrap('wrap')

  styleBuilder
    .select('.alert__eyebrow', theme)
    .margin('0')
    .fontSize('11px')
    .fontWeight('700')
    .textTransform('uppercase')
    .letterSpacing('0.12em')
    .color(palette.text.subtle)

  styleBuilder
    .select('.alert__title', theme)
    .margin('0')
    .fontSize('15px')
    .fontWeight('700')
    .letterSpacing('-0.01em')
    .color(palette.text.strong)

  styleBuilder
    .select('.alert__badge', theme)
    .display('inline-flex')
    .alignItems('center')
    .padding('3px 8px')
    .borderRadius(options.radii.pill)
    .fontSize('11px')
    .fontWeight('700')
    .textTransform('uppercase')
    .letterSpacing('0.08em')
    .background(palette.badge.muted.background)
    .color(palette.badge.muted.text)
}

export function applyAlertBodyStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder.select('.alert__body', theme).display('grid').gap('8px')
  styleBuilder
    .select('.alert__body :where(p, ul, ol)', theme)
    .margin('0')
    .lineHeight('1.6')
  styleBuilder
    .select('.alert__body :where(strong)', theme)
    .color(palette.text.strong)
  styleBuilder
    .select('.alert__body :where(a)', theme)
    .color(palette.text.accent)
    .fontWeight('600')
    .textDecoration('underline')
  styleBuilder
    .select('.alert__body :where(code)', theme)
    .fontFamily("'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace")
    .fontSize('0.9em')
    .background(palette.background.surfaceAlt)
    .border(`1px solid ${palette.border.subtle}`)
    .borderRadius(options.radii.sm)
    .padding('0.1em 0.35em')
}

export function applyAlertActionStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.alert__actions', theme)
    .display('flex')
    .alignItems('center')
    .flexWrap('wrap')
    .gap('8px')
  styleBuilder.select('.alert__actions:empty', theme).display('none')

  styleBuilder
    .select('.alert__actions :where(a, button)', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .padding('6px 11px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.action.neutral.background)
    .color(palette.action.neutral.text)
    .fontSize('12px')
    .fontWeight('600')
    .textDecoration('none')
    .cursor('pointer')
    .transition(
      'background 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease',
    )

  styleBuilder
    .select('.alert__actions :where(a, button):hover', theme)
    .background(palette.action.neutral.hover)
  styleBuilder
    .select('.alert__actions :where(a, button):active', theme)
    .background(palette.action.neutral.active)
  styleBuilder
    .select('.alert__actions :where(a, button):focus-visible', theme)
    .outline(`2px solid ${palette.action.neutral.focusRing}`)
    .outlineOffset('2px')
}

export function applyAlertMetaStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.alert__meta', theme)
    .margin('0')
    .fontSize('12px')
    .lineHeight('1.5')
    .color(palette.text.subtle)
}

export function applyAlertResponsiveStyles(theme: ThemeMode) {
  styleBuilder.select('.alert', theme).media('max-width: 720px').padding('12px')

  styleBuilder
    .select('.alert__actions', theme)
    .media('max-width: 720px')
    .gap('6px')
}
