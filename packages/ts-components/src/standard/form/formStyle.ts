import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerFormStyles() {
  themes.forEach((theme, palette, options) => {
    registerFormShellStyles(theme)
    registerFormFieldStyles(theme, palette, options)
    registerFormMetaStyles(theme, palette)
    registerFormStatusStyles(theme, palette, options)
    registerFormResponsiveStyles(theme)
  })
}

function registerFormShellStyles(theme: ThemeMode) {
  styleBuilder.select('.form-block', theme).display('grid').gap('12px')
}

function registerFormFieldStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder.select('.form-block__field', theme).display('grid').gap('0.6em')
  styleBuilder
    .select('.form-block__label', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w700))
    .color(palette.current.text.default)
    .lineHeight('1')
  styleBuilder
    .select('.form-block__input-shell', theme)
    .width('100%')
    .boxSizing('border-box')
    .borderRadius(options.radii.md)
    .transition('border-color 160ms ease, box-shadow 160ms ease')
    .display('flex')
    .alignItems('stretch')
    .overflow('hidden')
  styleBuilder
    .select(
      '.form-block__input-shell:has(.form-block__input:focus-visible)',
      theme,
    )
    .outline('none')
    .borderColor(palette.semanticTone.accent.border.default)
    .boxShadow(`0 0 0 3px ${palette.semanticTone.accent.surface.focusRing}`)
  styleBuilder
    .select('.form-block__input', theme)
    .width('100%')
    .minWidth('0')
    .boxSizing('border-box')
    .padding('0.5em 0.6em')
    .border('none')
    .borderRadius('0')
    .apply(palette.applyFont(palette.font.size.sm))
    .background('transparent')
    .boxShadow('none')
    .flex('1 1 auto')
  styleBuilder
    .select('.form-block__input::placeholder', theme)
    .color(palette.current.text.subtle)
  styleBuilder.select('.form-block__input:focus-visible', theme).outline('none')
  styleBuilder
    .select(
      '.form-block__input[type="number"]::-webkit-outer-spin-button, .form-block__input[type="number"]::-webkit-inner-spin-button',
      theme,
    )
    .appearance('none')
    .margin('0')
  styleBuilder
    .select('.form-block__input[type="number"]', theme)
    .appearance('textfield')
  styleBuilder
    .select('.form-block__input-icon', theme)
    .color(palette.current.text.subtle)
  styleBuilder
    .select(
      '.form-block__input-shell > .form-block__input-icon:first-child',
      theme,
    )
    .marginLeft('0.6em')
    .marginRight('0')
  styleBuilder
    .select(
      '.form-block__input-shell > .form-block__input-icon:last-child',
      theme,
    )
    .marginLeft('0')
    .marginRight('0.6em')
  styleBuilder
    .select('.form-block__number-controls', theme)
    .display('grid')
    .gridTemplateRows('1fr 1fr')
    .width('2em')
    .flex('0 0 auto')
    .background('transparent')
  styleBuilder
    .select('.form-block__number-btn', theme)
    .display('grid')
    .placeItems('center')
    .padding('0')
    .border('none')
    .apply(palette.applyFont(palette.font.size.sm, palette.font.weight.w700))
    .lineHeight('1')
    .cursor('pointer')
}

function registerFormMetaStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.form-block__meta', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('10px')
  styleBuilder
    .select('.form-block__check', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('0.5em')
    .apply(palette.applyFont(palette.font.size.xxs))
    .color(palette.current.text.default)
  styleBuilder
    .select('.form-block__check input', theme)
    .width('1.5em')
    .height('1.5em')
    .accentColor(palette.accent) // todo: implement current var to get current surface tone as color but not gradient.
  styleBuilder
    .select('.form-block__assist-link', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w700))
    .textDecoration('none')
    .color(palette.current.text.default)
  styleBuilder
    .select('.form-block__assist-link:hover', theme)
    .textDecoration('underline')
  styleBuilder
    .select('.form-block__divider', theme)
    .position('relative')
    .height('1px')
    .background(palette.current.border.default)
    .margin('2px 0')
  styleBuilder
    .select('.form-block__divider::after', theme)
    .content('attr(data-label)')
    .position('absolute')
    .left('50%')
    .top('50%')
    .transform('translate(-50%, -50%)')
    .padding('0 0.5em')
    .apply(palette.applyFont(palette.font.size.xxxs, palette.font.weight.w700))
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)
    .color(palette.current.text.subtle)
}

function registerFormStatusStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.form-status', theme)
    .marginTop('4px')
    .padding('0.5em 0.6em')
    .borderRadius(options.radii.md)
    .apply(palette.applyFont(palette.font.size.sm))
}

function registerFormResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.form-block__meta', theme)
    .media('max-width: 640px')
    .flexDirection('column')
    .alignItems('flex-start')
}
