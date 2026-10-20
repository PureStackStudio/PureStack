import type { Style } from '@purestack/ts-css'
import {
  BREAKPOINTS,
  mediaBelow,
  styleBuilder,
  themes,
  type ThemePalette,
} from '@purestack/ts-style'
import { studioColorPresets } from './studioColorPresets'
import { paint } from './studioSkinShared'

export function registerStudioColorPickerStyles() {
  themes.forEach((theme, palette) => {
    const root = styleBuilder.get(theme)
    registerPickerTriggerStyles(root, palette)
    registerPickerPanelStyles(root, palette)
    registerPickerPanelTextStyles(root, palette)
    registerPickerOptionStyles(root, palette)
    registerPickerSwatchStyles(root)
    registerPickerPresetStyles(root, palette)
    registerPickerMobileStyles(root)
  })
}

function registerPickerTriggerStyles(root: Style, palette: ThemePalette) {
  root.select('.topbar__actions').position('relative')
  root.select('.studio-color-picker').flexShrink('0')
  root
    .select('.studio-color-picker__trigger')
    .display('grid')
    .placeItems('center')
    .width('2.625rem')
    .height('2.625rem')
    .padding('0')
    .listStyle('none')
    .cursor('pointer')
    .border('1px solid transparent')
    .borderRadius(palette.radii.pill)
    .color(palette.semanticTone.neutral.text.subtle)
  root
    .select('.studio-color-picker__trigger::-webkit-details-marker')
    .display('none')
  root
    .select('.studio-color-picker__trigger .icon')
    .width('1.25rem')
    .height('1.25rem')
  root
    .select(
      '.studio-color-picker__trigger:hover, .studio-color-picker[open] > summary',
    )
    .background(palette.semanticTone.neutral.surface.hover.background)
    .borderColor(palette.semanticTone.neutral.border.subtle)
    .color(palette.semanticTone.accent.text.default)
  root
    .select('.studio-color-picker__trigger:focus-visible')
    .outline(`2px solid ${palette.semanticTone.accent.border.focus}`)
    .outlineOffset('2px')
}

function registerPickerPanelStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  root
    .select('.studio-color-picker__panel')
    .position('absolute')
    .zIndex('100')
    .top('calc(100% + 0.65rem)')
    .right('0')
    .width('18.5rem')
    .maxWidth('calc(100vw - 2rem)')
    .minInlineSize('0')
    .margin('0')
    .padding('1.25rem')
    .boxSizing('border-box')
    .border(`1px solid ${neutral.border.default}`)
    .borderRadius('1rem')
    .background(neutral.surface.rest.background)
    .color(neutral.text.default)
    .boxShadow(palette.effect.floatingShadow)
    .fontSize('0.875rem')
    .lineHeight('1.5')
    .letterSpacing('normal')
}

function registerPickerPanelTextStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  root
    .select('.studio-color-picker__panel legend')
    .float('left')
    .width('100%')
    .padding('0')
    .marginBottom('0.35rem')
    .fontSize('1rem')
    .fontWeight('600')
    .letterSpacing('-0.01em')
  root
    .select('.studio-color-picker__panel p')
    .margin('0 0 1rem')
    .fontSize('0.8125rem')
    .color(neutral.text.subtle)
  root
    .select('.studio-color-picker__options')
    .clear('both')
    .display('grid')
    .gridTemplateColumns('repeat(2, minmax(0, 1fr))')
    .gap('0.5rem')
  root
    .select('.studio-color-picker__note')
    .display('block')
    .marginTop('1rem')
    .fontSize('0.75rem')
    .color(neutral.text.subtle)
}

function registerPickerOptionStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  root
    .select('.studio-color-picker__option')
    .position('relative')
    .display('flex')
    .alignItems('center')
    .gap('0.6rem')
    .padding('0.65rem 0.5rem')
    .minWidth('0')
    .cursor('pointer')
    .border('1px solid transparent')
    .borderRadius(palette.radii.md)
  root
    .select('.studio-color-picker__option input')
    .position('absolute')
    .inset('0')
    .width('100%')
    .height('100%')
    .margin('0')
    .opacity('0')
    .cursor('pointer')
  root
    .select('.studio-color-picker__option:hover')
    .background(neutral.surface.hover.background)
    .borderColor(neutral.border.subtle)
  root
    .select('.studio-color-picker__option:has(input:focus-visible)')
    .outline(`2px solid ${palette.semanticTone.accent.border.focus}`)
    .outlineOffset('2px')
}

function registerPickerSwatchStyles(root: Style) {
  root
    .select('.studio-color-picker__swatch')
    .display('grid')
    .placeItems('center')
    .flexShrink('0')
    .width('1.5rem')
    .height('1.5rem')
    .borderRadius('50%')
    .color('#ffffff')
  root
    .select('.studio-color-picker__swatch .icon')
    .width('1rem')
    .height('1rem')
    .opacity('0')
}

function registerPickerPresetStyles(root: Style, palette: ThemePalette) {
  for (const preset of studioColorPresets) {
    root
      .select(
        `[data-site-color-option="${preset.id}"] .studio-color-picker__swatch`,
      )
      .background(paint(preset.accent)(0.53))
    const option = `:scope[data-site-color="${preset.id}"] .studio-color-picker__option[data-site-color-option="${preset.id}"]`
    root
      .select(option)
      .background(palette.semanticTone.accent.surface.rest.background)
      .borderColor(palette.semanticTone.accent.border.default)
      .color(palette.semanticTone.accent.text.default)
    root.select(`${option} .studio-color-picker__swatch .icon`).opacity('1')
  }
}

function registerPickerMobileStyles(root: Style) {
  const mobile = root.media(mediaBelow(BREAKPOINTS.sm))
  mobile
    .select('.studio > .site-header .studio-color-picker__panel')
    .right('-2rem')
  mobile
    .select(
      ':is(.studio > .site-header, body.template-doc:not(.preview) > .topbar) .topbar__actions > :is(.theme-toggle, a.topbar__icon, .topbar__toggle), :is(.studio > .site-header, body.template-doc:not(.preview) > .topbar) .studio-color-picker__trigger',
    )
    .width('2.375rem')
  // Keep the color, theme, GitHub, and navigation controls within narrow headers.
  mobile
    .select(
      '.studio > .site-header .topbar__actions > a.topbar__icon:nth-of-type(n + 2), body.template-doc:not(.preview) > .topbar .topbar__actions > a.topbar__icon:nth-of-type(n + 2)',
    )
    .display('none')
}
