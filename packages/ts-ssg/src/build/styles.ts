import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'

import { styleBuilder } from '../style/styles'
import { orderThemes, resolveThemeFileName } from '../style/themeAssets'
import { ensureDir } from '../util/fs'

export interface WriteStylesResult {
  outPath: string
  outputs: string[]
  signature: string
}

export interface WriteStylesInput {
  outDir: string
  fileName: string
  themes: string[]
  includeHljsTheme?: boolean
}

export async function writeStyles(
  input: WriteStylesInput,
): Promise<WriteStylesResult> {
  const { outDir, fileName, themes, includeHljsTheme = false } = input
  const resultPaths: string[] = []
  const hash = crypto.createHash('sha256')
  const orderedThemes = orderThemes(themes)
  const prettyCss = true
  styleBuilder.ensureThemes(orderedThemes)
  let lightOutPath: string | undefined

  for (const theme of orderedThemes) {
    const rendered = await styleBuilder.render(theme, prettyCss)
    const css = await resolveOutputCss(
      rendered,
      theme,
      prettyCss,
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
  prettyCss: boolean,
  includeHljsTheme: boolean,
): Promise<string> {
  const baseCss = prettyCss ? rendered : compactCss(rendered)
  if (!includeHljsTheme) return baseCss
  const highlightCss = await loadHighlightJsThemeCss(theme)
  if (!highlightCss) return baseCss
  return `${baseCss}\n\n${highlightCss}`
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
