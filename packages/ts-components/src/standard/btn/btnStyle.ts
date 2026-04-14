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
    .webkitTapHighlightColor('transparent')
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
    .select('.btn.tone-button--accent', theme)
    .background(palette.semanticTone.accent.button.rest.background)
    .borderColor(palette.semanticTone.accent.button.rest.border)
    .color(palette.semanticTone.accent.button.rest.text)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-button--accent:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.accent.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-button--accent:hover', theme)
    .background(palette.semanticTone.accent.button.hover.background)
    .borderColor(palette.semanticTone.accent.button.hover.border)
    .color(palette.semanticTone.accent.button.hover.text)

  styleBuilder
    .select('.btn.tone-button--accent:active', theme)
    .background(palette.semanticTone.accent.button.active.background)
    .borderColor(palette.semanticTone.accent.button.active.border)
    .color(palette.semanticTone.accent.button.active.text)

  styleBuilder
    .select('.btn.tone-button--accent:disabled', theme)
    .background(palette.semanticTone.accent.button.disabled.background)
    .borderColor(palette.semanticTone.accent.button.disabled.border)
    .color(palette.semanticTone.accent.button.disabled.text)

  styleBuilder
    .select('.btn.tone-button--neutral', theme)
    .background(palette.semanticTone.neutral.button.rest.background)
    .borderColor(palette.semanticTone.neutral.button.rest.border)
    .color(palette.semanticTone.neutral.button.rest.text)
    .boxShadow('none')

  styleBuilder
    .select('.btn.tone-button--neutral:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.neutral.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-button--neutral:hover', theme)
    .background(palette.semanticTone.neutral.button.hover.background)
    .borderColor(palette.semanticTone.neutral.button.hover.border)
    .color(palette.semanticTone.neutral.button.hover.text)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-button--neutral:active', theme)
    .background(palette.semanticTone.neutral.button.active.background)
    .borderColor(palette.semanticTone.neutral.button.active.border)
    .color(palette.semanticTone.neutral.button.active.text)

  styleBuilder
    .select('.btn.tone-button--neutral:disabled', theme)
    .background(palette.semanticTone.neutral.button.disabled.background)
    .borderColor(palette.semanticTone.neutral.button.disabled.border)
    .color(palette.semanticTone.neutral.button.disabled.text)

  styleBuilder
    .select('.btn.tone-button--ghost', theme)
    .background(palette.semanticTone.ghost.button.rest.background)
    .borderColor(palette.semanticTone.ghost.button.rest.border)
    .color(palette.semanticTone.ghost.button.rest.text)
    .boxShadow('none')

  styleBuilder
    .select('.btn.tone-button--ghost:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.ghost.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-button--ghost:hover', theme)
    .background(palette.semanticTone.ghost.button.hover.background)
    .borderColor('transparent')
    .color(palette.semanticTone.ghost.button.hover.text)

  styleBuilder
    .select('.btn.tone-button--ghost:active', theme)
    .background(palette.semanticTone.ghost.button.active.background)
    .borderColor('transparent')
    .color(palette.semanticTone.ghost.button.active.text)

  styleBuilder
    .select('.btn.tone-button--ghost:disabled', theme)
    .background(palette.semanticTone.ghost.button.disabled.background)
    .borderColor('transparent')
    .color(palette.semanticTone.ghost.button.disabled.text)
    .opacity('0.72')

  styleBuilder
    .select('.btn.tone-button--info', theme)
    .background(palette.semanticTone.info.button.rest.background)
    .borderColor(palette.semanticTone.info.button.rest.border)
    .color(palette.semanticTone.info.button.rest.text)
    .boxShadow('none')

  styleBuilder
    .select('.btn.tone-button--info:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.info.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-button--info:hover', theme)
    .background(palette.semanticTone.info.button.hover.background)
    .borderColor(palette.semanticTone.info.button.hover.border)
    .color(palette.semanticTone.info.button.hover.text)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-button--info:active', theme)
    .background(palette.semanticTone.info.button.active.background)
    .borderColor(palette.semanticTone.info.button.active.border)
    .color(palette.semanticTone.info.button.active.text)

  styleBuilder
    .select('.btn.tone-button--info:disabled', theme)
    .background(palette.semanticTone.info.button.disabled.background)
    .borderColor(palette.semanticTone.info.button.disabled.border)
    .color(palette.semanticTone.info.button.disabled.text)
    .opacity('0.72')

  styleBuilder
    .select('.btn.tone-button--success', theme)
    .background(palette.semanticTone.success.button.rest.background)
    .borderColor(palette.semanticTone.success.button.rest.border)
    .color(palette.semanticTone.success.button.rest.text)
    .boxShadow('none')

  styleBuilder
    .select('.btn.tone-button--success:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.success.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-button--success:hover', theme)
    .background(palette.semanticTone.success.button.hover.background)
    .borderColor(palette.semanticTone.success.button.hover.border)
    .color(palette.semanticTone.success.button.hover.text)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-button--success:active', theme)
    .background(palette.semanticTone.success.button.active.background)
    .borderColor(palette.semanticTone.success.button.active.border)
    .color(palette.semanticTone.success.button.active.text)

  styleBuilder
    .select('.btn.tone-button--success:disabled', theme)
    .background(palette.semanticTone.success.button.disabled.background)
    .borderColor(palette.semanticTone.success.button.disabled.border)
    .color(palette.semanticTone.success.button.disabled.text)
    .opacity('0.72')

  styleBuilder
    .select('.btn.tone-button--danger', theme)
    .background(palette.semanticTone.danger.button.rest.background)
    .borderColor(palette.semanticTone.danger.button.rest.border)
    .color(palette.semanticTone.danger.button.rest.text)
    .boxShadow('none')

  styleBuilder
    .select('.btn.tone-button--danger:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.danger.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-button--danger:hover', theme)
    .background(palette.semanticTone.danger.button.hover.background)
    .borderColor(palette.semanticTone.danger.button.hover.border)
    .color(palette.semanticTone.danger.button.hover.text)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-button--danger:active', theme)
    .background(palette.semanticTone.danger.button.active.background)
    .borderColor(palette.semanticTone.danger.button.active.border)
    .color(palette.semanticTone.danger.button.active.text)

  styleBuilder
    .select('.btn.tone-button--danger:disabled', theme)
    .background(palette.semanticTone.danger.button.disabled.background)
    .borderColor(palette.semanticTone.danger.button.disabled.border)
    .color(palette.semanticTone.danger.button.disabled.text)
    .opacity('0.72')

  styleBuilder
    .select('.btn.tone-button--warning', theme)
    .background(palette.semanticTone.warning.button.rest.background)
    .borderColor(palette.semanticTone.warning.button.rest.border)
    .color(palette.semanticTone.warning.button.rest.text)
    .boxShadow('none')

  styleBuilder
    .select('.btn.tone-button--warning:focus-visible', theme)
    .boxShadow(`0 0 0 2px ${palette.semanticTone.warning.button.focusRing}`)

  styleBuilder
    .select('.btn.tone-button--warning:hover', theme)
    .background(palette.semanticTone.warning.button.hover.background)
    .borderColor(palette.semanticTone.warning.button.hover.border)
    .color(palette.semanticTone.warning.button.hover.text)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn.tone-button--warning:active', theme)
    .background(palette.semanticTone.warning.button.active.background)
    .borderColor(palette.semanticTone.warning.button.active.border)
    .color(palette.semanticTone.warning.button.active.text)

  styleBuilder
    .select('.btn.tone-button--warning:disabled', theme)
    .background(palette.semanticTone.warning.button.disabled.background)
    .borderColor(palette.semanticTone.warning.button.disabled.border)
    .color(palette.semanticTone.warning.button.disabled.text)
    .opacity('0.72')
}
