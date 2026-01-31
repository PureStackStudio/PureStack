import fs from 'node:fs/promises'
import path from 'node:path'

import { ensureDir } from '../fs'
import { styleBuilder } from '../styles'

export interface WriteStylesResult {
  outPath: string
}

export async function writeStyles(
  outDir: string,
  fileName: string,
): Promise<WriteStylesResult> {
  const resultPaths: string[] = []
  const defaultName = fileName.replace(/\.css$/i, '')
  const names = new Set(styleBuilder.list())
  names.add('')

  for (const name of names) {
    const css = await styleBuilder.render(name, true)
    const cssName = name === '' ? defaultName : name
    const outPath = path.join(outDir, `${cssName}.css`)
    await ensureDir(outPath)
    await fs.writeFile(outPath, css)
    resultPaths.push(outPath)
  }

  return { outPath: resultPaths[0] ?? path.join(outDir, fileName) }
}
