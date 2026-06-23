import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  mediaMax,
  styleBuilder,
  type ThemeMode,
  themes,
} from '@purestack/ts-style'

export function registerContactFormStyles() {
  themes.forEach((theme, palette) => {
    registerContactFormShellStyles(theme, palette)
    registerContactFormFieldStyles(theme, palette)
    registerContactFormActionStyles(theme)
    registerContactFormResponsiveStyles(theme)
  })
}

function registerContactFormShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.contact-form', theme)
    .margin('1.25rem 0 0')
    .padding('1.125rem')
    .display('grid')
    .gap('0.875rem')
    .borderRadius(palette.radii.lg)
    .background(palette.current.surface.rest.background)
    .border(`1px solid ${palette.current.border.default}`)
    .boxShadow(palette.effect.panelShadow)
  styleBuilder
    .select('.contact-form__header', theme)
    .display('grid')
    .gap('0.375rem')
  styleBuilder
    .select('.contact-form__title', theme)
    .margin('0')
    .fontSize('1.05rem')
    .fontWeight('760')
    .letterSpacing('-0.01em')
    .color(palette.current.text.default)
  styleBuilder
    .select('.contact-form__description', theme)
    .margin('0')
    .fontSize('0.93rem')
    .lineHeight('1.6')
    .color(palette.current.text.subtle)
  styleBuilder
    .select('.contact-form__form', theme)
    .display('grid')
    .gap('0.625rem')
}

function registerContactFormFieldStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.contact-form__field', theme)
    .display('grid')
    .gap('0.375rem')
  styleBuilder
    .select('.contact-form__label', theme)
    .fontSize('0.86rem')
    .fontWeight('700')
    .color(palette.current.text.default)
  styleBuilder
    .select(
      '.contact-form__input, .contact-form__select, .contact-form__textarea',
      theme,
    )
    .width('100%')
    .padding('0.625rem 0.75rem')
    .borderRadius(palette.radii.md)
    .border(`1px solid ${palette.current.border.default}`)
    .background(palette.current.surfaceAlt.rest.background)
    .color(palette.current.text.default)
    .fontSize('0.92rem')
    .lineHeight('1.45')
    .boxSizing('border-box')
    .appearance('none')
  styleBuilder
    .select('.contact-form__textarea', theme)
    .resize('vertical')
    .minHeight('8.25rem')
  styleBuilder
    .select(
      '.contact-form__input::placeholder, .contact-form__textarea::placeholder',
      theme,
    )
    .color(palette.current.text.subtle)
  styleBuilder
    .select(
      '.contact-form__input:focus-visible, .contact-form__select:focus-visible, .contact-form__textarea:focus-visible',
      theme,
    )
    .outline(`2px solid ${palette.current.border.focus}`)
    .borderColor(palette.current.border.default)
}

function registerContactFormActionStyles(theme: ThemeMode) {
  styleBuilder
    .select('.contact-form__actions', theme)
    .display('flex')
    .justifyContent('flex-start')
    .paddingTop('0.125rem')
}

function registerContactFormResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.contact-form', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .padding('0.875rem')
}
