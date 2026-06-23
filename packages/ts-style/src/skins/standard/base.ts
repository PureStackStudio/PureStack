import type { CSSProps } from '@purestack/ts-css'
import type { ThemeMode } from '../../themeOptions'
import type { ThemePalette, ThemeTypography } from '../../themePalette'
import { getCurrentThemePalette } from '../../themePaletteVars'
import { getLetterSpacing } from '../../typography/getLetterSpacing'
import { getLineHeight } from '../../typography/getLineHeight'
import { createScale, createTone, rgba, type ToneColors } from './shared'

export type StandardCore = {
  neutral: ToneColors
  accent: ToneColors
  feature: ToneColors
  secondary: ToneColors
  custom: ToneColors
  ghost: ToneColors
  info: ToneColors
  success: ToneColors
  warning: ToneColors
  danger: ToneColors
}

type StandardPaletteOptions = {
  mode: ThemeMode
  core: StandardCore
  borderAlpha?: number
  subtleAlpha?: number
  chromeLighting?: number
  accent: string
}

export function createStandardPalette({
  mode,
  core,
  accent,
  chromeLighting = 0.22,
  borderAlpha = 0.66,
  subtleAlpha = 0.5,
}: StandardPaletteOptions): ThemePalette {
  const borderTone = (hex: string) => rgba(hex, borderAlpha)
  const subtleTone = (hex: string) => rgba(hex, subtleAlpha)
  const chrome = { lighting: chromeLighting }

  return {
    accent,
    current: getCurrentThemePalette(),
    font: createTypography(),
    radii: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      pill: '62.4375rem',
    },
    applyFont:
      (fontSize: string, fontWeight?: CSSProps['fontWeight']) => () => ({
        fontSize,
        fontWeight,
        letterSpacing: getLetterSpacing(fontSize, fontWeight),
        lineHeight: getLineHeight(fontSize, fontWeight),
      }),
    semanticTone: {
      neutral: createTone(
        core.neutral,
        mode,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      accent: createTone(
        core.accent,
        mode,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      feature: createTone(
        core.feature,
        mode,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      secondary: createTone(
        core.secondary,
        mode,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      custom: createTone(
        core.custom,
        mode,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      ghost: createTone(
        core.ghost,
        mode,
        borderTone,
        subtleTone,
        {},
        true,
        chrome,
      ),
      info: createTone(
        core.info,
        mode,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      success: createTone(
        core.success,
        mode,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      warning: createTone(
        core.warning,
        mode,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
      danger: createTone(
        core.danger,
        mode,
        borderTone,
        subtleTone,
        {},
        false,
        chrome,
      ),
    },
    effect: createEffect(core, mode),
  }
}

function createEffect(core: StandardCore, mode: ThemeMode) {
  const text = createScale(core.neutral.foreground, 18, mode)
  const accent = createScale(core.accent.button, 20, mode)
  const info = createScale(core.info.button, 18, mode)
  const shadowColor = core.neutral.foreground
  const effect: ThemePalette['effect'] = {
    glowPrimary: `0 0 1.75rem ${rgba(accent.level3, 0.22)}`,
    glowSecondary: `0 0 1.75rem ${rgba(info.level3, 0.18)}`,
    floatingShadow: `0 0.5625rem 1.4375rem ${rgba(shadowColor, 0.24)}`,
    softShadow: '0 0.625rem 1.125rem rgba(0, 0, 0, 0.18)',
    strongShadow: '0 1.25rem 2.5rem rgba(0, 0, 0, 0.4)',
    panelShadow: `0 0.4375rem 0.8125rem ${rgba(shadowColor, 0.07)}`,
    panelShadowStrong: `0 0.4375rem 0.8125rem ${rgba(shadowColor, 0.07)}`,
    accentShadow: `0 1rem 3rem ${rgba(accent.level3, 0.22)}`,
    interactiveShadow: `0 0.375rem 0.875rem ${rgba(shadowColor, 0.12)}`,
    trackShadow: `inset 0 0.0625rem 0 ${rgba(text.level5, 0.05)}`,
    thumbShadow: `0 0.75rem 1.5rem ${rgba(shadowColor, 0.18)}`,
    overlayScrim: rgba(shadowColor, 0.66),
    focusGlow: `0 0 0 0.125rem ${rgba(accent.level3, 0.42)}, 0 0 1.5rem ${rgba(accent.level3, 0.18)}`,
    insetShadow: `inset 0 0.625rem 1.75rem ${rgba(shadowColor, 0.34)}`,
  }
  return effect
}

function createTypography(): ThemeTypography {
  return {
    family: {
      base: "'Manrope', 'Segoe UI', system-ui, sans-serif",
    },
    size: {
      xxxs: '0.72rem',
      xxs: '0.85rem',
      xs: '0.9rem',
      sm: '0.94rem',
      body: '1rem',
      h6: '1rem',
      h5: '1rem',
      h4: '1rem',
      h3: '1.25rem',
      h2: '1.5rem',
      h1: '2rem',
      display: '2.545rem',
    },
    weight: {
      w100: '100',
      w400: '400',
      w500: '500',
      w600: '600',
      w700: '700',
    },
  }
}
