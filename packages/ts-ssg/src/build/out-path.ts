import path from 'node:path'

import { type ContentFile } from '../content'

export function resolveOutPath(outDir: string, file: ContentFile) {
  const baseName = path.basename(file.relPath, file.ext)
  const dir = path.dirname(file.relPath)
  const isIndex = baseName === 'index'
  const segments = isIndex ? [dir, 'index.html'] : [dir, baseName, 'index.html']
  return path.join(outDir, ...segments)
}
