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
    .color(palette.text.default)
  styleBuilder
    .select('.form-block__input', theme)
    .width('100%')
    .boxSizing('border-box')
    .padding('11px 12px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.canvas)
    .color(palette.text.default)
    .fontSize('0.94rem')
    .lineHeight('1.35')
    .transition('border-color 160ms ease, box-shadow 160ms ease')
  styleBuilder
    .select('.form-block__input::placeholder', theme)
    .color(palette.text.soft)
  styleBuilder
    .select('.form-block__input:focus-visible', theme)
    .outline('none')
    .borderColor(palette.border.accent)
    .boxShadow(`0 0 0 3px ${palette.action.accent.focusRing}`)
  styleBuilder
    .select(
      '.form-block__input[type="number"], .form-block__input--number',
      theme,
    )
    .appearance('textfield')
    .fontVariantNumeric('tabular-nums')
    .fontWeight('680')
    .letterSpacing('0.015em')
  styleBuilder
    .select('.form-block__number', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) 40px')
    .alignItems('stretch')
    .borderRadius(options.radii.md)
    .overflow('hidden')
  styleBuilder
    .select('.form-block__number .form-block__input--number', theme)
    .borderRadius('0')
    .borderRight(`1px solid ${palette.border.default}`)
    .boxShadow('none')
  styleBuilder
    .select(
      '.form-block__input[type="number"]:hover, .form-block__input--number:hover',
      theme,
    )
    .borderColor(palette.border.strong)
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
    .border(`1px solid ${palette.border.default}`)
    .borderLeft('none')
    .background(palette.background.surface)
  styleBuilder
    .select('.form-block__number-btn', theme)
    .display('grid')
    .placeItems('center')
    .padding('0')
    .border('none')
    .background('transparent')
    .color(palette.text.strong)
    .fontSize('0.95rem')
    .fontWeight('800')
    .lineHeight('1')
    .cursor('pointer')
    .transition('background 140ms ease, color 140ms ease')
  styleBuilder
    .select('.form-block__number-btn--up', theme)
    .borderBottom(`1px solid ${palette.border.default}`)
  styleBuilder
    .select('.form-block__number-btn:hover', theme)
    .background(palette.background.accent)
    .color(palette.text.default)
  styleBuilder
    .select('.form-block__number-btn:active', theme)
    .background(palette.background.accentMuted)
  styleBuilder
    .select('.form-block__number-btn:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('-2px')
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
    .color(palette.text.subtle)
  styleBuilder
    .select('.form-block__check input', theme)
    .width('16px')
    .height('16px')
    .accentColor(palette.action.accent.background)
  styleBuilder
    .select('.form-block__assist-link', theme)
    .fontSize('0.84rem')
    .fontWeight('650')
    .color(palette.text.accent)
    .textDecoration('none')
  styleBuilder
    .select('.form-block__assist-link:hover', theme)
    .color(palette.text.strong)
    .textDecoration('underline')
  styleBuilder
    .select('.form-block__divider', theme)
    .position('relative')
    .height('1px')
    .background(palette.border.default)
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
    .background(palette.background.surfaceAlt)
    .color(palette.text.soft)
}

function registerFormStatusStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.form-status', theme)
    .marginTop('4px')
    .padding('11px 12px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.canvas)
    .color(palette.text.default)
    .fontSize('0.9rem')
    .lineHeight('1.35')

  styleBuilder
    .select('.form-status--info', theme)
    .borderColor(palette.status.info.border)
    .background(palette.status.info.background)
    .color(palette.status.info.text)

  styleBuilder
    .select('.form-status--success', theme)
    .borderColor(palette.status.success.border)
    .background(palette.status.success.background)
    .color(palette.status.success.text)

  styleBuilder
    .select('.form-status--error', theme)
    .borderColor(palette.status.danger.border)
    .background(palette.status.danger.background)
    .color(palette.status.danger.text)

  styleBuilder
    .select('.form-status--warning', theme)
    .borderColor(palette.status.warning.border)
    .background(palette.status.warning.background)
    .color(palette.status.warning.text)
}

function registerFormResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.form-block__meta', theme)
    .media('max-width: 640px')
    .flexDirection('column')
    .alignItems('flex-start')
}
