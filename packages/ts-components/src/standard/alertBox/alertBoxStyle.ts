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
  applyAlertHeaderStyles(theme, palette)
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
    .border(`1px solid ${palette.current.border.default}`)
    .borderRadius(options.radii.md)
    .background(palette.semanticTone.neutral.surface.rest.background)
    .color(palette.current.text.default)
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
    .background(palette.semanticTone.neutral.icon.gradient)
    .backgroundColor(palette.semanticTone.neutral.icon.background)
    .border(`1px solid ${palette.semanticTone.neutral.icon.border}`)
    .color(palette.semanticTone.neutral.icon.color)
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
    .color(palette.current.text.subtle)

  styleBuilder
    .select('.alert__title', theme)
    .margin('0')
    .fontSize('15px')
    .fontWeight('700')
    .letterSpacing('-0.01em')
    .color(palette.current.text.default)
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
    .color(palette.current.text.default)
  styleBuilder
    .select('.alert__body :where(a)', theme)
    .color(palette.semanticTone.accent.text.default)
    .fontWeight('600')
    .textDecoration('underline')
  styleBuilder
    .select('.alert__body :where(code)', theme)
    .fontFamily("'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace")
    .fontSize('0.9em')
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)
    .border(`1px solid ${palette.current.border.subtle}`)
    .borderRadius(options.radii.sm)
    .padding('0.1em 0.35em')
}

export function applyAlertActionStyles(
  theme: ThemeMode,
  _palette: ThemePalette,
  _options: ThemeOptions,
) {
  styleBuilder
    .select('.alert__actions', theme)
    .display('flex')
    .alignItems('center')
    .flexWrap('wrap')
    .gap('8px')
}

export function applyAlertMetaStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.alert__meta', theme)
    .margin('0')
    .fontSize('12px')
    .lineHeight('1.5')
    .color(palette.current.text.subtle)
}

export function applyAlertResponsiveStyles(theme: ThemeMode) {
  styleBuilder.select('.alert', theme).media('max-width: 720px').padding('12px')

  styleBuilder
    .select('.alert__actions', theme)
    .media('max-width: 720px')
    .gap('6px')
}
