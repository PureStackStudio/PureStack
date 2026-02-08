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
  styleBuilder.ensureThemes(orderedThemes)
  let lightOutPath: string | undefined

  for (const theme of orderedThemes) {
    const css = await styleBuilder.render(theme, true)
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
    outPath: lightOutPath ?? path.join(outDir, resolveThemeFileName(fileName, 'light')),
    outputs: resultPaths,
    signature: hash.digest('hex'),
  }
}
