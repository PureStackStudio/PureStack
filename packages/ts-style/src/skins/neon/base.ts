import type { ThemePalette } from '../../themePalette'
import { getCurrentThemePalette } from '../../themePaletteVars'
import { createScale, createTone, rgba, type ToneColors } from './shared'

export type NeonCore = {
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
  subtleAlpha?: number
  chromeLighting?: number
}

export function createNeonPalette({
  core,
  borderAlpha = 0.33,
  subtleAlpha = 0.5,
  chromeLighting = 0.22,
}: NeonPaletteOptions): ThemePalette {
  const borderTone = (hex: string) => rgba(hex, borderAlpha)
  const subtleTone = (hex: string) => rgba(hex, subtleAlpha)
  const chrome = { lighting: chromeLighting }

  const effect: ThemePalette['effect'] = createEffect(core)

  return {
    current: getCurrentThemePalette(),
    semanticTone: {
      neutral: createTone(
        core.neutral,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      accent: createTone(
        core.accent,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      ghost: createTone(core.ghost, borderTone, subtleTone, {}, true, chrome),
      info: createTone(core.info, borderTone, subtleTone, {}, false, chrome),
      success: createTone(
        core.success,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      warning: createTone(
        core.warning,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      danger: createTone(
        core.danger,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
    },
    effect,
  }
}

function createEffect(core: NeonCore) {
  const text = createScale(core.neutral.foreground, 18)
  const accent = createScale(core.accent.button, 20)
  const info = createScale(core.info.button, 18)
  const shadowColor = core.neutral.foreground
  const effect: ThemePalette['effect'] = {
    glowPrimary: `0 0 28px ${rgba(accent.level3, 0.22)}`,
    glowSecondary: `0 0 28px ${rgba(info.level3, 0.18)}`,
    floatingShadow: `0 9px 23px ${rgba(shadowColor, 0.24)}`,
    panelShadow: `0 7px 20px ${rgba(shadowColor, 0.11)}`,
    panelShadowStrong: `0 11px 33px ${rgba(shadowColor, 0.22)}`,
    accentShadow: `0 16px 48px ${rgba(accent.level3, 0.22)}`,
    interactiveShadow: `0 6px 14px ${rgba(shadowColor, 0.12)}`,
    trackShadow: `inset 0 1px 0 ${rgba(text.level5, 0.05)}`,
    thumbShadow: `0 12px 24px ${rgba(shadowColor, 0.18)}`,
    overlayScrim: rgba(shadowColor, 0.66),
    focusGlow: `0 0 0 2px ${rgba(accent.level3, 0.42)}, 0 0 24px ${rgba(accent.level3, 0.18)}`,
    insetShadow: `inset 0 10px 28px ${rgba(shadowColor, 0.34)}`,
  }
  return effect
}
