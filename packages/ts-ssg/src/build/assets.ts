import fs from 'node:fs/promises'
import path from 'node:path'
import { isTypeScriptAssetPath, toOutputAssetRelPath } from '@purestack/ts-util'
import { ensureDir } from '@purestack/ts-util-node'
import { build as buildScript, type Metafile } from 'esbuild'
import { getLogger } from 'logpot'
import { discoverStaticAssets, type StaticAssetFile } from '../discover/content'

export interface CopyStaticAssetsResult {
  assets: number
  files: StaticAssetFile[]
  tsDependencyIndex: Record<string, string[]>
}

export interface CopyStaticAssetResult {
  outPath: string
  copied: boolean
  dependencyRelPaths: string[]
}

export async function copyStaticAssets(
  contentDir: string,
  outDir: string,
): Promise<CopyStaticAssetsResult> {
  const log = getLogger()
  const assets = await discoverStaticAssets(contentDir)
  const tsDependencyIndex: Record<string, string[]> = {}
  for (const asset of assets) {
    const outPath = resolveStaticOutPath(outDir, asset)
    await ensureDir(outPath)
    const dependencyRelPaths = await writeStaticAsset(
      contentDir,
      asset,
      outPath,
    )
    if (dependencyRelPaths.length > 0) {
      tsDependencyIndex[asset.relPath] = dependencyRelPaths
    }
  }
  log.info('static assets copied', { count: assets.length })
  return { assets: assets.length, files: assets, tsDependencyIndex }
}

export async function copyStaticAsset(
  contentDir: string,
  outDir: string,
  asset: StaticAssetFile,
): Promise<CopyStaticAssetResult> {
  const log = getLogger()
  const outPath = resolveStaticOutPath(outDir, asset)
  try {
    await ensureDir(outPath)
    const dependencyRelPaths = await writeStaticAsset(
      contentDir,
      asset,
      outPath,
    )
    log.info('static asset copied', {
      assetPath: asset.absPath,
      outPath,
    })
    return { outPath, copied: true, dependencyRelPaths }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    log.error('static asset copy failed', {
      assetPath: asset.absPath,
      outPath,
      error: message,
    })
    return { outPath, copied: false, dependencyRelPaths: [] }
  }
}

export function resolveStaticOutPath(outDir: string, asset: StaticAssetFile) {
  return path.join(outDir, toOutputAssetRelPath(asset.relPath))
}

async function writeStaticAsset(
  contentDir: string,
  asset: StaticAssetFile,
  outPath: string,
) {
  if (isTypeScriptAssetPath(asset.relPath)) {
    const buildResult = await buildScript({
      entryPoints: [asset.absPath],
      outfile: outPath,
      bundle: true,
      format: 'esm',
      minify: false,
      platform: 'browser',
      target: 'esnext',
      logLevel: 'silent',
      metafile: true,
    })
    return collectDependencyRelPaths(buildResult.metafile, contentDir)
  }
  await fs.copyFile(asset.absPath, outPath)
  return []
}

function collectDependencyRelPaths(
  metafile: Metafile | undefined,
  root: string,
) {
  const deps = new Set<string>()
  const inputs = metafile?.inputs ?? {}
  for (const inputPath of Object.keys(inputs)) {
    const absPath = path.isAbsolute(inputPath)
      ? inputPath
      : path.resolve(inputPath)
    const relPath = path.relative(root, absPath).replaceAll('\\', '/')
    if (isOutsideRoot(relPath)) continue
    deps.add(relPath)
  }
  return [...deps]
}

function isOutsideRoot(relPath: string) {
  return relPath === '..' || relPath.startsWith('../')
}
