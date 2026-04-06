import type { ThemeOptions, ThemePalette } from '@purestack/ts-style'
import { styleBuilder, type ThemeMode, themes } from '@purestack/ts-style'

export function registerButtonStyles() {
  themes.forEach((theme, palette, options) => {
    registerButtonBaseStyles(theme, palette, options)
    registerButtonSizeStyles(theme, options.radii)
    registerButtonToneStyles(theme, palette)
  })
}

function registerButtonBaseStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.btn', theme)
    .display('inline-flex')
    .verticalAlign('middle')
    .alignItems('center')
    .justifyContent('center')
    .gap('8px')
    .border('1px solid transparent')
    .fontWeight('600')
    .lineHeight('1')
    .cursor('pointer')
    .textDecoration('none')
    .whiteSpace('nowrap')
    .transition(
      'background 150ms ease, color 150ms ease, border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease',
    )
    .padding('10px 16px')
    .fontSize('0.95rem')
    .borderRadius(options.radii.md)

  styleBuilder
    .select('.btn:focus-visible', theme)
    .outline('none')
    .boxShadow(`0 0 0 2px ${palette.action.neutral.focusRing}`)

  styleBuilder
    .select('.btn:disabled', theme)
    .cursor('not-allowed')
    .transform('none')
    .boxShadow('none')

  styleBuilder
    .select('.btn__label', theme)
    .display('inline-flex')
    .alignItems('center')

  styleBuilder.select('.btn__icon', theme).width('1.1em').height('1.1em')
}

function registerButtonSizeStyles(
  theme: ThemeMode,
  radii: { sm: string; md: string; lg: string },
) {
  styleBuilder
    .select('.btn--sm', theme)
    .padding('8px 12px')
    .fontSize('0.86rem')
    .borderRadius(radii.sm)

  /*- The default size (md) is defined in the .btn for simplicity. */

  styleBuilder
    .select('.btn--lg', theme)
    .padding('12px 20px')
    .fontSize('1rem')
    .borderRadius(radii.md)

  styleBuilder
    .select('.btn--icon-only.btn--sm', theme)
    .padding('8px')
    .width('34px')

  styleBuilder
    .select('.btn--icon-only.btn--md', theme)
    .padding('10px')
    .width('40px')

  styleBuilder
    .select('.btn--icon-only.btn--lg', theme)
    .padding('12px')
    .width('46px')

  styleBuilder.select('.btn--icon-only .btn__label', theme).display('none')
}

function registerButtonToneStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.btn.tone-surface--accent', theme)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--accent:hover', theme)
    .background(palette.action.accent.hover)
    .borderColor(palette.action.accent.background)
    .color(palette.action.accent.text)

  styleBuilder
    .select('.btn.tone-surface--accent:active', theme)
    .background(palette.action.accent.active)
    .borderColor(palette.action.accent.active)

  styleBuilder
    .select('.btn.tone-surface--accent:disabled', theme)
    .background(palette.action.accent.disabled)
    .borderColor(palette.action.accent.disabled)
    .color(palette.text.strong)

  styleBuilder.select('.btn.tone-surface--neutral', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--neutral:hover', theme)
    .background(palette.background.raised)
    .borderColor(palette.border.hard)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--neutral:active', theme)
    .background(palette.action.neutral.active)
    .borderColor(palette.border.strong)

  styleBuilder
    .select('.btn.tone-surface--neutral:disabled', theme)
    .background(palette.action.neutral.disabled)
    .borderColor(palette.border.default)
    .color(palette.text.muted)

  styleBuilder.select('.btn.tone-surface--ghost', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--ghost:hover', theme)
    .background(palette.action.ghost.hover)
    .borderColor('transparent')
    .color(palette.action.ghost.text)

  styleBuilder
    .select('.btn.tone-surface--ghost:active', theme)
    .background(palette.action.ghost.active)
    .borderColor('transparent')

  styleBuilder
    .select('.btn.tone-surface--ghost:disabled', theme)
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--info', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--info:hover', theme)
    .background(palette.status.info.border)
    .borderColor(palette.status.info.border)
    .color(palette.text.inverse)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--info:active', theme)
    .background(palette.background.accentMuted)
    .borderColor(palette.status.info.border)

  styleBuilder
    .select('.btn.tone-surface--info:disabled', theme)
    .background(palette.status.info.background)
    .borderColor(palette.status.info.border)
    .color(palette.status.info.text)
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--success', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--success:hover', theme)
    .background(palette.status.success.border)
    .borderColor(palette.status.success.border)
    .color(palette.text.inverse)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--success:active', theme)
    .background(palette.background.successMuted)
    .borderColor(palette.status.success.border)

  styleBuilder
    .select('.btn.tone-surface--success:disabled', theme)
    .background(palette.status.success.background)
    .borderColor(palette.status.success.border)
    .color(palette.status.success.text)
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--danger', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--danger:hover', theme)
    .background(palette.border.danger)
    .borderColor(palette.border.danger)
    .color(palette.text.inverse)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--danger:active', theme)
    .background(palette.background.dangerMuted)
    .borderColor(palette.border.danger)

  styleBuilder
    .select('.btn.tone-surface--danger:disabled', theme)
    .background(palette.status.danger.background)
    .borderColor(palette.status.danger.border)
    .color(palette.status.danger.text)
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--warning', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--warning:hover', theme)
    .background(palette.status.warning.border)
    .borderColor(palette.status.warning.border)
    .color(palette.text.default)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--warning:active', theme)
    .background(palette.action.neutral.active)
    .borderColor(palette.status.warning.border)

  styleBuilder
    .select('.btn.tone-surface--warning:disabled', theme)
    .background(palette.status.warning.background)
    .borderColor(palette.status.warning.border)
    .color(palette.status.warning.text)
    .opacity('0.72')
}
