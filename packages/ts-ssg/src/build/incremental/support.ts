import fs from 'node:fs/promises'
import path from 'node:path'
import type { SiteConfig, SiteMdxConfig } from '@purestack/ts-common'
import { urlNormalizer } from '@purestack/ts-util'
import type { ContentFile, StaticAssetFile } from '../../discover/content'
import type { MdxRenderOptions } from '../../mdx/compile'
import {
  createMdxHighlighter,
  DEFAULT_MDX_CODE_LANGS,
  DEFAULT_MDX_CODE_THEMES,
  type MdxCodeHighlighter,
} from '../../mdx/highlight'
import { createHljsHighlighter } from '../../mdx/highlightjs'
import { resolveStaticOutPath } from '../assets'
import {
  type AssetManifestEntry,
  type BuildManifest,
  type ContentManifestEntry,
  manifestConfigFromSiteConfig,
  readSignature,
  type StylesManifestEntry,
} from '../manifest'
import { resolveOutPath, resolveRouteInfo } from '../out-path'
import type { BuildCountSummary } from '../site'

export class ManifestContentIndex {
  private readonly outPathToRelPath = new Map<string, string>()
  private readonly relPathToOutPath = new Map<string, string>()
  private readonly urlPathToRelPath = new Map<string, string>()
  private readonly relPathToUrlPath = new Map<string, string>()

  constructor(private readonly contentDir: string) {}

  rebuildFromManifest(manifest: BuildManifest) {
    this.outPathToRelPath.clear()
    this.relPathToOutPath.clear()
    this.urlPathToRelPath.clear()
    this.relPathToUrlPath.clear()
    for (const entry of Object.values(manifest.content)) {
      this.set(entry.relPath, entry.outPath, entry.ext)
    }
  }

  set(relPath: string, outPath: string, ext?: string) {
    const prevOutPath = this.relPathToOutPath.get(relPath)
    if (prevOutPath && prevOutPath !== outPath) {
      this.outPathToRelPath.delete(prevOutPath)
    }
    const prevUrlPath = this.relPathToUrlPath.get(relPath)
    if (prevUrlPath) {
      this.urlPathToRelPath.delete(prevUrlPath)
    }
    this.relPathToOutPath.set(relPath, outPath)
    this.outPathToRelPath.set(outPath, relPath)
    const routeInfo = resolveRouteInfo(
      toContentFile(this.contentDir, relPath, ext ?? path.extname(relPath)),
    )
    this.relPathToUrlPath.set(relPath, routeInfo.urlPath)
    this.urlPathToRelPath.set(routeInfo.urlPath, relPath)
  }

  remove(relPath: string) {
    const outPath = this.relPathToOutPath.get(relPath)
    const urlPath = this.relPathToUrlPath.get(relPath)
    if (outPath) this.outPathToRelPath.delete(outPath)
    if (urlPath) this.urlPathToRelPath.delete(urlPath)
    this.relPathToOutPath.delete(relPath)
    this.relPathToUrlPath.delete(relPath)
  }

  getRelPathByOutPath(outPath: string) {
    return this.outPathToRelPath.get(outPath)
  }

  getRelPathByUrlPath(urlPath: string) {
    return this.urlPathToRelPath.get(urlPath)
  }

  updateUrlPathMapFromFiles(files: ContentFile[]) {
    for (const file of files) {
      const routeInfo = resolveRouteInfo(file)
      this.relPathToUrlPath.set(file.relPath, routeInfo.urlPath)
      this.urlPathToRelPath.set(routeInfo.urlPath, file.relPath)
    }
  }
}

export async function resolveMdxBuildOptions(
  mdx: Partial<SiteMdxConfig> | undefined,
): Promise<MdxRenderOptions> {
  const highlighter = await resolveHighlighter(mdx)
  return { highlighter }
}

async function resolveHighlighter(
  mdx: Partial<SiteMdxConfig> | undefined,
): Promise<MdxCodeHighlighter | undefined> {
  if (mdx?.disableHighlighter) return undefined
  if (mdx?.highlighter === 'highlightjs') {
    return createHljsHighlighter()
  }
  return await createMdxHighlighter(
    DEFAULT_MDX_CODE_THEMES,
    DEFAULT_MDX_CODE_LANGS,
  )
}

export function normalizeUrlPath(urlPath: string) {
  return urlNormalizer.normalizeUrlPath(urlPath)
}

export function toContentFile(
  contentDir: string,
  relPath: string,
  ext: string,
): ContentFile {
  return {
    absPath: path.join(contentDir, relPath),
    relPath,
    ext,
  }
}

export function toAssetFile(
  contentDir: string,
  relPath: string,
  ext: string,
): StaticAssetFile {
  return {
    absPath: path.join(contentDir, relPath),
    relPath,
    ext,
  }
}

export async function removeFile(filePath: string) {
  try {
    await fs.rm(filePath, { force: true })
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return
    throw error
  }
}

export async function buildManifest(
  config: SiteConfig,
  contentFiles: ContentFile[],
  assetFiles: StaticAssetFile[],
  stylesResult: StylesManifestEntry,
  options: { getScriptCacheKey?: (relPath: string) => string | undefined } = {},
): Promise<BuildManifest> {
  const content: Record<string, ContentManifestEntry> = {}
  for (const file of contentFiles) {
    const signature = await readSignature(file.absPath)
    if (!signature) continue
    const outPath = resolveOutPath(config.outDir, file)
    content[file.relPath] = {
      relPath: file.relPath,
      ext: file.ext,
      outPath,
      ...signature,
    }
  }

  const assets: Record<string, AssetManifestEntry> = {}
  for (const asset of assetFiles) {
    const signature = await readSignature(asset.absPath)
    if (!signature) continue
    const outPath = resolveStaticOutPath(config.outDir, asset, {
      getScriptCacheKey: options.getScriptCacheKey,
    })
    const cacheKey = options.getScriptCacheKey?.(asset.relPath)
    assets[asset.relPath] = {
      relPath: asset.relPath,
      ext: asset.ext,
      outPath,
      ...(cacheKey ? { cacheKey } : {}),
      ...signature,
    }
  }

  return {
    version: 1,
    generatedAt: Date.now(),
    config: manifestConfigFromSiteConfig(config),
    content,
    assets,
    styles: stylesResult,
  }
}

export function isOutsideContentRoot(relPath: string) {
  if (path.isAbsolute(relPath)) return true
  const normalized = relPath.replaceAll('\\', '/')
  return normalized === '..' || normalized.startsWith('../')
}

export function countByExt(files: Array<{ ext: string }>): BuildCountSummary {
  const byExt: Record<string, number> = {}
  for (const file of files) {
    const ext = file.ext || ''
    byExt[ext] = (byExt[ext] ?? 0) + 1
  }
  return { total: files.length, byExt }
}
