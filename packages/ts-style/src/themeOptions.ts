import { type DeepPartial, merge } from '@purestack/ts-util'
import { type BuiltInSkinName, builtInSkins } from './skins'
import { normalizeThemeName, type ThemeName } from './themeAssets'
import type { ThemePalette } from './themePalette'
import { createThemePaletteVarBindings } from './themePaletteVars'

export {
  BREAKPOINTS,
  getBreakpoint,
  matchMediaAbove,
  matchMediaBelow,
  matchMediaMax,
  matchMediaMin,
  mediaAbove,
  mediaBelow,
  mediaMax,
  mediaMin,
  type ThemeBreakpointName,
} from './breakpoints'

const DEFAULT_SKIN = builtInSkins.neon
export const THEME_MODES = ['light', 'dark'] as const
export type ThemeMode = (typeof THEME_MODES)[number]

export interface ThemeOptions {
  colors: Record<ThemeMode, ThemePalette>
  radii: {
    sm: string
    md: string
    lg: string
    pill: string
  }
  typography: {
    baseFamily: string
  }
  shadows: {
    soft: string
    strong: string
  }
}

export type ThemeOptionsInput = DeepPartial<ThemeOptions> & {
  skin?: BuiltInSkinName
}

export const DEFAULT_THEME_OPTIONS: ThemeOptions = {
  colors: {
    ...DEFAULT_SKIN,
  },
  radii: {
    sm: '8px',
    md: '10px',
    lg: '16px',
    pill: '999px',
  },
  typography: {
    baseFamily: "'Manrope', 'Segoe UI', system-ui, sans-serif",
  },
  shadows: {
    soft: '0 10px 18px rgba(0, 0, 0, 0.18)',
    strong: '0 20px 40px rgba(0, 0, 0, 0.4)',
  },
}

let activeThemeOptions: ThemeOptions = DEFAULT_THEME_OPTIONS
let activeThemePalettes = createThemePalettes(DEFAULT_THEME_OPTIONS)

function resolveThemeOptions(
  ...values: Array<ThemeOptionsInput | undefined>
): ThemeOptions {
  let merged = DEFAULT_THEME_OPTIONS
  for (const value of values) {
    if (!value) continue
    const skin = resolveSkinName(value.skin)
    if (skin) {
      merged = mergeThemeOptions(merged, { colors: builtInSkins[skin] })
    }
    merged = mergeThemeOptions(merged, omitSkin(value))
  }
  return merged
}

function setThemeOptions(options: ThemeOptions) {
  activeThemeOptions = options
  activeThemePalettes = createThemePalettes(options)
}

function getThemeOptions(): ThemeOptions {
  return activeThemeOptions
}

function getThemePalette(theme: ThemeName): ThemePalette {
  return activeThemePalettes[resolveThemeMode(theme)]
}

function getRawThemePalette(theme: ThemeName): ThemePalette {
  const mode = resolveThemeMode(theme)
  return activeThemeOptions.colors[mode]
}

function resolveThemeMode(theme: ThemeName): ThemeMode {
  const normalized = normalizeThemeName(theme)
  if (normalized === 'dark') return 'dark'
  if (normalized === 'light') return 'light'
  if (
    normalized.startsWith('dark-') ||
    normalized.endsWith('-dark') ||
    normalized.includes('dark')
  ) {
    return 'dark'
  }
  if (
    normalized.startsWith('light-') ||
    normalized.endsWith('-light') ||
    normalized.includes('light')
  ) {
    return 'light'
  }
  return 'light'
}

function forEachTheme(run: (theme: ThemeMode, palette: ThemePalette) => void) {
  for (const theme of THEME_MODES) {
    run(theme, activeThemePalettes[theme])
  }
}

export interface Themes {
  readonly modes: readonly ThemeMode[]
  readonly defaults: ThemeOptions
  resolve: (...values: Array<ThemeOptionsInput | undefined>) => ThemeOptions
  setOptions: (options: ThemeOptions) => void
  getOptions: () => ThemeOptions
  palette: (theme: ThemeName) => ThemePalette
  rawPalette: (theme: ThemeName) => ThemePalette
  forEach: (
    run: (
      theme: ThemeMode,
      palette: ThemePalette,
      options: ThemeOptions,
    ) => void,
  ) => void
}

export const themes: Themes = {
  modes: THEME_MODES,
  defaults: DEFAULT_THEME_OPTIONS,
  resolve: (...values) => resolveThemeOptions(...values),
  setOptions: (options) => setThemeOptions(options),
  getOptions: () => getThemeOptions(),
  palette: (theme) => getThemePalette(theme),
  rawPalette: (theme) => getRawThemePalette(theme),
  forEach: (run) =>
    forEachTheme((theme, palette) => run(theme, palette, activeThemeOptions)),
}

function mergeThemeOptions(
  base: ThemeOptions,
  override: ThemeOptionsInput,
): ThemeOptions {
  return merge(base, override)
}

function omitSkin(input: ThemeOptionsInput): ThemeOptionsInput {
  const { skin: _skin, ...rest } = input
  return rest
}

function resolveSkinName(value: unknown): BuiltInSkinName | undefined {
  if (typeof value !== 'string') return undefined
  const skin = value.trim() as BuiltInSkinName
  if (skin in builtInSkins) return skin
  throw new Error(
    `Unknown theme skin "${value}". Expected one of: ${Object.keys(builtInSkins).join(', ')}.`,
  )
}

function createThemePalettes(
  options: ThemeOptions,
): Record<ThemeMode, ThemePalette> {
  return {
    light: createThemePaletteVarBindings(options.colors.light),
    dark: createThemePaletteVarBindings(options.colors.dark),
  }
}
