import type { ThemeMode, ThemePalette } from '@purestack/ts-style'
import { paint, studioHues } from './studioSkinShared'

export type DocumentationColors = ReturnType<typeof createDocumentationColors>

/** Reading surfaces and their decorative accents, separate from the demo palette. */
export function createDocumentationColors(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  const neutral = paint(studioHues.neutral)
  const dark = theme === 'dark'
  const surface = dark ? neutral(0.265, 0.13) : neutral(0.99, 0.015)
  const shadow = neutral(0.15, 0.1, dark ? 0.16 : 0.045)

  return {
    canvas: dark ? neutral(0.235, 0.12) : neutral(0.975, 0.025),
    surface,
    ink: dark ? neutral(0.85, 0.08) : neutral(0.32, 0.12),
    heading: dark ? neutral(0.93, 0.06) : neutral(0.25, 0.15),
    muted: dark ? neutral(0.72, 0.1) : neutral(0.48, 0.12),
    border: dark ? neutral(0.36, 0.12) : neutral(0.88, 0.05),
    shadow,
    tint: `color-mix(in srgb, ${palette.semanticTone.accent.text.default} 6%, ${surface})`,
    elevation: `0 3px 12px ${shadow}, 0 16px 40px ${shadow}`,
  }
}
