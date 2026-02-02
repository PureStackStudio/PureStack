import fs from 'node:fs/promises'
import path from 'node:path'

import type { SiteConfig } from '../config/config'
import { ensureDir } from '../util/fs'

export const MANIFEST_VERSION = 1
export const MANIFEST_DIRNAME = '.ts-ssg'
export const MANIFEST_FILENAME = 'manifest.json'

export interface FileSignature {
  mtimeMs: number
  size: number
}

export interface ManifestConfig {
  contentDir: string
  outDir: string
  siteTitle: string
  styleFileName: string
  styleHref: string
}

export interface ContentManifestEntry extends FileSignature {
  relPath: string
  ext: string
  outPath: string
}

export interface AssetManifestEntry extends FileSignature {
  relPath: string
  ext: string
  outPath: string
}

export interface StylesManifestEntry {
  signature: string
  outputs: string[]
}

export interface BuildManifest {
  version: number
  generatedAt: number
  config: ManifestConfig
  content: Record<string, ContentManifestEntry>
  assets: Record<string, AssetManifestEntry>
  styles: StylesManifestEntry
}

export function manifestPath(outDir: string) {
  return path.join(outDir, MANIFEST_DIRNAME, MANIFEST_FILENAME)
}

export function manifestConfigFromSiteConfig(config: SiteConfig): ManifestConfig {
  return {
    contentDir: config.contentDir,
    outDir: config.outDir,
    siteTitle: config.siteTitle,
    styleFileName: config.styleFileName,
    styleHref: config.styleHref,
  }
}

export function createEmptyManifest(config: SiteConfig): BuildManifest {
  return {
    version: MANIFEST_VERSION,
    generatedAt: Date.now(),
    config: manifestConfigFromSiteConfig(config),
    content: {},
    assets: {},
    styles: { signature: '', outputs: [] },
  }
}

export function isCompatibleManifest(
  manifest: BuildManifest,
  config: SiteConfig,
) {
  if (manifest.version !== MANIFEST_VERSION) return false
  const expected = manifestConfigFromSiteConfig(config)
  return (
    manifest.config.contentDir === expected.contentDir &&
    manifest.config.outDir === expected.outDir &&
    manifest.config.siteTitle === expected.siteTitle &&
    manifest.config.styleFileName === expected.styleFileName &&
    manifest.config.styleHref === expected.styleHref
  )
}

export async function readManifest(
  outDir: string,
): Promise<BuildManifest | null> {
  const filePath = manifestPath(outDir)
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(raw) as BuildManifest
    if (!parsed || typeof parsed !== 'object') return null
    if (!parsed.config || typeof parsed.config !== 'object') return null
    if (!parsed.content || typeof parsed.content !== 'object') return null
    if (!parsed.assets || typeof parsed.assets !== 'object') return null
    if (!parsed.styles || typeof parsed.styles !== 'object') return null
    return parsed
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return null
    throw error
  }
}

export async function writeManifest(
  outDir: string,
  manifest: BuildManifest,
): Promise<void> {
  const filePath = manifestPath(outDir)
  await ensureDir(filePath)
  const next = { ...manifest, generatedAt: Date.now() }
  await fs.writeFile(filePath, JSON.stringify(next, null, 2), 'utf8')
}

export async function readSignature(
  absPath: string,
): Promise<FileSignature | null> {
  try {
    const stats = await fs.stat(absPath)
    if (!stats.isFile()) return null
    return { mtimeMs: stats.mtimeMs, size: stats.size }
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return null
    throw error
  }
}

export function signatureEqual(
  left: FileSignature | undefined,
  right: FileSignature | null,
) {
  if (!left || !right) return false
  return left.mtimeMs === right.mtimeMs && left.size === right.size
}
