import { styleBuilder } from '../../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../../style/themeOptions'
import type { ThemePalette } from '../../style/themePalette'

export function registerContactFormStyles() {
  themes.forEach((theme, palette, options) => {
    registerContactFormShellStyles(theme, palette, options)
    registerContactFormFieldStyles(theme, palette, options)
    registerContactFormActionStyles(theme)
    registerContactFormResponsiveStyles(theme)
  })
}

function registerContactFormShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.contact-form', theme)
    .margin('20px 0 0')
    .padding('18px')
    .display('grid')
    .gap('14px')
    .borderRadius(options.radii.lg)
    .background(palette.background.surface)
    .border(`1px solid ${palette.border.default}`)
    .boxShadow(palette.effect.panelShadow)
  styleBuilder.select('.contact-form__header', theme).display('grid').gap('6px')
  styleBuilder
    .select('.contact-form__title', theme)
    .margin('0')
    .fontSize('1.05rem')
    .fontWeight('760')
    .letterSpacing('-0.01em')
    .color(palette.text.strong)
  styleBuilder
    .select('.contact-form__description', theme)
    .margin('0')
    .fontSize('0.93rem')
    .lineHeight('1.6')
    .color(palette.text.subtle)
  styleBuilder.select('.contact-form__form', theme).display('grid').gap('10px')
}

function registerContactFormFieldStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder.select('.contact-form__field', theme).display('grid').gap('6px')
  styleBuilder
    .select('.contact-form__label', theme)
    .fontSize('0.86rem')
    .fontWeight('700')
    .color(palette.text.default)
  styleBuilder
    .select(
      '.contact-form__input, .contact-form__select, .contact-form__textarea',
      theme,
    )
    .width('100%')
    .padding('10px 12px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.surfaceAlt)
    .color(palette.text.default)
    .fontSize('0.92rem')
    .lineHeight('1.45')
    .boxSizing('border-box')
    .appearance('none')
  styleBuilder
    .select('.contact-form__textarea', theme)
    .resize('vertical')
    .minHeight('132px')
  styleBuilder
    .select(
      '.contact-form__input::placeholder, .contact-form__textarea::placeholder',
      theme,
    )
    .color(palette.text.soft)
  styleBuilder
    .select(
      '.contact-form__input:focus-visible, .contact-form__select:focus-visible, .contact-form__textarea:focus-visible',
      theme,
    )
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
    .borderColor(palette.border.accent)
}

function registerContactFormActionStyles(theme: ThemeMode) {
  styleBuilder
    .select('.contact-form__actions', theme)
    .display('flex')
    .justifyContent('flex-start')
    .paddingTop('2px')
}

function registerContactFormResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.contact-form', theme)
    .media('max-width: 640px')
    .padding('14px')
}
