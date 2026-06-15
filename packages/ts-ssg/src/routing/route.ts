import path from 'node:path'

import type { ContentFile } from '../discover/content'

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

export function resolveRouteInfo(file: ContentFile): RouteInfo {
  const info = resolveRouteFileInfo(file)
  return {
    route: info.route,
    urlPath: info.urlPath,
    isFolderIndex: info.isFolderIndex,
  }
}

export function resolveRouteFileInfo(file: ContentFile): RouteFileInfo {
  const relPosix = toPosixPath(file.relPath)
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
  const urlPath = route === '' ? '/' : `/${route}/`
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

export function assertUniqueContentRoutes(files: ContentFile[]) {
  const byUrlPath = new Map<string, ContentFile[]>()
  for (const file of files) {
    const { urlPath } = resolveRouteInfo(file)
    const routeFiles = byUrlPath.get(urlPath) ?? []
    routeFiles.push(file)
    byUrlPath.set(urlPath, routeFiles)
  }
  const conflicts = [...byUrlPath.entries()].filter(
    ([, routeFiles]) => routeFiles.length > 1,
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

function toPosixPath(filePath: string) {
  return filePath.replaceAll('\\', '/')
}
