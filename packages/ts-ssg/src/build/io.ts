import fs from 'node:fs/promises'

import { ensureDir } from '../util/fs'

export async function readSource(absPath: string) {
  return fs.readFile(absPath, 'utf-8')
}

export async function writeHtml(outPath: string, html: string) {
  await ensureDir(outPath)
  await fs.writeFile(outPath, html, 'utf-8')
}

export async function prepareOutDir(
  outDir: string,
  options: { clean?: boolean } = {},
) {
  if (options.clean) {
    await fs.rm(outDir, { recursive: true, force: true })
  }
  await fs.mkdir(outDir, { recursive: true })
}
