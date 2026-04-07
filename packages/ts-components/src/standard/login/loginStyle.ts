import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerLoginStyles() {
  themes.forEach((theme, palette, options) => {
    registerLoginShellStyles(theme, palette, options)
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
    .border(`1px solid ${palette.semanticTone.neutral.border.default}`)
    .background(
      `linear-gradient(165deg, ${palette.semanticTone.neutral.background.surface} 0%, ${palette.semanticTone.neutral.background.surfaceAlt} 100%)`,
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
    .color(palette.semanticTone.neutral.text.subtle)
  styleBuilder
    .select('.login-panel__title', theme)
    .margin('0')
    .fontSize('1.65rem')
    .lineHeight('1.1')
    .fontWeight('820')
    .color(palette.semanticTone.neutral.text.strong)
  styleBuilder
    .select('.login-panel__description', theme)
    .margin('0')
    .fontSize('0.95rem')
    .lineHeight('1.55')
    .color(palette.semanticTone.neutral.text.subtle)
  styleBuilder
    .select('.login-panel__providers', theme)
    .display('grid')
    .gap('8px')
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
    .color(palette.semanticTone.neutral.text.subtle)
    .display('flex')
    .alignItems('center')
    .gap('6px')
  styleBuilder
    .select('.login-panel__footer a', theme)
    .color(palette.semanticTone.accent.text.default)
    .fontWeight('650')
    .textDecoration('none')
  styleBuilder
    .select('.login-panel__footer a:hover', theme)
    .color(palette.semanticTone.neutral.text.strong)
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
