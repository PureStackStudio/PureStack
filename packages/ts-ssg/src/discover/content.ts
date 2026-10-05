import fs from 'node:fs/promises'
import path from 'node:path'

import { getLogger } from 'logpot'

import { SITE_CONFIG_FILENAME } from '../config/config'
import { isContentExt, isRegorMdxContentExt } from './contentExtensions'

export {
  CONTENT_EXTS,
  isContentExt,
  isRegorMdxContentExt,
  MARKDOWN_CONTENT_EXT,
  MDX_CONTENT_EXT,
  REGOR_MDX_CONTENT_EXT,
  REGOR_MDX_CONTENT_EXTS,
} from './contentExtensions'

export interface ContentFile {
  absPath: string
  relPath: string
  ext: string
  /**
   * The source of a page a plugin generates, or a function that returns it.
   * Such a page has no file.
   */
  source?: string | (() => string | Promise<string>)
}

export interface StaticAssetFile {
  absPath: string
  relPath: string
  ext: string
}

export const DEFAULT_FOOTER_FILENAME = 'footer.mdx'
export const DEFAULT_HEADER_FILENAME = 'header.mdx'
const DEFAULT_FOOTER_BASENAME = 'footer'
const DEFAULT_HEADER_BASENAME = 'header'
export const DEFAULT_NAV_FILENAME = '_nav.json'
export const IGNORED_STATIC_CONTENT_FILENAMES = [
  'AGENTS.MD',
  SITE_CONFIG_FILENAME,
  DEFAULT_FOOTER_FILENAME,
  DEFAULT_HEADER_FILENAME,
  DEFAULT_NAV_FILENAME,
  'tsconfig.json',
] as const
export const IGNORED_STATIC_CONTENT_EXTENSIONS = ['.ts'] as const

export function isContentFile(_relPath: string, ext: string) {
  return isContentExt(ext)
}

export function isAgentsFile(relPath: string) {
  return path.basename(relPath).toUpperCase() === 'AGENTS.MD'
}

export function isSiteConfigFile(relPath: string) {
  return path.basename(relPath) === SITE_CONFIG_FILENAME
}

export function isDefaultFooterFile(relPath: string) {
  return isDefaultSpecialContentFile(relPath, DEFAULT_FOOTER_BASENAME)
}

export function isDefaultHeaderFile(relPath: string) {
  return isDefaultSpecialContentFile(relPath, DEFAULT_HEADER_BASENAME)
}

export function isIgnoredStaticContentFile(relPath: string) {
  const basename = path.basename(relPath).toUpperCase()
  return IGNORED_STATIC_CONTENT_FILENAMES.some(
    (fileName) => basename === fileName.toUpperCase(),
  )
}

export async function discoverContent(
  contentDir: string,
): Promise<ContentFile[]> {
  const log = getLogger()
  const files: ContentFile[] = []
  await walkDir(
    contentDir,
    contentDir,
    files,
    (relPath, ext) =>
      isContentFile(relPath, ext) &&
      !isDefaultFooterFile(relPath) &&
      !isDefaultHeaderFile(relPath) &&
      !isAgentsFile(relPath),
  )
  log.info('discover complete', { fileCount: files.length })
  return files.sort((a, b) => a.relPath.localeCompare(b.relPath))
}

export async function discoverStaticAssets(
  contentDir: string,
): Promise<StaticAssetFile[]> {
  const log = getLogger()
  const assets: StaticAssetFile[] = []
  await walkDir(contentDir, contentDir, assets, (relPath, ext) => {
    if (isIgnoredStaticContentFile(relPath)) return false
    if (isIgnoredStaticContentExtension(ext)) return false
    return !isContentFile(relPath, ext)
  })
  log.info('static assets discovered', { assets })
  return assets.sort((a, b) => a.relPath.localeCompare(b.relPath))
}

export async function discoverDefaultFooters(
  contentDir: string,
): Promise<ContentFile[]> {
  const files: ContentFile[] = []
  await walkDir(contentDir, contentDir, files, (relPath, ext) => {
    return isRegorMdxContentExt(ext) && isDefaultFooterFile(relPath)
  })
  assertUniqueDefaultSpecialFiles(files, 'footer')
  return files.sort((a, b) => a.relPath.localeCompare(b.relPath))
}

export async function discoverDefaultHeaders(
  contentDir: string,
): Promise<ContentFile[]> {
  const files: ContentFile[] = []
  await walkDir(contentDir, contentDir, files, (relPath, ext) => {
    return isRegorMdxContentExt(ext) && isDefaultHeaderFile(relPath)
  })
  assertUniqueDefaultSpecialFiles(files, 'header')
  return files.sort((a, b) => a.relPath.localeCompare(b.relPath))
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

function isIgnoredStaticContentExtension(ext: string) {
  const normalized = ext.toLowerCase()
  return IGNORED_STATIC_CONTENT_EXTENSIONS.some(
    (ignoredExt) => normalized === ignoredExt,
  )
}

function isDefaultSpecialContentFile(relPath: string, basename: string) {
  const ext = path.extname(relPath)
  if (!isRegorMdxContentExt(ext)) return false
  return path.basename(relPath, ext).toLowerCase() === basename
}

function assertUniqueDefaultSpecialFiles(files: ContentFile[], kind: string) {
  const byDir = new Map<string, ContentFile[]>()
  for (const file of files) {
    const dir = normalizeDir(path.dirname(file.relPath))
    const dirFiles = byDir.get(dir) ?? []
    dirFiles.push(file)
    byDir.set(dir, dirFiles)
  }

  const duplicates = [...byDir.values()].filter((entries) => entries.length > 1)
  if (duplicates.length === 0) return

  const details = duplicates
    .map((entries) =>
      entries
        .map((entry) => entry.relPath.replaceAll('\\', '/'))
        .sort((a, b) => a.localeCompare(b))
        .join(', '),
    )
    .join('; ')
  throw new Error(
    `Duplicate Regor MDX ${kind} partials detected. Keep only one per directory: ${details}`,
  )
}

function normalizeDir(dir: string) {
  return dir === '.' ? '' : dir.replaceAll('\\', '/')
}
