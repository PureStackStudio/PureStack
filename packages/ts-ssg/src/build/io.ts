import fs from 'node:fs/promises'

import { ensureDir } from '../fs'

export async function readSource(absPath: string) {
  return fs.readFile(absPath, 'utf-8')
}

export async function writeHtml(outPath: string, html: string) {
  await ensureDir(outPath)
  await fs.writeFile(outPath, html, 'utf-8')
}
