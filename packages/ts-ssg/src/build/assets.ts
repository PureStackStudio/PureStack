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

export interface StaticAssetBuildOptions {
  minifyScripts?: boolean
  failOnError?: boolean
  scriptCacheKey?: string
  getScriptCacheKey?: (relPath: string) => string | undefined
}

export interface CopyStaticAssetResult {
  outPath: string
  copied: boolean
  dependencyRelPaths: string[]
}

export async function copyStaticAssets(
  contentDir: string,
  outDir: string,
  options: StaticAssetBuildOptions = {},
): Promise<CopyStaticAssetsResult> {
  const log = getLogger()
  const assets = await discoverStaticAssets(contentDir)
  const tsDependencyIndex: Record<string, string[]> = {}
  for (const asset of assets) {
    const outPath = resolveStaticOutPath(outDir, asset, options)
    await ensureDir(outPath)
    const dependencyRelPaths = await writeStaticAsset(
      contentDir,
      asset,
      outPath,
      options,
    )
    await removeStaleScriptOutputFiles(asset, outPath, options)
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
  options: StaticAssetBuildOptions = {},
): Promise<CopyStaticAssetResult> {
  const log = getLogger()
  const outPath = resolveStaticOutPath(outDir, asset, options)
  try {
    await ensureDir(outPath)
    const dependencyRelPaths = await writeStaticAsset(
      contentDir,
      asset,
      outPath,
      options,
    )
    await removeStaleScriptOutputFiles(asset, outPath, options)
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
    if (options.failOnError === true) {
      throw error
    }
    return { outPath, copied: false, dependencyRelPaths: [] }
  }
}

export function resolveStaticOutPath(
  outDir: string,
  asset: StaticAssetFile,
  options: Pick<
    StaticAssetBuildOptions,
    'getScriptCacheKey' | 'scriptCacheKey'
  > = {},
) {
  return path.join(
    outDir,
    toOutputAssetRelPath(asset.relPath, {
      cacheKey: resolveScriptCacheKey(asset.relPath, options),
    }),
  )
}

function resolveScriptCacheKey(
  relPath: string,
  options: Pick<
    StaticAssetBuildOptions,
    'getScriptCacheKey' | 'scriptCacheKey'
  >,
) {
  return options.getScriptCacheKey?.(relPath) ?? options.scriptCacheKey
}

async function writeStaticAsset(
  contentDir: string,
  asset: StaticAssetFile,
  outPath: string,
  options: StaticAssetBuildOptions,
) {
  if (isTypeScriptAssetPath(asset.relPath)) {
    const buildResult = await buildScript({
      entryPoints: [asset.absPath],
      outfile: outPath,
      bundle: true,
      format: 'esm',
      minify: options.minifyScripts === true,
      treeShaking: true,
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

async function removeStaleScriptOutputFiles(
  asset: StaticAssetFile,
  outPath: string,
  options: StaticAssetBuildOptions,
) {
  if (!isTypeScriptAssetPath(asset.relPath)) return
  if (!resolveScriptCacheKey(asset.relPath, options)) return

  const outputDirectory = path.dirname(outPath)
  const currentFileName = path.basename(outPath)
  const scriptName = path.basename(asset.relPath, path.extname(asset.relPath))

  let entries: string[]
  try {
    entries = await fs.readdir(outputDirectory)
  } catch (error) {
    if (isEnoent(error)) return
    throw error
  }

  await Promise.all(
    entries.map(async (entry) => {
      if (entry === currentFileName) return
      if (!isStaleScriptOutputFile(entry, scriptName)) return
      await fs.rm(path.join(outputDirectory, entry), { force: true })
    }),
  )
}

function isStaleScriptOutputFile(fileName: string, scriptName: string) {
  return (
    fileName === `${scriptName}.js` ||
    (fileName.startsWith(`${scriptName}.`) && fileName.endsWith('.js'))
  )
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

function isEnoent(error: unknown) {
  const err = error as NodeJS.ErrnoException
  return err?.code === 'ENOENT'
}
