import fs from 'node:fs/promises'
import path from 'node:path'

import { getLogger } from 'logpot'

import { SITE_CONFIG_FILENAME } from '../config/config'

export interface ContentFile {
  absPath: string
  relPath: string
  ext: string
}

export interface StaticAssetFile {
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
  await walkDir(contentDir, contentDir, files, (_relPath, ext) =>
    CONTENT_EXTS.has(ext),
  )
  log.info('discover complete', { files })
  return files.sort((a, b) => a.relPath.localeCompare(b.relPath))
}

export async function discoverStaticAssets(
  contentDir: string,
): Promise<StaticAssetFile[]> {
  const log = getLogger()
  const assets: StaticAssetFile[] = []
  await walkDir(contentDir, contentDir, assets, (relPath, ext) => {
    if (path.basename(relPath) === SITE_CONFIG_FILENAME) return false
    return !CONTENT_EXTS.has(ext)
  })
  log.info('static assets discovered', { assets })
  return assets.sort((a, b) => a.relPath.localeCompare(b.relPath))
}

type WalkPredicate = (relPath: string, ext: string) => boolean

async function walkDir(
  root: string,
  dir: string,
  acc: { absPath: string; relPath: string; ext: string }[],
  include: WalkPredicate,
) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const absPath = path.join(dir, entry.name)
    const isDir = entry.isDirectory()
    if (isDir) {
      await walkDir(root, absPath, acc, include)
      continue
    }
    const ext = path.extname(entry.name)
    const relPath = path.relative(root, absPath)
    if (!include(relPath, ext)) {
      continue
    }
    acc.push({
      absPath,
      relPath,
      ext,
    })
  }
}
