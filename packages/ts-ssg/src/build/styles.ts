import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import {
  orderThemes,
  resolveThemeFileName,
  styleBuilder,
} from '@purestack/ts-components'
import { ensureDir } from '@purestack/ts-util'
import type { SiteStyleConfig } from '../config/config'

export interface WriteStylesResult {
  outPath: string
  outputs: string[]
  signature: string
}

export interface WriteStylesInput {
  outDir: string
  includeHljsTheme?: boolean
}

export async function writeStyles(
  input: WriteStylesInput,
  style: SiteStyleConfig,
): Promise<WriteStylesResult> {
  const { outDir, includeHljsTheme = false } = input
  const { fileName, themes, pretty } = style
  const resultPaths: string[] = []
  const hash = crypto.createHash('sha256')
  const orderedThemes = orderThemes(themes)
  styleBuilder.ensureThemes(orderedThemes)
  let lightOutPath: string | undefined

  for (const theme of orderedThemes) {
    const rendered = await styleBuilder.render(theme, pretty)
    const css = await resolveOutputCss(
      rendered,
      theme,
      !pretty,
      includeHljsTheme,
    )
    const cssName = resolveThemeFileName(fileName, theme)
    const outPath = path.join(outDir, cssName)
    await ensureDir(outPath)
    await fs.writeFile(outPath, css)
    hash.update(css)
    hash.update('\0')
    resultPaths.push(outPath)
    if (theme === 'light') {
      lightOutPath = outPath
    }
  }

  return {
    outPath:
      lightOutPath ??
      path.join(outDir, resolveThemeFileName(fileName, 'light')),
    outputs: resultPaths,
    signature: hash.digest('hex'),
  }
}

const require = createRequire(import.meta.url)

async function resolveOutputCss(
  rendered: string,
  theme: string,
  compact: boolean,
  includeHljsTheme: boolean,
): Promise<string> {
  let mergedCss = rendered
  if (includeHljsTheme) {
    const highlightCss = await loadHighlightJsThemeCss(theme)
    if (highlightCss) {
      mergedCss = `${mergedCss}\n\n${highlightCss}`
    }
  }
  return compact ? compactCss(mergedCss) : mergedCss
}

async function loadHighlightJsThemeCss(theme: string): Promise<string> {
  const themeFile =
    theme === 'dark'
      ? 'highlight.js/styles/github-dark.css'
      : 'highlight.js/styles/github.css'
  const cssPath = require.resolve(themeFile)
  return await fs.readFile(cssPath, 'utf8')
}

function compactCss(css: string) {
  const lines = css
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  return lines.join('')
}
