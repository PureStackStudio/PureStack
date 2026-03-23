import type { ThemePalette } from '@purestack/ts-style'
import { styleBuilder, type ThemeMode, themes } from '@purestack/ts-style'

export function registerButtonStyles() {
  themes.forEach((theme, palette, options) => {
    registerButtonBaseStyles(theme, palette)
    registerButtonSizeStyles(theme, options.radii)
    registerButtonVariantStyles(theme, palette)
  })
}

function registerButtonBaseStyles(theme: ThemeMode, palette: ThemePalette) {
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

  styleBuilder
    .select('.btn--md', theme)
    .padding('10px 16px')
    .fontSize('0.95rem')
    .borderRadius(radii.md)

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

function registerButtonVariantStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.btn--primary', theme)
    .background(palette.action.accent.background)
    .borderColor(palette.action.accent.background)
    .color(palette.action.accent.text)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.btn--primary:hover', theme)
    .background(palette.action.accent.hover)
    .borderColor(palette.action.accent.hover)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.btn--primary:active', theme)
    .background(palette.action.accent.active)
    .borderColor(palette.action.accent.active)
    .transform('translateY(0)')

  styleBuilder
    .select('.btn--primary:disabled', theme)
    .background(palette.action.accent.disabled)
    .borderColor(palette.action.accent.disabled)
    .color(palette.text.strong)

  styleBuilder
    .select('.btn--secondary', theme)
    .background(palette.action.neutral.background)
    .borderColor(palette.border.default)
    .color(palette.action.neutral.text)

  styleBuilder
    .select('.btn--secondary:hover', theme)
    .background(palette.background.raised)
    .borderColor(palette.border.hard)
    .boxShadow(palette.effect.interactiveShadow)
    .transform('translateY(-2px)')

  styleBuilder
    .select('.btn--secondary:active', theme)
    .background(palette.action.neutral.active)
    .borderColor(palette.border.strong)
    .transform('translateY(0)')

  styleBuilder
    .select('.btn--secondary:disabled', theme)
    .background(palette.action.neutral.disabled)
    .borderColor(palette.border.default)
    .color(palette.text.muted)

  styleBuilder
    .select('.btn--ghost', theme)
    .background(palette.action.ghost.background)
    .borderColor('transparent')
    .color(palette.action.ghost.text)

  styleBuilder
    .select('.btn--ghost:hover', theme)
    .background(palette.action.ghost.hover)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.btn--ghost:active', theme)
    .background(palette.action.ghost.active)
    .transform('translateY(0)')

  styleBuilder
    .select('.btn--ghost:disabled', theme)
    .background(palette.action.ghost.disabled)
    .color(palette.text.muted)

  styleBuilder
    .select('.btn--danger', theme)
    .background(palette.status.danger.background)
    .borderColor(palette.status.danger.border)
    .color(palette.status.danger.text)

  styleBuilder
    .select('.btn--danger:hover', theme)
    .background(palette.border.danger)
    .borderColor(palette.border.danger)
    .color(palette.text.inverse)
    .boxShadow(palette.effect.interactiveShadow)
    .transform('translateY(-2px)')

  styleBuilder
    .select('.btn--danger:active', theme)
    .background(palette.background.dangerMuted)
    .borderColor(palette.border.danger)
    .transform('translateY(0)')

  styleBuilder
    .select('.btn--danger:disabled', theme)
    .background(palette.status.danger.background)
    .borderColor(palette.status.danger.border)
    .color(palette.status.danger.text)
    .opacity('0.72')

  styleBuilder
    .select('.btn--warning', theme)
    .background(palette.status.warning.background)
    .borderColor(palette.status.warning.border)
    .color(palette.status.warning.text)

  styleBuilder
    .select('.btn--warning:hover', theme)
    .background(palette.status.warning.border)
    .borderColor(palette.status.warning.border)
    .color(palette.text.default)
    .boxShadow(palette.effect.interactiveShadow)
    .transform('translateY(-2px)')

  styleBuilder
    .select('.btn--warning:active', theme)
    .background(palette.action.neutral.active)
    .borderColor(palette.status.warning.border)
    .transform('translateY(0)')

  styleBuilder
    .select('.btn--warning:disabled', theme)
    .background(palette.status.warning.background)
    .borderColor(palette.status.warning.border)
    .color(palette.status.warning.text)
    .opacity('0.72')
}
