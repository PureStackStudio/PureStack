import type { ThemeMode, ThemePalette } from '@purestack/ts-style'

export type ComposerCanvasStyleOption = 'theme' | 'revert' | 'initial'

export interface ComposerCanvasStyleContext {
  palette: ThemePalette
  theme: ThemeMode
}
