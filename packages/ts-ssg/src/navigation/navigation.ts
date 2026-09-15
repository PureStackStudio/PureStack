import type {
  NavigationConfig,
  PageFrontmatter,
  PageNavigation,
} from '@purestack/ts-common'
import { pickSemanticTone } from '@purestack/ts-style'
import { resolveNavigationConfig } from './config'
import { loadContentMeta } from './meta'
import type {
  NavFile,
  NavigationContentFile,
  NavigationTree,
  ResolvedNavigationConfig,
} from './model'
import { loadCustomNavigation } from './nav-file'
import { buildPageLinksByFolder, resolvePageLinks } from './page-links'
import {
  buildAutoNavigation,
  buildBaseFolderNavigation,
  buildFolderTree,
  buildNestedNavigation,
  stripInternalNavByFolder,
} from './tree'
import { resolveFolderKey } from './utils'

export type { NavigationTree, ResolvedNavigationConfig }
export { resolveFolderKey, resolveNavigationConfig }

export async function buildNavigation(
  contentDir: string,
  files: NavigationContentFile[],
  navigation?: NavigationConfig,
): Promise<NavigationTree | undefined> {
  const config = resolveNavigationConfig(navigation)
  if (config.mode === 'none') return undefined

  const folderSet = collectFolders(files)
  const contentMeta = await loadContentMeta(files)
  const folderTree = buildFolderTree(contentMeta)
  const autoByFolder =
    config.mode === 'custom' ? {} : buildAutoNavigation(folderTree, config)
  const customByFolder =
    config.mode === 'auto'
      ? {}
      : await loadCustomNavigation(contentDir, folderSet, config)
  const baseByFolder = buildBaseFolderNavigation(
    autoByFolder,
    customByFolder,
    config,
  )
  const byFolder = buildNestedNavigation(
    folderTree,
    baseByFolder,
    customByFolder,
    config,
  )
  const publicByFolder = stripInternalNavByFolder(byFolder)
  const rootByFolder = buildNavigationRootOverrides(
    folderSet,
    customByFolder,
    publicByFolder,
  )
  const pageLinksByFolder = buildPageLinksByFolder(customByFolder)
  const global = publicByFolder[''] ?? []
  return {
    mode: config.mode,
    config,
    byFolder: publicByFolder,
    rootByFolder,
    pageLinksByFolder,
    global,
  }
}

export function resolvePageNavigation(
  tree: NavigationTree | undefined,
  file: NavigationContentFile,
  frontmatter?: PageFrontmatter,
): PageNavigation | undefined {
  if (!tree) return undefined
  const folder = resolveFolderKey(file.relPath)
  const locale = resolveContentLocale(file)
  const configuredRoot = locale
    ? resolveLocalizedNavigationRoot(folder, locale, tree.config.roots)
    : resolveNavigationRoot(folder, tree.config.roots)
  const root = Object.hasOwn(tree.rootByFolder, folder)
    ? (tree.rootByFolder[folder] ?? configuredRoot)
    : configuredRoot
  const items = tree.byFolder[root] ?? tree.byFolder[folder] ?? []
  const pageLinks = resolvePageLinks(tree, folder, items, file)
  return {
    mode: tree.mode,
    folder,
    root,
    items,
    global: locale ? (tree.byFolder[locale] ?? tree.global) : tree.global,
    tone: pickSemanticTone(frontmatter?.nav?.tone) ?? tree.config.tone,
    ...(pageLinks ? { pageLinks } : {}),
  }
}

function resolveLocalizedNavigationRoot(
  folder: string,
  locale: string,
  roots: string[],
) {
  if (roots.length === 0) return locale
  const localizedRoots = roots.map((root) =>
    root ? `${locale}/${root}` : locale,
  )
  return resolveNavigationRoot(folder, localizedRoots, locale)
}

export function resolveNavigationRoot(
  folder: string,
  roots: string[],
  fallback = '',
) {
  for (const root of roots) {
    if (folder === root || folder.startsWith(`${root}/`)) return root
  }
  return fallback
}

function collectFolders(files: NavigationContentFile[]) {
  const folders = new Set<string>()
  folders.add('')
  for (const file of files) {
    const folder = resolveFolderKey(file.relPath)
    folders.add(folder)
    if (!folder) continue
    const segments = folder.split('/')
    for (let i = 1; i < segments.length; i += 1) {
      folders.add(segments.slice(0, i).join('/'))
    }
  }
  return folders
}

function resolveContentLocale(file: NavigationContentFile) {
  return 'locale' in file ? file.locale : undefined
}

function buildNavigationRootOverrides(
  folders: Set<string>,
  customByFolder: Record<string, NavFile>,
  byFolder: Record<string, unknown>,
) {
  const result: Record<string, string> = {}
  for (const folder of folders) {
    const override = findInheritedNavigationRoot(folder, customByFolder)
    if (!override) continue
    const { sourceFolder, root } = override
    if (!Object.hasOwn(byFolder, root)) {
      const sourcePath = sourceFolder
        ? `${sourceFolder}/_nav.json`
        : '_nav.json'
      throw new Error(
        `Invalid navigation root "${root}" in ${sourcePath}: root menu was not built.`,
      )
    }
    result[folder] = root
  }
  return result
}

function findInheritedNavigationRoot(
  folder: string,
  customByFolder: Record<string, { root?: string }>,
) {
  let current = folder
  while (true) {
    const root = customByFolder[current]?.root
    if (root !== undefined) return { sourceFolder: current, root }
    if (!current) return undefined
    current = parentFolder(current)
  }
}

function parentFolder(folder: string) {
  const slashIndex = folder.lastIndexOf('/')
  return slashIndex < 0 ? '' : folder.slice(0, slashIndex)
}
