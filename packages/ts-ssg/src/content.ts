import fs from 'node:fs/promises'
import path from 'node:path'

import { getLogger } from 'logpot'
export interface ContentFile {
  absPath: string
  relPath: string
  ext: string
}

const CONTENT_EXTS = new Set(['.md', '.mdx'])

export async function discoverContent(
  contentDir: string,
): Promise<ContentFile[]> {
  const log = getLogger()
  const files: ContentFile[] = []
  await walkDir(contentDir, contentDir, files)
  log.info('ts-ssg discover complete', { files })
  return files.sort((a, b) => a.relPath.localeCompare(b.relPath))
}

async function walkDir(root: string, dir: string, acc: ContentFile[]) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const absPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      await walkDir(root, absPath, acc)
      continue
    }
    const ext = path.extname(entry.name)
    if (!CONTENT_EXTS.has(ext)) {
      continue
    }
    acc.push({
      absPath,
      relPath: path.relative(root, absPath),
      ext,
    })
  }
}
