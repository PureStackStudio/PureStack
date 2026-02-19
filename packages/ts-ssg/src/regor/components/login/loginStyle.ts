import { styleBuilder } from '../../../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../../../style/themeOptions'
import type { ThemePalette } from '../../../style/themePalette'

export function registerLoginStyles() {
  themes.forEach((theme, palette, options) => {
    registerLoginShellStyles(theme, palette, options)
    registerLoginActionStyles(theme, palette, options)
    registerLoginMetaStyles(theme, palette, options)
    registerLoginResponsiveStyles(theme)
  })
}

function registerLoginShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.login-panel', theme)
    .width('100%')
    .maxWidth('460px')
    .margin('32px auto')
  styleBuilder
    .select('.login-panel__shell', theme)
    .display('grid')
    .gap('16px')
    .padding('26px')
    .borderRadius(options.radii.lg)
    .border(`1px solid ${palette.border.default}`)
    .background(
      `linear-gradient(165deg, ${palette.background.surface} 0%, ${palette.background.surfaceAlt} 100%)`,
    )
    .boxShadow(palette.effect.panelShadow)
  styleBuilder
    .select('.login-panel__header', theme)
    .display('grid')
    .gap('8px')
    .margin('0 0 4px')
  styleBuilder
    .select('.login-panel__badge', theme)
    .margin('0')
    .fontSize('0.72rem')
    .fontWeight('750')
    .letterSpacing('0.08em')
    .textTransform('uppercase')
    .color(palette.text.subtle)
  styleBuilder
    .select('.login-panel__title', theme)
    .margin('0')
    .fontSize('1.65rem')
    .lineHeight('1.1')
    .fontWeight('820')
    .color(palette.text.strong)
  styleBuilder
    .select('.login-panel__description', theme)
    .margin('0')
    .fontSize('0.95rem')
    .lineHeight('1.55')
    .color(palette.text.subtle)
}

function registerLoginActionStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.login-panel__providers', theme)
    .display('grid')
    .gap('8px')
  styleBuilder
    .select('.login-panel__provider', theme)
    .padding('10px 12px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.surfaceAlt)
    .color(palette.text.default)
    .fontSize('0.89rem')
    .fontWeight('650')
    .cursor('pointer')
    .transition('border-color 140ms ease, transform 140ms ease')
  styleBuilder
    .select('.login-panel__provider:hover', theme)
    .borderColor(palette.border.accent)
    .transform('translateY(-1px)')
  styleBuilder
    .select('.login-panel__provider:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
}

function registerLoginMetaStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.login-panel__footer', theme)
    .margin('4px 0 0')
    .fontSize('0.84rem')
    .color(palette.text.subtle)
    .display('flex')
    .alignItems('center')
    .gap('6px')
  styleBuilder
    .select('.login-panel__footer a', theme)
    .color(palette.text.accent)
    .fontWeight('650')
    .textDecoration('none')
  styleBuilder
    .select('.login-panel__footer a:hover', theme)
    .color(palette.text.strong)
    .textDecoration('underline')
  styleBuilder
    .select('.login-panel__shell', theme)
    .backdropFilter('blur(6px)')
    .borderRadius(options.radii.lg)
}

function registerLoginResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.login-panel', theme)
    .media('max-width: 640px')
    .maxWidth('100%')
    .margin('18px 0')
  styleBuilder
    .select('.login-panel__shell', theme)
    .media('max-width: 640px')
    .padding('18px')
}
