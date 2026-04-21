import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  getBreakpoint,
  mediaMax,
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
    .width(`min(${getBreakpoint(BREAKPOINTS.lg)}, calc(100vw - 24px))`)
    .padding('18px')
    .borderRadius(options.radii.lg)
    .background(palette.current.surface.rest.background)
    .border(`1px solid ${palette.current.border.default}`)
    .boxShadow(palette.effect.panelShadowStrong)
    .display('grid')
    .gap('10px')
  styleBuilder.select('.consent__banner[hidden]', theme).display('none')
  styleBuilder
    .select('.consent__title', theme)
    .margin('0')
    .apply(palette.applyFont(palette.font.size.xs, palette.font.weight.w700))
    .color(palette.current.text.default)
  styleBuilder
    .select('.consent__description', theme)
    .margin('0')
    .apply(palette.applyFont(palette.font.size.xs))
    .color(palette.current.text.subtle)
  styleBuilder
    .select('.consent__policy', theme)
    .color(palette.current.text.default)
    .fontWeight(palette.font.weight.w700)
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
    .width(`min(${getBreakpoint(BREAKPOINTS.sm)}, calc(100vw - 24px))`)
    .marginLeft('auto')
    .padding('16px')
    .display('grid')
    .gap('14px')
    .borderRadius(options.radii.lg)
    .background(palette.current.surface.rest.background)
    .border(`1px solid ${palette.current.border.default}`)
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
    .apply(palette.applyFont(palette.font.size.xs, palette.font.weight.w700))
    .color(palette.current.text.default)
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
    .border(`1px solid ${palette.current.border.subtle}`)
    .background(palette.current.surface.rest.background)
  styleBuilder
    .select('.consent__item-main', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('0.5em')
  styleBuilder
    .select('.consent__checkbox', theme)
    .width('1.1em')
    .height('1.1em')
    .accentColor(palette.current.canvas)
  styleBuilder
    .select('.consent__item-label', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w700))
    .color(palette.current.text.default)
  styleBuilder
    .select('.consent__item-description', theme)
    .apply(palette.applyFont(palette.font.size.xxs))
    .color(palette.current.text.subtle)
  styleBuilder
    .select('.consent__panel-actions', theme)
    .display('flex')
    .gap('0.5em')
    .flexWrap('wrap')
  styleBuilder
    .select('.consent__actions', theme)
    .display('flex')
    .alignItems('center')
    .gap('0.5em')
    .flexWrap('wrap')
}

function registerConsentResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.consent__banner', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .padding('14px')
  styleBuilder
    .select('.consent__actions', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .display('grid')
    .gridTemplateColumns('1fr')
  styleBuilder
    .select('.consent__panel', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .bottom('58px')
}
