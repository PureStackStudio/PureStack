import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

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
    .background(palette.semanticTone.neutral.background.surface)
    .border(`1px solid ${palette.semanticTone.neutral.border.default}`)
    .boxShadow(palette.effect.panelShadow)
  styleBuilder.select('.contact-form__header', theme).display('grid').gap('6px')
  styleBuilder
    .select('.contact-form__title', theme)
    .margin('0')
    .fontSize('1.05rem')
    .fontWeight('760')
    .letterSpacing('-0.01em')
    .color(palette.semanticTone.neutral.text.strong)
  styleBuilder
    .select('.contact-form__description', theme)
    .margin('0')
    .fontSize('0.93rem')
    .lineHeight('1.6')
    .color(palette.semanticTone.neutral.text.subtle)
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
    .color(palette.semanticTone.neutral.text.default)
  styleBuilder
    .select(
      '.contact-form__input, .contact-form__select, .contact-form__textarea',
      theme,
    )
    .width('100%')
    .padding('10px 12px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.semanticTone.neutral.border.default}`)
    .background(palette.semanticTone.neutral.background.surfaceAlt)
    .color(palette.semanticTone.neutral.text.default)
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
    .color(palette.semanticTone.neutral.text.soft)
  styleBuilder
    .select(
      '.contact-form__input:focus-visible, .contact-form__select:focus-visible, .contact-form__textarea:focus-visible',
      theme,
    )
    .outline(`2px solid ${palette.semanticTone.neutral.border.focus}`)
    .borderColor(palette.semanticTone.accent.border.default)
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
