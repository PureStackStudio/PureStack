import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerFooterStyles() {
  themes.forEach((theme, palette, options) => {
    applyFooterShellStyles(theme, palette)
    applyFooterBottomStyles(theme, palette, options)
    applyFooterToneStyles(theme, palette)
    applyFooterResponsiveStyles(theme)
  })
}

export function applyFooterShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-footer', theme)
    .position('relative')
    .overflow('hidden')
    .background('transparent')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
    .padding('0')

  styleBuilder
    .select('.site-footer__inner', theme)
    .position('relative')
    .display('grid')
    .gap('1em')
    .padding('1em 2em 0.5em 2em')
    .background(palette.semanticTone.neutral.surface.rest.background)
    .background('transparent')
}

export function applyFooterBottomStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyFooterBottomShellStyles(theme, palette)
  applyFooterBottomLegalStyles(theme, palette, options)
  applyFooterBottomSocialStyles(theme, palette, options)
}

export function applyFooterBottomShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-footer__bottom', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) auto auto')
    .gap('0.5em')
    .alignItems('center')
    .paddingTop('0.5em')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
  styleBuilder
    .select('.site-footer__copyright', theme)
    .margin('0')
    .apply(palette.applyFont(palette.font.size.xxs))
    .color(palette.current.text.subtle)
}

export function applyFooterBottomLegalStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__legal', theme)
    .display('flex')
    .alignItems('center')
    .gap('0.5em')
    .flexWrap('wrap')
  styleBuilder
    .select('.site-footer__legal :where(a)', theme)
    .apply(palette.applyFont(palette.font.size.xxs))
    .textDecoration('none')
    .color(palette.current.text.subtle)
  styleBuilder
    .select('.site-footer__legal :where(a:hover)', theme)
    .color(palette.semanticTone.accent.text.default)
  styleBuilder
    .select('.site-footer__legal :where(a:focus-visible)', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
    .borderRadius(options.radii.sm)
}

export function applyFooterBottomSocialStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-footer__social', theme)
    .display('flex')
    .alignItems('center')
    .gap('0.5em')
    .justifyContent('flex-end')
    .flexWrap('wrap')
  styleBuilder
    .select('.footer-social', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('0.5em')
    .padding('7px 10px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.current.border.default}`)
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)
    .textDecoration('none')
    .fontSize('13px')
    .fontWeight('700')
    .color(palette.current.text.default)
    .transition(
      'background 160ms ease, border-color 160ms ease, transform 160ms ease',
    )
  styleBuilder
    .select('.footer-social:hover', theme)
    .background(palette.semanticTone.accent.canvas)
    .borderColor(palette.semanticTone.accent.border.default)
  styleBuilder
    .select('.footer-social:focus-visible', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
  styleBuilder
    .select('.footer-social__icon', theme)
    .width('1em')
    .height('1em')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
  styleBuilder
    .select('.footer-social__icon svg', theme)
    .width('1em')
    .height('1em')
    .display('block')
    .stroke('currentColor')
    .fill('none')
    .strokeLinecap('round')
    .strokeLinejoin('round')
    .strokeWidth('2')
}

export function applyFooterToneStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.site-footer--tone-accent', theme)
    .background(palette.semanticTone.neutral.surface.rest.background)

  styleBuilder
    .select('.site-footer--tone-accent .site-footer__inner', theme)
    .background(palette.semanticTone.neutral.surface.rest.background)
    .borderColor(palette.current.border.default)

  styleBuilder
    .select('.site-footer--tone-neutral .site-footer__inner', theme)
    .background(palette.semanticTone.neutral.surface.rest.background)
}

export function applyFooterResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-footer__bottom', theme)
    .media('max-width: 840px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.site-footer__social', theme)
    .media('max-width: 840px')
    .justifyContent('flex-start')
}
