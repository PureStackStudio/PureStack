import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  mediaMax,
  styleBuilder,
  type ThemeMode,
  themes,
} from '@purestack/ts-style'

export function registerFormStyles() {
  themes.forEach((theme, palette) => {
    registerFormShellStyles(theme)
    registerFormFieldStyles(theme, palette)
    registerAutoCompleteInputStyles(theme, palette)
    registerMultiAutoCompleteInputStyles(theme, palette)
    registerFormMetaStyles(theme, palette)
    registerFormStatusStyles(theme, palette)
    registerFormResponsiveStyles(theme)
    registerFormSelectFieldStyles(theme, palette)
  })
}

function registerFormShellStyles(theme: ThemeMode) {
  styleBuilder.select('.form-block', theme).display('grid').gap('0.75rem')
}

function registerFormFieldStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder.select('.form-block__field', theme).display('grid').gap('0.6em')
  styleBuilder
    .select('.form-block__label', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w700))
    .color(palette.current.tone)
    .lineHeight('1')
  styleBuilder
    .select('.form-block__input-shell', theme)
    .width('100%')
    .boxSizing('border-box')
    .borderRadius(palette.radii.md)
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
    .borderColor(palette.current.border.default)
    .boxShadow(`0 0 0 3px ${palette.current.border.focus}`)
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

function registerFormSelectFieldStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  registerFormSelectControlStyles(theme)
  registerFormSelectOptionStyles(theme, palette)
  registerFormSelectIconStyles(theme)
}

function registerFormSelectControlStyles(theme: ThemeMode) {
  styleBuilder.select('.form-block__select-shell', theme).position('relative')
  styleBuilder
    .select('.form-block__select', theme)
    .appearance('none')
    .cursor('pointer')
    .paddingRight('2.9em')
  styleBuilder
    .select('.form-block__select:disabled', theme)
    .cursor('not-allowed')
  styleBuilder
    .select(
      '.form-block__select-shell:has(> .form-block__input-icon:first-child) .form-block__select',
      theme,
    )
    .paddingLeft('2.9em')
}

function registerFormSelectOptionStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('option, optgroup', theme)
    .backgroundColor(palette.current.canvascolor)
  styleBuilder
    .select('option:disabled, optgroup:disabled', theme)
    .color(palette.current.text.subtle)
}

function registerFormSelectIconStyles(theme: ThemeMode) {
  styleBuilder
    .select(
      '.form-block__select-shell > .form-block__input-icon:first-child',
      theme,
    )
    .position('absolute')
    .left('0.6em')
    .top('50%')
    .transform('translateY(-50%)')
    .pointerEvents('none')
    .marginLeft('0')
    .marginRight('0')

  styleBuilder
    .select(
      '.form-block__select-shell > .form-block__input-icon:last-child',
      theme,
    )
    .position('absolute')
    .right('0.6em')
    .top('50%')
    .transform('translateY(-50%)')
    .pointerEvents('none')
    .marginLeft('0')
    .marginRight('0')
}

function registerAutoCompleteInputStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.auto-complete-input', theme)
    .position('relative')
    .maxWidth('100%')

  styleBuilder
    .select('.auto-complete-input__popup', theme)
    .position('absolute')
    .left('0')
    .right('0')
    .top('calc(100% + 0.375rem)')
    .boxSizing('border-box')
    .maxHeight('18rem')
    .overflow('auto')
    .padding('0.35em')
    .borderRadius(palette.radii.md)
    .border(`1px solid ${palette.current.border.default}`)
    .background(palette.current.surface.rest.background)
    .boxShadow(palette.effect.strongShadow)
    .zIndex('70')

  styleBuilder
    .select('.auto-complete-input__listbox', theme)
    .display('grid')
    .gap('0.2em')

  styleBuilder
    .select('.auto-complete-input__option', theme)
    .borderRadius(palette.radii.sm)
    .color(palette.current.text.default)
    .cursor('pointer')
    .transition('background 140ms ease, color 140ms ease')

  styleBuilder
    .select(
      '.auto-complete-input__option:hover:not(.auto-complete-input__option--disabled), .auto-complete-input__option--active',
      theme,
    )
    .background(palette.current.button.hover.background)
    .color(palette.current.button.hover.text)

  styleBuilder
    .select('.auto-complete-input__option--selected', theme)
    .background(palette.current.surfaceAlt.rest.background)

  styleBuilder
    .select('.auto-complete-input__option--disabled', theme)
    .cursor('not-allowed')
    .opacity('0.55')

  styleBuilder
    .select(
      '.auto-complete-input__message, .auto-complete-input__default-row',
      theme,
    )
    .boxSizing('border-box')
    .width('100%')
    .padding('0.55em 0.65em')
    .apply(palette.applyFont(palette.font.size.sm))

  styleBuilder
    .select('.auto-complete-input__message', theme)
    .color(palette.current.text.subtle)

  styleBuilder
    .select('.auto-complete-input__default-row', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) auto')
    .alignItems('center')
    .gap('0.6em')

  styleBuilder
    .select('.auto-complete-input__default-label', theme)
    .overflow('hidden')
    .textOverflow('ellipsis')
    .whiteSpace('nowrap')

  styleBuilder
    .select('.auto-complete-input__default-check', theme)
    .width('1em')
    .height('1em')
    .color(palette.current.tone)
}

function registerMultiAutoCompleteInputStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.multi-auto-complete-input', theme)
    .position('relative')
    .maxWidth('100%')

  styleBuilder
    .select('.multi-auto-complete-input__shell', theme)
    .minHeight('2.45em')
    .cursor('text')

  styleBuilder
    .select('.multi-auto-complete-input__shell--disabled', theme)
    .cursor('not-allowed')

  styleBuilder
    .select('.multi-auto-complete-input__control', theme)
    .display('flex')
    .alignItems('center')
    .flexWrap('wrap')
    .gap('0.35em')
    .width('100%')
    .minWidth('0')
    .padding('0.35em')
    .boxSizing('border-box')

  styleBuilder
    .select('.multi-auto-complete-input__query', theme)
    .width('8rem')
    .minWidth('7rem')
    .padding('0.15em 0.25em')
    .lineHeight('1.5')

  styleBuilder
    .select('.multi-auto-complete-input__item', theme)
    .display('inline-flex')
    .alignItems('center')
    .maxWidth('100%')
    .gap('0.3em')
    .padding('0.18em 0.25em 0.18em 0.55em')
    .borderRadius(palette.radii.sm)
    .background(palette.current.surfaceAlt.rest.background)
    .color(palette.current.text.default)
    .apply(palette.applyFont(palette.font.size.xs, palette.font.weight.w600))

  styleBuilder
    .select('.multi-auto-complete-input__item--invalid', theme)
    .background(palette.semanticTone.danger.surface.rest.background)
    .color(palette.semanticTone.danger.text.default)

  styleBuilder
    .select('.multi-auto-complete-input__item--disabled', theme)
    .opacity('0.58')

  styleBuilder
    .select('.multi-auto-complete-input__item-label', theme)
    .minWidth('0')
    .overflow('hidden')
    .textOverflow('ellipsis')
    .whiteSpace('nowrap')

  styleBuilder
    .select('.multi-auto-complete-input__remove', theme)
    .display('grid')
    .placeItems('center')
    .width('1.35em')
    .height('1.35em')
    .padding('0')
    .border('none')
    .borderRadius(palette.radii.sm)
    .background('transparent')
    .color('currentColor')
    .cursor('pointer')

  styleBuilder
    .select('.multi-auto-complete-input__remove:hover', theme)
    .background(palette.current.button.hover.background)
    .color(palette.current.button.hover.text)

  styleBuilder
    .select('.multi-auto-complete-input__remove .icon', theme)
    .width('1em')
    .height('1em')

  styleBuilder
    .select('.multi-auto-complete-input__popup', theme)
    .position('absolute')
    .left('0')
    .right('0')
    .top('calc(100% + 0.375rem)')
    .boxSizing('border-box')
    .maxHeight('18rem')
    .overflow('auto')
    .padding('0.35em')
    .borderRadius(palette.radii.md)
    .border(`1px solid ${palette.current.border.default}`)
    .background(palette.current.surface.rest.background)
    .boxShadow(palette.effect.strongShadow)
    .zIndex('70')

  styleBuilder
    .select('.multi-auto-complete-input__listbox', theme)
    .display('grid')
    .gap('0.2em')

  styleBuilder
    .select('.multi-auto-complete-input__option', theme)
    .borderRadius(palette.radii.sm)
    .color(palette.current.text.default)
    .cursor('pointer')
    .transition('background 140ms ease, color 140ms ease')

  styleBuilder
    .select(
      '.multi-auto-complete-input__option:hover:not(.multi-auto-complete-input__option--disabled), .multi-auto-complete-input__option--active',
      theme,
    )
    .background(palette.current.button.hover.background)
    .color(palette.current.button.hover.text)

  styleBuilder
    .select('.multi-auto-complete-input__option--disabled', theme)
    .cursor('not-allowed')
    .opacity('0.55')

  styleBuilder
    .select(
      '.multi-auto-complete-input__message, .multi-auto-complete-input__default-row',
      theme,
    )
    .boxSizing('border-box')
    .width('100%')
    .padding('0.55em 0.65em')
    .apply(palette.applyFont(palette.font.size.sm))

  styleBuilder
    .select('.multi-auto-complete-input__message', theme)
    .color(palette.current.text.subtle)

  styleBuilder
    .select('.multi-auto-complete-input__default-label', theme)
    .display('block')
    .overflow('hidden')
    .textOverflow('ellipsis')
    .whiteSpace('nowrap')
}

function registerFormMetaStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.form-block__meta', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('0.625rem')
  styleBuilder
    .select('.form-block__check', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('0.5em')
    .apply(palette.applyFont(palette.font.size.xxs))
    .color(palette.current.tone)
  styleBuilder
    .select('.form-block__check input', theme)
    .width('1.5em')
    .height('1.5em')
    .accentColor(palette.current.tone)
  styleBuilder
    .select('.form-block__assist-link', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w700))
    .textDecoration('none')
    .color(palette.current.tone)
  styleBuilder
    .select('.form-block__assist-link:hover', theme)
    .textDecoration('underline')
  styleBuilder
    .select('.form-block__divider', theme)
    .position('relative')
    .height('1px')
    .background(palette.current.border.default)
    .margin('0.125rem 0')
  styleBuilder
    .select('.form-block__divider::after', theme)
    .content('attr(data-label)')
    .position('absolute')
    .left('50%')
    .top('50%')
    .transform('translate(-50%, -50%)')
    .padding('0 0.5em')
    .apply(palette.applyFont(palette.font.size.xxxs, palette.font.weight.w700))
    .background(palette.current.surfaceAlt.rest.background)
    .color(palette.current.text.subtle)
}

function registerFormStatusStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.form-status', theme)
    .marginTop('0.25rem')
    .padding('0.5em 0.6em')
    .borderRadius(palette.radii.md)
    .apply(palette.applyFont(palette.font.size.sm))
}

function registerFormResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.form-block__meta', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .flexDirection('column')
    .alignItems('flex-start')
}
