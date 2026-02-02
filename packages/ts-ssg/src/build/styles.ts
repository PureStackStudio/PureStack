import crypto from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'

import { styleBuilder } from '../style/styles'
import { ensureDir } from '../util/fs'

export interface WriteStylesResult {
  outPath: string
  outputs: string[]
  signature: string
}

export async function writeStyles(
  outDir: string,
  fileName: string,
): Promise<WriteStylesResult> {
  const resultPaths: string[] = []
  const hash = crypto.createHash('sha256')
  const defaultName = fileName.replace(/\.css$/i, '')
  const named = styleBuilder.list().filter((name) => name !== '')
  named.sort()
  const names = ['', ...named]

  for (const name of names) {
    const css = await styleBuilder.render(name, true)
    const cssName = name === '' ? defaultName : name
    const outPath = path.join(outDir, `${cssName}.css`)
    await ensureDir(outPath)
    await fs.writeFile(outPath, css)
    hash.update(css)
    hash.update('\0')
    resultPaths.push(outPath)
  }

  return {
    outPath: resultPaths[0] ?? path.join(outDir, fileName),
    outputs: resultPaths,
    signature: hash.digest('hex'),
  }
}
