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
    registerFormStatusStyles(theme, options)
    registerFormResponsiveStyles(theme)
  })
}

function registerFormShellStyles(theme: ThemeMode) {
  styleBuilder.select('.form-block', theme).display('grid').gap('12px')
  styleBuilder
    .select('.form-block__autofill-trap', theme)
    .position('absolute')
    .left('-10000px')
    .top('auto')
    .width('1px')
    .height('1px')
    .opacity('0')
    .pointerEvents('none')
}

function registerFormFieldStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder.select('.form-block__field', theme).display('grid').gap('6px')
  styleBuilder
    .select('.form-block__label', theme)
    .fontSize('0.83rem')
    .fontWeight('700')
    .letterSpacing('0.02em')
    .color(palette.current.text.default)
  styleBuilder
    .select('.form-block__input', theme)
    .width('100%')
    .boxSizing('border-box')
    .padding('11px 12px')
    .borderRadius(options.radii.md)
    .fontSize('0.94rem')
    .lineHeight('1.35')
    .transition('border-color 160ms ease, box-shadow 160ms ease')
  styleBuilder
    .select('.form-block__input::placeholder', theme)
    .color(palette.current.text.subtle)
  styleBuilder
    .select('.form-block__input:focus-visible', theme)
    .outline('none')
    .borderColor(palette.semanticTone.accent.border.default)
    .boxShadow(`0 0 0 3px ${palette.semanticTone.accent.surface.focusRing}`)
  styleBuilder
    .select(
      '.form-block__input[type="number"], .form-block__input--number',
      theme,
    )
    .appearance('textfield')
  styleBuilder
    .select('.form-block__number', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) 40px')
    .alignItems('stretch')
    .width('100%')
    .boxSizing('border-box')
    .padding('0')
    .transition('border-color 160ms ease, box-shadow 160ms ease')
    .overflow('hidden')
    .borderRadius(options.radii.md)
  styleBuilder
    .select(
      '.form-block__number:has(.form-block__input--number:focus-visible)',
      theme,
    )
    .borderColor(palette.semanticTone.accent.border.default)
    .boxShadow(`0 0 0 3px ${palette.semanticTone.accent.surface.focusRing}`)
  styleBuilder
    .select('.form-block__number .form-block__input--number', theme)
    .borderRadius('0')
    .border('none')
    .boxShadow('none')
    .background('transparent')
  styleBuilder
    .select(
      '.form-block__input[type="number"]::-webkit-outer-spin-button, .form-block__input[type="number"]::-webkit-inner-spin-button',
      theme,
    )
    .appearance('none')
    .margin('0')
  styleBuilder
    .select('.form-block__number-controls', theme)
    .display('grid')
    .gridTemplateRows('1fr 1fr')
    .background('transparent')
  styleBuilder
    .select('.form-block__number-btn', theme)
    .display('grid')
    .placeItems('center')
    .padding('0')
    .border('none')
    .fontSize('0.95rem')
    .fontWeight('800')
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
    .gap('8px')
    .fontSize('0.84rem')
    .color(palette.current.text.default)
  styleBuilder
    .select('.form-block__check input', theme)
    .width('16px')
    .height('16px')
    .accentColor(palette.semanticTone.accent.canvas)
  styleBuilder
    .select('.form-block__assist-link', theme)
    .fontSize('0.84rem')
    .fontWeight('650')
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
    .padding('0 8px')
    .fontSize('0.78rem')
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)
    .color(palette.current.text.subtle)
}

function registerFormStatusStyles(theme: ThemeMode, options: ThemeOptions) {
  styleBuilder
    .select('.form-status', theme)
    .marginTop('4px')
    .padding('11px 12px')
    .borderRadius(options.radii.md)
    .fontSize('0.9rem')
    .lineHeight('1.35')
}

function registerFormResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.form-block__meta', theme)
    .media('max-width: 640px')
    .flexDirection('column')
    .alignItems('flex-start')
}
