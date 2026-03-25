import fs from 'node:fs/promises'
import path from 'node:path'

export async function ensureDir(filePath: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
}

export function replaceExt(filePath: string, newExt: string) {
  return filePath.slice(0, -path.extname(filePath).length) + newExt
}
