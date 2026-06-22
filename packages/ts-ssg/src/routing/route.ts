import path from 'node:path'

import type { ContentFile } from '../discover/content'
import type { ResolvedContentFile } from '../i18n/content'

export interface RouteInfo {
  route: string
  urlPath: string
  isFolderIndex: boolean
}

export interface RouteFileInfo extends RouteInfo {
  relPath: string
  folder: string
  baseName: string
  isIndex: boolean
  isNamedFolderIndex: boolean
}

type RoutableContentFile = ContentFile | ResolvedContentFile

export function resolveRouteInfo(file: RoutableContentFile): RouteInfo {
  const info = resolveRouteFileInfo(file)
  return {
    route: info.route,
    urlPath: info.urlPath,
    isFolderIndex: info.isFolderIndex,
  }
}

export function resolveRouteFileInfo(file: RoutableContentFile): RouteFileInfo {
  const relPosix = toPosixPath(resolveRouteRelPath(file))
  const baseName = path.posix.basename(relPosix, file.ext)
  const dir = path.posix.dirname(relPosix)
  const folder = dir === '.' ? '' : dir
  const folderName = folder ? path.posix.basename(folder) : ''
  const isIndex = baseName === 'index'
  const isNamedFolderIndex = folderName.length > 0 && baseName === folderName
  const isFolderIndex = isIndex || isNamedFolderIndex
  const segments: string[] = []
  if (dir !== '.') segments.push(...dir.split('/'))
  if (!isFolderIndex) segments.push(baseName)
  const route = segments.join('/')
  const urlPath = resolveUrlPath(file) ?? (route === '' ? '/' : `/${route}/`)
  return {
    relPath: relPosix,
    folder,
    baseName,
    isIndex,
    isNamedFolderIndex,
    isFolderIndex,
    route,
    urlPath,
  }
}

export function resolveOutputRouteInfo(file: RoutableContentFile): RouteInfo {
  return resolveRouteInfo({
    absPath: file.absPath,
    relPath: resolveOutputRelPath(file),
    ext: file.ext,
  })
}

export function assertUniqueContentRoutes(files: ResolvedContentFile[]) {
  const byUrlPath = new Map<string, ResolvedContentFile[]>()
  for (const file of files) {
    const { urlPath } = resolveRouteInfo(file)
    const routeFiles = byUrlPath.get(urlPath) ?? []
    routeFiles.push(file)
    byUrlPath.set(urlPath, routeFiles)
  }
  const conflicts = [...byUrlPath.entries()].filter(
    ([, routeFiles]) => !isAllowedLocalizedDuplicate(routeFiles),
  )
  if (conflicts.length === 0) return

  const details = conflicts
    .map(([urlPath, routeFiles]) => {
      const sources = routeFiles
        .map((file) => toPosixPath(file.relPath))
        .sort((a, b) => a.localeCompare(b))
        .join(', ')
      return `${urlPath}: ${sources}`
    })
    .join('; ')
  throw new Error(`Duplicate content routes detected. ${details}`)
}

function isAllowedLocalizedDuplicate(routeFiles: ResolvedContentFile[]) {
  if (routeFiles.length <= 1) return true
  const locales = new Set<string>()
  for (const file of routeFiles) {
    if (!file.locale) return false
    if (locales.has(file.locale)) return false
    locales.add(file.locale)
  }
  return true
}

function resolveRouteRelPath(file: RoutableContentFile) {
  return 'routeRelPath' in file ? file.routeRelPath : file.relPath
}

function resolveOutputRelPath(file: RoutableContentFile) {
  return 'outputRelPath' in file ? file.outputRelPath : file.relPath
}

function resolveUrlPath(file: RoutableContentFile) {
  return 'urlPath' in file ? file.urlPath : undefined
}

function toPosixPath(filePath: string) {
  return filePath.replaceAll('\\', '/')
}
