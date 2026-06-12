import type {
  NavigationConfig,
  PageFrontmatter,
  PageNavigation,
} from '@purestack/ts-common'
import { pickSemanticTone } from '@purestack/ts-style'
import type { ContentFile } from '../discover/content'
import { resolveNavigationConfig } from './config'
import { loadContentMeta } from './meta'
import type { NavigationTree, ResolvedNavigationConfig } from './model'
import { loadCustomNavigation } from './nav-file'
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
  files: ContentFile[],
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
  const global = publicByFolder[''] ?? []
  return { mode: config.mode, config, byFolder: publicByFolder, global }
}

export function resolvePageNavigation(
  tree: NavigationTree | undefined,
  file: ContentFile,
  frontmatter?: PageFrontmatter,
): PageNavigation | undefined {
  if (!tree) return undefined
  const folder = resolveFolderKey(file.relPath)
  const root = resolveNavigationRoot(folder, tree.config.roots)
  const items = tree.byFolder[root] ?? tree.byFolder[folder] ?? []
  return {
    mode: tree.mode,
    folder,
    root,
    items,
    global: tree.global,
    tone: pickSemanticTone(frontmatter?.nav?.tone) ?? tree.config.tone,
  }
}

export function resolveNavigationRoot(folder: string, roots: string[]) {
  for (const root of roots) {
    if (folder === root || folder.startsWith(`${root}/`)) return root
  }
  return folder
}

function collectFolders(files: ContentFile[]) {
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
