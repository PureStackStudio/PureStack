import type { ThemePalette } from '../../themePalette'
import { createScale, createTone, rgba, type ToneColors } from './shared'

export type NeonCore = {
  baseBlack: string
  neutral: ToneColors
  accent: ToneColors
  ghost: ToneColors
  info: ToneColors
  success: ToneColors
  warning: ToneColors
  danger: ToneColors
}

type NeonPaletteOptions = {
  core: NeonCore
  borderAlpha?: number
}

export function createNeonPalette({
  core,
  borderAlpha = 0.33,
}: NeonPaletteOptions): ThemePalette {
  const borderTone = (hex: string) => rgba(hex, borderAlpha)

  const effect: ThemePalette['effect'] = createEffect(core)

  return {
    semanticTone: {
      neutral: createTone(core.neutral, borderTone),
      accent: createTone(core.accent, borderTone),
      ghost: createTone(core.ghost, borderTone),
      info: createTone(core.info, borderTone),
      success: createTone(core.success, borderTone),
      warning: createTone(core.warning, borderTone),
      danger: createTone(core.danger, borderTone),
    },
    effect,
  }
}

function createEffect(core: NeonCore) {
  const text = createScale(core.neutral.foreground, 18)
  const accent = createScale(core.accent.background, 20)
  const info = createScale(core.info.background, 18)

  const effect: ThemePalette['effect'] = {
    glowPrimary: `0 0 28px ${rgba(accent.level3, 0.22)}`,
    glowSecondary: `0 0 28px ${rgba(info.level3, 0.18)}`,
    floatingShadow: `0 18px 56px ${rgba(core.baseBlack, 0.64)}`,
    panelShadow: `0 14px 40px ${rgba(core.baseBlack, 0.56)}`,
    panelShadowStrong: `0 22px 72px ${rgba(core.baseBlack, 0.68)}`,
    accentShadow: `0 16px 48px ${rgba(accent.level3, 0.22)}`,
    interactiveShadow: `0 12px 34px ${rgba(core.baseBlack, 0.52)}`,
    trackShadow: `inset 0 1px 0 ${rgba(text.level5, 0.05)}`,
    thumbShadow: `0 12px 24px ${rgba(core.baseBlack, 0.58)}`,
    overlayScrim: rgba(core.baseBlack, 0.66),
    focusGlow: `0 0 0 2px ${rgba(accent.level3, 0.42)}, 0 0 24px ${rgba(accent.level3, 0.18)}`,
    insetShadow: `inset 0 10px 28px ${rgba(core.baseBlack, 0.34)}`,
  }
  return effect
}
