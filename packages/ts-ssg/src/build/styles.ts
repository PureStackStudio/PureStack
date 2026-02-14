import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { styleBuilder } from '../style/styles'
import { orderThemes, resolveThemeFileName } from '../style/themeAssets'
import { ensureDir } from '../util/fs'

export interface WriteStylesResult {
  outPath: string
  outputs: string[]
  signature: string
}

export async function writeStyles(
  outDir: string,
  fileName: string,
  themes: string[],
): Promise<WriteStylesResult> {
  const resultPaths: string[] = []
  const hash = crypto.createHash('sha256')
  const orderedThemes = orderThemes(themes)
  const prettyCss = true
  styleBuilder.ensureThemes(orderedThemes)
  let lightOutPath: string | undefined

  for (const theme of orderedThemes) {
    const rendered = await styleBuilder.render(theme, prettyCss)
    const css = prettyCss ? rendered : compactCss(rendered)
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

function compactCss(css: string) {
  const lines = css
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
  return lines.join('')
}
