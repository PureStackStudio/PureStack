import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  type NavigationConfig,
  resolveNavigationConfig,
} from '../navigation/navigation'
import {
  type ThemeOptions,
  type ThemeOptionsInput,
  themes,
} from '../style/themeOptions'
import { resolveThemes } from '../style/themes'

export interface SiteConfig {
  rootDir: string
  contentDir: string
  outDir: string
  siteTitle: string
  styleFileName: string
  styleHref: string
  styleThemes: string[]
  navigation: NavigationConfig
  theme: ThemeOptions
}

export type PartialSiteConfig = Partial<Omit<SiteConfig, 'theme'>> & {
  theme?: ThemeOptionsInput
}
export type SiteConfigFile = Partial<
  Pick<
    SiteConfig,
    | 'outDir'
    | 'siteTitle'
    | 'styleFileName'
    | 'styleHref'
    | 'styleThemes'
    | 'navigation'
  >
> & { theme?: ThemeOptionsInput }

const DEFAULT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)
export const SITE_CONFIG_FILENAME = 'siteConfig.json'

export function resolveSiteConfig(input: PartialSiteConfig = {}): SiteConfig {
  const rootDir = input.rootDir ?? DEFAULT_ROOT
  const contentDir = input.contentDir ?? path.join(rootDir, 'sample-content')
  const fileConfig = loadSiteConfigFile(contentDir)
  const outDir =
    input.outDir ??
    resolveOutDirFromFile(fileConfig.outDir, rootDir) ??
    path.join(rootDir, 'dist', 'site')
  const siteTitle = resolveString(
    input.siteTitle,
    fileConfig.siteTitle,
    'ts-ssg',
  )
  const styleFileName = resolveString(
    input.styleFileName,
    fileConfig.styleFileName,
    'site.css',
  )
  const styleHref = resolveString(
    input.styleHref,
    fileConfig.styleHref,
    `/${styleFileName}`,
  )
  const styleThemes = resolveThemes(input.styleThemes, fileConfig.styleThemes)
  const navigation = resolveNavigationConfig(
    input.navigation,
    fileConfig.navigation,
  )
  const theme = themes.resolve(input.theme, fileConfig.theme)
  return {
    rootDir,
    contentDir,
    outDir,
    siteTitle,
    styleFileName,
    styleHref,
    styleThemes,
    navigation,
    theme,
  }
}

function resolveString(...values: Array<string | undefined>) {
  for (const value of values) {
    if (typeof value === 'string' && value.length > 0) return value
  }
  return ''
}

function resolveOutDirFromFile(value: unknown, rootDir: string) {
  if (typeof value !== 'string' || value.length === 0) return undefined
  if (path.isAbsolute(value)) return value
  return path.join(rootDir, value)
}

function loadSiteConfigFile(contentDir: string): SiteConfigFile {
  const filePath = path.join(contentDir, SITE_CONFIG_FILENAME)
  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('siteConfig.json must contain a JSON object.')
    }
    return parsed as SiteConfigFile
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return {}
    const message = err.message ?? String(err)
    throw new Error(`Failed to read ${SITE_CONFIG_FILENAME}: ${message}`)
  }
}
