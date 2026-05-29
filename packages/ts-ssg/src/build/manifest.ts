import { createHash } from 'node:crypto'
import type { Stats } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { ensureDir } from '@purestack/ts-util-node'
import { getLogger } from 'logpot'

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
  style: {
    fileName: string
    href: string
    themes: string[]
    pretty: boolean
  }
  signature: string
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
  cacheKey?: string
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

export function manifestConfigFromSiteConfig(
  config: SiteConfig,
): ManifestConfig {
  return {
    contentDir: config.contentDir,
    outDir: config.outDir,
    siteTitle: config.siteTitle,
    style: {
      fileName: config.style.fileName,
      href: config.style.href,
      themes: config.style.themes,
      pretty: config.style.pretty,
    },
    signature: createManifestConfigSignature(config),
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
  return manifestConfigEqual(manifest.config, expected)
}

export async function readManifest(
  outDir: string,
): Promise<BuildManifest | null> {
  const filePath = manifestPath(outDir)
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return parseManifestJson(raw, filePath)
  } catch (error) {
    if (isEnoent(error)) return null
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
    return fileSignatureFromStats(stats)
  } catch (error) {
    if (isEnoent(error)) return null
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

function manifestConfigEqual(left: ManifestConfig, right: ManifestConfig) {
  return (
    left.contentDir === right.contentDir &&
    left.outDir === right.outDir &&
    left.siteTitle === right.siteTitle &&
    isPlainObject(left.style) &&
    isPlainObject(right.style) &&
    left.style.fileName === right.style.fileName &&
    left.style.href === right.style.href &&
    Array.isArray(left.style.themes) &&
    left.style.themes.join('|') === right.style.themes.join('|') &&
    left.style.pretty === right.style.pretty &&
    left.signature === right.signature
  )
}

function createManifestConfigSignature(config: SiteConfig) {
  return createHash('sha256').update(JSON.stringify(config)).digest('hex')
}

function parseManifestJson(
  raw: string,
  filePath: string,
): BuildManifest | null {
  if (raw.trim().length === 0) {
    logIgnoredManifest(filePath, 'empty manifest')
    return null
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch (error) {
    logIgnoredManifest(filePath, 'invalid JSON', error)
    return null
  }

  if (isBuildManifest(parsed)) return parsed
  logIgnoredManifest(filePath, 'invalid manifest shape')
  return null
}

function isBuildManifest(value: unknown): value is BuildManifest {
  if (!value || typeof value !== 'object') return false
  const manifest = value as Record<string, unknown>
  return (
    isPlainObject(manifest.config) &&
    isPlainObject(manifest.content) &&
    isPlainObject(manifest.assets) &&
    isPlainObject(manifest.styles)
  )
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isEnoent(error: unknown): boolean {
  const err = error as NodeJS.ErrnoException
  return err?.code === 'ENOENT'
}

function logIgnoredManifest(filePath: string, reason: string, error?: unknown) {
  const meta: Record<string, unknown> = { filePath, reason }
  if (error instanceof Error) {
    meta.error = error.message
  } else if (error !== undefined) {
    meta.error = String(error)
  }
  getLogger().warn('manifest cache ignored', meta)
}

function fileSignatureFromStats(stats: Stats): FileSignature | null {
  if (!stats.isFile()) return null
  return { mtimeMs: stats.mtimeMs, size: stats.size }
}
