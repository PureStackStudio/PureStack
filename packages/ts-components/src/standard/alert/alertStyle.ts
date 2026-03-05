import { styleBuilder } from '../../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../../style/themeOptions'
import type { ThemePalette } from '../../style/themePalette'

export function registerAlertStyles() {
  themes.forEach((theme, palette, options) => {
    applyAlertShellStyles(theme, palette, options)
    applyAlertToneStyles(theme, palette)
    applyAlertResponsiveStyles(theme)
  })
}

export function applyAlertShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyAlertContainerStyles(theme, palette, options)
  applyAlertIconStyles(theme, palette, options)
  applyAlertHeaderStyles(theme, palette, options)
  applyAlertBodyStyles(theme, palette, options)
  applyAlertActionStyles(theme, palette, options)
  applyAlertMetaStyles(theme, palette)
}

export function applyAlertToneStyles(theme: ThemeMode, palette: ThemePalette) {
  applyAlertSoftToneStyles(theme, palette)
  applyAlertOutlineToneStyles(theme, palette)
  applyAlertFeatureToneStyles(theme, palette)
}

export function applyAlertContainerStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.alert', theme)
    .display('grid')
    .gridTemplateColumns('auto minmax(0, 1fr)')
    .gap('14px')
    .alignItems('start')
    .padding('14px 16px')
    .margin('0 0 14px')
    .border(`1px solid ${palette.border.default}`)
    .borderRadius(options.radii.md)
    .background(palette.background.panel)
    .color(palette.text.default)
    .boxShadow(palette.effect.panelShadow)

  styleBuilder.select('.alert--compact', theme).padding('10px 12px').gap('10px')
  styleBuilder
    .select('.alert--inline', theme)
    .gridTemplateColumns('1fr')
    .gap('8px')
}

export function applyAlertIconStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.alert .alert__icon', theme)
    .width('32px')
    .height('32px')
    .borderRadius(options.radii.sm)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .background(palette.icon.neutral.gradient)
    .backgroundColor(palette.icon.neutral.background)
    .border(`1px solid ${palette.icon.neutral.ring}`)
    .color(palette.icon.neutral.color)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.alert--inline .alert__icon', theme)
    .width('26px')
    .height('26px')
  styleBuilder
    .select('.alert__icon svg', theme)
    .width('16px')
    .height('16px')
    .display('block')
    .stroke('currentColor')
    .fill('none')
    .strokeLinecap('round')
    .strokeLinejoin('round')
    .strokeWidth('2.2')
}

export function applyAlertHeaderStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.alert__content', theme)
    .display('grid')
    .gap('10px')
    .minWidth('0')
  styleBuilder
    .select('.alert__header', theme)
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .flexWrap('wrap')

  styleBuilder
    .select('.alert__eyebrow', theme)
    .margin('0')
    .fontSize('11px')
    .fontWeight('700')
    .textTransform('uppercase')
    .letterSpacing('0.12em')
    .color(palette.text.subtle)

  styleBuilder
    .select('.alert__title', theme)
    .margin('0')
    .fontSize('15px')
    .fontWeight('700')
    .letterSpacing('-0.01em')
    .color(palette.text.strong)

  styleBuilder
    .select('.alert__badge', theme)
    .display('inline-flex')
    .alignItems('center')
    .padding('3px 8px')
    .borderRadius(options.radii.pill)
    .fontSize('11px')
    .fontWeight('700')
    .textTransform('uppercase')
    .letterSpacing('0.08em')
    .background(palette.badge.muted.background)
    .color(palette.badge.muted.text)
}

export function applyAlertBodyStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder.select('.alert__body', theme).display('grid').gap('8px')
  styleBuilder
    .select('.alert__body :where(p, ul, ol)', theme)
    .margin('0')
    .lineHeight('1.6')
  styleBuilder
    .select('.alert__body :where(strong)', theme)
    .color(palette.text.strong)
  styleBuilder
    .select('.alert__body :where(a)', theme)
    .color(palette.text.accent)
    .fontWeight('600')
    .textDecoration('underline')
  styleBuilder
    .select('.alert__body :where(code)', theme)
    .fontFamily("'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace")
    .fontSize('0.9em')
    .background(palette.background.surfaceAlt)
    .border(`1px solid ${palette.border.subtle}`)
    .borderRadius(options.radii.sm)
    .padding('0.1em 0.35em')
}

export function applyAlertActionStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.alert__actions', theme)
    .display('flex')
    .alignItems('center')
    .flexWrap('wrap')
    .gap('8px')
  styleBuilder.select('.alert__actions:empty', theme).display('none')

  styleBuilder
    .select('.alert__actions :where(a, button)', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .padding('6px 11px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.action.neutral.background)
    .color(palette.action.neutral.text)
    .fontSize('12px')
    .fontWeight('600')
    .textDecoration('none')
    .cursor('pointer')
    .transition(
      'background 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease',
    )

  styleBuilder
    .select('.alert__actions :where(a, button):hover', theme)
    .background(palette.action.neutral.hover)
    .transform('translateY(-1px)')
  styleBuilder
    .select('.alert__actions :where(a, button):active', theme)
    .background(palette.action.neutral.active)
  styleBuilder
    .select('.alert__actions :where(a, button):focus-visible', theme)
    .outline(`2px solid ${palette.action.neutral.focusRing}`)
    .outlineOffset('2px')
}

export function applyAlertMetaStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.alert__meta', theme)
    .margin('0')
    .fontSize('12px')
    .lineHeight('1.5')
    .color(palette.text.subtle)
}

export function applyAlertSoftToneStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  const tones = [
    {
      tone: 'info',
      background: palette.status.info.background,
      border: palette.status.info.border,
      text: palette.status.info.text,
    },
    {
      tone: 'success',
      background: palette.status.success.background,
      border: palette.status.success.border,
      text: palette.status.success.text,
    },
    {
      tone: 'warning',
      background: palette.status.warning.background,
      border: palette.status.warning.border,
      text: palette.status.warning.text,
    },
    {
      tone: 'danger',
      background: palette.status.danger.background,
      border: palette.status.danger.border,
      text: palette.status.danger.text,
    },
    {
      tone: 'accent',
      background: palette.background.accentMuted,
      border: palette.border.accent,
      text: palette.text.accent,
    },
  ]

  for (const tone of tones) {
    applyAlertToneVariantStyles(
      theme,
      'soft',
      tone.tone,
      tone.background,
      tone.border,
      tone.text,
    )
  }

  styleBuilder
    .select('.alert--soft.alert--tone-neutral', theme)
    .background(palette.background.surfaceAlt)
    .borderColor(palette.border.default)
}

export function applyAlertOutlineToneStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.alert--outline', theme)
    .background(palette.background.surface)

  const tones = [
    {
      tone: 'info',
      border: palette.status.info.border,
      text: palette.status.info.text,
    },
    {
      tone: 'success',
      border: palette.status.success.border,
      text: palette.status.success.text,
    },
    {
      tone: 'warning',
      border: palette.status.warning.border,
      text: palette.status.warning.text,
    },
    {
      tone: 'danger',
      border: palette.status.danger.border,
      text: palette.status.danger.text,
    },
    {
      tone: 'accent',
      border: palette.border.accent,
      text: palette.text.accent,
    },
  ]

  for (const tone of tones) {
    applyAlertToneVariantStyles(
      theme,
      'outline',
      tone.tone,
      palette.background.surface,
      tone.border,
      tone.text,
    )
  }
}

export function applyAlertToneVariantStyles(
  theme: ThemeMode,
  variant: 'soft' | 'outline',
  tone: string,
  background: string,
  borderColor: string,
  textColor: string,
) {
  const baseSelector = `.alert--${variant}.alert--tone-${tone}`
  styleBuilder
    .select(baseSelector, theme)
    .background(background)
    .borderColor(borderColor)
  if (variant === 'outline') {
    styleBuilder
      .select(baseSelector, theme)
      .borderLeft(`4px solid ${borderColor}`)
  }
  styleBuilder
    .select(
      `${baseSelector} .alert__title, ${baseSelector} .alert__icon`,
      theme,
    )
    .color(textColor)
}

export function applyAlertFeatureToneStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.alert--feature', theme)
    .background(palette.background.feature)
    .borderColor(palette.border.accent)
    .boxShadow(palette.effect.panelShadowStrong)
  styleBuilder
    .select('.alert--feature .alert__title', theme)
    .color(palette.text.accent)
  styleBuilder
    .select('.alert--feature .alert__icon', theme)
    .backgroundColor(palette.icon.accent.background)
    .background(palette.icon.accent.gradient)
    .borderColor(palette.icon.accent.ring)
    .color(palette.icon.accent.color)
}

export function applyAlertResponsiveStyles(theme: ThemeMode) {
  styleBuilder.select('.alert', theme).media('max-width: 720px').padding('12px')

  styleBuilder
    .select('.alert__actions', theme)
    .media('max-width: 720px')
    .gap('6px')
}
