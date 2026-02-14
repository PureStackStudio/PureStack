import { styleBuilder } from '../../../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../../../style/themeOptions'
import type { ThemePalette } from '../../../style/themePalette'

export function registerConsentStyles() {
  themes.forEach((theme, palette, options) => {
    registerConsentShellStyles(theme)
    registerConsentBannerStyles(theme, palette, options)
    registerConsentPanelStyles(theme, palette, options)
    registerConsentFormStyles(theme, palette, options)
    registerConsentButtonStyles(theme, palette, options)
    registerConsentSettingsStyles(theme, palette, options)
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
    .background(palette.background.raised)
    .border(`1px solid ${palette.border.default}`)
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
    .color(palette.text.strong)
  styleBuilder
    .select('.consent__description', theme)
    .margin('0')
    .fontSize('14px')
    .lineHeight('1.6')
    .color(palette.text.muted)
  styleBuilder
    .select('.consent__policy', theme)
    .color(palette.text.accent)
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
    .background(palette.background.raised)
    .border(`1px solid ${palette.border.default}`)
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
    .color(palette.text.strong)
  styleBuilder
    .select('.consent__panel-close', theme)
    .display('grid')
    .placeItems('center')
    .width('36px')
    .height('36px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.action.ghost.background)
    .color(palette.action.ghost.text)
    .cursor('pointer')
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
    .border(`1px solid ${palette.border.subtle}`)
    .background(palette.background.surface)
  styleBuilder
    .select('.consent__item-main', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('8px')
  styleBuilder
    .select('.consent__checkbox', theme)
    .width('16px')
    .height('16px')
    .accentColor(palette.action.accent.background)
  styleBuilder
    .select('.consent__item-label', theme)
    .fontSize('14px')
    .fontWeight('700')
    .color(palette.text.default)
  styleBuilder
    .select('.consent__item-description', theme)
    .fontSize('13px')
    .lineHeight('1.5')
    .color(palette.text.subtle)
  styleBuilder
    .select('.consent__panel-actions', theme)
    .display('flex')
    .gap('8px')
    .flexWrap('wrap')
}

function registerConsentButtonStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.consent__actions', theme)
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .flexWrap('wrap')
  styleBuilder
    .select('.consent__button', theme)
    .padding('9px 14px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.action.neutral.background)
    .color(palette.action.neutral.text)
    .fontSize('13px')
    .fontWeight('700')
    .cursor('pointer')
    .transition(
      'background 170ms ease, border-color 170ms ease, transform 170ms ease',
    )
  styleBuilder
    .select('.consent__button:hover', theme)
    .background(palette.action.neutral.hover)
    .transform('translateY(-1px)')
  styleBuilder
    .select('.consent__button--primary', theme)
    .borderColor(palette.action.accent.background)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
  styleBuilder
    .select('.consent__button--primary:hover', theme)
    .background(palette.action.accent.hover)
  styleBuilder
    .select('.consent__button--ghost', theme)
    .background(palette.action.ghost.background)
    .color(palette.action.ghost.text)
  styleBuilder
    .select('.consent__button:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
}

function registerConsentSettingsStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.consent__settings', theme)
    .pointerEvents('auto')
    .display('inline-flex')
    .alignItems('center')
    .padding('0')
    .borderRadius(options.radii.sm)
    .border('0')
    .background('transparent')
    .color(palette.text.subtle)
    .fontSize('13px')
    .fontWeight('600')
    .textDecoration('none')
    .lineHeight('1.3')
    .cursor('pointer')
  styleBuilder
    .select('.consent__settings:hover', theme)
    .color(palette.text.accent)
    .textDecoration('underline')
  styleBuilder
    .select('.site-footer__legal .consent__settings', theme)
    .fontSize('13px')
    .fontWeight('600')
  styleBuilder.select('.consent__settings[hidden]', theme).display('none')
  styleBuilder
    .select('.consent__settings:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
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
    .select('.consent__button', theme)
    .media('max-width: 720px')
    .width('100%')
    .justifyContent('center')
  styleBuilder
    .select('.consent__panel', theme)
    .media('max-width: 720px')
    .bottom('58px')
}
