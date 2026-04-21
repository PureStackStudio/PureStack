import type { ThemePalette, ThemePaletteCurrent } from './themePalette'

const THEME_PALETTE_VAR_PREFIX = '--ps'
export const MINIFY_THEME_VARIABLE_NAMES = true
const SEMANTIC_TONE_NAMES = [
  'neutral',
  'accent',
  'feature',
  'secondary',
  'custom',
  'ghost',
  'info',
  'success',
  'warning',
  'danger',
] as const
const INTERACTIVE_STATES = ['rest', 'hover', 'active', 'disabled'] as const
const CURRENT_INTERACTIVE_STATES = ['rest', 'hover', 'active'] as const
const INTERACTIVE_PROPS = ['background', 'border', 'text'] as const
const BORDER_PROPS = ['subtle', 'default', 'focus'] as const
const TEXT_PROPS = ['default', 'subtle'] as const
const ICON_PROPS = ['background', 'gradient', 'color', 'border'] as const
const EFFECT_PROPS = [
  'glowPrimary',
  'glowSecondary',
  'floatingShadow',
  'panelShadow',
  'panelShadowStrong',
  'accentShadow',
  'interactiveShadow',
  'trackShadow',
  'thumbShadow',
  'overlayScrim',
  'focusGlow',
  'insetShadow',
] as const

type PathLeaf = readonly string[]
type PathTree = {
  readonly [key: string]: PathLeaf | PathTree
}
type PropertyPathTree<TProps extends readonly string[]> = {
  readonly [K in TProps[number]]: readonly [...string[], K]
}
type InteractivePathTree<TStates extends readonly string[]> = {
  readonly [K in TStates[number]]: PropertyPathTree<typeof INTERACTIVE_PROPS>
}

const CURRENT_THEME_PALETTE_PATHS = {
  tone: ['tone'],
  canvas: ['canvas'],
  overlay: ['overlay'],
  surface: createInteractivePathTree('surface', CURRENT_INTERACTIVE_STATES),
  surfaceAlt: createInteractivePathTree(
    'surfaceAlt',
    CURRENT_INTERACTIVE_STATES,
  ),
  text: createPropertyPathTree('text', TEXT_PROPS),
  border: createPropertyPathTree('border', BORDER_PROPS),
  button: createInteractivePathTree('button', CURRENT_INTERACTIVE_STATES),
  icon: createPropertyPathTree('icon', ICON_PROPS),
} as const satisfies PathTree

const THEME_PALETTE_VAR_PATHS = buildThemePaletteVarPaths()
const THEME_PALETTE_VAR_PATH_ENTRIES = THEME_PALETTE_VAR_PATHS.map(
  (path) => [buildReadableThemeVariableName('theme', path), path] as const,
)
const CURRENT_THEME_PALETTE_VAR_PATH_ENTRIES = flattenPathTree(
  CURRENT_THEME_PALETTE_PATHS,
).map(
  (path) => [buildReadableThemeVariableName('current', path), path] as const,
)

/**
 * Utilities for turning a semantic {@link ThemePalette} into a CSS custom-property contract.
 *
 * Algorithm:
 * 1. Traverse the palette recursively and treat every string leaf as one token.
 *    Exception:
 *    - `current` is a special runtime alias surface and is not part of generated
 *      theme variable declarations.
 *    Example paths:
 *    - `canvas`
 *    - `text.default`
 *    - `semanticTone.info.surface.rest.background`
 * 2. Convert each path into a stable CSS variable name by:
 *    - splitting the path into segments
 *    - converting each segment from camelCase to kebab-case
 *    - joining with `-`
 *    - prefixing with `--ps-`
 *    Example:
 *    - `canvas` -> `--ps-canvas`
 *    - `semanticTone.info.surface.rest.background` -> `--ps-semantic-tone-info-surface-rest-background`
 * 3. Support two outputs from the same source palette:
 *    - declaration output:
 *      `buildThemePaletteVariableCss(...)` emits a `:root` block assigning raw values
 *      to those variable names
 *    - binding output:
 *      `createThemePaletteVarBindings(...)` recreates the same `ThemePalette` shape,
 *      but replaces each leaf string value with `var(--ps-...)`
 *
 * This keeps authored skins as the raw source of truth while allowing component styles
 * to consume semantic tokens through CSS variables.
 */
export interface ThemePaletteVarEntry {
  name: string
  path: string[]
  value: string
}

export function createThemePaletteVarBindings(
  palette: ThemePalette,
): ThemePalette {
  return {
    ...mapThemePaletteLeaves(palette, (path) => getThemePaletteVar(path)),
    current: getCurrentThemePalette(),
  }
}

export function getThemePaletteVar(path: string | readonly string[]) {
  return `var(${getThemePaletteVarName(path)})`
}

export function getThemePaletteVarName(path: string | readonly string[]) {
  return buildThemeVariableName('theme', normalizePath(path))
}

export function getCurrentThemePaletteVar(path: string | readonly string[]) {
  return `var(${getCurrentThemePaletteVarName(path)})`
}

export function getCurrentThemePaletteVarName(
  path: string | readonly string[],
) {
  return buildThemeVariableName('current', normalizePath(path))
}

export function normalizeThemeVariableReference(value: string) {
  return value.replace(
    /var\((--ps-[A-Za-z0-9-]+)\)/g,
    (match, variableName: string) => {
      const normalizedTheme = normalizeReadableThemeVariableName(variableName)
      if (normalizedTheme) return `var(${normalizedTheme})`
      const normalizedCurrent =
        normalizeReadableCurrentVariableName(variableName)
      if (normalizedCurrent) return `var(${normalizedCurrent})`
      return match
    },
  )
}

export function listThemePaletteVarEntries(
  palette: ThemePalette,
): ThemePaletteVarEntry[] {
  const entries: ThemePaletteVarEntry[] = []
  collectThemePaletteEntries(palette, [], entries)
  return entries
}

export function listCurrentThemePaletteVarEntries(
  palette: ThemePaletteCurrent,
): ThemePaletteVarEntry[] {
  const entries: ThemePaletteVarEntry[] = []
  collectCurrentThemePaletteEntries(palette, [], entries)
  return entries
}

export function buildThemePaletteVariableCss(
  palette: ThemePalette,
  pretty: boolean = true,
  selector: string = ':root',
) {
  const entries = listThemePaletteVarEntries(palette)
  if (entries.length === 0) return ''
  if (!pretty) {
    const declarations = entries
      .map((entry) => `${entry.name}:${entry.value};`)
      .join('')
    return `${selector}{${declarations}}`
  }

  const lines = [`${selector} {`]
  for (const entry of entries) {
    lines.push(`  ${entry.name}: ${entry.value};`)
  }
  lines.push('}')
  return lines.join('\n')
}

function collectThemePaletteEntries(
  value: unknown,
  path: string[],
  entries: ThemePaletteVarEntry[],
) {
  if (typeof value === 'string') {
    entries.push({
      name: getThemePaletteVarName(path),
      path,
      value,
    })
    return
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return
  }

  for (const [key, child] of Object.entries(value)) {
    if (isCurrentPaletteKey(path, key) || isFontPaletteKey(path, key)) continue
    collectThemePaletteEntries(child, [...path, key], entries)
  }
}

function collectCurrentThemePaletteEntries(
  value: unknown,
  path: string[],
  entries: ThemePaletteVarEntry[],
) {
  if (typeof value === 'string') {
    entries.push({
      name: getCurrentThemePaletteVarName(path),
      path,
      value,
    })
    return
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return
  }

  for (const [key, child] of Object.entries(value)) {
    collectCurrentThemePaletteEntries(child, [...path, key], entries)
  }
}

function mapThemePaletteLeaves(
  value: ThemePalette,
  mapLeaf: (path: string[]) => string,
  path: string[] = [],
): ThemePalette {
  return mapThemePaletteValue(value, mapLeaf, path)
}

export function getCurrentThemePalette(): ThemePaletteCurrent {
  return mapPathTreeLeaves(CURRENT_THEME_PALETTE_PATHS, (path) =>
    getCurrentThemePaletteVar(path),
  )
}

function mapThemePaletteValue<T>(
  value: T,
  mapLeaf: (path: string[]) => string,
  path: string[],
): T {
  if (typeof value === 'string') {
    return mapLeaf(path) as T
  }

  if (typeof value === 'function') {
    return value
  }

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return value
  }

  const out: Record<string, unknown> = {}
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (isCurrentPaletteKey(path, key) || isFontPaletteKey(path, key)) {
      out[key] = child
      continue
    }
    out[key] = mapThemePaletteValue(child, mapLeaf, [...path, key])
  }
  return out as T
}

function isCurrentPaletteKey(path: string[], key: string) {
  return path.length === 0 && key === 'current'
}

function isFontPaletteKey(path: string[], key: string) {
  return path.length === 0 && key === 'font'
}

function normalizePath(path: string | readonly string[]) {
  return [...(typeof path === 'string' ? path.split('.') : path)]
}

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
}

function buildThemeVariableName(scope: 'theme' | 'current', parts: string[]) {
  const normalized = parts.map(toKebabCase)
  if (!MINIFY_THEME_VARIABLE_NAMES) {
    return buildReadableThemeVariableName(scope, parts)
  }
  return `${THEME_PALETTE_VAR_PREFIX}-${scope === 'current' ? 'c' : 't'}-${hashThemeVariablePath(normalized)}`
}

function normalizeReadableCurrentVariableName(variableName: string) {
  for (const [readableName, path] of CURRENT_THEME_PALETTE_VAR_PATH_ENTRIES) {
    if (variableName === readableName) {
      return getCurrentThemePaletteVarName(path)
    }
  }
  return ''
}

function normalizeReadableThemeVariableName(variableName: string) {
  for (const [readableName, path] of THEME_PALETTE_VAR_PATH_ENTRIES) {
    if (variableName === readableName) {
      return getThemePaletteVarName(path)
    }
  }
  return ''
}

function buildReadableThemeVariableName(
  scope: 'theme' | 'current',
  parts: string[],
) {
  const normalized = parts.map(toKebabCase)
  return `${THEME_PALETTE_VAR_PREFIX}-${scope === 'current' ? 'current-' : ''}${normalized.join('-')}`
}

function hashThemeVariablePath(parts: string[]) {
  let hash = 2166136261
  for (const char of parts.join('.')) {
    hash ^= char.charCodeAt(0)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0).toString(36)
}

function buildThemePaletteVarPaths() {
  const paths: string[][] = [['accent']]

  for (const tone of SEMANTIC_TONE_NAMES) {
    paths.push(['semanticTone', tone, 'tone'])
    paths.push(['semanticTone', tone, 'canvas'])
    paths.push(['semanticTone', tone, 'overlay'])

    for (const prop of BORDER_PROPS) {
      paths.push(['semanticTone', tone, 'root', 'border', prop])
      paths.push(['semanticTone', tone, 'border', prop])
    }

    for (const prop of TEXT_PROPS) {
      paths.push(['semanticTone', tone, 'root', 'text', prop])
      paths.push(['semanticTone', tone, 'text', prop])
    }

    for (const prop of ICON_PROPS) {
      paths.push(['semanticTone', tone, 'icon', prop])
    }

    for (const group of ['surface', 'surfaceAlt', 'button'] as const) {
      paths.push(['semanticTone', tone, group, 'focusRing'])
      for (const state of INTERACTIVE_STATES) {
        for (const prop of INTERACTIVE_PROPS) {
          paths.push(['semanticTone', tone, group, state, prop])
        }
      }
    }
  }

  for (const prop of EFFECT_PROPS) {
    paths.push(['effect', prop])
  }

  return paths
}

function createInteractivePathTree<const TStates extends readonly string[]>(
  group: string,
  states: TStates,
): InteractivePathTree<TStates> {
  const out: Record<string, PathLeaf | PathTree> = {}
  for (const state of states) {
    out[state] = createPropertyPathTree([group, state], INTERACTIVE_PROPS)
  }
  return out as InteractivePathTree<TStates>
}

function createPropertyPathTree<const TProps extends readonly string[]>(
  prefix: string | readonly string[],
  props: TProps,
): PropertyPathTree<TProps> {
  const parts = typeof prefix === 'string' ? [prefix] : [...prefix]
  const out: Record<string, PathLeaf> = {}
  for (const prop of props) {
    out[prop] = [...parts, prop]
  }
  return out as PropertyPathTree<TProps>
}

function flattenPathTree(tree: PathTree): string[][] {
  const paths: string[][] = []
  for (const value of Object.values(tree)) {
    if (isPathLeaf(value)) {
      paths.push([...value])
      continue
    }
    paths.push(...flattenPathTree(value))
  }
  return paths
}

function mapPathTreeLeaves<T extends PathTree>(
  tree: T,
  mapLeaf: (path: string[]) => string,
): MapPathTreeLeaves<T> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(tree)) {
    out[key] = isPathLeaf(value)
      ? mapLeaf([...value])
      : mapPathTreeLeaves(value, mapLeaf)
  }
  return out as MapPathTreeLeaves<T>
}

type MapPathTreeLeaves<T extends PathTree> = {
  [K in keyof T]: T[K] extends PathLeaf
    ? string
    : T[K] extends PathTree
      ? MapPathTreeLeaves<T[K]>
      : never
}

function isPathLeaf(value: PathTree | PathLeaf): value is PathLeaf {
  return Array.isArray(value)
}
