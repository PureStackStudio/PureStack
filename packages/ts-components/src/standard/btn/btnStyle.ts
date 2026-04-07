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
    .boxShadow(`0 0 0 2px ${palette.semanticTone.neutral.button.focusRing}`)

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
    .select('.btn.tone-surface--accent:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.accent.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-surface--accent', theme)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--accent:hover', theme)
    .background(palette.semanticTone.accent.button.hover)
    .borderColor(palette.semanticTone.accent.button.border)
    .color(palette.semanticTone.accent.button.text)

  styleBuilder
    .select('.btn.tone-surface--accent:active', theme)
    .background(palette.semanticTone.accent.button.active)
    .borderColor(palette.semanticTone.accent.button.active)

  styleBuilder
    .select('.btn.tone-surface--accent:disabled', theme)
    .background(palette.semanticTone.accent.button.disabled)
    .borderColor(palette.semanticTone.accent.button.disabled)
    .color(palette.semanticTone.neutral.text.strong)

  styleBuilder.select('.btn.tone-surface--neutral', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--neutral:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.neutral.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-surface--neutral:hover', theme)
    .background(palette.semanticTone.neutral.button.hover)
    .borderColor(palette.semanticTone.neutral.border.hard)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--neutral:active', theme)
    .background(palette.semanticTone.neutral.button.active)
    .borderColor(palette.semanticTone.neutral.border.strong)

  styleBuilder
    .select('.btn.tone-surface--neutral:disabled', theme)
    .background(palette.semanticTone.neutral.button.disabled)
    .borderColor(palette.semanticTone.neutral.border.default)
    .color(palette.semanticTone.neutral.text.muted)

  styleBuilder.select('.btn.tone-surface--ghost', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--ghost:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.ghost.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-surface--ghost:hover', theme)
    .background(palette.semanticTone.ghost.button.hover)
    .borderColor('transparent')
    .color(palette.semanticTone.ghost.button.text)

  styleBuilder
    .select('.btn.tone-surface--ghost:active', theme)
    .background(palette.semanticTone.ghost.button.active)
    .borderColor('transparent')

  styleBuilder
    .select('.btn.tone-surface--ghost:disabled', theme)
    .background(palette.semanticTone.ghost.button.disabled)
    .borderColor('transparent')
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--info', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--info:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.info.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-surface--info:hover', theme)
    .background(palette.semanticTone.info.button.hover)
    .borderColor(palette.semanticTone.info.button.border)
    .color(palette.semanticTone.neutral.text.inverse)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--info:active', theme)
    .background(palette.semanticTone.info.button.active)
    .borderColor(palette.semanticTone.info.button.border)

  styleBuilder
    .select('.btn.tone-surface--info:disabled', theme)
    .background(palette.semanticTone.info.button.disabled)
    .borderColor(palette.semanticTone.info.button.border)
    .color(palette.semanticTone.info.button.text)
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--success', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--success:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.success.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-surface--success:hover', theme)
    .background(palette.semanticTone.success.button.hover)
    .borderColor(palette.semanticTone.success.button.border)
    .color(palette.semanticTone.neutral.text.inverse)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--success:active', theme)
    .background(palette.semanticTone.success.button.active)
    .borderColor(palette.semanticTone.success.button.border)

  styleBuilder
    .select('.btn.tone-surface--success:disabled', theme)
    .background(palette.semanticTone.success.button.disabled)
    .borderColor(palette.semanticTone.success.button.border)
    .color(palette.semanticTone.success.button.text)
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--danger', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--danger:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.danger.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-surface--danger:hover', theme)
    .background(palette.semanticTone.danger.button.hover)
    .borderColor(palette.semanticTone.danger.button.border)
    .color(palette.semanticTone.neutral.text.inverse)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--danger:active', theme)
    .background(palette.semanticTone.danger.button.active)
    .borderColor(palette.semanticTone.danger.button.border)

  styleBuilder
    .select('.btn.tone-surface--danger:disabled', theme)
    .background(palette.semanticTone.danger.button.disabled)
    .borderColor(palette.semanticTone.danger.button.border)
    .color(palette.semanticTone.danger.button.text)
    .opacity('0.72')

  styleBuilder.select('.btn.tone-surface--warning', theme).boxShadow('none')

  styleBuilder
    .select('.btn.tone-surface--warning:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.warning.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-surface--warning:hover', theme)
    .background(palette.semanticTone.warning.button.hover)
    .borderColor(palette.semanticTone.warning.button.border)
    .color(palette.semanticTone.neutral.text.default)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-surface--warning:active', theme)
    .background(palette.semanticTone.warning.button.active)
    .borderColor(palette.semanticTone.warning.button.border)

  styleBuilder
    .select('.btn.tone-surface--warning:disabled', theme)
    .background(palette.semanticTone.warning.button.disabled)
    .borderColor(palette.semanticTone.warning.button.border)
    .color(palette.semanticTone.warning.button.text)
    .opacity('0.72')
}
