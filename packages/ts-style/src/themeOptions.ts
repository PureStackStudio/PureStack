import { type DeepPartial, merge } from '@purestack/ts-util'
import {
  type BuiltInSkinName,
  builtInSkins,
  type SkinPresetList,
} from './skins'
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
} from './breakpoints'

const DEFAULT_SKIN = builtInSkins.neon.create()
export const THEME_MODES = ['light', 'dark'] as const
export type ThemeMode = (typeof THEME_MODES)[number]

export interface ThemeOptions {
  remSize: string
  mobileRemSize: string
  palette: Record<ThemeMode, ThemePalette>
}

export type ThemeOptionsInput = DeepPartial<ThemeOptions> & {
  skin?: BuiltInSkinName
  presets?: SkinPresetList
}

export const DEFAULT_THEME_OPTIONS: ThemeOptions = {
  remSize: '',
  mobileRemSize: '',
  palette: {
    ...DEFAULT_SKIN,
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
      merged = mergeThemeOptions(merged, {
        palette: builtInSkins[skin].create(resolveSkinPresets(value.presets)),
      })
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
  return activeThemeOptions.palette[mode]
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
  const { skin: _skin, presets: _presets, ...rest } = input
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

function resolveSkinPresets(value: unknown): readonly string[] {
  if (!Array.isArray(value)) return []
  return value.filter((preset): preset is string => typeof preset === 'string')
}

function createThemePalettes(
  options: ThemeOptions,
): Record<ThemeMode, ThemePalette> {
  return {
    light: createThemePaletteVarBindings(options.palette.light),
    dark: createThemePaletteVarBindings(options.palette.dark),
  }
}
