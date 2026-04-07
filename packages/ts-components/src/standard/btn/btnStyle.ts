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
    .boxShadow(`0 0 0 2px ${palette.semanticTone.neutral.focusRing}`)

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
    .background(palette.semanticTone.accent.hover)
    .borderColor(palette.semanticTone.accent.background.default)
    .color(palette.semanticTone.accent.text.default)

  styleBuilder
    .select('.btn.tone-surface--accent:active', theme)
    .background(palette.semanticTone.accent.active)
    .borderColor(palette.semanticTone.accent.active)

  styleBuilder
    .select('.btn.tone-surface--accent:disabled', theme)
    .background(palette.semanticTone.accent.disabled)
    .borderColor(palette.semanticTone.accent.disabled)
    .color(palette.semanticTone.neutral.text.strong)

  styleBuilder.select('.btn.tone-surface--neutral', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--neutral:hover', theme)
    .background(palette.semanticTone.neutral.background.raised)
    .borderColor(palette.semanticTone.neutral.border.hard)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--neutral:active', theme)
    .background(palette.semanticTone.neutral.active)
    .borderColor(palette.semanticTone.neutral.border.strong)

  styleBuilder
    .select('.btn.tone-surface--neutral:disabled', theme)
    .background(palette.semanticTone.neutral.disabled)
    .borderColor(palette.semanticTone.neutral.border.default)
    .color(palette.semanticTone.neutral.text.muted)

  styleBuilder.select('.btn.tone-surface--ghost', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--ghost:hover', theme)
    .background(palette.semanticTone.ghost.hover)
    .borderColor('transparent')
    .color(palette.semanticTone.ghost.text.default)

  styleBuilder
    .select('.btn.tone-surface--ghost:active', theme)
    .background(palette.semanticTone.ghost.active)
    .borderColor('transparent')

  styleBuilder
    .select('.btn.tone-surface--ghost:disabled', theme)
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--info', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--info:hover', theme)
    .background(palette.semanticTone.info.border.default)
    .borderColor(palette.semanticTone.info.border.default)
    .color(palette.semanticTone.neutral.text.inverse)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--info:active', theme)
    .background(palette.semanticTone.info.background.default)
    .borderColor(palette.semanticTone.info.border.default)

  styleBuilder
    .select('.btn.tone-surface--info:disabled', theme)
    .background(palette.semanticTone.info.background.default)
    .borderColor(palette.semanticTone.info.border.default)
    .color(palette.semanticTone.info.text.default)
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--success', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--success:hover', theme)
    .background(palette.semanticTone.success.border.default)
    .borderColor(palette.semanticTone.success.border.default)
    .color(palette.semanticTone.neutral.text.inverse)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--success:active', theme)
    .background(palette.semanticTone.success.background.default)
    .borderColor(palette.semanticTone.success.border.default)

  styleBuilder
    .select('.btn.tone-surface--success:disabled', theme)
    .background(palette.semanticTone.success.background.default)
    .borderColor(palette.semanticTone.success.border.default)
    .color(palette.semanticTone.success.text.default)
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--danger', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--danger:hover', theme)
    .background(palette.semanticTone.danger.border.default)
    .borderColor(palette.semanticTone.danger.border.default)
    .color(palette.semanticTone.neutral.text.inverse)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--danger:active', theme)
    .background(palette.semanticTone.danger.background.default)
    .borderColor(palette.semanticTone.danger.border.default)

  styleBuilder
    .select('.btn.tone-surface--danger:disabled', theme)
    .background(palette.semanticTone.danger.background.default)
    .borderColor(palette.semanticTone.danger.border.default)
    .color(palette.semanticTone.danger.text.default)
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--warning', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--warning:hover', theme)
    .background(palette.semanticTone.warning.border.default)
    .borderColor(palette.semanticTone.warning.border.default)
    .color(palette.semanticTone.neutral.text.default)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--warning:active', theme)
    .background(palette.semanticTone.neutral.active)
    .borderColor(palette.semanticTone.warning.border.default)

  styleBuilder
    .select('.btn.tone-surface--warning:disabled', theme)
    .background(palette.semanticTone.warning.background.default)
    .borderColor(palette.semanticTone.warning.border.default)
    .color(palette.semanticTone.warning.text.default)
    .opacity('0.72')
}
