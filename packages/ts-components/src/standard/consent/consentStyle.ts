import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerConsentStyles() {
  themes.forEach((theme, palette, options) => {
    registerConsentShellStyles(theme)
    registerConsentBannerStyles(theme, palette, options)
    registerConsentPanelStyles(theme, palette, options)
    registerConsentFormStyles(theme, palette, options)
    registerConsentResponsiveStyles(theme)
  })
}

function registerConsentShellStyles(theme: ThemeMode) {
  styleBuilder
    .select('.consent', theme)
    .position('fixed')
    .left('0')
    .right('0')
    .bottom('0')
    .zIndex(1200)
    .pointerEvents('none')
}

function registerConsentBannerStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.consent__banner', theme)
    .pointerEvents('auto')
    .margin('0 auto 16px')
    .width('min(980px, calc(100vw - 24px))')
    .padding('18px')
    .borderRadius(options.radii.lg)
    .background(palette.semanticTone.neutral.background.surface)
    .border(`1px solid ${palette.semanticTone.neutral.border.default}`)
    .boxShadow(palette.effect.panelShadowStrong)
    .display('grid')
    .gap('10px')
  styleBuilder.select('.consent__banner[hidden]', theme).display('none')
  styleBuilder
    .select('.consent__title', theme)
    .margin('0')
    .fontSize('18px')
    .fontWeight('750')
    .letterSpacing('-0.01em')
    .color(palette.semanticTone.neutral.text.default)
  styleBuilder
    .select('.consent__description', theme)
    .margin('0')
    .fontSize('14px')
    .lineHeight('1.6')
    .color(palette.semanticTone.neutral.text.subtle)
  styleBuilder
    .select('.consent__policy', theme)
    .color(palette.semanticTone.accent.text.default)
    .fontWeight('650')
    .textDecoration('none')
  styleBuilder
    .select('.consent__policy:hover', theme)
    .textDecoration('underline')
}

function registerConsentPanelStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.consent__panel', theme)
    .pointerEvents('auto')
    .position('fixed')
    .right('12px')
    .bottom('66px')
    .left('12px')
    .width('min(720px, calc(100vw - 24px))')
    .marginLeft('auto')
    .padding('16px')
    .display('grid')
    .gap('14px')
    .borderRadius(options.radii.lg)
    .background(palette.semanticTone.neutral.background.surface)
    .border(`1px solid ${palette.semanticTone.neutral.border.default}`)
    .boxShadow(palette.effect.panelShadowStrong)
  styleBuilder.select('.consent__panel[hidden]', theme).display('none')
  styleBuilder
    .select('.consent__panel-header', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) auto')
    .alignItems('center')
    .gap('10px')
  styleBuilder
    .select('.consent__panel-title', theme)
    .margin('0')
    .fontSize('17px')
    .fontWeight('750')
    .letterSpacing('-0.01em')
    .color(palette.semanticTone.neutral.text.default)
}

function registerConsentFormStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder.select('.consent__list', theme).display('grid').gap('10px')
  styleBuilder
    .select('.consent__item', theme)
    .display('grid')
    .gap('6px')
    .padding('10px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.semanticTone.neutral.border.subtle}`)
    .background(palette.semanticTone.neutral.background.surface)
  styleBuilder
    .select('.consent__item-main', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('8px')
  styleBuilder
    .select('.consent__checkbox', theme)
    .width('16px')
    .height('16px')
    .accentColor(palette.semanticTone.accent.background.canvas)
  styleBuilder
    .select('.consent__item-label', theme)
    .fontSize('14px')
    .fontWeight('700')
    .color(palette.semanticTone.neutral.text.default)
  styleBuilder
    .select('.consent__item-description', theme)
    .fontSize('13px')
    .lineHeight('1.5')
    .color(palette.semanticTone.neutral.text.subtle)
  styleBuilder
    .select('.consent__panel-actions', theme)
    .display('flex')
    .gap('8px')
    .flexWrap('wrap')
  styleBuilder
    .select('.consent__actions', theme)
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .flexWrap('wrap')
}

function registerConsentResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.consent__banner', theme)
    .media('max-width: 720px')
    .padding('14px')
  styleBuilder
    .select('.consent__actions', theme)
    .media('max-width: 720px')
    .display('grid')
    .gridTemplateColumns('1fr')
  styleBuilder
    .select('.consent__panel', theme)
    .media('max-width: 720px')
    .bottom('58px')
}
