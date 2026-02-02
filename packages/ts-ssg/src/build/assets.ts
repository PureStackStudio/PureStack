import fs from 'node:fs/promises'
import path from 'node:path'

import { getLogger } from 'logpot'

import { discoverStaticAssets, type StaticAssetFile } from '../discover/content'
import { ensureDir } from '../util/fs'

export interface CopyStaticAssetsResult {
  assets: number
}

export interface CopyStaticAssetResult {
  outPath: string
  copied: boolean
}

export async function copyStaticAssets(
  contentDir: string,
  outDir: string,
): Promise<CopyStaticAssetsResult> {
  const log = getLogger()
  const assets = await discoverStaticAssets(contentDir)
  for (const asset of assets) {
    const outPath = resolveStaticOutPath(outDir, asset)
    await ensureDir(outPath)
    await fs.copyFile(asset.absPath, outPath)
  }
  log.info('static assets copied', { count: assets.length })
  return { assets: assets.length }
}

export async function copyStaticAsset(
  outDir: string,
  asset: StaticAssetFile,
): Promise<CopyStaticAssetResult> {
  const log = getLogger()
  const outPath = resolveStaticOutPath(outDir, asset)
  try {
    await ensureDir(outPath)
    await fs.copyFile(asset.absPath, outPath)
    log.info('static asset copied', {
      assetPath: asset.absPath,
      outPath,
    })
    return { outPath, copied: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    log.error('static asset copy failed', {
      assetPath: asset.absPath,
      outPath,
      error: message,
    })
    return { outPath, copied: false }
  }
}

export function resolveStaticOutPath(outDir: string, asset: StaticAssetFile) {
  return path.join(outDir, asset.relPath)
}
